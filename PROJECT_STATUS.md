# PROJECT_STATUS

## 현재 단계
- **CBT 중심 개편·검증·Git 준비 완료**
- 최종 갱신: 2026-06-21 (Asia/Seoul)
- 정식 사이트 제목: `2026 소프트웨어공학 기말고사 CBT 문제집`

## 완료 작업
- 실제 원본 `시험\중간고사` 9개, `시험\기말고사` 9개를 읽기 전용으로 재확인
- 원본 18개 파일의 SHA-256 manifest와 현재 파일을 비교해 무결성 확인
- 참고 저장소 `linuxmaster-quiz`, `ComputerNetwork_CBT`를 임시 shallow clone으로 읽기 전용 분석 후 임시 폴더 삭제
- 참고 저장소의 과목 데이터는 복사하지 않고 CBT 구조·팔레트·확인 채점·localStorage 방식만 참고
- 루트 랜딩을 학습 요약 중심에서 CBT 중심으로 전면 개편
- 모의고사 1·2와 통합 100문항 문제은행을 `cbt/` 아래 구현
- 문제은행 전체 100 / 중간고사 30 / 기말고사 70 및 주제·태그 필터 구현
- 새 localStorage 키 3종으로 로그인·사용자별 오답·응시 기록 구현
- 오답노트 `review/`, 학습기록 `stats/`, 보조 개념정리 `notes/` 구현
- 문제·선지 순서 랜덤, 원본 ID/정답 인덱스 보존, 확인 버튼 후 채점 구현
- SVG 4개와 원본 추출 기능점수 표를 개념정리 페이지에 사용
- `.gitignore`, `.nojekyll`, 한국어 `README.md` 작성
- Git 저장소 초기화, `main` 브랜치 설정, 대상 `origin` 연결, 사이트 파일만 스테이징

## 남은 작업
- Git 커밋 및 원격 push
- GitHub 저장소 Settings → Pages → Deploy from a branch → `main` → `/ (root)` 설정
- 선택 사항: `ist-se.kro.kr` DNS 설정 후 CNAME 추가

## 생성/수정 파일
- 루트: `index.html`, `login.html`, `README.md`, `.gitignore`, `.nojekyll`, `PROJECT_STATUS.md`
- 공통 자산: `assets/style.css`, `storage.js`, `auth.js`, `cbt.js`, `review.js`, `stats.js`, `notes.js`
- CBT: `cbt/software_engineering_mock_01.html`, `software_engineering_mock_02.html`, `software_engineering_final_cbt.html`
- 데이터: `data/software_engineering_mock_01.js`, `software_engineering_mock_02.js`, `software_engineering_final_bank.js`, `software_engineering_notes.js`, `software_engineering_concepts.js`, `software_engineering_comparisons.js`
- 보조 화면: `notes/software-engineering-final/index.html`, `review/wrong-notes.html`, `stats/study-record.html`
- 이미지: `assets/img/sdlc-flow.svg`, `scrum-flow.svg`, `uml-relations.svg`, `testing-flow.svg`, `assets/img/extracted/planning-source-p57.png`
- 검증: `scripts/validate_questions.py`, `scripts/validate_site.py`

## 마지막 검증 결과
- `python scripts/validate_questions.py`: **통과**
  - mock01 50문항, 중간 15/기말 35, 정답 1=13·2=12·3=13·4=12
  - mock02 50문항, 중간 15/기말 35, 정답 1=12·2=13·3=12·4=13
  - 동일 정답 3연속 없음, 유사도 0.88 이상 중복 의심 없음
  - 통합 문제은행 100문항, 중간 30/기말 70
- `python scripts/validate_site.py`: **통과**
  - 필수 파일, 정식 HTML, 상대경로, 전역 데이터, localStorage 키, SVG, 외부 이미지, Git 추적 안전성 확인
- Node 구문 검사: **신규 JS와 데이터 JS 12개 통과**
- Edge CDP 실제 동작: **통과**
  - 랜딩 CBT 카드, 로컬 로그인 키 생성
  - 모의고사 50문항/팔레트 50개
  - 선택 전 미채점, 확인 후 오답·설명·팔레트 상태
  - 오답 저장, 기록 저장, 문제/선지 랜덤 후 정확한 채점
  - 오답노트와 기록 화면 연동
  - 문제은행 전체 100 / 중간 30 / 기말 70 필터
  - 개념 데이터와 필수 비교 16개 렌더링
- HTTP: 정식 HTML 8개 모두 200 응답
- 시각 확인: 1440×1200 다크 랜딩 레이아웃 정상

## Git 상태
- 저장소: 초기화 완료
- 브랜치: `main`
- origin: `https://github.com/InsuHam0315/SoftwareEngineering_CBT.git`
- 원격 상태: 커밋이 없는 빈 저장소
- `.gitignore`: `시험/`, `최종/`, 루트 대형 과제 파일, 참고 저장소, 레거시 중복 페이지 제외
- 현재 상태: 사이트 산출물만 staged, 아직 commit/push하지 않음
- push 보류 이유: `gh` CLI가 없고 비대화형 Git 자격 증명 사용 가능 여부를 확정할 수 없어 안전하게 명령만 제공

## 실패 작업 및 원인
- 사용자 설명의 루트 `중간고사/`, `기말고사/`가 없음: 실제 `시험/` 아래 위치를 사용해 해결
- 첫 Edge 자동 검사에서 빈 DOM 확인: 초기 탭 로딩 완료 전 검사한 하니스 타이밍 문제로, 명시적 Page.navigate와 대기 후 재실행해 통과
- 이전 개편 전 검증기는 구 파일명·구 저장 키만 확인: 새 구조 기준으로 전면 갱신해 통과
- 미해결 구현/검증 실패 없음

## 다음 action to resume
1. `git status`
2. `python scripts/validate_questions.py`
3. `python scripts/validate_site.py`
4. `git add .`
5. `git commit -m "Build SoftwareEngineering CBT site"`
6. `git push -u origin main`
7. GitHub Pages를 `main` / `/ (root)`로 설정

## 재개 시 먼저 확인할 파일
1. `PROJECT_STATUS.md`
2. `README.md`
3. `assets/cbt.js`, `assets/storage.js`
4. `scripts/validate_questions.py`, `scripts/validate_site.py`
5. `data/software_engineering_mock_01.js`, `data/software_engineering_mock_02.js`

## 원본 안전 상태
- `시험\중간고사`, `시험\기말고사` 내부에 파일을 생성·수정·삭제·이동하지 않음
- 원본 18개 파일이 최초 SHA-256 manifest와 모두 일치
- 참고 저장소 clone은 최종 프로젝트에 남아 있지 않으며 Git 추적 대상에도 없음
