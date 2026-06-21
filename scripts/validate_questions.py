"""모의고사와 기말 CBT 세트의 구조·난도·정답·선지 편향을 검증한다."""
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
DATASETS = {
    "mock01": ("software_engineering_mock_01.js", "window.SE_MOCK_01", "mock01"),
    "mock02": ("software_engineering_mock_02.js", "window.SE_MOCK_02", "mock02"),
    **{f"final_set_{n:02d}": (f"software_engineering_final_set_{n:02d}.js", f"window.SE_FINAL_SET_{n:02d}", f"final-set-{n:02d}") for n in range(1, 7)},
}
ABSOLUTE_WORDS = ("항상", "절대", "무조건", "반드시", "전혀")
VAGUE_CHOICES = {"모두옳다", "모두맞다", "해당없다", "알수없다", "기타이다", "위와같다"}
BANNED_PADDING = ("제시된 조건과 결과를 함께 고려", "관련 전제도 함께 확인", "을(를)", "표면적 특징만 보고 제시된 조건")


def load_js(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8-sig")
    match = re.search(r"=\s*(\[.*\])\s*;?\s*$", text, re.S)
    if not match:
        raise ValueError("전역 배열 대입 형식을 찾지 못함")
    value = json.loads(match.group(1))
    if not isinstance(value, list):
        raise ValueError("최상위 값이 배열이 아님")
    return value


def normalized(text: str) -> str:
    return re.sub(r"[^0-9a-z가-힣]", "", unicodedata.normalize("NFC", str(text)).lower())


def choice_length(text: str) -> int:
    return len(re.sub(r"\s+", "", str(text)))


def expected_difficulty(label: str) -> dict[str, tuple[int, int]]:
    if label.startswith("mock"):
        return {"쉬움": (5, 8), "보통": (20, 24), "어려움": (18, 22)}
    return {"쉬움": (5, 7), "보통": (20, 23), "어려움": (20, 25)}


def validate_set(label: str, questions: list[dict], expected_exam: str) -> tuple[list[str], dict]:
    errors: list[str] = []
    ids: set[str] = set()
    longest_correct = 0
    correct_lengths: list[int] = []
    distractor_lengths: list[int] = []
    absolute_count = 0

    if len(questions) != 50:
        errors.append(f"{label}: 문항 수 {len(questions)} (기대 50)")
    for index, item in enumerate(questions, 1):
        where = f"{label} #{index}"
        missing = [field for field in REQUIRED if field not in item]
        if missing:
            errors.append(f"{where}: 필수 필드 누락 {missing}")
            continue
        if item["id"] in ids:
            errors.append(f"{where}: 세트 안 ID 중복 '{item['id']}'")
        ids.add(item["id"])
        if item["exam"] != expected_exam:
            errors.append(f"{where}: exam '{item['exam']}' (기대 '{expected_exam}')")
        if item["range"] not in ("중간고사", "기말고사"):
            errors.append(f"{where}: 잘못된 range '{item['range']}'")
        if item["sourceFolder"] != item["range"]:
            errors.append(f"{where}: sourceFolder와 range 불일치")
        for field in ("sourceFile", "topic", "type", "difficulty", "question", "explanation"):
            if not isinstance(item[field], str) or not item[field].strip():
                errors.append(f"{where}: {field}가 비어 있음")
        choices = item["choices"]
        if not isinstance(choices, list) or len(choices) != 4:
            errors.append(f"{where}: 선지가 정확히 4개가 아님")
            continue
        if any(not isinstance(choice, str) or not choice.strip() for choice in choices):
            errors.append(f"{where}: 빈 선지 존재")
            continue
        if len(set(choices)) != 4:
            errors.append(f"{where}: 중복 선지 존재")
        vague = [choice for choice in choices if normalized(choice) in VAGUE_CHOICES]
        if vague:
            errors.append(f"{where}: 근거가 부족한 모호한 선지 {vague}")
        padded = [phrase for phrase in BANNED_PADDING if phrase in " ".join(choices) or phrase in item["explanation"]]
        if padded:
            errors.append(f"{where}: 길이 맞추기용 반복·비문 표현 {padded}")
        if item["answer"] not in (1, 2, 3, 4):
            errors.append(f"{where}: answer가 1~4가 아님")
            continue
        if not isinstance(item["tags"], list) or not item["tags"] or any(not isinstance(tag, str) or not tag.strip() for tag in item["tags"]):
            errors.append(f"{where}: tags가 비어 있거나 올바르지 않음")
        if len(item["explanation"].strip()) < 35:
            errors.append(f"{where}: 해설이 너무 짧아 정답 근거와 함정을 설명하기 어려움")

        lengths = [choice_length(choice) for choice in choices]
        shortest, longest = min(lengths), max(lengths)
        if shortest < 12:
            errors.append(f"{where}: 지나치게 짧고 모호할 수 있는 선지 존재 (최단 {shortest}자)")
        if longest and shortest / longest < 0.60:
            errors.append(f"{where}: 선지 길이 불균형 (최단 {shortest}자 / 최장 {longest}자)")
        answer_index = item["answer"] - 1
        if lengths[answer_index] == longest:
            longest_correct += 1
        correct_lengths.append(lengths[answer_index])
        distractor_lengths.extend(length for i, length in enumerate(lengths) if i != answer_index)
        absolute_count += sum(choice.count(word) for choice in choices for word in ABSOLUTE_WORDS)

    ranges = Counter(item.get("range") for item in questions)
    if label.startswith("mock") and ranges != Counter({"중간고사": 15, "기말고사": 35}):
        errors.append(f"{label}: 범위 분포 {dict(ranges)} (기대 중간 15/기말 35)")
    if label.startswith("final") and ranges != Counter({"기말고사": 50}):
        errors.append(f"{label}: 범위 분포 {dict(ranges)} (기대 기말 50)")

    answers = Counter(item.get("answer") for item in questions)
    if set(answers) != {1, 2, 3, 4} or any(answers[number] not in (12, 13) for number in range(1, 5)):
        errors.append(f"{label}: 정답 분포 {dict(sorted(answers.items()))} (각 12~13 기대)")
    for start in range(max(0, len(questions) - 2)):
        run = [questions[start + offset].get("answer") for offset in range(3)]
        if len(set(run)) == 1:
            errors.append(f"{label}: {start + 1}~{start + 3}번 정답 {run[0]}이 3회 연속")

    difficulties = Counter(item.get("difficulty") for item in questions)
    for name, (minimum, maximum) in expected_difficulty(label).items():
        if not minimum <= difficulties[name] <= maximum:
            errors.append(f"{label}: 난이도 '{name}' {difficulties[name]}문항 (기대 {minimum}~{maximum})")
    unknown = set(difficulties) - {"쉬움", "보통", "어려움"}
    if unknown:
        errors.append(f"{label}: 알 수 없는 난이도 {sorted(unknown)}")

    ratio = longest_correct / len(questions) if questions else 0
    if not 0.20 <= ratio <= 0.35:
        errors.append(f"{label}: 정답이 최장 선지인 비율 {ratio:.0%} (기대 20~35%)")
    correct_avg = sum(correct_lengths) / len(correct_lengths) if correct_lengths else 0
    distractor_avg = sum(distractor_lengths) / len(distractor_lengths) if distractor_lengths else 0
    average_ratio = correct_avg / distractor_avg if distractor_avg else 0
    if not 0.88 <= average_ratio <= 1.12:
        errors.append(f"{label}: 평균 정답/오답 선지 길이 비율 {average_ratio:.2f} (기대 0.88~1.12)")
    if absolute_count > 10:
        errors.append(f"{label}: 항상/절대/무조건 계열 표현 {absolute_count}회로 과다")
    simple_stems = sum(bool(re.search(r"무엇인가\??$|정의로 옳은|다음 중 (?:맞는|옳은) 것은", item.get("question", ""))) for item in questions)
    if simple_stems > 8:
        errors.append(f"{label}: 단순 정의형 어간 {simple_stems}문항으로 과다")

    stats = {"ranges": ranges, "answers": answers, "difficulties": difficulties, "longest_ratio": ratio,
             "average_ratio": average_ratio, "absolute_count": absolute_count, "simple_stems": simple_stems}
    return errors, stats


def duplicate_reports(all_questions: list[tuple[str, dict]]) -> tuple[list[str], list[str]]:
    exact: list[str] = []
    similar: list[str] = []
    seen: dict[str, tuple[str, str]] = {}
    for label, item in all_questions:
        stem = normalized(item.get("question", ""))
        if stem in seen:
            old_label, old_id = seen[stem]
            exact.append(f"완전 중복: {old_label}/{old_id} ↔ {label}/{item.get('id')}")
        elif stem:
            seen[stem] = (label, item.get("id", ""))
    for i, (label_a, a) in enumerate(all_questions):
        a_text = normalized(a.get("question", ""))
        for label_b, b in all_questions[i + 1:]:
            b_text = normalized(b.get("question", ""))
            if not a_text or not b_text or a_text == b_text:
                continue
            if abs(len(a_text) - len(b_text)) > max(len(a_text), len(b_text)) * 0.18:
                continue
            ratio = SequenceMatcher(None, a_text, b_text).ratio()
            if ratio >= 0.90:
                similar.append(f"유사도 {ratio:.2f}: {label_a}/{a.get('id')} ↔ {label_b}/{b.get('id')}")
    return exact, similar


def main() -> int:
    errors: list[str] = []
    loaded: dict[str, list[dict]] = {}
    global_ids: dict[str, str] = {}
    for label, (filename, marker, expected_exam) in DATASETS.items():
        path = DATA / filename
        if not path.exists():
            errors.append(f"필수 파일 없음: data/{filename}")
            continue
        text = path.read_text(encoding="utf-8-sig")
        if marker not in text:
            errors.append(f"data/{filename}: 전역변수 {marker} 없음")
        try:
            questions = load_js(path)
        except (ValueError, json.JSONDecodeError) as exc:
            errors.append(f"data/{filename}: 파싱 실패: {exc}")
            continue
        loaded[label] = questions
        set_errors, stats = validate_set(label, questions, expected_exam)
        errors.extend(set_errors)
        print(f"{label}: {len(questions)}문항 | 정답 " + ", ".join(f"{n}={stats['answers'][n]}" for n in range(1, 5)))
        print(f"  난이도 {dict(stats['difficulties'])} | 최장 정답 {stats['longest_ratio']:.0%} | 평균 길이비 {stats['average_ratio']:.2f}")
        for item in questions:
            item_id = item.get("id")
            if item_id in global_ids:
                errors.append(f"전체 ID 중복: {global_ids[item_id]}/{item_id} ↔ {label}/{item_id}")
            elif item_id:
                global_ids[item_id] = label

    final_bank = DATA / "software_engineering_final_bank.js"
    if not final_bank.exists():
        errors.append("필수 파일 없음: data/software_engineering_final_bank.js")
    else:
        bank_text = final_bank.read_text(encoding="utf-8-sig")
        for n in range(1, 7):
            if f"window.SE_FINAL_SET_{n:02d}" not in bank_text:
                errors.append(f"통합 기말 문제은행에 {n}세트 참조 없음")

    pairs = [(label, item) for label, questions in loaded.items() for item in questions]
    exact, similar = duplicate_reports(pairs)
    errors.extend(exact)
    print(f"중복 검사: 완전 중복 {len(exact)}건, 유사도 0.90 이상 {len(similar)}건")
    for report in similar[:20]:
        print(f"  [보고] {report}")

    if errors:
        print(f"\n[실패] 질문 검증 오류 {len(errors)}건")
        for error in errors:
            print(f"  - {error}")
        return 1
    print(f"\n[통과] 8개 세트 {sum(map(len, loaded.values()))}문항의 구조·분포·난도·선지 편향 검증 완료")
    return 0


if __name__ == "__main__":
    sys.exit(main())
