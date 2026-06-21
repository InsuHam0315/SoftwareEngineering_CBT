# PROJECT_STATUS

## 현재 단계
- **CBT 중심 개념 정리 페이지 상세 보강·검증·GitHub main 푸시 완료**
- 최종 갱신: 2026-06-21 (Asia/Seoul)
- 정식 사이트 제목: `2026 소프트웨어공학 기말고사 CBT 문제집`
- 대상 저장소: `https://github.com/InsuHam0315/SoftwareEngineering_CBT.git`

## 이번 보강 작업
- 기존 사이트와 데이터 구조를 유지한 채 학습노트 38개, 개념사전 78개, 비교표 16개를 초보자·시험 대비용으로 확장
- 각 항목에 요약, 상세 설명, 중요성, 흐름, 예시, 시험 포인트, 실수, 연관 개념, 암기법, OX, 태그, 내용 기준, 시각자료 메타데이터 추가
- 중요 개념은 상세 설명 700자 이상, 일반 개념은 400자 이상이 되도록 점검
- 제공 자료 밖 보충 설명에 `일반적인 소프트웨어공학 관점 보충` 표시
- 관련 개념끼리 재사용할 수 있는 한국어 교육용 로컬 SVG 17개를 `assets/img/concepts/`에 생성
- 외부 이미지 핫링크를 사용하지 않고 모든 카드 이미지를 GitHub Pages 상대경로로 연결
- 데스크톱 오른쪽 sticky 목차, 모바일 접이식 목차, 부드러운 앵커 이동, 현재 섹션 강조 구현
- 검색·시험 범위·자료 종류 변경 시 목차와 카드 목록이 함께 갱신되도록 구현
- 카드에 범위/중요도/제목/출처/펼치기 버튼, 로컬 visual, 상세 학습 블록을 배치
- 첫 중요 카드만 기본으로 펼치고 나머지는 접어 긴 페이지의 탐색성을 유지

## 추가한 시각자료
- `program-software.svg`
- `software-quality.svg`
- `requirements.svg`
- `sdlc-flow.svg`
- `waterfall-model.svg`
- `prototype-spiral.svg`
- `incremental-iterative.svg`
- `agile-scrum.svg`
- `uml-diagrams.svg`
- `uml-relations-detail.svg`
- `planning-estimation.svg`
- `function-point.svg`
- `architecture-design.svg`
- `design-patterns.svg`
- `verification-validation.svg`
- `testing-levels.svg`
- `maintenance-types.svg`

모든 신규 시각자료는 직접 생성한 로컬 SVG이다. 공개 라이선스를 신속히 검증할 수 있는 외부 이미지를 사용하지 못할 경우 로컬 SVG를 생성한다는 fallback 정책을 적용했으며, 외부 웹 이미지와 핫링크는 사용하지 않았다.

## 수정/생성 파일
- 학습 화면: `notes/software-engineering-final/index.html`
- 학습 렌더링: `assets/notes.js`
- 공통 스타일: `assets/style.css`
- 학습 데이터: `data/software_engineering_notes.js`, `data/software_engineering_concepts.js`, `data/software_engineering_comparisons.js`
- 신규 이미지: `assets/img/concepts/*.svg` 17개
- SVG 생성 스크립트: `scripts/generate_concept_svgs.py`
- 검증기: `scripts/validate_site.py`
- Git 제외 규칙: `.gitignore`
- 진행 문서: `PROJECT_STATUS.md`

## 검증 결과
- `python scripts/validate_questions.py`: **통과**
  - mock01 50문항, mock02 50문항, 통합 문제은행 100문항
  - 중간고사 30문항, 기말고사 70문항 유지
  - 유사도 0.88 이상 중복 의심 없음
- `python scripts/validate_site.py`: **통과**
  - 필수 파일 32개와 정식 HTML 8개 확인
  - 원본 18개 SHA-256 무결성 확인
  - 카드별 local visual 132개, `assets/img/concepts/`, TOC, 상세 렌더링 표식 확인
  - 외부 이미지 핫링크 없음, 로컬 이미지/SVG 경로와 XML 정상
  - Git 추적 안전성, localStorage 키, CBT 기능 표식 정상
- Node JS 구문 검사: **12개 모두 통과**
  - `assets/auth.js`, `storage.js`, `cbt.js`, `notes.js`, `review.js`, `stats.js`
  - 학습 데이터 3개, 모의고사 데이터 2개, 통합 문제은행 데이터 1개
- Edge CDP 실제 렌더링: **통과**
  - 기본 학습노트 카드/이미지 38개, 접힌 상세 37개, 열린 상세 1개
  - 핵심 개념 78개 및 비교 16개 전환 렌더링
  - 카드 상세 토글과 동적 목차 재생성
  - 외부 이미지 0개, 데스크톱 오른쪽 목차 정상
  - 모바일 접이식 목차 노출·열기 및 데스크톱 목차 숨김 정상
  - 모의고사 1의 문제 카드 50개와 팔레트 50개 렌더링
- HTTP 정식 페이지 8개: **모두 200 응답**
- `git diff --check`: **통과**

## 기존 기능 보호
- `assets/auth.js`, `assets/storage.js`, `assets/cbt.js` 변경 없음
- `login.html`, `index.html` 변경 없음
- `cbt/` 3개 HTML과 CBT 문제 데이터 변경 없음
- `review/wrong-notes.html`, `stats/study-record.html` 변경 없음
- 로그인, 사용자별 오답, 응시 기록에 쓰는 기존 localStorage 키 유지

## 원본 안전 상태
- 실제 읽기 전용 원본 위치: `시험/중간고사/`, `시험/기말고사/`
- 원본 폴더에 파일을 생성·수정·삭제·이동하지 않음
- 원본 18개 파일이 `data/source_manifest.json`의 SHA-256 및 크기와 모두 일치
- `.gitignore`에 `시험/`, `중간고사/`, `기말고사/`, 임시·참고 폴더 및 임시 파일 제외 규칙 유지

## 알려진 제한사항
- 연관된 세부 항목은 같은 주제 SVG를 재사용한다. 장식 이미지보다 판별 기준과 흐름을 보여 주는 학습용 그림을 우선했다.
- 브라우저 간 실제 영구 저장 데이터 마이그레이션은 변경하지 않았으며, 이번 작업은 기존 localStorage 구조를 그대로 유지한다.
- GitHub Pages 배포 완료 여부와 실제 원격 환경의 오답노트/localStorage 동작은 푸시 후 브라우저에서 최종 확인해야 한다.

## 다음 action to resume
1. GitHub Pages를 `main` / `/ (root)`로 설정
2. `https://insuham0315.github.io/SoftwareEngineering_CBT/` 배포 완료 확인
3. 배포 환경에서 개념 카드 이미지·오른쪽 목차·모바일 목차 확인
4. 로그인 후 CBT 응시 기록·오답노트 localStorage 연동 브라우저 확인

## Git 상태
- 브랜치: `main`
- origin: `https://github.com/InsuHam0315/SoftwareEngineering_CBT.git`
- 개선 전 기준 커밋: `fe7cb5c Update project status after push`
- 이번 개선 커밋: `fc6cafa Improve Software Engineering CBT study pages`
- 푸시 상태: **성공** — `origin/main`에 `fc6cafa` 반영 완료
- 남은 GitHub 설정: Repository → Settings → Pages → Deploy from a branch → `main` → `/ (root)`
