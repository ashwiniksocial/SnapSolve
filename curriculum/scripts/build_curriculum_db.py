"""
SnapSolve Master Curriculum Database Builder
Reads every PDF under curriculum/sources/cbse/ and generates structured JSON.
Source: uploaded official PDFs only — no internet, no model knowledge used.
"""

import json
import os
import re
import subprocess
from pathlib import Path

BASE = Path("curriculum/sources/cbse")
OUT  = Path("curriculum/generated")
OUT.mkdir(parents=True, exist_ok=True)

# ── PDF utilities ──────────────────────────────────────────────────────────────

def pdf_to_text(pdf_path: Path) -> str:
    r = subprocess.run(
        ["pdftotext", str(pdf_path), "-"],
        capture_output=True, text=True, timeout=120,
    )
    return r.stdout

def pdf_page_count(pdf_path: Path) -> int:
    r = subprocess.run(["pdfinfo", str(pdf_path)], capture_output=True, text=True, timeout=15)
    for ln in r.stdout.splitlines():
        if ln.startswith("Pages:"):
            return int(ln.split(":")[1].strip())
    return 0

def clean(s: str) -> str:
    return " ".join(s.split()).strip()

# ── filename-based metadata ────────────────────────────────────────────────────
#
# Pattern: <class_code><subject_code><book_num><chapter_or_suffix>.pdf
#   class_code:   fe=6, ge=7, he=8, ie=9
#   subject_code: gp=Mathematics(GanitaPrakash), mh=Mathematics(GanitaManjari),
#                 cu=Science(Curiosity), sc=Science
#   book_num:     1 or 2  (some classes have two maths books)
#   chapter:      2-digit number (01-13), or "ps" (prelims), "cc" (cover/other)

CLASS_CODE = {"fe": 6, "ge": 7, "he": 8, "ie": 9}
SUBJ_CODE  = {
    "gp": ("Mathematics", "Ganita Prakash"),
    "mh": ("Mathematics", "Ganita Manjari"),
    "cu": ("Science",      "Curiosity"),
    "sc": ("Science",      "Curiosity"),
}

CHAPTER_STEM_RE = re.compile(
    r'^(fe|ge|he|ie)(gp|mh|cu|sc)([12])(\d{2}|ps|cc)\.(pdf|jpg|png)$', re.I
)

def parse_filename(filename: str):
    """Return metadata dict or None for non-chapter files."""
    m = CHAPTER_STEM_RE.match(filename.lower())
    if not m:
        return None
    cc, sc, book, suffix, _ = m.groups()
    class_num  = CLASS_CODE.get(cc)
    subj, series = SUBJ_CODE.get(sc, (sc.upper(), ""))
    is_chapter = suffix.isdigit()
    chapter_num = int(suffix) if is_chapter else None
    return {
        "class_num":   class_num,
        "subject":     subj,
        "series":      series,
        "book":        int(book),
        "chapter_num": chapter_num,
        "is_chapter":  is_chapter,
        "is_prelims":  suffix == "ps",
    }

# ── heading / structure extraction ────────────────────────────────────────────

SEC_RE    = re.compile(r'^(\d+\.\d+)\s{1,4}(.{3,80})$')
SUBSEC_RE = re.compile(r'^(\d+\.\d+\.\d+)\s{1,4}(.{3,80})$')
ACT_RE    = re.compile(r'^(Activity\b|Let [Uu]s\b|Think and Reflect|Do [Tt]his[!:]?|Explore[:\s]|Try [Tt]his)', re.I)
EX_RE     = re.compile(r'^(Exercise\b|EXERCISE\b|Practice Problems?\b|Try These\b)', re.I)
KEY_RE    = re.compile(r'^(Key Terms?\b|Key Concepts?\b|Glossary\b|Summary\b|What [Yy]ou [Hh]ave [Ll]earned)', re.I)
FIG_RE    = re.compile(r'^Fig\.?\s*([\d.]+)[:\s]+(.{4,80})$', re.I)

def extract_structure(text: str, chapter_num: int):
    prefix = str(chapter_num) + "."
    sections, subsections, activities, exercises, key_terms, figures = [], [], [], [], [], set()

    seen_sec, seen_sub = set(), set()

    for raw in text.splitlines():
        line = clean(raw)
        if not line or len(line) < 4:
            continue

        m = SUBSEC_RE.match(line)
        if m and m.group(1).startswith(prefix) and m.group(1) not in seen_sub:
            seen_sub.add(m.group(1))
            subsections.append({"number": m.group(1), "title": clean(m.group(2))})
            continue

        m = SEC_RE.match(line)
        if m and m.group(1).startswith(prefix) and m.group(1) not in seen_sec:
            seen_sec.add(m.group(1))
            sections.append({"number": m.group(1), "title": clean(m.group(2))})
            continue

        if ACT_RE.match(line):
            t = line[:120]
            if t not in activities:
                activities.append(t)

        if EX_RE.match(line):
            t = line[:120]
            if t not in exercises:
                exercises.append(t)

        if KEY_RE.match(line):
            t = line[:120]
            if t not in key_terms:
                key_terms.append(t)

        m = FIG_RE.match(line)
        if m:
            figures.add(clean(m.group(2))[:100])

    return {
        "sections":    sections,
        "subsections": subsections,
        "activities":  activities[:25],
        "exercises":   exercises[:25],
        "key_terms":   list(key_terms)[:25],
        "figures":     sorted(figures)[:40],
    }

# ── chapter title extraction from PDF text ────────────────────────────────────

SECTION_HDR_RE = re.compile(r'^\d{1,2}\.\d[\s\.]')  # e.g. "2.1 Introduction"
TITLE_NOISE_RE = re.compile(
    r'^(Think [Ii]t [Oo]ver|Probe and [Pp]onder|'
    r'Reprint\b|'
    r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|'       # M/D/YYYY, M-D-YYYY
    r'\d{1,2}-[A-Za-z]{3}-\d{2,4}|'          # DD-Mon-YY
    r'\d{1,2}:\d{2}:\d{2}\s*(AM|PM)?|'       # HH:MM:SS
    r'Curiosity\b|Ganita|Grade\b|Class\b|NCERT|'
    r'[A-Za-z0-9_\-]+\.indd)',
    re.I
)
BULLET_CHAR_RE = re.compile(r'^[yz•●]\s*$|^[yz]\s+\S')

def extract_chapter_title(text: str, chapter_num: int) -> str:
    """
    Hybrid anchor-based extraction:
    A. Locate the standalone chapter-number line.
    B. Scan next 35 lines for last '?' (Think It Over zone) AND last .indd stamp.
    C. Also find the first section heading N.M within 120 lines.
    D. Title zone = [max(last_q, last_indd, start)+1 … first_section_heading).
    E. Collect short (<= 80 chars) non-noise lines from that window.
    """
    lines = [clean(l) for l in text.splitlines() if clean(l)]
    num_str = str(chapter_num)

    # A – locate chapter number within first 60 lines
    start_idx = None
    for i, line in enumerate(lines[:60]):
        if line == num_str or line == f"Chapter {num_str}":
            start_idx = i
            break
    if start_idx is None:
        return f"Chapter {chapter_num}"

    # B – scan NEXT 35 lines for Think It Over markers
    last_q_idx    = None
    last_indd_idx = None
    for i, line in enumerate(lines[start_idx+1 : start_idx+36], start=start_idx+1):
        if line.endswith("?"):
            last_q_idx = i
        if re.search(r'\.indd\b', line, re.I):
            last_indd_idx = i

    # C – find first section heading within 120 lines
    section_hdr_idx = None
    for i, line in enumerate(lines[start_idx+1 : start_idx+120], start=start_idx+1):
        if SECTION_HDR_RE.match(line):
            section_hdr_idx = i
            break

    # D – title zone boundaries
    raw_zone_start = max(x for x in (last_q_idx, last_indd_idx, start_idx) if x is not None) + 1
    zone_end       = section_hdr_idx if section_hdr_idx is not None else start_idx + 12

    # Clamp: if Think It Over questions pushed zone_start past the section heading
    # (happens for maths PDFs where a question mark appears in the chapter body
    # within the 35-line scan window), fall back to directly after the chapter number.
    if raw_zone_start >= zone_end:
        zone_start = start_idx + 1
    else:
        zone_start = raw_zone_start

    window = lines[zone_start : zone_end]

    # E – collect title lines
    title_parts: list[str] = []
    for line in window:
        if len(line) < 3:
            if title_parts: break
            continue
        if BULLET_CHAR_RE.match(line):
            if title_parts: break
            continue
        if TITLE_NOISE_RE.match(line):
            if title_parts: break
            continue
        if len(line) > 80:
            if title_parts: break
            continue
        title_parts.append(line)
        combined = " ".join(title_parts)
        # A line ending with :, ,, – or a conjunction signals the title continues
        if line.endswith((',', ':', '-', '–')):
            continue
        last_word = combined.rstrip(",:–").split()[-1].lower() if combined.split() else ""
        if last_word in ("and", "of", "the", "in", "a", "an", "to", "for",
                         "how", "what", "when", "where", "why", "with", "by",
                         "its", "their", "our", "your", "this", "that"):
            continue
        if len(combined) >= 6:
            break

    title = " ".join(title_parts).strip()
    title = re.sub(r'\s+\d+\s*$', '', title).strip()
    return title or f"Chapter {chapter_num}"

# ── main loop ─────────────────────────────────────────────────────────────────

master_entries = []
chapter_entries = []
topic_entries   = []

all_pdfs = sorted(BASE.rglob("*.pdf"))
total_pdfs = len(all_pdfs)

print(f"Found {total_pdfs} PDFs under {BASE}\n")

for pdf_path in all_pdfs:
    filename   = pdf_path.name
    rel_path   = str(pdf_path.relative_to(Path(".")))
    parts      = pdf_path.parts  # e.g. curriculum/sources/cbse/class9/mathematics/iemh106.pdf

    # Determine class/subject from directory path
    class_dir_name = None
    subject_dir_name = None
    for p in parts:
        if re.match(r'^class\d$', p):
            class_dir_name = p
        elif p in ("mathematics", "mathematics1", "mathematics2", "science", "computer"):
            subject_dir_name = p

    class_num_from_dir = int(class_dir_name[5]) if class_dir_name else None

    # Try filename-based parse first
    fm = parse_filename(filename)

    if fm:
        class_num   = fm["class_num"]
        subject     = fm["subject"]
        series      = fm["series"]
        book        = fm["book"]
        chapter_num = fm["chapter_num"]
        is_chapter  = fm["is_chapter"]
        is_prelims  = fm["is_prelims"]
    else:
        # Computer / ICT files — treat as reference documents
        class_num   = class_num_from_dir
        subject     = "Computer/ICT"
        series      = ""
        book        = None
        chapter_num = None
        is_chapter  = False
        is_prelims  = False

    pages = pdf_page_count(pdf_path)
    print(f"  {rel_path}  ({pages} pp)", end=" ... ")

    if is_chapter and chapter_num:
        text      = pdf_to_text(pdf_path)
        title     = extract_chapter_title(text, chapter_num)
        structure = extract_structure(text, chapter_num)
        print(f'Ch {chapter_num}: "{title}"')
    else:
        text      = pdf_to_text(pdf_path)
        first_lines = [clean(l) for l in text.splitlines() if clean(l)]
        title     = first_lines[0][:120] if first_lines else filename
        structure = {k: [] for k in ("sections","subsections","activities","exercises","key_terms","figures")}
        print(f'non-chapter: "{title[:60]}"')

    board = "CBSE"

    base_entry = {
        "filename":      filename,
        "filepath":      rel_path,
        "board":         board,
        "class":         class_num,
        "subject":       subject,
        "series":        series,
        "book":          book,
        "chapter_number": chapter_num,
        "chapter_title": title,
        "is_chapter":    is_chapter,
        "page_count":    pages,
    }
    master_entries.append({**base_entry, "structure": structure})

    if is_chapter:
        ch_entry = {
            **base_entry,
            "sections":    structure["sections"],
            "subsections": structure["subsections"],
            "activities":  structure["activities"],
            "exercises":   structure["exercises"],
            "key_terms":   structure["key_terms"],
            "figures":     structure["figures"],
        }
        chapter_entries.append(ch_entry)

        for sec in structure["sections"]:
            topic_entries.append({
                "board":          board,
                "class":          class_num,
                "subject":        subject,
                "series":         series,
                "book":           book,
                "chapter_number": chapter_num,
                "chapter_title":  title,
                "level":          "section",
                "number":         sec["number"],
                "title":          sec["title"],
                "filename":       filename,
            })
        for sub in structure["subsections"]:
            topic_entries.append({
                "board":          board,
                "class":          class_num,
                "subject":        subject,
                "series":         series,
                "book":           book,
                "chapter_number": chapter_num,
                "chapter_title":  title,
                "level":          "subsection",
                "number":         sub["number"],
                "title":          sub["title"],
                "filename":       filename,
            })

# ── write outputs ──────────────────────────────────────────────────────────────

def write_json(path, obj):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)
    print(f"  Wrote {path}")

write_json(OUT / "master-curriculum-index.json", {
    "note": "Extracted exclusively from uploaded official PDFs. No external knowledge used.",
    "total_pdfs": total_pdfs,
    "total_chapters": len(chapter_entries),
    "entries": master_entries,
})

write_json(OUT / "master-topic-index.json", {
    "note": "Extracted exclusively from uploaded official PDFs. No external knowledge used.",
    "total_topics": len(topic_entries),
    "topics": topic_entries,
})

write_json(OUT / "curriculum-manifest.json", {
    "note": "Extracted exclusively from uploaded official PDFs. No external knowledge used.",
    "total_chapters": len(chapter_entries),
    "chapters": chapter_entries,
})

print(f"\nSummary: {total_pdfs} PDFs | {len(chapter_entries)} chapters | {len(topic_entries)} topics")
