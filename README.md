# 지원자 중심 개발자 포트폴리오

고운맘의 주문·재고·결제·실패 복구·인증 설계와 회사의 메일 첨부·사용신청 승인 장애 해결 경험을 소개합니다. 채용 담당자가 책임 범위, 선택 이유와 검증 근거를 빠르게 파악하도록 구성합니다.

## 정보 구조

다음 7개 섹션을 유지합니다.

1. 대표 프로젝트: 1인 개발 범위, 서비스 상태와 실제 고객 화면.
2. 백엔드 문제 해결: 재고 예약·만료 배치, 중복 결제, 이미지 부분 실패, 동시 토큰 갱신의 네 사례. 결과·문제·선택·검증을 먼저 표시하고 구현 상세는 접어 둡니다.
3. 회사 문제 해결은 행정우편 첨부파일 삭제 장애와 문자 발송 비동기화 사례를 소개한 뒤 담당 업무·경력을 표시합니다.
4. AI 활용과 검증: 격리 실행, 실제 명령 검증, 승인·기준 해시 검사와 개발자의 책임.
5. 아키텍처·ERD: 서비스 구성과 주문·재고, 결제·환불, 배송·알림 관계. 컬럼을 반복 설명하는 도메인 목록은 두지 않습니다.
6. 기술 스택: Backend, Database/Infra, Frontend, 검증·외부 연계의 네 범주. 회사와 개인 프로젝트의 사용 환경을 구분합니다.
7. 연락처: 공개 이력서 PDF, GitHub, 이메일과 고운맘 서비스 URL.

작은 구매 화면 개선 목록, 중복된 역할·AI 설명, ERD 전후의 설계 원칙 반복은 공개 본문에서 제외합니다. 기술 사례의 실패 조건·검증 환경과 회사 업무의 책임 범위는 줄이지 않습니다.

## 사실관계와 공개 기준

- 고운맘은 지원자가 확인한 사업자등록 완료·공개 운영 상태를 유지합니다. UI 보완으로 일반 주문은 아직 불가하다는 기존 안내를 유지하며, 실제 고객 주문·매출·부하 성과를 추정하지 않습니다.
- 고운맘의 개발 환경 재현 결과와 회사의 실제 운영 장애 경험을 구분합니다. 로컬 검증일이 최신 운영 배포일이나 외부 제공자 실환경 검증일을 뜻하지 않습니다.
- 회사 경험은 지원자가 제공한 사실만 사용합니다. 메일 배포 인수와 기능 개발·유지보수·운영 오류 대응을 담당했고, 전 시스템 전환이나 서버 인프라 전체 구축·관리로 확대하지 않습니다.
- 문자 발송 사례의 개선 효과는 게이트웨이 대기가 화면 응답 경로에서 제거된 범위로 설명합니다. 개선 후 응답 시간은 미측정이며 운영 DB 정리 건수는 집계가 일치하지 않아 생략합니다.
- 엔소프트웨어는 2025.07.01~재직 중, 감프정보기술은 2024.11.25~2025.05.23입니다. 총 경력 개월 수를 자동 추정하지 않습니다.
- 인사·노무는 10개 과업 중 5개 개별·1개 공동 완료, 연가 스케줄러, OZ Report 기반 근무성적평정 PDF 생성, 급여명세서 엑셀 업로드 양식 오류 안내를 유지합니다. 제공되지 않은 검증 규칙·행/셀 단위 기능·효율 개선 수치는 추가하지 않습니다.
- 회사 고객 기관명, 내부 URL·서버·DB 상세·계정·로그·운영 데이터는 공개하지 않습니다. 메일 A/B 흐름은 원리 설명용 개념도이며 실제 로그가 아닙니다.
- 공개 연락처와 공개 이력서 PDF에는 이메일·GitHub·경력·프로젝트만 사용하고 전화번호·생년월일·주소는 제외합니다.
- AI 사용 범위와 업무 규칙·변경 채택·검증·배포의 개발자 책임을 명시합니다. 요청 원문, 실제 작업 ID, 실행기 키·비공개 변경 파일은 공개하지 않습니다.

## 내용 근거

- 주문·결제·만료 잠금: [잠금 계약](../docs/order-payment-locking.md), [만료 서비스](../gowoonmom/src/main/java/ko/dh/gowoonmom/order/service/PaymentReadyOrderCleanupService.java), [회원 잠금 조회](../gowoonmom/src/main/java/ko/dh/gowoonmom/order/dao/OrderRepository.java).
- 재고: [서비스](../gowoonmom/src/main/java/ko/dh/gowoonmom/product/service/ProductOptionService.java), [예약 SQL](../gowoonmom/src/main/resources/mapper/product/ProductOptionMapper.xml).
- 결제: `../gowoonmom/src/main/java/ko/dh/gowoonmom/payment/service/PaymentService.java`, `PaymentTxService.java`.
- 이미지 복구: [outbox worker](../gowoonmom/src/main/java/ko/dh/gowoonmom/product/service/ImageUploadOutboxWorker.java). 공개 본문은 트랜잭션·선점·외부 I/O·재시도의 경계를 설명합니다.
- 인증: [AuthService](../gowoonmom/src/main/java/ko/dh/gowoonmom/auth/service/AuthService.java), [RefreshTokenRepository](../gowoonmom/src/main/java/ko/dh/gowoonmom/auth/dao/RefreshTokenRepository.java), [JwtProvider](../gowoonmom/src/main/java/ko/dh/gowoonmom/security/jwt/JwtProvider.java), [프론트 authStore](../gowoonmom-web/src/stores/authStore.ts).
- AI 개발: [실행 구조](../docs/ai-development-orchestrator.md), [실행기](../tools/development-runner/README.md).
- AI 상품 상세: [API 계약](../docs/ai-product-detail-authoring-api.md).
- ERD: [단일 스키마](../docs/schema.sql), [도메인 설명](../docs/database-schema.md). 비회원·탈퇴 주문의 선택적 회원 참조, 결제 없는 취소의 nullable 결제 참조와 주문상품별 환불 배분을 유지합니다. 주문상품 1..N·옵션/재고 1:1에는 업무 생성 규칙이 포함됩니다.

### 핵심 사례의 기존 검증

| 검증일 | 범위·환경 | 확인한 결과 |
| --- | --- | --- |
| 2026-09-19 | 재고 예약·결제·이미지 복구·인증의 선별 테스트. H2·단위 테스트, PG/S3 모의 서버·객체 | 핵심 7개 클래스 120개. OAuth 관련 3개 클래스의 17개를 포함한 실제 실행은 137개 통과, 실패·오류·스킵 0개 |
| 2026-09-20 | 격리 MariaDB 11.4.11의 동일 옵션 재고 1개 예약 경쟁, 해당 메서드 1개 | 성공 1건·OUT_OF_STOCK 1건, 예약 수량 1개·실물 재고 1개. inventory version만 1 증가 |

위 날짜는 과거 실행 근거이며 2026-10-28에 전체 사례를 재실행한 것으로 표시하지 않습니다. H2·모의 외부 시스템의 결과를 실제 PG·AWS 장애나 대규모 부하 시험으로 확대하지 않습니다.

### 2026-10-28 신규 주문·만료 배치 검증

[MariaDbPaymentReadyCleanupLockingIntegrationTest](../gowoonmom/src/mariadbTest/java/ko/dh/gowoonmom/order/service/MariaDbPaymentReadyCleanupLockingIntegrationTest.java)의 **5개 테스트**를 설치된 MariaDB 11.8.2의 격리 임시 인스턴스에서 실행했습니다. 실패·오류·스킵 0개입니다.

- 재고 예약 직후 신규 주문 준비와 같은 회원을 포함한 다회원 만료 배치를 교차 실행.
- 적립금 미사용 만료 주문과 다른 회원의 신규 적립금 사용 INSERT 경합.
- 두 만료 배치의 중복 처리에서 주문·재고·적립금 반환이 한 번만 반영되는지 확인.
- 적립금·재고 반환 뒤 최종 주문 쓰기 실패 시 전체 롤백, 이후 재시도의 1회 반영 확인.
- 신규 주문의 적립금 부족 거절과 재시도에서 주문·재고 예약·원장 누수 없음 확인.

```powershell
cd C:\dh\gowoonmom
$env:JAVA_HOME = 'C:/Program Files/Java/jdk-17'
.\scripts\run-isolated-mariadb-tests.ps1 -Tests @('*MariaDbPaymentReadyCleanupLockingIntegrationTest')
```

기존 개발·운영 DB와 비밀 설정을 사용하지 않았습니다. 전용 53306 인스턴스·계정·임시 파일을 만들고 실행 후 프로세스·파일·환경변수 정리를 확인했습니다. 결과 XML은 `../gowoonmom/build/test-results/mariaDbIntegrationTest/TEST-ko.dh.gowoonmom.order.service.MariaDbPaymentReadyCleanupLockingIntegrationTest.xml`입니다.

검증은 서비스·JPA 적립금 원장·MyBatis 재고 SQL을 연결한 동시성 재현입니다. HTTP 주문 전체 흐름, 실제 PG 승인, 전체 시스템 교착 제거와 운영 부하를 검증한 결과는 아닙니다. 기본 배치 20건과 회원 잠금 순서를 유지하고, 적립금은 원장·유효기간 검증을 위해 주문별 기존 반환 서비스를 재사용합니다.

## 로컬 확인과 사이트 검증

```powershell
cd C:\dh\gowoonmom\portfolio
# 의존성이 없을 때만 설치합니다.
pnpm.cmd install --frozen-lockfile
npm.cmd run dev -- --port 5173 --strictPort
```

접속 주소는 `http://127.0.0.1:5173/`입니다. 같은 작업 폴더의 정상 서버는 재사용하고, 작업을 마친 뒤에도 사용자가 확인할 수 있도록 실행해 둡니다. 이 정적 포트폴리오에는 고운맘 백엔드가 필요하지 않으며 기존 3000/8080 서버는 건드리지 않습니다.

```powershell
node .\site.test.mjs
node --test .\dev-server.test.mjs
node --check .\script.js
npm.cmd run build
git diff --check
```

`site.test.mjs`는 링크와 민감정보, 사례의 구조·순서, 실제 앵커 대상·자산 파일, 공개 연락처·PDF, 회사 책임 범위, 미확인 성과·개인 경로·secret 노출을 검사합니다. `dev-server.test.mjs`는 경로 경계·보안 헤더·GET/HEAD 제한 3개를 확인합니다. 별도 lint/typecheck 명령은 없습니다. 화면 검증의 실제 결과는 [design-qa.md](./design-qa.md)를 따릅니다.

## 화면 자산과 이력서

- `assets/gowoonmom-storefront.jpg`: 2026-10-07 공개 고객 화면. 캡처는 최신 배포·주문 가능 여부의 증거가 아닙니다.
- `assets/admin-order-state.jpg`: 2026-10-14 로컬 주문 목록의 상품·상태 열만 자른 원본. 주문번호·수령인·전화번호·금액·계정 영역은 제외했습니다.
- `assets/admin-refund-allocation.jpg`: 같은 날 실제 환불 배분 컴포넌트를 테스트 데이터로 표시한 화면. 실제 고객 환불 증빙이 아니며 캡처 중 환불/배분 저장 API를 실행하지 않았습니다.
- 원본 캡처는 공개 폴더 밖에서 관리합니다. `scripts/crop-admin-screen.py`는 크롭 시 메타데이터를 제거하며, 좌표 크롭이 개인정보를 자동 판별하지 않으므로 최종 이미지를 직접 확인합니다.
- 공개 이력서 PDF는 `assets/lim-donghyun-backend-resume.pdf`입니다. [Markdown 원문](../resume/gowoonmom-developer-resume.md)을 단일 내용 원본으로 관리하고 `python .\scripts\build-public-resume.py`로 2쪽 PDF를 생성합니다. ReportLab·pypdf·Windows 맑은 고딕이 필요합니다. 원문 변경 시 생성 후 두 페이지를 렌더링해 확인합니다. 사이트 빌드만으로 PDF가 바뀌지 않습니다.

## 배포

현재 공개 배포 대상은 사용자가 관리하는 GitHub Pages의 `portfolio.gowoonmom.kr`입니다. `.openai`·Worker 설정은 이전 도구 설정이며 Sites로 원본을 동기화하거나 게시하지 않습니다. `npm.cmd run build`의 정적 클라이언트는 `dist/client`에 생성됩니다. 실제 게시 설정을 확인하지 않고 소스 커밋만으로 배포 완료를 표시하지 않습니다.
