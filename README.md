# 2026 소프트웨어공학 기말고사 CBT 문제집

제공된 소프트웨어공학 중간·기말고사 자료를 바탕으로 만든 정적 CBT 학습 사이트입니다. 고난도 모의고사 2회, 기말 CBT 50문항 6세트, 랜덤 50문항, 오답노트, 사용자별 학습기록과 보조 개념정리를 제공합니다.

## 주요 기능

- 모의고사별 50문항: 중간고사 범위 15문항, 기말고사 범위 35문항
- 선지 선택 후 `확인` 버튼으로 채점
- 문제 번호 팔레트와 진행률·정답률 표시
- 문제 순서 및 선지 순서 랜덤
- 기말 CBT 50문항 6세트와 전체 300문항 기반 랜덤 50문항
- localStorage 기반 로컬 로그인, 오답노트, 학습기록
- 반응형 다크 UI와 로컬 SVG 학습자료

## 파일 구조

```text
├─ index.html
├─ login.html
├─ assets/
│  ├─ style.css
│  ├─ storage.js
│  ├─ auth.js
│  ├─ cbt.js
│  └─ img/
├─ cbt/
│  ├─ software_engineering_mock_01.html
│  ├─ software_engineering_mock_02.html
│  ├─ software_engineering_final_cbt.html
│  ├─ software_engineering_final_set_01.html ~ final_set_06.html
│  └─ software_engineering_final_random.html
├─ data/
│  ├─ software_engineering_mock_01.js
│  ├─ software_engineering_mock_02.js
│  ├─ software_engineering_final_bank.js
│  ├─ software_engineering_final_set_01.js ~ final_set_06.js
│  ├─ software_engineering_notes.js
│  ├─ software_engineering_concepts.js
│  └─ software_engineering_comparisons.js
├─ notes/software-engineering-final/index.html
├─ review/wrong-notes.html
├─ stats/study-record.html
└─ scripts/
```

## 로컬 실행

```powershell
Set-Location "H:\2026_소프트웨어공학"
python -m http.server 8000
```

브라우저에서 `http://localhost:8000/`을 엽니다.

## 데이터 저장 안내

서버나 데이터베이스를 사용하지 않습니다. 로그인 프로필과 CBT 기록은 다음 localStorage 키로 현재 브라우저에만 저장됩니다.

- `softwareEngineeringCurrentUser`
- `softwareEngineeringUsers`
- `softwareEngineeringStudyData_{userId}`

브라우저 저장 데이터를 삭제하면 기록도 함께 사라집니다.

## GitHub Pages 배포

예상 Pages 주소:

```text
https://insuham0315.github.io/SoftwareEngineering_CBT/
```

1. GitHub 저장소의 **Settings**를 엽니다.
2. 왼쪽 메뉴에서 **Pages**를 선택합니다.
3. **Build and deployment**의 Source를 **Deploy from a branch**로 설정합니다.
4. Branch는 `main`, 폴더는 `/ (root)`를 선택합니다.
5. 저장한 뒤 배포가 완료될 때까지 기다립니다.

사용자 지정 도메인을 연결할 경우 후보 도메인은 다음과 같습니다.

```text
ist-se.kro.kr
```

실제 DNS 설정 전에는 `CNAME` 파일을 추가하지 않습니다.

## 검증

```powershell
python scripts/validate_questions.py
python scripts/validate_site.py
node --check assets/auth.js
node --check assets/storage.js
node --check assets/cbt.js
```

## 주의

- 본 사이트는 시험 대비용 개인 학습 도구입니다.
- 원본 강의자료는 저장소에 포함하지 않습니다.
- 일반 지식으로 보충한 내용은 `일반적인 소프트웨어공학 관점`으로 표시했습니다.
