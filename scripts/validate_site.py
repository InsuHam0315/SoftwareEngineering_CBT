"""CBT 정적 사이트의 구조, 상대경로, Pages 준비 상태와 원본 무결성을 검증한다."""
from __future__ import annotations

import hashlib
import json
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
HTML_FILES = [
    "index.html", "login.html",
    "cbt/software_engineering_mock_01.html", "cbt/software_engineering_mock_02.html", "cbt/software_engineering_final_cbt.html",
    "notes/software-engineering-final/index.html", "review/wrong-notes.html", "stats/study-record.html",
]
REQUIRED = HTML_FILES + [
    "README.md", "PROJECT_STATUS.md", ".gitignore", ".nojekyll",
    "assets/style.css", "assets/storage.js", "assets/auth.js", "assets/cbt.js", "assets/review.js", "assets/stats.js", "assets/notes.js",
    "assets/img/sdlc-flow.svg", "assets/img/scrum-flow.svg", "assets/img/uml-relations.svg", "assets/img/testing-flow.svg",
    "data/software_engineering_mock_01.js", "data/software_engineering_mock_02.js", "data/software_engineering_final_bank.js",
    "data/software_engineering_notes.js", "data/software_engineering_concepts.js", "data/software_engineering_comparisons.js",
    "scripts/validate_questions.py", "scripts/validate_site.py", "scripts/generate_concept_svgs.py",
]
GLOBALS = {
    "data/software_engineering_mock_01.js": "window.SE_MOCK_01",
    "data/software_engineering_mock_02.js": "window.SE_MOCK_02",
    "data/software_engineering_final_bank.js": "window.SE_FINAL_BANK",
    "data/software_engineering_notes.js": "window.SE_NOTES",
    "data/software_engineering_concepts.js": "window.SE_CONCEPTS",
    "data/software_engineering_comparisons.js": "window.SE_COMPARISONS",
}
PROHIBITED_TRACKED_PREFIXES = ("시험/", "중간고사/", "기말고사/", "최종/", ".reference-tmp/", "linuxmaster-quiz/", "ComputerNetwork_CBT/")
VISUAL_DATA = {
    "data/software_engineering_notes.js": 38,
    "data/software_engineering_concepts.js": 78,
    "data/software_engineering_comparisons.js": 16,
}


class RefParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(); self.refs: list[tuple[str, str, str]] = []; self.lang = ""; self.body_base: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "html": self.lang = values.get("lang", "") or ""
        if tag == "body": self.body_base = values.get("data-base")
        for attr in ("src", "href"):
            if values.get(attr): self.refs.append((tag, attr, values[attr] or ""))


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""): digest.update(chunk)
    return digest.hexdigest()


def check_manifest(errors: list[str]) -> None:
    manifest_path = ROOT / "data/source_manifest.json"
    if not manifest_path.exists():
        print("[정보] 원본 manifest가 없어 원본 무결성 검사를 건너뜁니다."); return
    manifest = json.loads(manifest_path.read_text(encoding="utf-8-sig")); roots = manifest.get("sourceRoots", [])
    if not roots or not all((ROOT / relative).exists() for relative in roots):
        print("[정보] 배포 사본에는 원본 폴더가 없어 SHA-256 검사를 건너뜁니다."); return
    expected = {item["path"]: item for item in manifest.get("files", [])}; current: dict[str, Path] = {}
    for relative_root in roots:
        for item in (ROOT / relative_root).rglob("*"):
            if item.is_file(): current[item.relative_to(ROOT).as_posix()] = item
    if set(current) != set(expected):
        added = sorted(set(current) - set(expected)); removed = sorted(set(expected) - set(current))
        if added: errors.append(f"원본 폴더에 기준 이후 추가된 파일: {added}")
        if removed: errors.append(f"원본 폴더에서 사라진 파일: {removed}")
    for relative in sorted(set(current) & set(expected)):
        item = current[relative]; reference = expected[relative]
        if item.stat().st_size != reference["size"] or sha256(item) != reference["sha256"]: errors.append(f"원본 파일 내용 변경 감지: {relative}")
    if not errors: print(f"[통과] 원본 {len(expected)}개 SHA-256 무결성 확인")


def check_git(errors: list[str]) -> None:
    forbidden_dirs = [".reference-tmp", "linuxmaster-quiz", "ComputerNetwork_CBT"]
    for name in forbidden_dirs:
        if (ROOT / name).exists(): errors.append(f"참고 저장소/임시 폴더가 프로젝트에 남아 있음: {name}")
    if not (ROOT / ".git").exists():
        print("[정보] Git 초기화 전 상태 — tracked 파일 검사는 건너뜁니다."); return
    result = subprocess.run(["git", "ls-files"], cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace", check=False)
    if result.returncode != 0: errors.append("git ls-files 실행 실패"); return
    tracked = [line.replace("\\", "/") for line in result.stdout.splitlines()]
    bad = [path for path in tracked if path.startswith(PROHIBITED_TRACKED_PREFIXES)]
    if bad: errors.append(f"추적되면 안 되는 원본/참고 파일: {bad[:20]}")


def check_study_visuals(errors: list[str]) -> None:
    image_dir = ROOT / "assets/img/concepts"
    if not image_dir.is_dir():
        errors.append("assets/img/concepts/ 폴더 없음")
        return
    concept_images = sorted(path for path in image_dir.iterdir() if path.is_file())
    if not concept_images: errors.append("assets/img/concepts/에 시각자료가 없음")
    for path in concept_images:
        relative = path.relative_to(ROOT).as_posix()
        if path.suffix.lower() == ".svg":
            try:
                tree = ET.parse(path)
                for node in tree.iter():
                    for key, value in node.attrib.items():
                        if key.endswith("href") and re.match(r"^(?:https?:)?//", value, re.I):
                            errors.append(f"{relative}: 외부 SVG 이미지 참조")
            except ET.ParseError as exc: errors.append(f"{relative}: SVG XML 오류 {exc}")
    page_dir = ROOT / "notes/software-engineering-final"
    for relative, expected_count in VISUAL_DATA.items():
        path = ROOT / relative
        if not path.exists(): continue
        text = path.read_text(encoding="utf-8-sig")
        blocks = re.findall(r"[\"']?visual[\"']?\s*:\s*\{(.*?)\}", text, re.S)
        if len(blocks) != expected_count:
            errors.append(f"{relative}: visual 항목 {len(blocks)}개 (기대 {expected_count}개)")
        if len(re.findall(r"[\"']?fullExplanation[\"']?\s*:", text)) != expected_count:
            errors.append(f"{relative}: fullExplanation 항목이 전체 {expected_count}개에 없음")
        if len(re.findall(r"[\"']?sourceBasis[\"']?\s*:", text)) != expected_count:
            errors.append(f"{relative}: sourceBasis 항목이 전체 {expected_count}개에 없음")
        for index, block in enumerate(blocks, start=1):
            match = re.search(r"[\"']?src[\"']?\s*:\s*['\"]([^'\"]+)['\"]", block)
            if not match:
                errors.append(f"{relative}: visual #{index}에 src 없음")
                continue
            raw = match.group(1)
            if re.match(r"^(?:https?:)?//", raw, re.I):
                errors.append(f"{relative}: 외부 이미지 핫링크 '{raw}'")
                continue
            target = (page_dir / unquote(urlsplit(raw).path)).resolve()
            try: target.relative_to(ROOT.resolve())
            except ValueError:
                errors.append(f"{relative}: 프로젝트 밖 visual 경로 '{raw}'")
                continue
            if not target.is_file(): errors.append(f"{relative}: 존재하지 않는 visual 경로 '{raw}'")


def main() -> int:
    errors: list[str] = []
    for relative in REQUIRED:
        path = ROOT / relative
        if not path.exists(): errors.append(f"필수 파일 없음: {relative}")
        elif path.is_file() and path.stat().st_size == 0 and relative != ".nojekyll": errors.append(f"빈 필수 파일: {relative}")
    expected_bases = {name: "" if "/" not in name else "../../" if name.startswith("notes/") else "../" for name in HTML_FILES}
    external_images: list[str] = []
    for relative in HTML_FILES:
        path = ROOT / relative
        if not path.exists(): continue
        text = path.read_text(encoding="utf-8-sig"); parser = RefParser(); parser.feed(text)
        if parser.lang != "ko": errors.append(f"{relative}: html lang='ko'가 아님")
        if parser.body_base != expected_bases[relative]: errors.append(f"{relative}: data-base가 '{expected_bases[relative]}'가 아님")
        for tag, attr, raw in parser.refs:
            if "\\" in raw: errors.append(f"{relative}: 웹 경로에 백슬래시 사용 '{raw}'")
            if raw.startswith("/") and not raw.startswith("//"): errors.append(f"{relative}: GitHub Pages에서 깨지는 루트 절대경로 '{raw}'")
            if tag == "img" and re.match(r"^(?:https?:)?//", raw, re.I): external_images.append(f"{relative}: {raw}")
            parts = urlsplit(raw)
            if parts.scheme or raw.startswith("//") or raw.startswith("#") or raw.startswith("javascript:"): continue
            target_text = unquote(parts.path)
            if not target_text: continue
            target = (path.parent / target_text).resolve()
            try: target.relative_to(ROOT.resolve())
            except ValueError: errors.append(f"{relative}: 프로젝트 밖 참조 '{raw}'"); continue
            if not target.exists(): errors.append(f"{relative}: 존재하지 않는 로컬 참조 '{raw}'")
    errors.extend(f"외부 이미지 핫링크: {item}" for item in external_images)
    css = (ROOT / "assets/style.css").read_text(encoding="utf-8-sig") if (ROOT / "assets/style.css").exists() else ""
    if re.search(r"url\(\s*['\"]?(?:https?:)?//", css, re.I): errors.append("assets/style.css: 외부 URL 이미지 참조")
    for relative in ["assets/img/sdlc-flow.svg", "assets/img/scrum-flow.svg", "assets/img/uml-relations.svg", "assets/img/testing-flow.svg"]:
        path = ROOT / relative
        if not path.exists(): continue
        try:
            tree = ET.parse(path)
            for node in tree.iter():
                for key, value in node.attrib.items():
                    if key.endswith("href") and re.match(r"^(?:https?:)?//", value, re.I): errors.append(f"{relative}: 외부 SVG 이미지 참조")
        except ET.ParseError as exc: errors.append(f"{relative}: SVG XML 오류 {exc}")
    for relative, marker in GLOBALS.items():
        path = ROOT / relative
        if path.exists() and marker not in path.read_text(encoding="utf-8-sig"): errors.append(f"{relative}: 전역변수 {marker} 없음")
    storage = (ROOT / "assets/storage.js").read_text(encoding="utf-8-sig") if (ROOT / "assets/storage.js").exists() else ""
    for marker in ["softwareEngineeringCurrentUser", "softwareEngineeringUsers", "softwareEngineeringStudyData_"]:
        if marker not in storage: errors.append(f"assets/storage.js: localStorage 키 표식 없음 '{marker}'")
    cbt = (ROOT / "assets/cbt.js").read_text(encoding="utf-8-sig") if (ROOT / "assets/cbt.js").exists() else ""
    for marker in ["confirm-answer", "random-order", "restore-order", "random-choices", "upsertWrongNote", "addRecord", "bank-range", "bank-topic", "bank-tag"]:
        if marker not in cbt: errors.append(f"assets/cbt.js: CBT 기능 표식 없음 '{marker}'")
    index = (ROOT / "index.html").read_text(encoding="utf-8-sig") if (ROOT / "index.html").exists() else ""
    if "2026 소프트웨어공학 기말고사 CBT 문제집" not in index: errors.append("index.html: 정확한 사이트 제목 없음")
    readme = (ROOT / "README.md").read_text(encoding="utf-8-sig") if (ROOT / "README.md").exists() else ""
    for marker in ["https://insuham0315.github.io/SoftwareEngineering_CBT/", "ist-se.kro.kr", "python -m http.server 8000"]:
        if marker not in readme: errors.append(f"README.md: 필수 안내 없음 '{marker}'")
    gitignore = (ROOT / ".gitignore").read_text(encoding="utf-8-sig") if (ROOT / ".gitignore").exists() else ""
    for marker in ["/시험/", "/중간고사/", "/기말고사/", "/최종/", "/.reference-tmp/", "/_reference/", "/reference/", "/tmp/", "/temp/", "*.tmp"]:
        if marker not in gitignore: errors.append(f".gitignore: 제외 규칙 없음 '{marker}'")
    notes_page = (ROOT / "notes/software-engineering-final/index.html").read_text(encoding="utf-8-sig") if (ROOT / "notes/software-engineering-final/index.html").exists() else ""
    if not re.search(r'id=["\']study-toc["\']', notes_page): errors.append("개념정리 페이지: study-toc 목차 마크업 없음")
    notes_js = (ROOT / "assets/notes.js").read_text(encoding="utf-8-sig") if (ROOT / "assets/notes.js").exists() else ""
    for marker in ["IntersectionObserver", "fullExplanation", "commonMistakes", "oxPoints", "visual"]:
        if marker not in notes_js: errors.append(f"assets/notes.js: 상세 카드/목차 기능 표식 없음 '{marker}'")
    check_study_visuals(errors); check_manifest(errors); check_git(errors)
    if errors:
        print(f"[실패] 사이트 검증 오류 {len(errors)}건")
        for error in errors: print(f"  - {error}")
        return 1
    print(f"[통과] 필수 파일 {len(REQUIRED)}개와 정식 HTML {len(HTML_FILES)}개 확인")
    print("[통과] GitHub Pages 상대경로·로컬 이미지·SVG·전역 데이터 확인")
    print("[통과] 학습 카드별 로컬 visual·오른쪽 목차·상세 렌더링 표식 확인")
    print("[통과] 새 localStorage 키·CBT 확인 채점·랜덤·필터 기능 표식 확인")
    print("[통과] 참고 저장소 파일이 산출물에 포함되지 않음")
    return 0


if __name__ == "__main__": sys.exit(main())
