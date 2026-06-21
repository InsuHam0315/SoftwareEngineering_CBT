# PROJECT_STATUS

## 현재 단계
- **소프트웨어공학 CBT 문제은행 고도화 및 50문항 세트 구조 개편 완료**
- 최종 갱신: 2026-06-21 (Asia/Seoul)
- 저장소: `https://github.com/InsuHam0315/SoftwareEngineering_CBT.git`

## 모의고사 개선 상태
| 세트 | 문항 | 범위 | 난이도(쉬움/보통/어려움) | 정답 분포(1/2/3/4) | 정답 최장 비율 |
|---|---:|---|---|---|---:|
| 모의고사 1회 | 50 | 중간 15 / 기말 35 | 7 / 22 / 21 | 13 / 12 / 13 / 12 | 26% |
| 모의고사 2회 | 50 | 중간 15 / 기말 35 | 7 / 22 / 21 | 12 / 13 / 12 / 13 | 26% |

- 단순 정의형을 줄이고 사례 적용, 개념 비교, 흐름 판단, UML 관계, 테스트 설계, Verification/Validation, 스크럼, 품질보증·유지보수 판단형으로 재작성했다.
- 네 선지의 문법·구체성·길이를 맞추고 각 오답에 개념상 그럴듯하지만 잘못된 조건이나 결과를 포함했다.
- 모든 해설에 정답 근거와 대표 함정 반박을 포함했다.

## 기말 CBT 세트 분할 상태
- 이전 장문 기본 세션을 세트 선택 화면으로 전환했다.
- 고정 세트 6개, 각 50문항으로 총 300문항을 구성했다.
- 전체 300문항에서 원본 ID를 유지해 추출하는 `랜덤 50문항`을 추가했다.

| 세트 | 문항 | 난이도(쉬움/보통/어려움) | 정답 분포(1/2/3/4) | 정답 최장 비율 |
|---|---:|---|---|---:|
| 기말 CBT 1세트 | 50 | 6 / 22 / 22 | 13 / 13 / 12 / 12 | 26% |
| 기말 CBT 2세트 | 50 | 6 / 22 / 22 | 12 / 13 / 12 / 13 | 26% |
| 기말 CBT 3세트 | 50 | 6 / 22 / 22 | 13 / 12 / 13 / 12 | 26% |
| 기말 CBT 4세트 | 50 | 6 / 22 / 22 | 13 / 13 / 12 / 12 | 26% |
| 기말 CBT 5세트 | 50 | 6 / 22 / 22 | 13 / 13 / 12 / 12 | 26% |
| 기말 CBT 6세트 | 50 | 6 / 22 / 22 | 13 / 13 / 12 / 12 | 26% |

## 기능 보존 및 UI 변경
- 기존 다크 UI, 로컬 로그인, 사용자별 학습기록, 오답노트, 확인 버튼 채점, 해설, 문제 번호 팔레트, 문제·선지 랜덤 섞기를 유지했다.
- 기말 세트 선택 페이지, 6개 고정 세트 페이지, 랜덤 50문항 페이지를 추가했다.
- 오답 다시 풀기 경로와 학습기록 집계를 새 세트 ID에 맞게 확장했다.
- 과거 `finalbank` 오답 기록의 모의고사 재시도 경로도 보존했다.

## 수정·생성 파일
- 진입·문서: `index.html`, `README.md`, `.gitignore`, `PROJECT_STATUS.md`
- CBT 화면: `cbt/software_engineering_final_cbt.html`, `cbt/software_engineering_final_set_01.html`~`06.html`, `cbt/software_engineering_final_random.html`
- 문제 데이터: `data/software_engineering_mock_01.js`, `data/software_engineering_mock_02.js`, `data/software_engineering_final_set_01.js`~`06.js`, `data/software_engineering_final_bank.js`
- 기능 JS: `assets/cbt.js`, `assets/storage.js`, `assets/review.js`, `assets/stats.js`
- 기록 화면: `stats/study-record.html`
- 검증기: `scripts/validate_questions.py`, `scripts/validate_site.py`

## 검증 결과
- `python scripts/validate_questions.py`: **통과**
  - 8개 세트, 총 400문항 구조·문항 수·난도·정답 분포·연속 정답·길이 편향 확인
  - 완전 중복 0건, 문장 유사도 0.90 이상 0건
  - 모든 세트 정답 최장 비율 26%, 평균 정답/오답 길이비 1.03~1.10
- `python scripts/validate_site.py`: **통과**
  - 필수 파일 45개, 정식 HTML 15개, 상대경로와 데이터 전역변수 확인
  - 원본 18개 SHA-256 무결성 확인
- `node --check`: **통과** — 기능·데이터 JS 17개
- HTTP 확인: **통과** — 정식 화면 15개 모두 200 응답
- `git diff --check`: **통과**

## 원본 안전 상태
- `시험/`, `중간고사/`, `기말고사/`, `최종/` 원본·기존 자료를 수정하거나 추적하지 않았다.
- `.gitignore`에 원본, 참고, 임시, 운영체제 파일 제외 규칙을 유지·확인했다.
- 생성 과정의 임시 스크립트는 모두 삭제했다.

## Git 상태
- 브랜치: `main`
- 원격: `origin` → `https://github.com/InsuHam0315/SoftwareEngineering_CBT.git`
- 예정 커밋: `Improve Software Engineering CBT question bank`
- 이 문서 작성 시점에는 전체 검증이 통과했으며, 허용된 산출물만 선택 스테이징한 뒤 커밋·푸시한다.

## 중단 시 다음 재개 작업
1. `python scripts/validate_questions.py`
2. `python scripts/validate_site.py`
3. `git status --short`와 스테이징 목록에서 원본 폴더가 없는지 확인
4. 커밋 `Improve Software Engineering CBT question bank`
5. `git push origin main`