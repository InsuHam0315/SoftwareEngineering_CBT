window.SE_COMPARISONS = [
  {
    id: "cmp-01", conceptA: "프로그램", conceptB: "소프트웨어",
    keyDifference: "프로그램은 실행 명령과 원시 코드 중심의 좁은 개념이고, 소프트웨어는 프로그램에 데이터 구조·문서·테스트 결과·사용자 매뉴얼·운영 산출물까지 포함하는 포괄적 개념이다.",
    examTip: "선지에 ‘소프트웨어는 소스 코드만 의미한다’가 나오면 틀린 설명이다.",
    example: "수강신청 Java 코드만 가리키면 프로그램, 코드·DB 구조·SRS·테스트 보고서·매뉴얼 전체를 가리키면 소프트웨어다.",
    tags: ["정의", "기초"], range: "중간고사", sourceFile: "SWE_1장_2.pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-02", conceptA: "Verification", conceptB: "Validation",
    keyDifference: "Verification은 명세와 설계에 맞게 제품을 올바르게 만들고 있는지 확인하고, Validation은 결과물이 사용자의 실제 필요를 충족하는 올바른 제품인지 확인한다.",
    examTip: "Verification=Are we building the product right?, Validation=Are we building the right product?의 의미를 한국어로 구분한다.",
    example: "설계서가 SRS를 정확히 반영했는지 검토하는 것은 Verification, 사용자가 실제 업무로 인수 시험하는 것은 Validation이다.",
    tags: ["검증", "확인", "품질"], range: "기말고사", sourceFile: "일반 소프트웨어공학 보충", origin: "일반적인 소프트웨어공학 관점"
  },
  {
    id: "cmp-03", conceptA: "폭포수 모델", conceptB: "애자일 모델",
    keyDifference: "폭포수는 계획된 단계를 순차적으로 진행하며 문서·승인을 중시하고, 애자일은 짧은 반복에서 동작하는 소프트웨어를 자주 인도하며 피드백과 변화 대응을 중시한다.",
    examTip: "요구가 안정되고 규제가 강하면 폭포수가, 요구 변화와 빠른 피드백이 중요하면 애자일이 상대적으로 적합하다. 어느 한쪽이 항상 우월하지는 않다.",
    example: "요건이 고정된 계약형 공공 시스템은 폭포수, 시장 반응에 따라 기능을 바꾸는 서비스는 애자일 접근이 유리할 수 있다.",
    tags: ["프로세스 모델", "변화"], range: "중간고사", sourceFile: "SWE_1장_2.pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-04", conceptA: "프로토타입 모델", conceptB: "나선형 모델",
    keyDifference: "프로토타입 모델은 시제품과 사용자 피드백으로 불명확한 요구를 발견·구체화하는 데 초점을 두고, 나선형 모델은 매 반복에서 위험을 식별·분석하고 대응한 뒤 개발과 평가를 수행한다.",
    examTip: "‘위험 분석’이 반복의 독립 단계로 강조되면 나선형, ‘빠른 모형으로 요구 확인’이 중심이면 프로토타입 모델이다.",
    example: "UI 흐름 확인용 화면 모형은 프로토타입, 신기술·안전 위험을 매 주기 평가하는 대규모 제어 시스템은 나선형에 가깝다.",
    tags: ["프로세스 모델", "위험", "요구사항"], range: "중간고사", sourceFile: "소공_선형_나선형모델(202603161Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-05", conceptA: "점증적 개발", conceptB: "반복적 개발",
    keyDifference: "점증적 개발은 완성된 기능 단위를 차례로 더해 시스템의 범위를 넓히고, 반복적 개발은 시스템 전체의 초기 버전을 반복해서 다듬어 기능과 성능의 완성도를 높인다.",
    examTip: "점증적=범위 증가, 반복적=전체 골격의 품질 증가로 기억한다. 실제 프로젝트에서는 두 방식을 함께 쓸 수 있다.",
    example: "회원→주문→결제를 하나씩 추가하면 점증적이고, 세 기능의 기본 흐름을 먼저 만든 뒤 매 반복에서 모두 정교화하면 반복적이다.",
    tags: ["단계적 개발", "반복"], range: "중간고사", sourceFile: "SWE_1장_2.pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-06", conceptA: "Product Backlog", conceptB: "Sprint Backlog",
    keyDifference: "Product Backlog는 제품 전체에 필요한 요구·개선 항목의 우선순위 목록이고, Sprint Backlog는 이번 Sprint 목표를 위해 선택한 항목과 구체 작업 계획이다.",
    examTip: "제품 전체와 장기 방향은 Product Backlog, 현재 반복의 실행 계획은 Sprint Backlog다.",
    example: "결제·쿠폰·검색 개선 전체 목록은 Product Backlog이고, 이번 2주에 구현할 결제 작업은 Sprint Backlog다.",
    tags: ["스크럼", "백로그"], range: "중간고사", sourceFile: "SWE_1장_2.pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-07", conceptA: "Sprint Review", conceptB: "Sprint Retrospective",
    keyDifference: "Sprint Review는 이해관계자와 제품 증가분·비즈니스 가치·다음 방향을 검토하고, Sprint Retrospective는 팀이 협업 방식·절차·도구를 돌아보고 개선 행동을 정한다.",
    examTip: "Review=무엇을 만들었나와 다음 제품 방향, Retrospective=어떻게 일했나와 팀 프로세스 개선이다.",
    example: "고객에게 기능을 시연해 백로그를 조정하면 Review, 코드 리뷰 지연 원인을 분석해 규칙을 바꾸면 Retrospective다.",
    tags: ["스크럼", "검토", "회고"], range: "중간고사", sourceFile: "SWE_1장_2.pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-08", conceptA: "유스케이스", conceptB: "사용자 스토리",
    keyDifference: "유스케이스는 액터 목표를 정상·대안·예외 흐름으로 구조화해 시스템 상호작용을 상세히 기술하고, 사용자 스토리는 역할·목표·가치를 짧게 적어 대화를 촉진하는 애자일 요구 표현이다.",
    examTip: "상세 시나리오와 예외 흐름은 유스케이스, 카드·대화·확인(3C)과 간결한 문장은 사용자 스토리다.",
    example: "‘학생으로서 잔여 좌석을 보고 싶다’는 사용자 스토리이고, 조회 단계와 오류·대안 흐름까지 적으면 유스케이스다.",
    tags: ["요구사항", "UML", "애자일"], range: "중간고사", sourceFile: "2장(202404041Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-09", conceptA: "Association", conceptB: "Dependency",
    keyDifference: "Association은 한 객체가 다른 객체의 참조를 필드 등으로 지속 보유하는 구조 관계이고, Dependency는 매개변수·지역 변수·일시 호출처럼 잠시 사용해 변경 영향을 받는 약한 관계다.",
    examTip: "참조를 인스턴스 속성으로 유지하면 Association 가능성이 높고, 메서드 안에서 잠시 사용 후 끝나면 Dependency 가능성이 높다.",
    example: "교수가 담당 과목 목록을 필드로 가지면 Association, 보고서 메서드가 Printer를 매개변수로 받으면 Dependency다.",
    tags: ["UML 관계", "참조"], range: "중간고사", sourceFile: "UML.pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-10", conceptA: "Aggregation", conceptB: "Composition",
    keyDifference: "둘 다 부분-전체 관계지만 Aggregation에서는 부분의 생명주기가 전체와 독립이고, Composition에서는 부분이 전체에 강하게 소유되어 생명주기를 함께한다.",
    examTip: "빈 마름모=Aggregation, 채운 마름모=Composition이며 마름모는 전체 쪽에 둔다.",
    example: "학과-교수처럼 독립 생존하면 Aggregation, 주문-주문항목처럼 주문 삭제 시 항목도 사라지면 Composition이다.",
    tags: ["UML 관계", "생명주기"], range: "중간고사", sourceFile: "UML.pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-11", conceptA: "Generalization", conceptB: "Realization",
    keyDifference: "Generalization은 하위 클래스가 상위 클래스의 공통 특성을 이어받는 is-a 상속 관계이고, Realization은 구현 클래스가 인터페이스의 계약을 실제로 제공하는 관계다.",
    examTip: "둘 다 빈 삼각형을 쓰지만 Generalization은 실선, Realization은 점선이다.",
    example: "Student가 Person을 상속하면 Generalization, CardPayment가 Payment 인터페이스를 구현하면 Realization이다.",
    tags: ["UML 관계", "상속", "인터페이스"], range: "중간고사", sourceFile: "UML.pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-12", conceptA: "활동 다이어그램", conceptB: "상태 다이어그램",
    keyDifference: "활동 다이어그램은 업무·알고리즘의 행동과 분기·병렬 제어 흐름을 나타내고, 상태 다이어그램은 한 객체가 사건에 따라 상태를 바꾸는 생애를 나타낸다.",
    examTip: "여러 역할이 참여하는 업무 절차는 활동, 상태 의존 행동을 가진 단일 객체는 상태 다이어그램이 적합하다.",
    example: "주문 처리 부서 흐름은 활동 다이어그램, 주문 객체의 접수→결제→배송 상태 전이는 상태 다이어그램이다.",
    tags: ["UML", "행위"], range: "중간고사", sourceFile: "2장(202404041Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-13", conceptA: "순차 다이어그램", conceptB: "통신 다이어그램",
    keyDifference: "둘 다 객체 간 상호작용을 표현하지만 순차 다이어그램은 생명선과 위→아래 시간 순서를, 통신 다이어그램은 객체 연결 구조와 번호가 붙은 메시지를 강조한다.",
    examTip: "세로 시간축이 뚜렷하면 순차, 링크 위 메시지 번호가 핵심이면 통신 다이어그램이다.",
    example: "로그인 호출을 시간축으로 추적하면 순차, 화면·서비스·저장소 연결과 1, 1.1 메시지로 나타내면 통신이다.",
    tags: ["UML", "상호작용"], range: "중간고사", sourceFile: "2장(202404041Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-14", conceptA: "컴포넌트 다이어그램", conceptB: "배치 다이어그램",
    keyDifference: "컴포넌트 다이어그램은 소프트웨어 컴포넌트와 제공·요구 인터페이스 및 의존을 나타내고, 배치 다이어그램은 물리 노드·실행 환경과 그 위에 배치된 산출물을 나타낸다.",
    examTip: "소프트웨어 조립 구조는 컴포넌트, 서버·단말·네트워크와 실행 위치는 배치다.",
    example: "주문 서비스와 결제 컴포넌트 의존은 컴포넌트 다이어그램, 웹 서버와 DB 서버에 파일을 배치한 모습은 배치 다이어그램이다.",
    tags: ["UML", "구현", "배치"], range: "중간고사", sourceFile: "2장(202404041Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-15", conceptA: "기능 요구사항", conceptB: "비기능 요구사항",
    keyDifference: "기능 요구사항은 시스템이 제공할 행동과 서비스를, 비기능 요구사항은 그 기능이 만족해야 할 성능·보안·신뢰성·사용성 등의 품질 속성과 제약을 설명한다.",
    examTip: "‘무엇을 하는가’는 기능, ‘얼마나 빠르고 안전하며 신뢰할 수 있어야 하는가’는 비기능이다. 비기능도 측정 가능하게 써야 한다.",
    example: "‘학생은 성적을 조회한다’는 기능, ‘조회 요청의 95%를 2초 안에 처리한다’는 비기능 요구사항이다.",
    tags: ["요구사항", "품질 속성"], range: "중간고사", sourceFile: "소공_선형_나선형모델(202603161Gim).pdf", origin: "제공 자료 기반"
  },
  {
    id: "cmp-16", conceptA: "테스트 케이스", conceptB: "테스트 시나리오",
    keyDifference: "테스트 시나리오는 사용자 관점의 넓은 업무 흐름과 검증 대상을 설명하고, 테스트 케이스는 구체적인 사전조건·입력·실행 절차·예상 결과를 명시해 반복 실행 가능하게 만든다.",
    examTip: "‘결제 흐름을 검증한다’는 시나리오, 카드번호·금액·단계·기대 메시지까지 정하면 테스트 케이스다.",
    example: "‘품절 상품 주문 실패’가 시나리오라면 재고 0, 상품 A 선택, 주문 클릭, ‘품절’ 메시지 기대는 구체 테스트 케이스다.",
    tags: ["테스트", "품질"], range: "기말고사", sourceFile: "일반 소프트웨어공학 보충", origin: "일반적인 소프트웨어공학 관점"
  }
];
