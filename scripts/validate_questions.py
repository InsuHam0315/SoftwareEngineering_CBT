"""모의고사 데이터의 구조, 범위 비율, 정답 배열을 검증한다."""
from __future__ import annotations

import json
import re
import sys
import unicodedata
from collections import Counter
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
REQUIRED = ["id", "exam", "range", "sourceFolder", "sourceFile", "topic", "type", "difficulty", "question", "choices", "answer", "explanation", "tags"]
TARGETS = {
    "mock01": {1: 13, 2: 12, 3: 13, 4: 12},
    "mock02": {1: 12, 2: 13, 3: 12, 4: 13},
}
FILES = {
    "mock01": "software_engineering_mock_01.js",
    "mock02": "software_engineering_mock_02.js",
}
GLOBALS = {"mock01": "window.SE_MOCK_01", "mock02": "window.SE_MOCK_02"}


def load_js(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8-sig")
    match = re.search(r"=\s*(\[.*\])\s*;?\s*$", text, re.S)
    if not match:
        raise ValueError("전역 배열 대입 형식을 찾지 못함")
    return json.loads(match.group(1))


def normalized(text: str) -> str:
    return re.sub(r"[^0-9a-z가-힣]", "", unicodedata.normalize("NFC", text).lower())


def source_names(folder: str) -> set[str]:
    source = ROOT / "시험" / folder
    return {unicodedata.normalize("NFC", p.name) for p in source.iterdir() if p.is_file()} if source.exists() else set()


def validate_exam(exam: str, questions: list[dict]) -> list[str]:
    errors: list[str] = []
    label = f"data/{FILES[exam]}"
    if len(questions) != 50:
        errors.append(f"{label}: 문항 수 {len(questions)} (기대 50)")
    ids: set[str] = set()
    known_sources = {folder: source_names(folder) for folder in ("중간고사", "기말고사") if (ROOT / "시험" / folder).exists()}
    for index, item in enumerate(questions, 1):
        where = f"{label} #{index}"
        missing = [field for field in REQUIRED if field not in item]
        if missing:
            errors.append(f"{where}: 필수 필드 누락 {missing}")
            continue
        for field, value in item.items():
            if isinstance(value, str) and not value.strip():
                errors.append(f"{where}: 빈 문자열 필드 '{field}'")
        if item["id"] in ids:
            errors.append(f"{where}: ID 중복 '{item['id']}'")
        ids.add(item["id"])
        if item["exam"] != exam:
            errors.append(f"{where}: exam 값 '{item['exam']}'")
        if item["range"] not in ("중간고사", "기말고사"):
            errors.append(f"{where}: 잘못된 range '{item['range']}'")
        if item["sourceFolder"] != item["range"]:
            errors.append(f"{where}: sourceFolder와 range 불일치")
        if not isinstance(item["choices"], list) or len(item["choices"]) != 4:
            errors.append(f"{where}: choices 길이가 4가 아님")
        elif any(not isinstance(choice, str) or not choice.strip() for choice in item["choices"]):
            errors.append(f"{where}: 빈 선지 존재")
        elif len(set(item["choices"])) != 4:
            errors.append(f"{where}: 중복 선지 존재")
        if item["answer"] not in (1, 2, 3, 4):
            errors.append(f"{where}: answer가 1~4가 아님")
        if not isinstance(item["explanation"], str) or not item["explanation"].strip():
            errors.append(f"{where}: explanation이 비어 있음")
        if not isinstance(item["tags"], list) or not item["tags"]:
            errors.append(f"{where}: tags가 비어 있음")
        elif any(not isinstance(tag, str) or not tag.strip() for tag in item["tags"]):
            errors.append(f"{where}: 빈 태그 존재")
        folder = item.get("sourceFolder")
        filename = unicodedata.normalize("NFC", item.get("sourceFile", ""))
        if folder in known_sources and filename not in known_sources[folder]:
            errors.append(f"{where}: 원본 폴더에 sourceFile이 없음 '{item.get('sourceFile')}'")
    ranges = Counter(item.get("range") for item in questions)
    if ranges != Counter({"중간고사": 15, "기말고사": 35}):
        errors.append(f"{label}: 범위 분포 {dict(ranges)} (기대 중간 15/기말 35)")
    answers = Counter(item.get("answer") for item in questions)
    if dict(sorted(answers.items())) != TARGETS[exam]:
        errors.append(f"{label}: 정답 분포 {dict(sorted(answers.items()))} (기대 {TARGETS[exam]})")
    for i in range(len(questions) - 2):
        run = [questions[i + j].get("answer") for j in range(3)]
        if len(set(run)) == 1:
            errors.append(f"{label}: {i + 1}~{i + 3}번 정답 {run[0]}이 3회 연속")
    print(f"[정보] {exam}: 총 {len(questions)}, 범위 {dict(ranges)}, 정답 {dict(sorted(answers.items()))}")
    return errors


def duplicate_reports(all_questions: list[tuple[str, dict]]) -> list[str]:
    reports: list[str] = []
    for i, (exam_a, a) in enumerate(all_questions):
        a_text = normalized(a.get("question", ""))
        for exam_b, b in all_questions[i + 1:]:
            if a.get("id") == b.get("id"):
                continue
            b_text = normalized(b.get("question", ""))
            ratio = SequenceMatcher(None, a_text, b_text).ratio() if a_text and b_text else 0
            if ratio >= 0.88:
                reports.append(f"중복 의심({ratio:.2f}): {exam_a}/{a.get('id')} ↔ {exam_b}/{b.get('id')}")
    return reports


def main() -> int:
    errors: list[str] = []
    loaded: dict[str, list[dict]] = {}
    for exam in ("mock01", "mock02"):
        path = DATA / FILES[exam]
        if not path.exists():
            errors.append(f"필수 파일 없음: {path.relative_to(ROOT)}")
            continue
        try:
            if GLOBALS[exam] not in path.read_text(encoding="utf-8-sig"):
                errors.append(f"{path.relative_to(ROOT)}: 전역변수 {GLOBALS[exam]} 없음")
            loaded[exam] = load_js(path)
            errors.extend(validate_exam(exam, loaded[exam]))
        except (ValueError, json.JSONDecodeError) as exc:
            errors.append(f"data/{FILES[exam]} 파싱 실패: {exc}")
    final_bank = DATA / "software_engineering_final_bank.js"
    if not final_bank.exists():
        errors.append("필수 파일 없음: data/software_engineering_final_bank.js")
    elif "window.SE_FINAL_BANK" not in final_bank.read_text(encoding="utf-8-sig"):
        errors.append("data/software_engineering_final_bank.js: window.SE_FINAL_BANK 없음")
    if len(loaded.get("mock01", [])) + len(loaded.get("mock02", [])) == 100:
        combined_ranges = Counter(item["range"] for questions in loaded.values() for item in questions)
        if combined_ranges != Counter({"중간고사": 30, "기말고사": 70}):
            errors.append(f"통합 문제은행 범위 분포 오류: {dict(combined_ranges)}")
        else:
            print("[정보] 통합 문제은행: 총 100, 중간고사 30, 기말고사 70")
    pairs = [(exam, q) for exam, questions in loaded.items() for q in questions]
    duplicates = duplicate_reports(pairs)
    if duplicates:
        print(f"[보고] 중복 의심 {len(duplicates)}건")
        for report in duplicates[:20]:
            print(f"  - {report}")
    else:
        print("[보고] 유사도 0.88 이상 중복 의심 문항 없음")
    if errors:
        print(f"\n[실패] 질문 검증 오류 {len(errors)}건")
        for error in errors:
            print(f"  - {error}")
        return 1
    print("\n[통과] 모의고사 질문 검증을 모두 통과했습니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
