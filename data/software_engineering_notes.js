window.SE_NOTES = [
  {
    id: "note-mid-01", range: "중간고사", unit: "1장 · 소프트웨어공학 개요", title: "프로그램과 소프트웨어", importance: "최상",
    content: "프로그램은 주로 실행 가능한 원시 코드에 초점을 둔다. 소프트웨어는 프로그램뿐 아니라 자료구조·데이터베이스 구조, 단계별 문서, 테스트 결과, 사용자 매뉴얼처럼 운영과 관리에 필요한 모든 산출물을 포함하는 포괄적 개념이다.",
    examTip: "‘코드만’이면 프로그램, ‘코드+문서+데이터+운영 산출물’이면 소프트웨어로 구분한다.",
    tags: ["소프트웨어", "프로그램", "정의"], sourceFile: "SWE_1장_2.pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-02", range: "중간고사", unit: "1장 · 소프트웨어공학 개요", title: "소프트웨어의 특징과 위기", importance: "상",
    content: "소프트웨어는 공장에서 동일품을 찍어내는 제조물이 아니라 사람의 지식 노동으로 개발되며, 하드웨어처럼 물리적으로 마모되지 않는다. 그러나 환경 변화와 계속되는 변경으로 구조가 복잡해져 품질이 저하될 수 있다. 규모·복잡도 증가, 일정 지연, 비용 초과, 품질 저하가 소프트웨어 위기를 만든다.",
    examTip: "‘소프트웨어도 오래 쓰면 물리적으로 닳는다’는 진술은 틀리다. 변경 누적에 따른 품질 저하와 마모를 구분한다.",
    tags: ["소프트웨어 특징", "소프트웨어 위기", "품질"], sourceFile: "SWE_1장_2.pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-03", range: "중간고사", unit: "1장 · 소프트웨어공학 개요", title: "소프트웨어공학과 품질·생산성", importance: "상",
    content: "소프트웨어공학은 품질 좋은 소프트웨어를 경제적으로 개발하기 위해 체계적이고 규율 있으며 정량화 가능한 원리·방법·도구를 적용하는 분야다. 핵심 목표는 정해진 비용과 일정 안에서 요구 품질을 만족시키고 유지보수성을 확보하는 것이다.",
    examTip: "소프트웨어공학을 단순한 프로그래밍 기법이나 특정 언어 사용법으로 축소하지 않는다.",
    tags: ["소프트웨어공학", "품질", "생산성"], sourceFile: "SWE_1장_2.pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-04", range: "중간고사", unit: "1장 · 생명주기", title: "SDLC 기본 흐름과 산출물", importance: "최상",
    content: "대표 생명주기 흐름은 계획·요구사항 분석 → 설계 → 구현 → 테스트 → 배포 → 유지보수다. 요구분석명세서(SRS), 설계서(SDD), 소스 코드, 테스트 결과 보고서처럼 단계마다 검토 가능한 산출물이 나온다.",
    examTip: "단계 이름뿐 아니라 각 단계의 입력·산출물과 다음 단계의 검토 기준을 함께 기억한다.",
    tags: ["SDLC", "생명주기", "산출물"], sourceFile: "SWE_1장_2.pdf", relatedImage: "assets/img/sdlc-flow.svg", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-05", range: "중간고사", unit: "1장 · 프로세스 모델", title: "폭포수 모델과 V 모델", importance: "최상",
    content: "폭포수 모델은 요구분석부터 유지보수까지 단계를 순차 수행하며 문서와 단계별 승인을 중시한다. 요구가 안정적일 때 관리하기 쉽지만 변경 대응이 느리고 동작 결과가 늦게 보인다. V 모델은 왼쪽의 요구·설계 단계와 오른쪽의 대응 테스트 단계를 연결해 검증 계획을 조기에 세운다.",
    examTip: "단위 테스트↔모듈/상세 설계, 통합 테스트↔아키텍처 설계, 시스템 테스트↔시스템 명세, 인수 테스트↔사용자 요구를 대응시킨다.",
    tags: ["폭포수", "V 모델", "검증", "테스트"], sourceFile: "소공_선형_나선형모델(202603161Gim).pdf", relatedImage: "assets/img/testing-flow.svg", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-06", range: "중간고사", unit: "1장 · 프로세스 모델", title: "프로토타입 모델", importance: "상",
    content: "프로토타입 모델은 불명확한 요구를 빠른 모형으로 보여 주고 사용자 평가를 받아 요구를 구체화한다. 요구 이해와 UI 피드백에는 유리하지만 사용자가 시제품을 완제품으로 오해하거나 범위가 계속 커지고, 버릴 시제품의 구조를 성급히 제품에 재사용하는 위험이 있다.",
    examTip: "핵심 목적은 ‘빠른 완제품’이 아니라 ‘요구사항 확인과 학습’이다.",
    tags: ["프로토타입", "요구사항", "사용자 평가"], sourceFile: "소공_선형_나선형모델(202603161Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-07", range: "중간고사", unit: "1장 · 프로세스 모델", title: "나선형 모델과 위험 분석", importance: "최상",
    content: "나선형 모델은 계획·요구분석 → 위험 분석 → 개발 → 사용자 평가를 반복한다. 프로토타입 전에 위험을 분석하므로 대규모·고위험 프로젝트에 적합하고 요구를 점진적으로 반영한다. 반면 반복할수록 기간과 관리 부담이 커지고 위험 전문가가 필요하다.",
    examTip: "나선형 모델을 식별하는 가장 강한 단서는 매 반복의 ‘위험 분석’이다.",
    tags: ["나선형", "위험 분석", "반복"], sourceFile: "소공_선형_나선형모델(202603161Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-08", range: "중간고사", unit: "1장 · 단계적 개발", title: "점증적 개발과 반복적 개발", importance: "상",
    content: "점증적 개발은 중요한 서브시스템부터 완성해 릴리스하면서 개발 범위를 넓힌다. 반복적 개발은 시스템 전체의 초기 버전을 먼저 제공한 뒤 여러 반복에서 기능과 성능을 보강해 품질·완성도를 높인다.",
    examTip: "점증적=범위 증가, 반복적=전체 골격의 품질 증가로 암기한다.",
    tags: ["점증적", "반복적", "릴리스"], sourceFile: "SWE_1장_2.pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-09", range: "중간고사", unit: "1장 · 애자일", title: "애자일 선언의 네 가지 가치", importance: "최상",
    content: "애자일은 프로세스와 도구보다 개인과 상호작용, 포괄적 문서보다 동작하는 소프트웨어, 계약 협상보다 고객 협력, 계획 준수보다 변화 대응을 더 가치 있게 본다. 오른쪽 항목도 가치가 있지만 왼쪽을 더 중시한다는 뜻이다.",
    examTip: "문서·계획·도구를 없애자는 선언이 아니라 상대적 우선순위를 정한 것이다.",
    tags: ["애자일", "애자일 선언", "변화 대응"], sourceFile: "소공_에자일방법론(202603161Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-10", range: "중간고사", unit: "1장 · 스크럼", title: "스크럼 전체 흐름", importance: "최상",
    content: "제품 책임자가 우선순위화한 Product Backlog를 바탕으로 Sprint Planning에서 이번 Sprint의 목표와 Sprint Backlog를 정한다. Sprint 동안 Daily Scrum으로 진행을 점검하고, 완료 뒤 Sprint Review에서 결과와 제품을 검토하며 Sprint Retrospective에서 팀의 일하는 방식을 개선한다.",
    examTip: "Review는 제품·가치·이해관계자 피드백, Retrospective는 팀 프로세스 개선이다.",
    tags: ["스크럼", "Product Backlog", "Sprint"], sourceFile: "SWE_1장_2.pdf", relatedImage: "assets/img/scrum-flow.svg", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-11", range: "중간고사", unit: "1장 · 스크럼", title: "사용자 스토리와 스토리 포인트", importance: "상",
    content: "사용자 스토리는 기능을 대화의 단서가 되도록 간결히 기록하고 카드·대화·확인의 3C로 구체화한다. 스토리 포인트는 소요 시간 그 자체가 아니라 다른 스토리와 비교한 상대적 업무 규모이며 흔히 피보나치 계열을 사용한다.",
    examTip: "스토리 포인트를 인시·일·주 같은 절대 시간으로 해석하지 않는다.",
    tags: ["사용자 스토리", "3C", "스토리 포인트"], sourceFile: "SWE_1장_2.pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-12", range: "중간고사", unit: "1장 · 스크럼", title: "Daily Scrum과 소멸 차트", importance: "중",
    content: "Daily Scrum은 매일 같은 시간에 짧게 진행 상황과 오늘 할 일, 장애물을 공유하는 점검 회의다. 소멸 차트는 시간에 따른 남은 작업량을 표시하므로 정상적으로 진행되면 오른쪽으로 갈수록 값이 감소한다.",
    examTip: "Daily Scrum은 상세 문제 해결 회의나 관리자 보고 회의가 아니다.",
    tags: ["Daily Scrum", "소멸 차트", "진척 관리"], sourceFile: "SWE_1장_2.pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-13", range: "중간고사", unit: "2장 · UML", title: "UML 다이어그램의 관점", importance: "상",
    content: "UML은 시스템의 상호작용, 정적 구조, 동적 행위를 여러 다이어그램으로 시각화하는 표준 모델링 언어다. 유스케이스는 외부 관점의 기능, 클래스는 정적 구조, 순차·통신은 객체 상호작용, 활동·상태는 행위 흐름, 컴포넌트·배치는 구현과 물리 배치를 표현한다.",
    examTip: "UML은 개발 프로세스 자체나 프로그래밍 언어가 아니라 모델링 언어다.",
    tags: ["UML", "다이어그램", "모델링"], sourceFile: "2장(202404041Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-14", range: "중간고사", unit: "2장 · UML", title: "유스케이스 다이어그램", importance: "최상",
    content: "유스케이스 다이어그램은 시스템 경계 안의 기능과 밖의 액터 관계를 표현한다. 액터는 사람 자체보다 시스템과 상호작용하는 역할이다. 사용자 액터, 연동되는 시스템 액터, 능동적인 주요 액터, 요청을 받는 보조 액터 등을 식별한다.",
    examTip: "유스케이스 이름은 사용자가 얻는 목표를 동사형으로 쓰고, 액터를 특정 개인 이름으로 잡지 않는다.",
    tags: ["유스케이스", "액터", "시스템 경계"], sourceFile: "2장(202404041Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-15", range: "중간고사", unit: "2장 · UML", title: "클래스 다이어그램의 핵심", importance: "최상",
    content: "클래스 다이어그램은 클래스의 이름·속성·연산과 클래스 사이의 관계, 다중도를 정적으로 나타낸다. 관계의 의미뿐 아니라 인스턴스 생명주기, 참조 유지 여부, 상속·인터페이스 구현 여부를 함께 읽어야 한다.",
    examTip: "다중도 0..1, 1, *, 1..*의 최소·최대 개수를 정확히 읽는다.",
    tags: ["클래스 다이어그램", "다중도", "정적 구조"], sourceFile: "2장(202404041Gim).pdf", relatedImage: "assets/img/uml-relations.svg", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-16", range: "중간고사", unit: "2장 · UML 관계", title: "연관·집합·복합 관계", importance: "최상",
    content: "연관은 한 객체가 다른 객체의 참조를 지속적으로 갖는 일반 관계다. 집합은 부분-전체이지만 부분의 생명주기가 전체와 독립이고 빈 마름모를 쓴다. 복합은 강한 부분-전체로 부분의 생명주기가 전체에 종속되며 채운 마름모를 쓴다.",
    examTip: "마름모는 전체 쪽에 놓인다. 빈 마름모=Aggregation, 채운 마름모=Composition이다.",
    tags: ["Association", "Aggregation", "Composition"], sourceFile: "UML.pdf", relatedImage: "assets/img/uml-relations.svg", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-17", range: "중간고사", unit: "2장 · UML 관계", title: "의존·일반화·실체화", importance: "최상",
    content: "의존은 한 클래스가 다른 클래스를 매개변수나 지역 변수 등으로 잠시 사용하는 관계이며 점선 화살표를 쓴다. 일반화는 공통 특성을 상위 타입으로 추출한 is-a 상속 관계이고 실선+빈 삼각형을 쓴다. 실체화는 클래스가 인터페이스의 계약을 구현하는 관계이고 점선+빈 삼각형을 쓴다.",
    examTip: "빈 삼각형은 같지만 일반화는 실선, 실체화는 점선이다.",
    tags: ["Dependency", "Generalization", "Realization"], sourceFile: "UML.pdf", relatedImage: "assets/img/uml-relations.svg", origin: "제공 자료 기반"
  },
  {
    id: "note-mid-18", range: "중간고사", unit: "2장 · UML 행위", title: "순차·통신·활동·상태 다이어그램", importance: "상",
    content: "순차 다이어그램은 위에서 아래로 흐르는 시간 순서와 생명선을 강조하고, 통신 다이어그램은 객체 연결과 번호가 붙은 메시지를 강조한다. 활동 다이어그램은 여러 주체의 업무·제어 흐름을, 상태 다이어그램은 한 객체의 상태와 사건에 따른 전이를 표현한다.",
    examTip: "업무 절차는 활동, 단일 객체의 생애 변화는 상태 다이어그램이 적합하다.",
    tags: ["순차", "통신", "활동", "상태"], sourceFile: "2장(202404041Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-01", range: "기말고사", unit: "3장 · 프로젝트 계획", title: "계획 수립의 순서와 필요성", importance: "최상",
    content: "소프트웨어 개발 계획은 비용·기간·자원을 현실적으로 배분하는 기준이다. 자료는 문제 정의와 타당성 분석을 거쳐 비용을 산정하고, 일정 계획과 위험 분석으로 이어지는 흐름을 제시한다. 계획이 부실하면 일정 지연, 비용 초과, 품질 저하, 유지보수 비용 증가가 발생하기 쉽다.",
    examTip: "문제 정의는 ‘무엇을 개발할지와 범위’를 정해 초기 타당성·계획의 기초를 만든다.",
    tags: ["프로젝트 계획", "문제 정의", "위험 분석"], sourceFile: "3장(202605271Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-02", range: "기말고사", unit: "3장 · 타당성", title: "경제적·기술적·법적 타당성", importance: "상",
    content: "경제적 타당성은 비용-편익과 시장성을 통해 투자 가치가 있는지, 기술적 타당성은 현재 기술·하드웨어·개발 역량으로 요구 기능을 구현할 수 있는지, 법적 타당성은 도구 사용권·소유권·지적재산권 등 법적 문제가 없는지 검토한다.",
    examTip: "투자 효율=경제, 구현 가능=기술, 라이선스·저작권=법적으로 연결한다.",
    tags: ["타당성", "경제성", "기술성", "법"], sourceFile: "3장(202605271Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-03", range: "기말고사", unit: "3장 · 비용 산정", title: "하향식과 상향식 산정", importance: "상",
    content: "하향식은 전체 규모를 전문가 판단이나 델파이 기법으로 먼저 추정해 세부 항목에 배분한다. 델파이는 여러 전문가가 익명으로 독립 의견을 내고 여러 라운드의 피드백으로 합의를 좁힌다. 상향식은 세부 작업 단위별 비용을 구한 뒤 합산하며 LOC와 단계별 노력 기법이 대표적이다.",
    examTip: "익명성·반복·의견 수렴은 델파이의 핵심 단서다.",
    tags: ["하향식", "상향식", "델파이"], sourceFile: "3장(202605271Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-04", range: "기말고사", unit: "3장 · LOC", title: "LOC 추정과 M/M 계산", importance: "최상",
    content: "추정 LOC는 (낙관치+4×중간치+비관치)/6으로 계산한다. 노력(M/M)=LOC÷1인당 월평균 생산 LOC, 개발비=노력×1인당 월 인건비, 개발기간=노력÷참여인원, 생산성=LOC÷노력이다. M/M은 인원과 기간을 곱한 인월 단위다.",
    examTip: "가중치 4는 중간치에 준다. 생산성과 노력의 분자·분모를 뒤집지 않는다.",
    tags: ["LOC", "M/M", "생산성", "계산"], sourceFile: "3장(202605031Gim)_1-3-r1.pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-05", range: "기말고사", unit: "3장 · 비용 산정", title: "브룩스 법칙과 일정 압축", importance: "중",
    content: "브룩스 법칙은 지연 중인 소프트웨어 프로젝트에 인력을 더 투입하면 교육과 의사소통 부담 때문에 오히려 더 늦어질 수 있음을 말한다. 인원과 기간은 단순히 완전 대체되지 않으며, 자료는 정상 계획에서 일정 단축에도 현실적인 한계가 있음을 강조한다.",
    examTip: "사람 수를 두 배로 늘리면 기간이 정확히 절반이 된다는 가정은 틀리다.",
    tags: ["브룩스 법칙", "일정", "의사소통"], sourceFile: "3장(202605271Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-06", range: "기말고사", unit: "3장 · COCOMO", title: "COCOMO의 입력·출력과 유형", importance: "최상",
    content: "COCOMO는 납품 소스 규모 KDSI를 바탕으로 노력 PM과 개발기간 TDEV를 추정한다. 단순형(Organic)은 비교적 작고 익숙한 업무, 중간형(Semi-detached)은 경험과 복잡도가 혼합된 중간 규모, 내장형(Embedded)은 하드웨어·실시간·강한 제약과 밀접한 시스템에 해당한다.",
    examTip: "KDSI는 납품 코드의 천 줄 단위이며 주석·빈 줄을 단순 포함한 파일 전체 줄 수가 아니다.",
    tags: ["COCOMO", "KDSI", "Organic", "Embedded"], sourceFile: "소프트웨어_비용산정기법_강의교안(202605183Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-07", range: "기말고사", unit: "3장 · COCOMO", title: "EAF와 COCOMO II", importance: "상",
    content: "EAF는 제품·하드웨어·인력·프로젝트 특성에 해당하는 노력 승수들을 곱한 보정 계수로 기본 PM을 조정한다. COCOMO II는 진행 정도에 따라 애플리케이션 합성, 초기 설계, 구조 설계 이후 모델을 적용해 초기 정보 부족 문제를 완화한다.",
    examTip: "요구 신뢰도·복잡도·개발자 경험 등이 EAF를 바꾸며, EAF가 커지면 같은 규모의 노력도 증가한다.",
    tags: ["COCOMO II", "EAF", "노력 보정"], sourceFile: "3장(202605271Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-08", range: "기말고사", unit: "3장 · 기능 점수", title: "기능 점수의 관점과 장단점", importance: "최상",
    content: "기능 점수(FP)는 사용자에게 보이는 입출력·조회·논리 파일 기능을 정량화해 규모를 측정한다. 개발 언어와 구현 방식에 독립적이고 초기에도 적용할 수 있지만 요구에서 기능을 정확히 도출할 전문가가 필요하며 내부 알고리즘 중심 소프트웨어에는 덜 적합하다.",
    examTip: "LOC는 구현 코드 규모, FP는 사용자 관점의 기능 규모다.",
    tags: ["기능 점수", "FP", "사용자 관점"], sourceFile: "소프트웨어_비용산정기법_강의교안(202605183Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-09", range: "기말고사", unit: "3장 · 기능 점수", title: "ILF와 EIF 판별", importance: "최상",
    content: "ILF는 측정 대상 애플리케이션이 등록·수정·삭제하며 유지 책임을 지는 내부 논리 데이터다. EIF는 다른 애플리케이션이 유지하고 현재 시스템은 읽거나 참조만 하는 외부 인터페이스 데이터다. 물리적으로 어느 DB에 저장됐는지보다 유지보수 책임과 애플리케이션 경계가 중요하다.",
    examTip: "‘내 시스템이 CUD 하는가?’가 ILF/EIF를 가르는 핵심 질문이다.",
    tags: ["ILF", "EIF", "데이터 기능"], sourceFile: "부록A_5가지_기능유형_구분기준.pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-10", range: "기말고사", unit: "3장 · 기능 점수", title: "EI·EO·EQ 판별", importance: "최상",
    content: "EI는 경계 밖에서 입력이 들어와 ILF를 생성·수정·삭제하는 처리다. EO는 계산·가공·파생 데이터가 포함된 출력이고, EQ는 계산 없이 저장 데이터를 검색해 그대로 보여 주는 단순 조회다. 입력/출력 방향을 먼저 본 뒤 출력이면 파생 로직 유무를 확인한다.",
    examTip: "조회 화면이라도 합계·평균·등급 계산이 들어가면 EQ가 아니라 EO일 수 있다.",
    tags: ["EI", "EO", "EQ", "트랜잭션 기능"], sourceFile: "부록A_5가지_기능유형_구분기준.pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-11", range: "기말고사", unit: "3장 · 기능 점수", title: "간이 기능 점수 계산", importance: "상",
    content: "간이 기능 점수법은 유형별 개수에 평균 복잡도 가중치를 적용한다. 자료의 평균값은 ILF 7.5, EIF 5.4, EI 4.0, EO 5.2, EQ 3.9다. 데이터 기능 점수와 트랜잭션 기능 점수를 합하면 미조정 기능 점수(UFP)가 된다.",
    examTip: "UFP는 기능 요구만 반영하며 성능·품질·운영 환경 같은 비기능 요소는 아직 제외한다.",
    tags: ["간이 기능 점수", "UFP", "가중치"], sourceFile: "3장(202605271Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-12", range: "기말고사", unit: "3장 · 일정", title: "WBS·간트 차트·PERT/CPM", importance: "상",
    content: "WBS는 프로젝트 범위를 관리 가능한 작업으로 계층 분해한다. 간트 차트는 시간축에서 작업 시작·종료와 진행을 직관적으로 보여 준다. PERT/CPM 네트워크는 작업 선후관계와 경로를 분석하며, 임계 경로는 여유 시간이 0인 가장 긴 경로로 지연 시 전체 일정도 지연된다.",
    examTip: "임계 경로는 작업 수가 가장 많은 경로가 아니라 총 소요시간이 가장 긴 경로다.",
    tags: ["WBS", "간트 차트", "PERT", "임계 경로"], sourceFile: "3장(202404291Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-13", range: "기말고사", unit: "상위 설계", title: "설계 원리: 추상화·정보 은닉·모듈화", importance: "상",
    content: "좋은 설계는 핵심만 드러내는 추상화, 내부 결정을 감추는 정보 은닉과 캡슐화, 변경 가능한 단위로 나누는 모듈화를 활용한다. 모듈 내부 요소는 한 목적에 집중해 응집도를 높이고, 모듈 간 의존은 줄여 결합도를 낮추는 것이 바람직하다.",
    examTip: "목표는 고응집·저결합이다. 캡슐화는 데이터와 연산을 묶고 접근을 통제한다.",
    tags: ["추상화", "정보 은닉", "모듈화", "응집도", "결합도"], sourceFile: "상위설계2(202606081Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-14", range: "기말고사", unit: "상위 설계", title: "소프트웨어 아키텍처와 스타일", importance: "상",
    content: "아키텍처는 시스템의 주요 구성요소, 책임, 인터페이스, 상호작용과 제약을 정한 상위 수준 청사진이다. 계층형은 관심사를 층으로 나누고, 클라이언트-서버는 서비스 요청과 제공을 분리하며, MVC는 모델·뷰·컨트롤러 책임을 분리한다.",
    examTip: "아키텍처는 개별 메서드 구현보다 전체 구조와 품질 속성에 영향을 주는 결정을 다룬다.",
    tags: ["아키텍처", "계층형", "클라이언트-서버", "MVC"], sourceFile: "상위설계2(202606081Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-15", range: "기말고사", unit: "상위 설계", title: "디자인 패턴의 목적과 분류", importance: "최상",
    content: "디자인 패턴은 반복되는 객체지향 설계 문제에 대한 검증된 경험을 추상화·일반화한 재사용 템플릿이다. 생성 패턴은 객체 생성, 구조 패턴은 클래스·객체 조립, 행위 패턴은 객체 사이 책임과 협력을 다룬다. 의사소통과 변경 대응은 좋아지지만 초기 학습·적용 비용이 있다.",
    examTip: "패턴은 완성 코드나 알고리즘이 아니라 상황·문제·해결 구조·결과를 공유하는 설계 지식이다.",
    tags: ["디자인 패턴", "생성", "구조", "행위"], sourceFile: "상위설계2(202606081Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-16", range: "기말고사", unit: "하위 설계 · 생성 패턴", title: "생성 패턴 핵심 구분", importance: "최상",
    content: "Factory Method는 생성 인터페이스를 두고 구체 객체 결정을 하위 클래스에 맡긴다. Abstract Factory는 관련 제품군을 일관되게 만든다. Builder는 복잡한 객체의 조립 과정과 표현을 분리하고, Prototype은 기존 객체를 복제하며, Singleton은 인스턴스를 하나로 제한한다.",
    examTip: "Factory Method=제품 하나의 생성 위임, Abstract Factory=서로 맞는 제품군, Builder=단계별 조립, Prototype=복제다.",
    tags: ["Factory Method", "Abstract Factory", "Builder", "Prototype", "Singleton"], sourceFile: "디자인패턴.html", origin: "제공 자료 기반"
  },
  {
    id: "note-final-17", range: "기말고사", unit: "하위 설계 · 구조 패턴", title: "구조 패턴 핵심 구분", importance: "최상",
    content: "Adapter는 호환되지 않는 인터페이스를 변환하고, Bridge는 추상화와 구현을 분리해 독립 확장한다. Composite는 잎과 복합 객체를 같은 방식으로 다루며, Decorator는 객체를 감싸 동적으로 책임을 더한다. Facade는 복잡한 서브시스템에 단순한 통합 창구를 제공하고 Proxy는 대리자가 접근을 통제한다.",
    examTip: "Adapter는 기존 인터페이스 호환, Decorator는 기능 추가, Facade는 사용 창구 단순화다.",
    tags: ["Adapter", "Bridge", "Composite", "Decorator", "Facade", "Proxy"], sourceFile: "14주차_하위설계.pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-18", range: "기말고사", unit: "하위 설계 · 행위 패턴", title: "행위 패턴 핵심 구분", importance: "최상",
    content: "Observer는 한 객체의 상태 변화를 구독자에게 통지하고, Strategy는 교체 가능한 알고리즘을 캡슐화한다. Command는 요청을 객체화해 큐·로그·Undo를 지원하고, State는 내부 상태에 따라 행위가 달라지게 한다. Mediator는 객체 간 통신을 중재하고 Memento는 캡슐화를 해치지 않고 이전 상태를 저장·복원한다.",
    examTip: "Strategy는 사용자가 알고리즘을 선택하고, State는 객체 상태가 바뀌며 행위가 자연스럽게 달라진다.",
    tags: ["Observer", "Strategy", "Command", "State", "Mediator", "Memento"], sourceFile: "14주차_하위설계.pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-19", range: "기말고사", unit: "14주차 · 용어", title: "시스템·방법·프레임워크·아키텍처·모듈", importance: "상",
    content: "시스템은 목적을 위해 상호작용하는 구성요소의 전체, 방법은 반복 가능한 문제 해결 절차, 프레임워크는 확장 지점과 제어 흐름을 제공하는 재사용 구조, 아키텍처는 전체 구성과 상호작용의 청사진, 모듈은 독립적인 기능 수행 단위다.",
    examTip: "프레임워크는 애플리케이션의 제어 흐름을 주도하고 개발자 코드의 확장 지점을 호출한다.",
    tags: ["시스템", "방법", "프레임워크", "아키텍처", "모듈"], sourceFile: "14주차_(각종_용어_정리).pdf", origin: "제공 자료 기반"
  },
  {
    id: "note-final-20", range: "기말고사", unit: "테스트와 품질", title: "Verification과 Validation 및 테스트 수준", importance: "상",
    content: "Verification은 명세와 설계에 맞게 제품을 올바르게 만들고 있는지 확인하고, Validation은 완성 결과가 사용자의 실제 필요를 충족하는지 확인한다. 테스트 수준은 일반적으로 단위 → 통합 → 시스템 → 인수 테스트로 확대된다.",
    examTip: "Verification=제품을 올바르게 만드는가, Validation=올바른 제품을 만드는가로 구분한다.",
    tags: ["Verification", "Validation", "테스트 수준"], sourceFile: "일반 소프트웨어공학 보충", relatedImage: "assets/img/testing-flow.svg", origin: "일반적인 소프트웨어공학 관점"
  }
];
