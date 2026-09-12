"""Extract concise course introductions from the 2026 DOCX syllabus collection."""

from __future__ import annotations

import json
import re
from pathlib import Path

from docx import Document


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTLINE_ROOT = PROJECT_ROOT.parents[2] / "大纲"
OUTPUT_PATH = PROJECT_ROOT / "lib" / "course-descriptions.json"

MAJOR_FOLDERS = {
    "视觉传达设计": OUTLINE_ROOT / "视觉传达",
    "数字媒体艺术": OUTLINE_ROOT / "数字媒体艺术",
    "包装设计": OUTLINE_ROOT / "包装设计",
    "智能交互设计": OUTLINE_ROOT / "智能交互设计",
}

TITLE_PATTERN = re.compile(r"^《([^》]+)》(?:课程)?教学大纲(?:（[^）]+）)?$")


def clean(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def concise(text: str, limit: int = 330) -> str:
    text = clean(text)
    if len(text) <= limit:
        return text
    sentences = re.split(r"(?<=[。！？])", text)
    selected: list[str] = []
    for sentence in sentences:
        if selected and len("".join(selected)) + len(sentence) > limit:
            break
        selected.append(sentence)
        if len("".join(selected)) >= 170:
            break
    result = "".join(selected).strip()
    if len(result) > limit:
        return result[: limit - 1].rstrip("，；、 ") + "…"
    return result if result else text[: limit - 1].rstrip("，；、 ") + "…"


def extract_docx(path: Path) -> dict[str, dict[str, str]]:
    try:
        paragraphs = [clean(paragraph.text) for paragraph in Document(path).paragraphs]
    except Exception as exc:  # Keep extraction resilient to one damaged draft.
        print(f"skip {path.name}: {exc}")
        return {}

    filename_match = re.search(r"《([^》]+)》", path.name)
    filename_title = clean(filename_match.group(1)) if filename_match else None
    entries: dict[str, dict[str, str]] = {}
    current_title: str | None = None
    for index, text in enumerate(paragraphs):
        if not text:
            continue
        title_match = TITLE_PATTERN.match(text)
        if title_match and "\t" not in text:
            current_title = clean(title_match.group(1))
            continue
        active_title = filename_title or current_title
        if active_title and re.search(r"课程(?:总体)?介绍", text):
            inline_description = re.sub(r"^.*?课程(?:总体)?介绍\s*[：:]?\s*", "", text)
            following = [item for item in paragraphs[index + 1 : index + 16] if item]
            description = inline_description or (following[0] if following else "")
            if not description:
                continue
            prerequisite = ""
            for item in following:
                if item.startswith("前修课程"):
                    prerequisite = clean(item.split("：", 1)[-1])
                    break
            entries[active_title] = {
                "description": concise(description),
                "prerequisite": prerequisite,
                "source": path.name,
            }
    return entries


def main() -> None:
    result: dict[str, dict[str, dict[str, str]]] = {}
    for major, folder in MAJOR_FOLDERS.items():
        courses: dict[str, dict[str, str]] = {}
        for path in sorted(folder.glob("*.docx")):
            if "人才培养方案" in path.name:
                continue
            for name, entry in extract_docx(path).items():
                existing = courses.get(name)
                if not existing or len(entry["description"]) > len(existing["description"]):
                    courses[name] = entry
        result[major] = dict(sorted(courses.items()))

    OUTPUT_PATH.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {OUTPUT_PATH}")
    for major, courses in result.items():
        print(f"{major}: {len(courses)} introductions")


if __name__ == "__main__":
    main()
