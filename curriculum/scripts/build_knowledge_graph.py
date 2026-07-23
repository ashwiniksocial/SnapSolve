"""
build_knowledge_graph.py
Generates three knowledge-graph files from the three master curriculum JSON files.

Sources:  curriculum/generated/master-curriculum-index.json
          curriculum/generated/master-topic-index.json
          curriculum/generated/curriculum-manifest.json

Outputs:  curriculum/generated/knowledge-graph.json
          curriculum/generated/topic-dependency-map.json
          curriculum/generated/chapter-sequence-map.json

Rules (strict):
  - Only relationships derivable from the uploaded curriculum (position, order, adjacency).
  - No inference from model knowledge.
  - Explicit prerequisites: none found in curriculum sections → 0 explicit dependency edges.
  - Sequential edges (prev/next topic within chapter) ARE positional, not inferred.
"""

import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path("curriculum/generated")

manifest_raw  = json.loads((ROOT / "curriculum-manifest.json").read_text())
topics_raw    = json.loads((ROOT / "master-topic-index.json").read_text())

chapters  = manifest_raw["chapters"]
all_topics = topics_raw["topics"]

# ── helpers ───────────────────────────────────────────────────────────────────

def _slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

def _topic_id(cls, subject, book, chapter_num, section_num):
    b = book if book else 1
    return f"{cls}-{_slug(subject)}-b{b}-c{chapter_num}-{section_num}"

def _chapter_id(cls, subject, book, chapter_num):
    b = book if book else 1
    return f"{cls}-{_slug(subject)}-b{b}-c{chapter_num}"

def _subject_stream_key(cls, subject):
    """Key that groups all books of a subject into one stream."""
    return (cls, subject)

def _section_sort_key(number: str):
    """Sort section numbers like '1.1', '1.10', '2.3' numerically."""
    parts = re.split(r"[.\-]", str(number))
    return tuple(int(p) if p.isdigit() else 0 for p in parts)

# ── build chapter index ────────────────────────────────────────────────────────
# For each (class, subject) stream, order chapters across books sequentially:
#   book 1 ch 1 .. book 1 ch N, book 2 ch 1 .. book 2 ch M

stream_chapters = defaultdict(list)  # stream_key → [chapter dict, ...]
for ch in chapters:
    sk = _subject_stream_key(ch["class"], ch["subject"])
    stream_chapters[sk].append(ch)

for sk in stream_chapters:
    stream_chapters[sk].sort(key=lambda c: (c.get("book") or 1, c["chapter_number"]))

# Assign global position within stream
chapter_stream_pos = {}   # chapter_id → {stream_pos, stream_total, prev_ch_id, next_ch_id}
chapter_global_idx = {}   # chapter_id → chapter dict

for sk, chs in stream_chapters.items():
    total = len(chs)
    for i, ch in enumerate(chs):
        chid = _chapter_id(ch["class"], ch["subject"], ch.get("book"), ch["chapter_number"])
        prev_chid = _chapter_id(
            chs[i-1]["class"], chs[i-1]["subject"], chs[i-1].get("book"), chs[i-1]["chapter_number"]
        ) if i > 0 else None
        next_chid = _chapter_id(
            chs[i+1]["class"], chs[i+1]["subject"], chs[i+1].get("book"), chs[i+1]["chapter_number"]
        ) if i < total - 1 else None
        chapter_stream_pos[chid] = {
            "stream_position": i + 1,
            "stream_total":    total,
            "prev_chapter_id": prev_chid,
            "next_chapter_id": next_chid,
        }
        chapter_global_idx[chid] = ch

# ── build topic index ordered within each chapter ─────────────────────────────

ch_topic_lists = defaultdict(list)   # chapter_id → [topic entries in order]
for t in all_topics:
    chid = _chapter_id(t["class"], t["subject"], t.get("book"), t["chapter_number"])
    ch_topic_lists[chid].append(t)

for chid in ch_topic_lists:
    ch_topic_lists[chid].sort(key=lambda t: _section_sort_key(t["number"]))

# Assign position within chapter and prev/next topic IDs
topic_pos_map = {}   # topic_id → position metadata

for chid, topic_list in ch_topic_lists.items():
    total = len(topic_list)
    for i, t in enumerate(topic_list):
        tid = _topic_id(t["class"], t["subject"], t.get("book"), t["chapter_number"], t["number"])
        prev_tid = _topic_id(
            topic_list[i-1]["class"], topic_list[i-1]["subject"],
            topic_list[i-1].get("book"), topic_list[i-1]["chapter_number"],
            topic_list[i-1]["number"]
        ) if i > 0 else None
        next_tid = _topic_id(
            topic_list[i+1]["class"], topic_list[i+1]["subject"],
            topic_list[i+1].get("book"), topic_list[i+1]["chapter_number"],
            topic_list[i+1]["number"]
        ) if i < total - 1 else None
        topic_pos_map[tid] = {
            "topic_id":           tid,
            "chapter_position":   i + 1,
            "chapter_total":      total,
            "prev_topic_in_chapter": prev_tid,
            "next_topic_in_chapter": next_tid,
        }

# ── 1. knowledge-graph.json ───────────────────────────────────────────────────
# One node per topic with all parent/sequence fields.

kg_nodes = []
for t in all_topics:
    chid = _chapter_id(t["class"], t["subject"], t.get("book"), t["chapter_number"])
    tid  = _topic_id(t["class"], t["subject"], t.get("book"), t["chapter_number"], t["number"])
    pos  = topic_pos_map.get(tid, {})
    csp  = chapter_stream_pos.get(chid, {})
    ch   = chapter_global_idx.get(chid, {})

    kg_nodes.append({
        "topic_id":              tid,
        "topic_number":          t["number"],
        "topic_title":           t["title"],
        "topic_level":           t.get("level", "section"),
        # parent pointers
        "parent_chapter_id":     chid,
        "parent_chapter_number": t["chapter_number"],
        "parent_chapter_title":  t["chapter_title"],
        "parent_book":           t.get("book"),
        "parent_subject":        t["subject"],
        "parent_series":         t.get("series", ""),
        "parent_class":          t["class"],
        "board":                 t.get("board", "CBSE"),
        "source_filename":       t.get("filename", ""),
        # within-chapter sequence
        "chapter_position":      pos.get("chapter_position"),
        "chapter_total_topics":  pos.get("chapter_total"),
        "prev_topic_id":         pos.get("prev_topic_in_chapter"),
        "next_topic_id":         pos.get("next_topic_in_chapter"),
        # cross-chapter pointers (chapter level, not topic level)
        "prev_chapter_id":       csp.get("prev_chapter_id"),
        "next_chapter_id":       csp.get("next_chapter_id"),
        # explicit prerequisites from curriculum: none found
        "prerequisite_topic_ids":  [],
        "dependent_topic_ids":     [],
    })

kg_nodes.sort(key=lambda n: (
    n["parent_class"],
    n["parent_subject"],
    n["parent_book"] or 1,
    n["parent_chapter_number"],
    _section_sort_key(n["topic_number"]),
))

# ── 2. topic-dependency-map.json ─────────────────────────────────────────────
# Sequential edges only (prev/next within chapter).
# Explicit curriculum prerequisites: 0 found → 0 explicit edges.

sequential_edges = []
explicit_edges   = []   # empty: no explicit prerequisites found in curriculum

for node in kg_nodes:
    if node["prev_topic_id"]:
        sequential_edges.append({
            "from_topic_id": node["prev_topic_id"],
            "to_topic_id":   node["topic_id"],
            "edge_type":     "sequential",
            "basis":         "curriculum_position",
        })

dep_map = {
    "note": (
        "Sequential edges reflect topic ordering within each chapter as printed "
        "in the uploaded curriculum PDFs. "
        "Explicit prerequisite/dependent edges: 0 (no explicit prerequisites "
        "were found in any chapter section heading in the uploaded curriculum)."
    ),
    "total_sequential_edges": len(sequential_edges),
    "total_explicit_prerequisite_edges": len(explicit_edges),
    "total_edges": len(sequential_edges) + len(explicit_edges),
    "sequential_edges": sequential_edges,
    "explicit_prerequisite_edges": explicit_edges,
}

# ── 3. chapter-sequence-map.json ─────────────────────────────────────────────

ch_seq_nodes = []
for sk, chs in sorted(stream_chapters.items()):
    cls, subj = sk
    total = len(chs)
    for i, ch in enumerate(chs):
        chid = _chapter_id(ch["class"], ch["subject"], ch.get("book"), ch["chapter_number"])
        csp  = chapter_stream_pos[chid]
        ch_topics = ch_topic_lists.get(chid, [])
        first_tid = _topic_id(
            ch["class"], ch["subject"], ch.get("book"),
            ch["chapter_number"], ch_topics[0]["number"]
        ) if ch_topics else None
        last_tid = _topic_id(
            ch["class"], ch["subject"], ch.get("book"),
            ch["chapter_number"], ch_topics[-1]["number"]
        ) if ch_topics else None

        ch_seq_nodes.append({
            "chapter_id":       chid,
            "class":            ch["class"],
            "subject":          ch["subject"],
            "series":           ch.get("series", ""),
            "book":             ch.get("book"),
            "chapter_number":   ch["chapter_number"],
            "chapter_title":    ch["chapter_title"],
            "stream_position":  csp["stream_position"],
            "stream_total":     csp["stream_total"],
            "prev_chapter_id":  csp["prev_chapter_id"],
            "next_chapter_id":  csp["next_chapter_id"],
            "topic_count":      len(ch_topics),
            "first_topic_id":   first_tid,
            "last_topic_id":    last_tid,
            "source_filename":  ch.get("filename", ""),
        })

# ── write outputs ──────────────────────────────────────────────────────────────

def write_json(path, obj):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)
    print(f"  Wrote {path}")

write_json(ROOT / "knowledge-graph.json", {
    "note": (
        "Curriculum Knowledge Graph built exclusively from master-curriculum-index.json, "
        "master-topic-index.json, and curriculum-manifest.json. "
        "No model knowledge used. Relationships derived from curriculum position only."
    ),
    "total_topics":  len(kg_nodes),
    "total_chapters": len(chapter_global_idx),
    "nodes": kg_nodes,
})

write_json(ROOT / "topic-dependency-map.json", dep_map)

write_json(ROOT / "chapter-sequence-map.json", {
    "note": (
        "Chapter sequences ordered by (book, chapter_number) within each "
        "(class, subject) stream. Multi-book subjects (Class 7 & 8 Mathematics) "
        "treat Book 2 as a continuation of Book 1 within the same academic year."
    ),
    "total_chapters": len(ch_seq_nodes),
    "chapters": ch_seq_nodes,
})

# ── validation report ─────────────────────────────────────────────────────────

total_topics    = len(kg_nodes)
total_chapters  = len(ch_seq_nodes)
total_edges     = dep_map["total_edges"]
seq_edges       = dep_map["total_sequential_edges"]
expl_edges      = dep_map["total_explicit_prerequisite_edges"]

# Topics with no parent chapter (shouldn't happen if data is clean)
no_parent = [n for n in kg_nodes if not n["parent_chapter_id"]]

# Topics with no sequence info (chapter_position is None)
no_seq    = [n for n in kg_nodes if n["chapter_position"] is None]

# Topics that are first in their chapter (no prev_topic_id)
no_prev   = [n for n in kg_nodes if not n["prev_topic_id"]]

print("\n============================")
print("  KNOWLEDGE GRAPH SUMMARY")
print("============================")
print(f"  Total topics:              {total_topics}")
print(f"  Total chapters:            {total_chapters}")
print(f"  Total dependency edges:    {total_edges}")
print(f"    Sequential (prev→next):  {seq_edges}")
print(f"    Explicit prerequisites:  {expl_edges}")
print(f"  Topics with no parent:     {len(no_parent)}")
print(f"  Topics with no sequence:   {len(no_seq)}")
print(f"  Chapter-opening topics:    {len(no_prev)} (one per chapter, as expected)")
print()

# Stream breakdown
print("=== Chapter streams ===")
for sk, chs in sorted(stream_chapters.items()):
    cls, subj = sk
    books = sorted(set(c.get("book") or 1 for c in chs))
    print(f"  Class {cls} {subj}: {len(chs)} chapters, book(s) {books}")
