"""
SnapSolve Master Curriculum Database Builder
Reads every PDF under curriculum/sources/cbse/ and generates structured JSON.
Source: uploaded official PDFs only — no internet, no model knowledge used.
"""

import json
import re
import subprocess
from pathlib import Path

import pypdf

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

def pdf_bookmark_title(pdf_path: Path, chapter_num: int) -> str | None:
    """Return chapter title from PDF bookmarks if a clean usable title exists."""
    try:
        reader = pypdf.PdfReader(str(pdf_path))
        def walk(items):
            for item in items:
                if isinstance(item, list):
                    yield from walk(item)
                elif hasattr(item, "title"):
                    yield item.title
        for raw in walk(reader.outline):
            if not raw:
                continue
            t = raw.strip()
            if re.match(r'^[a-z]{4}\d{3}$', t.lower()):          # "gegp107"
                continue
            if re.match(r'^chapter\s+\d+\s*$', t, re.I):          # "CHAPTER 10"
                continue
            if re.search(r'solution|soloution|class-\d|part-\d', t, re.I):
                continue
            if re.search(r'\d+\.\d+\s', t):                       # section headings
                continue
            if re.search(r'\.(docx|xlsx|pdf|pptx)\b', t, re.I):   # leaked filenames
                continue
            # Strip "Ch-7 " or "Chapter N — " prefix
            t = re.sub(r'^(?:Ch(?:apter)?[-\s]+\d+[-–\u2013\u2014\s]+)', '', t, flags=re.I).strip()
            if len(t) >= 8:
                return t
    except Exception:
        pass
    return None

def clean(s: str) -> str:
    return " ".join(s.split()).strip()

# ── filename-based metadata ────────────────────────────────────────────────────

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
    m = CHAPTER_STEM_RE.match(filename.lower())
    if not m:
        return None
    cc, sc, book, suffix, _ = m.groups()
    return {
        "class_num":    CLASS_CODE.get(cc),
        "subject":      SUBJ_CODE.get(sc, (sc.upper(), ""))[0],
        "series":       SUBJ_CODE.get(sc, (sc.upper(), ""))[1],
        "book":         int(book),
        "chapter_num":  int(suffix) if suffix.isdigit() else None,
        "is_chapter":   suffix.isdigit(),
        "is_prelims":   suffix == "ps",
        "file_series":  (cc + sc).lower(),
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

# ── common regexes ─────────────────────────────────────────────────────────────

SECTION_HDR_RE = re.compile(r'^\d{1,2}\.\d[\s\.]')

TITLE_NOISE_RE = re.compile(
    r'^(Think [Ii]t [Oo]ver|Probe and [Pp]onder|'
    r'Reprint\b|'
    r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|'      # M/D/YYYY  M-D-YYYY
    r'\d{1,2}-[A-Za-z]{3}-\d{2,4}|'         # DD-Mon-YY
    r'\d{1,2}:\d{2}:\d{2}|'                 # HH:MM:SS
    r'Curiosity\b|Ganita|Grade\b|Class\b|NCERT|'
    r'[A-Za-z0-9_\-]+\.indd)',
    re.I
)

BULLET_CHAR_RE = re.compile(r'^[yz•●]\s*$|^[yz]\s+\S', re.I)

# Indic script Unicode ranges (Devanagari, Bengali, Gujarati, etc.)
_INDIC_RE = re.compile(r'[\u0900-\u0D7F]')

def _has_indic_script(s: str) -> bool:
    return bool(_INDIC_RE.search(s))

# Minimal non-title starters
_NON_TITLE_START_RE = re.compile(
    r'^(Reprint\b|Activity\s+\d|Fig\.\s*\d|Table\s+\d|Note:|Exercise\s+\d|'
    r'Share\s+your\s+questions)',
    re.I
)

def _is_title_line(line: str, max_len: int = 65) -> bool:
    if not line or len(line) < 2:
        return False
    if len(line) > max_len:
        return False
    if _has_indic_script(line):
        return False
    if TITLE_NOISE_RE.match(line):
        return False
    if BULLET_CHAR_RE.match(line):
        return False
    if SECTION_HDR_RE.match(line):
        return False
    if _NON_TITLE_START_RE.match(line):
        return False
    if re.match(r'^\d+$', line):
        return False
    return True


# ── Series-specific extractors ─────────────────────────────────────────────────

# Extended continuation words including prepositions that split titles
_CONT = {
    "and", "of", "the", "in", "a", "an", "to", "for",
    "how", "what", "when", "where", "why", "with", "by",
    "its", "their", "our", "your", "this", "that", "or",
    "through", "across", "about", "between", "into",
    "from", "at", "around", "along", "beyond", "over",
    "during", "via", "within", "upon",
}


def _extract_fecu_gecu(lines: list[str], chapter_num: int) -> str:
    """
    Class 6-7 Science (fecu / gecu).
    Strategy:
    - Find chapter number line (bare or embedded like "5 Physical and Chemical")
    - Collect short title lines using continuation + lookahead + word-count guard
    - If collected title looks like a prefix, check preceding line for complete version
    """
    num_str = str(chapter_num)
    MAX_LEN = 55
    MAX_WORDS = 7

    def _valid(line: str) -> bool:
        """True if line could be a title-line in fecu/gecu context."""
        if not _is_title_line(line, max_len=MAX_LEN):
            return False
        if len(line.split()) > MAX_WORDS:
            return False
        return True

    # ── Embedded case: "5 Physical and Chemical" ──────────────────────────────
    embedded_start = None
    embedded_extra = ""
    for i, line in enumerate(lines[:80]):
        if line.startswith(num_str + " ") and len(line) > len(num_str) + 1:
            embedded_start = i
            embedded_extra = line[len(num_str):].strip()
            break

    if embedded_start is not None:
        before: list[str] = []
        for ln in reversed(lines[:embedded_start]):
            if not _valid(ln):
                break
            before.insert(0, ln)
            if len(before) >= 3:
                break
        parts = before + ([embedded_extra] if embedded_extra else [])
        return " ".join(parts).strip() or f"Chapter {chapter_num}"

    # ── Standard case: bare chapter number ────────────────────────────────────
    start_idx = None
    for i, line in enumerate(lines[:80]):
        if line == num_str:
            start_idx = i
            break
    if start_idx is None:
        return f"Chapter {chapter_num}"

    # Collect title lines from start_idx + 1
    parts: list[str] = []
    i = start_idx + 1
    while i < start_idx + 8 and i < len(lines):
        line = lines[i]

        # Skip control characters and one-char garbage
        if len(line) <= 1 or re.match(r'^[\x00-\x1f\x7f]+$', line):
            if parts:
                break
            i += 1
            continue

        if not _valid(line):
            if parts:
                break
            i += 1
            continue

        parts.append(line)
        combined = " ".join(parts)
        n_words  = len(combined.split())

        # Peek at next line
        next_line = lines[i + 1] if i + 1 < len(lines) else ""
        next_ok   = _valid(next_line)
        next_first = next_line.split()[0].lower().rstrip(",;") if next_line.split() else ""

        # If only 1 combined word so far, always try to get one more
        if n_words == 1:
            i += 1
            continue

        # Continue if last token is a continuation preposition/conjunction
        last_word = combined.rstrip(",:–\u2013\u2014").split()[-1].lower()
        if last_word in _CONT:
            i += 1
            continue

        # Continue if line ends with comma or colon (more words coming)
        if line.rstrip().endswith((',', ':')):
            i += 1
            continue

        # Continue if next line opens with a continuation word (e.g. "to a Healthy Body")
        if next_ok and next_first in _CONT:
            i += 1
            continue

        break

    title = " ".join(parts).strip()
    if not title:
        return f"Chapter {chapter_num}"

    # If the extracted title looks like an incomplete prefix (ends mid-adjective-phrase),
    # check whether the line immediately before the chapter number is the full title
    if start_idx >= 1:
        preceding = lines[start_idx - 1]
        if (preceding.startswith(title) and
                len(preceding) > len(title) + 2 and
                _is_title_line(preceding, max_len=65)):
            return preceding

    return title


def _extract_hecu(lines: list[str], chapter_num: int) -> str:
    """
    Class 8 Science (hecu).
    Strategy A: scan for "Chapter N — Full Title" pattern (em/en-dash) in first 150 lines.
    Strategy B: title lines immediately before the chapter number line.
    """
    num_str = str(chapter_num)

    dash_re = re.compile(
        rf'Chapter\s+{chapter_num}\s*[\u2013\u2014\-]+\s*(.+)', re.I
    )
    for line in lines[:150]:
        m = dash_re.search(line)
        if m:
            t = m.group(1).strip()
            if t and len(t) >= 5:
                return t

    # Fallback: short lines before chapter number
    num_idx = None
    for i, line in enumerate(lines[:80]):
        if line == num_str:
            num_idx = i
            break
    if num_idx is not None and num_idx >= 1:
        candidate: list[str] = []
        for line in reversed(lines[:num_idx]):
            if not _is_title_line(line, max_len=60):
                break
            candidate.insert(0, line)
            if len(candidate) >= 4:
                break
        if candidate:
            t = " ".join(candidate).strip()
            if 4 <= len(t) <= 120:
                return t

    return f"Chapter {chapter_num}"


# Intro-paragraph starters that mark where the chapter body begins (not the title)
_INTRO_RE = re.compile(
    r'^(In (this|Chapter|earlier|Grade|our|the)|'
    r'You (have|will|may|know)|Have you|It (is|was|has)|'
    r'Everything|The (Earth|Sun|human|cell|atom|study|'
    r'atmosphere|water|living|properties|study|structure)|'
    r'These |This |From (Chapter|Grade|the)|Throughout|'
    r'Consider |Every |Sound is|'
    r'A (cell|tissue|plant|force|wave|sound|simple|body|single)|'
    r'Life (on|begins)|'
    r'Humans?|'
    r'All (of|these)|Matter |'
    r'Many (such|of|living|plants|animals|organisms)|'
    r'Due to|Despite|We (have|know|will)|'
    r'Earlier|Previously|Previously)',
    re.I
)

# Timestamp / indd-file patterns used as page-break anchors in iesc PDFs
_INDD_TS_RE = re.compile(
    r'[A-Za-z0-9_\-]+\.indd|'
    r'\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|'
    r'\d{1,2}-[A-Za-z]{3}-\d{2,4}',
    re.I
)


def _collect_iesc_title(lines: list[str], start: int, max_lines: int = 18) -> str:
    """
    Collect chapter title lines starting from `start`.
    Skips noise/indd/intro-paragraph/lowercase-start lines when no title started yet.
    Stops on intro-paragraph line once title has started.
    """
    parts: list[str] = []
    for line in lines[start: start + max_lines]:
        # Skip noise / indd / timestamps
        if TITLE_NOISE_RE.match(line) or _INDD_TS_RE.search(line):
            if parts:
                break
            continue
        # Skip "Chapter N" cross-references
        if re.match(r'^Chapter\s+\d+$', line, re.I):
            if parts:
                break
            continue
        # Must be a valid title line (length, no Indic, etc.)
        if not _is_title_line(line, max_len=65):
            if parts:
                break
            continue
        # Check word count: a first line with many words is an intro sentence
        wc = len(line.split())
        if wc > 7:
            if parts:
                break
            continue
        # Intro-paragraph starters
        if _INTRO_RE.match(line):
            if parts:
                break
            continue
        # Lines starting with lowercase are sentence continuations, not titles
        if not parts and line and line[0].islower():
            continue
        # Stop on lowercase lines once title has started, UNLESS it's a
        # continuation word like "and", "of", "in" that continues the title
        if parts and line and line[0].islower():
            first_word = line.split()[0].lower().rstrip(",;")
            if first_word not in _CONT:
                break
        parts.append(line)
        if len(parts) >= 4:
            break

    return " ".join(parts).strip()


def _is_valid_iesc_title(t: str) -> bool:
    """Return True if `t` looks like a genuine chapter title (not a sentence fragment)."""
    if not t or len(t) < 5:
        return False
    # Titles don't end with a full stop
    if t.endswith('.'):
        return False
    # Titles should have at least 3 words (all known iesc titles do)
    if len(t.split()) < 3:
        return False
    # Titles don't end with a preposition / article / conjunction
    last_word = t.rstrip(",:–\u2013\u2014").split()[-1].lower()
    _INCOMPLETE = {"the", "a", "an", "of", "in", "to", "for", "by", "their",
                   "its", "our", "and", "or", "with", "at", "on", "from"}
    if last_word in _INCOMPLETE:
        return False
    return True


def _extract_iesc(lines: list[str], chapter_num: int) -> str:
    """
    Class 9 Science (iesc).

    Variant A: title lines between "Chapter" keyword and chapter number
               (e.g. iesc106: Chapter → How Forces Affect → Motion → 6)
    Variant B: title appears right after the last Think-It-Over question (within 30 lines)
    Fallback:  title appears right after the last indd/timestamp stamp in first 70 lines
               (chapter title recapped as a page header on the body page)
    """
    num_str = str(chapter_num)

    # Locate "Chapter" keyword and bare chapter number
    chapter_word_idx = None
    chapter_num_idx  = None
    for i, line in enumerate(lines[:40]):
        if line.lower() == "chapter" and chapter_word_idx is None:
            chapter_word_idx = i
        if line == num_str and chapter_word_idx is not None and chapter_num_idx is None:
            chapter_num_idx = i

    # ── Variant A: title before chapter number ────────────────────────────────
    if chapter_word_idx is not None and chapter_num_idx is not None:
        gap_lines = lines[chapter_word_idx + 1 : chapter_num_idx]
        title_lines = [
            l for l in gap_lines
            if _is_title_line(l, max_len=65)
            and not re.match(r'^Think [Ii]t [Oo]ver$', l)
        ]
        if title_lines:
            return " ".join(title_lines).strip()

    # ── Variant B: title after Think-It-Over block ────────────────────────────
    after_num = (chapter_num_idx + 1) if chapter_num_idx is not None else 0

    # Find last Think-It-Over question-mark line (within 30 lines, skip section headings)
    last_tio_q   = None
    last_bullet  = None
    for i, line in enumerate(lines[after_num: after_num + 30], start=after_num):
        if BULLET_CHAR_RE.match(line):
            last_bullet = i
        if line.endswith("?") and not SECTION_HDR_RE.match(line):
            last_tio_q = i

    # Anchor: start looking for title right after last TIO question / bullet
    tio_anchor = max(x for x in (last_tio_q, last_bullet, after_num - 1) if x is not None) + 1
    title = _collect_iesc_title(lines, tio_anchor)

    # Validate: genuine chapter titles don't end in a period, have ≥3 words, no hanging preposition
    if _is_valid_iesc_title(title):
        return title

    # Fallback: title re-appears as page header right after the last indd/timestamp
    last_ts = None
    for i, line in enumerate(lines[after_num: after_num + 70], start=after_num):
        if _INDD_TS_RE.search(line):
            last_ts = i

    if last_ts is not None:
        title = _collect_iesc_title(lines, last_ts + 1)
        if _is_valid_iesc_title(title):
            return title

    return f"Chapter {chapter_num}"


def _extract_math_678(lines: list[str], chapter_num: int, pdf_path: Path) -> str:
    """
    Class 6-8 Mathematics (fegp / gegp / hegp).
    Priority:
    1. Strict-filtered PDF bookmark
    2. Short lines BEFORE the chapter number (hegp105 pattern)
    3. Short lines AFTER the chapter number (most chapters)
    """
    num_str = str(chapter_num)

    # 1. Bookmark
    bm = pdf_bookmark_title(pdf_path, chapter_num)
    if bm:
        return bm

    # 2. Find chapter number in first 12 lines
    start_idx = None
    for i, line in enumerate(lines[:12]):
        if line == num_str:
            start_idx = i
            break
    if start_idx is None:
        return f"Chapter {chapter_num}"

    def _collect_math_title(from_idx: int) -> str:
        parts: list[str] = []
        for idx, line in enumerate(lines[from_idx: from_idx + 6]):
            if not _is_title_line(line, max_len=60):
                if parts:
                    break
                continue
            if SECTION_HDR_RE.match(line):
                if parts:
                    break
                continue
            if len(line.split()) > 7:
                if parts:
                    break
                continue
            parts.append(line)
            combined = " ".join(parts)
            n_words = len(combined.split())
            if n_words == 1:
                continue  # single word: always try one more line
            # Peek at next line for continuation logic
            next_line = lines[from_idx + idx + 1] if from_idx + idx + 1 < len(lines) else ""
            next_first = next_line.split()[0].lower().rstrip(",;") if next_line.split() else ""
            # For ALL-CAPS titles: continue if next line is ALSO all-caps
            # (e.g. "FINDING COMMON" + "GROUND", "YET THINGS" + "MULTIPLY").
            # Stop only when next line is mixed-case (e.g. "Integers" subtitle
            # after "ZERO") or a section heading / intro sentence.
            bare = combined.replace(" ", "").replace(",", "").replace(":", "")
            is_all_caps = bare == bare.upper() and len(bare) > 3
            if is_all_caps:
                last_word = combined.rstrip(",:–\u2013\u2014").split()[-1].lower()
                if last_word in _CONT:
                    continue
                if combined.rstrip().endswith((',', ':')):
                    continue
                # Check whether next non-empty line is also ALL-CAPS
                next_bare = next_line.replace(" ", "").replace(",", "").replace(":", "")
                next_is_all_caps = (next_bare == next_bare.upper() and len(next_bare) > 2)
                if next_is_all_caps:
                    continue  # title continues on next ALL-CAPS line
                if next_first in _CONT:
                    continue
                break
            # For mixed-case titles rely only on length/section-heading stop conditions
        return " ".join(parts).strip()

    _LOWER_WORDS = {"a", "an", "the", "and", "but", "or", "for", "nor",
                    "on", "at", "to", "by", "in", "of", "up", "as", "vs"}

    def _title_case(t: str) -> str:
        if not t or t != t.upper():
            return t
        words = t.split()
        out = []
        for i, w in enumerate(words):
            if i == 0 or i == len(words) - 1:
                out.append(w.capitalize())
            elif w.lower() in _LOWER_WORDS:
                out.append(w.lower())
            else:
                out.append(w.capitalize())
        return " ".join(out)

    # 3. Lines BEFORE chapter number
    if start_idx >= 1:
        before: list[str] = []
        for line in reversed(lines[:start_idx]):
            if not _is_title_line(line, max_len=60):
                break
            if SECTION_HDR_RE.match(line):
                break
            if len(line.split()) > 7:
                break
            before.insert(0, line)
            if len(before) >= 3:
                break
        if before:
            t = _title_case(" ".join(before).strip())
            if t and len(t) >= 3:
                return t

    # 4. Lines AFTER chapter number
    t = _collect_math_title(start_idx + 1)
    if t:
        return _title_case(t)

    return f"Chapter {chapter_num}"


def _extract_generic(lines: list[str], chapter_num: int) -> str:
    """
    Original anchor-based extraction (works well for iemh / Class 9 Math).
    """
    CONTINUATION_WORDS = {
        "and", "of", "the", "in", "a", "an", "to", "for",
        "how", "what", "when", "where", "why", "with", "by",
        "its", "their", "our", "your", "this", "that", "or",
    }
    num_str = str(chapter_num)

    start_idx = None
    for i, line in enumerate(lines[:60]):
        if line == num_str or line == f"Chapter {num_str}":
            start_idx = i
            break
    if start_idx is None:
        return f"Chapter {chapter_num}"

    last_q_idx = last_indd_idx = None
    for i, line in enumerate(lines[start_idx+1 : start_idx+36], start=start_idx+1):
        if line.endswith("?"):
            last_q_idx = i
        if re.search(r'\.indd\b', line, re.I):
            last_indd_idx = i

    section_hdr_idx = None
    for i, line in enumerate(lines[start_idx+1 : start_idx+120], start=start_idx+1):
        if SECTION_HDR_RE.match(line):
            section_hdr_idx = i
            break

    raw_zone_start = max(
        x for x in (last_q_idx, last_indd_idx, start_idx) if x is not None
    ) + 1
    zone_end = section_hdr_idx if section_hdr_idx is not None else start_idx + 12

    zone_start = start_idx + 1 if raw_zone_start >= zone_end else raw_zone_start
    window     = lines[zone_start : zone_end]

    def _line_ok(ln: str) -> bool:
        return (len(ln) >= 3 and not BULLET_CHAR_RE.match(ln)
                and not TITLE_NOISE_RE.match(ln) and len(ln) <= 80)

    title_parts: list[str] = []

    # Short window (≤ 4 lines) is the exact title zone — collect all valid lines
    if len(window) <= 4:
        for line in window:
            if _line_ok(line):
                title_parts.append(line)
    else:
        for line in window:
            if not _line_ok(line):
                if title_parts: break
                continue
            title_parts.append(line)
            combined = " ".join(title_parts)
            if line.endswith((',', ':', '-', '\u2013', '\u2014')):
                continue
            last_word = combined.rstrip(",:–\u2013\u2014").split()[-1].lower() if combined.split() else ""
            if last_word in CONTINUATION_WORDS:
                continue
            if len(combined) >= 6:
                break

    title = " ".join(title_parts).strip()
    return re.sub(r'\s+\d+\s*$', '', title).strip() or f"Chapter {chapter_num}"


def extract_chapter_title(text: str, chapter_num: int,
                          file_series: str = "", pdf_path: Path = None) -> str:
    lines = [clean(l) for l in text.splitlines() if clean(l)]

    if file_series in ("fecu", "gecu"):
        return _extract_fecu_gecu(lines, chapter_num)
    if file_series == "hecu":
        return _extract_hecu(lines, chapter_num)
    if file_series == "iesc":
        return _extract_iesc(lines, chapter_num)
    if file_series in ("fegp", "gegp", "hegp"):
        return _extract_math_678(lines, chapter_num, pdf_path or Path())
    return _extract_generic(lines, chapter_num)


# ── main loop ─────────────────────────────────────────────────────────────────

master_entries  = []
chapter_entries = []
topic_entries   = []

all_pdfs   = sorted(BASE.rglob("*.pdf"))
total_pdfs = len(all_pdfs)
print(f"Found {total_pdfs} PDFs under {BASE}\n")

for pdf_path in all_pdfs:
    filename  = pdf_path.name
    rel_path  = str(pdf_path.relative_to(Path(".")))
    parts     = pdf_path.parts

    class_dir_name = next((p for p in parts if re.match(r'^class\d$', p)), None)
    class_num_from_dir = int(class_dir_name[5]) if class_dir_name else None

    fm = parse_filename(filename)
    if fm:
        class_num   = fm["class_num"]
        subject     = fm["subject"]
        series      = fm["series"]
        book        = fm["book"]
        chapter_num = fm["chapter_num"]
        is_chapter  = fm["is_chapter"]
        file_series = fm["file_series"]
    else:
        class_num   = class_num_from_dir
        subject     = "Computer/ICT"
        series      = ""
        book        = None
        chapter_num = None
        is_chapter  = False
        file_series = ""

    pages = pdf_page_count(pdf_path)
    print(f"  {rel_path}  ({pages} pp)", end=" ... ")

    if is_chapter and chapter_num:
        text      = pdf_to_text(pdf_path)
        title     = extract_chapter_title(text, chapter_num,
                                          file_series=file_series,
                                          pdf_path=pdf_path)
        structure = extract_structure(text, chapter_num)
        print(f'Ch {chapter_num}: "{title}"')
    else:
        text         = pdf_to_text(pdf_path)
        first_lines  = [clean(l) for l in text.splitlines() if clean(l)]
        title        = first_lines[0][:120] if first_lines else filename
        structure    = {k: [] for k in ("sections","subsections","activities","exercises","key_terms","figures")}
        print(f'non-chapter: "{title[:60]}"')

    board = "CBSE"
    base_entry = {
        "filename":       filename,
        "filepath":       rel_path,
        "board":          board,
        "class":          class_num,
        "subject":        subject,
        "series":         series,
        "book":           book,
        "chapter_number": chapter_num,
        "chapter_title":  title,
        "is_chapter":     is_chapter,
        "page_count":     pages,
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
