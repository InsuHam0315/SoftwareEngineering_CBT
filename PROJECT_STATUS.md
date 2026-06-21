# PROJECT_STATUS

## 현재 단계
- **소프트웨어공학 CBT 난이도 복구, 선지 편향 개선, 기말 50문항 4세트 추가 완료**
- 최종 갱신: 2026-06-22 (Asia/Seoul)
- 저장소: `https://github.com/InsuHam0315/SoftwareEngineering_CBT.git`

## 난이도 복구 방식
- 과도한 난이도 개편 커밋은 `eb9c62c Improve Software Engineering CBT question bank`로 확인했다.
- 직전 적정 난이도 커밋 `9be8d4e Improve concept detail layout`에서 모의고사 1·2회 데이터만 파일 단위로 복구했다.
- 복구한 모의고사의 100개 문제 어간과 ID는 이전 버전과 모두 일치한다.
- 이전 버전에 별도 파일이 없던 기말 1~6세트는 UI를 되돌리지 않고 난이도를 쉬움 16·보통 27·어려움 7로 재분류했다.
- 기말 7~10세트 200문항은 기존 개념·노트 데이터에서 기초 정의, 비교, 간단한 사례 중심으로 생성했다.

## 세트별 검증 결과
| 세트 | 문항 | 난이도(쉬움/보통/어려움) | 정답 분포(1/2/3/4) | 단독 최장 정답 비율 |
|---|---:|---|---|---:|
| 모의고사 1회 | 50 | 17 / 27 / 6 | 13 / 12 / 13 / 12 | 24% |
| 모의고사 2회 | 50 | 16 / 28 / 6 | 12 / 13 / 12 / 13 | 34% |
| 기말 CBT 1세트 | 50 | 16 / 27 / 7 | 13 / 13 / 12 / 12 | 20% |
| 기말 CBT 2세트 | 50 | 16 / 27 / 7 | 12 / 13 / 12 / 13 | 20% |
| 기말 CBT 3세트 | 50 | 16 / 27 / 7 | 13 / 12 / 13 / 12 | 26% |
| 기말 CBT 4세트 | 50 | 16 / 27 / 7 | 13 / 13 / 12 / 12 | 26% |
| 기말 CBT 5세트 | 50 | 16 / 27 / 7 | 13 / 13 / 12 / 12 | 26% |
| 기말 CBT 6세트 | 50 | 16 / 27 / 7 | 13 / 13 / 12 / 12 | 26% |
| 기말 CBT 7세트 | 50 | 16 / 27 / 7 | 13 / 13 / 12 / 12 | 26% |
| 기말 CBT 8세트 | 50 | 16 / 27 / 7 | 12 / 13 / 13 / 12 | 26% |
| 기말 CBT 9세트 | 50 | 16 / 27 / 7 | 12 / 12 / 13 / 13 | 26% |
| 기말 CBT 10세트 | 50 | 16 / 27 / 7 | 13 / 12 / 12 / 13 | 26% |

## 선지와 해설 개선
- 복구 문항 중 정답만 길었던 대표 문항의 네 선지를 문법과 구체성 수준이 비슷하도록 고쳤다.
- 짧은 용어형 선지는 같은 범주의 용어로, 문장형 선지는 비슷한 길이의 완전한 문장으로 구성했다.
- 정답이 다른 선지보다 단독으로 긴 비율을 모든 세트에서 목표 범위 20~35%로 맞췄다.
- 평균 정답/오답 선지 길이비는 세트별 1.00~1.10이다.
- 모든 600문항 해설에 정답 근거, 혼동하기 쉬운 부분, `시험 포인트:`를 유지하거나 추가했다.

## 50문항 반복 학습 구조
- 모의고사 1·2회는 각각 50문항이다.
- 기말 CBT는 고정 10세트, 세트별 50문항으로 총 500문항이다.
- 랜덤 CBT는 500문항 전체에서 50문항만 추출하며 100문항 기본 세션은 사용하지 않는다.
- 로컬 로그인, 사용자별 학습기록, 오답노트, 문제 번호 팔레트, 문제·선지 랜덤, 확인 버튼 채점을 유지했다.

## 수정·생성 파일
- 문서·진입: `README.md`, `index.html`, `PROJECT_STATUS.md`
- 기능: `assets/cbt.js`, `assets/review.js`
- CBT 화면: `cbt/software_engineering_final_cbt.html`, `cbt/software_engineering_final_random.html`, `cbt/software_engineering_final_set_01.html`~`10.html`
- 문제 데이터: `data/software_engineering_mock_01.js`, `data/software_engineering_mock_02.js`, `data/software_engineering_final_set_01.js`~`10.js`, `data/software_engineering_final_bank.js`
- 생성·검증기: `scripts/generate_extra_sets.js`, `scripts/validate_questions.py`, `scripts/validate_site.py`

## 검증 결과
- `python scripts/validate_questions.py`: **통과**
  - 12개 세트, 총 600문항의 문항 수·필수 필드·정답·난이도·연속 정답·선지 편향 확인
  - 쉬움+보통은 세트별 43~44문항, 어려움은 6~7문항
  - 완전 중복 0건, 유사도 0.90 이상 문항은 보고용 5쌍
- `python scripts/validate_site.py`: **통과**
  - 필수 파일 53개, 정식 HTML 19개, 상대경로·데이터 전역변수·기능 표식 확인
  - 원본 18개 SHA-256 무결성 확인
- `node --check`: **통과** — 기능·데이터·생성기 JS 19개
- Python 구문 검사: **통과** — 검증기 2개
- HTTP 확인: **통과** — 정식 화면 19개 모두 200 응답 및 `lang="ko"`
- `git diff --check`: **통과**

## 원본 안전 상태
- `중간고사/`, `기말고사/` 원본 자료를 수정·삭제·이동·생성하지 않았다.
- 두 원본 폴더에서 Git 추적 파일은 0개다.
- `.gitignore`의 원본·참고·임시·운영체제 파일 제외 규칙을 확인했다.

## Git 상태
- 브랜치: `main`
- 원격: `origin` → `https://github.com/InsuHam0315/SoftwareEngineering_CBT.git`
- 내용 커밋: `c3eff8b Restore Software Engineering CBT difficulty and balance choices`
- Push: `origin/main` 반영 완료
- 원본 폴더 추적 파일: 0개

## 다음 재개 작업
1. GitHub Pages 배포가 갱신되면 기말 7~10세트 진입과 랜덤 500문항 풀을 확인한다.
2. 배포 브라우저에서 로그인·학습기록·오답 재도전·확인 채점 연동을 최종 확인한다.
