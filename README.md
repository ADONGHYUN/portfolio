# 지원자 중심 개발자 포트폴리오

회사 업무 시스템의 운영 책임 경험과, `고운맘`을 기획부터 AWS 기반 공개 배포까지 혼자 구축한 경험을 함께 보여주는 포트폴리오입니다. AI 상품 상세 제작과 AI 개발 작업의 격리 실행·검증·승인·복구 설계도 함께 소개합니다.
프로젝트 기술 설명서가 아니라 채용 담당자가 지원자의 책임 범위와 문제 해결 방식을 빠르게 파악하는 제출본을 목표로 합니다.

고운맘 본문은 2026-09-19 선별 검증과 2026-09-20 재고 동시 예약 검증을 기준으로 합니다. 공개 배포·가오픈 상태이며 실제 고객 유입 전 기능 및 운영 검증 단계로 설명합니다. 로컬 코드와 테스트의 확인은 최신 운영 배포나 외부 제공자 실환경 검증을 뜻하지 않습니다. 회사 경험은 지원자가 직접 제공한 사실관계로 작성하며, 고운맘 코드나 테스트를 회사 경험의 근거로 사용하지 않습니다.

## 정보 구조

첫 화면의 사례 바로가기 아래에 다음 7개 섹션을 구성합니다.

1. 대표 프로젝트: 책임 범위·상태·단일 백엔드와 관계형 DB를 선택한 기준
2. 문제 해결: 주문·재고 동시성, 결제 정합성, 이미지 부분 성공 복구, 인증의 네 가지 사례와 데이터 흐름
3. 구현 결과·AI 활용: 고객·운영자 흐름, AI의 보조 범위와 개발자의 판단·검증 책임. 상세 실행기는 접어서 표시
4. 데이터 모델: 주문 스냅샷·결제 시도·원장·재고·외부 작업의 수명을 분리한 이유. 전체 테이블 수는 공개 본문에서 제외
5. 실무 경험: 메일 배포 인수 후 1인 담당, 인사·노무 3인 팀의 과업 범위, 공용 첨부 임시폴더 삭제 장애 사례. 상세 원인·수정 내용은 접어서 표시
6. 기술 스택: 실제 기술·도구를 여섯 범주로 분류. 상태 머신·lease·스냅샷 등 설계 내용은 AI 사례에서 설명
7. 연락처: 공개 이력서 PDF·GitHub·이메일·고운맘 서비스 URL

ERD와 문제 해결 사례는 별도 이미지 파일 없이 HTML/CSS로 구성해 화면 크기에 맞게 읽을 수 있습니다. 공개 ERD는 핵심 PK·FK와 상태 컬럼만 표시하고, 정확한 제약조건과 인덱스는 `docs/schema.sql`을 기준으로 관리합니다.

## 내용 근거

아래는 본문을 유지보수할 때 확인할 소스입니다. 비공개 운영 기록이나 요청 본문을 공개 자산으로 복사하지 않습니다.

제출용 본문에는 면접관이 열어 볼 수 없는 파일명 목록이나 편집 작업 메모를 표시하지 않습니다. 실제 예약 SQL과 검증 조건·확인된 결과를 본문에 제공하고, 아래 소스 경로·실행 명령은 유지보수용 근거로 관리합니다. 실행하지 않은 MariaDB 시나리오의 기대값은 성공 결과 목록에서 제외합니다. 사례 하단은 막연한 확장 계획 대신 현재 구현된 운영 보호 장치를 설명하며, 확인한 테스트 환경은 결과와 함께 명시합니다.

- ERD: `../docs/schema.sql`을 기준으로 `user_account`, `sales_order`, `sales_order_item`의 현행 이름과 비회원 주문의 nullable 회원 참조를 반영했습니다. 옵션·재고의 1:1 표기는 도메인 생성 규칙을 포함합니다. 테이블 개수 대신 모델링 경계를 설명합니다.
- AI 상품 상세 제작: `../docs/ai-product-detail-authoring-api.md`, `../gowoonmom/src/main/java/ko/dh/gowoonmom/product/authoring/AuthoringService.java`, `../gowoonmom-web/src/components/admin/product-detail-authoring/ProductDetailAuthoringDetail.tsx`.
- AI 개발 자동화: `../docs/ai-development-orchestrator.md`, `../tools/development-runner/README.md`. 모델 제안과 실행기의 파일 적용·검증을 분리하며 로컬 Codex App Server 연결을 사용합니다.
- 교환·운영 감시·소셜 연결 해제: `../docs/exchange-api.md`, `../docs/operations-monitoring.md`, `../docs/social-unlink-operations.md`.
- 회사 경험: 지원자가 제공한 근무 기간·역할·운영 장애 원인·적용한 수정을 기준으로 작성합니다. 브라우저 전환 사업에서는 전달받은 목록에 따른 메일 배포를 인수한 범위이며 전환 개발이나 전 시스템 배포 총괄로 표현하지 않습니다.
- 메일 사례의 A/B 순서는 장애 원리를 설명하는 개념 흐름이며 실제 실행한 테스트 기록이 아닙니다. 확인된 결과는 원인 식별, 저장·정리 범위 수정, 루트·보호 경로 삭제 방어입니다. 재발률, 경로 정규화 API, 교차 실행 검증 등 제공되지 않은 내용은 성과로 기재하지 않습니다.
- 인사·노무는 전체 10개 과업 중 5개 개별 완료·1개 공동 완료와 연가 스케줄러·OZ Report PDF 기능만 구체적으로 표시합니다. 과업 수를 기여율이나 생산성으로 환산하지 않습니다.

### 2026-09-19 고운맘 선별 검증

운영 장애를 해결했다는 주장이 아니라 개발·테스트 재현 근거입니다. 아래 7개 핵심 클래스의 120개 테스트가 통과했습니다. 명령의 `*AuthServiceTest` 패턴에 OAuth 관련 3개 클래스의 17개 테스트도 포함되어 전체 실행 결과는 137개 통과, 실패·오류·스킵 0개입니다. 이 숫자는 서비스 규모나 테스트의 완전성을 의미하지 않습니다.

| 사례 | 구현 기준 | 실행한 테스트 | 환경·결과 |
| --- | --- | --- | --- |
| 재고 예약 | `ProductOptionService`, `ProductOptionMapper.xml` | `ProductOptionBulkStockIntegrationTest` 7개 | H2, 다중 옵션 일부 부족·판매 상태 변경 시 전체 예약 롤백 |
| 결제 정합성 | `PaymentService`, `PaymentTxService`, `PaymentAttempt` | `PortOnePaymentLifecycleIntegrationTest` 15개, `PaymentTxServiceTest` 45개 | H2+loopback PG 모의 서버 및 단위 테스트. 중복 승인·과거 이벤트·만료와 승인 경합·취소 재실행 |
| 이미지 복구 | `ImageUploadOutboxWorker`, `ImageUploadOutboxStore` | `ImageUploadOutboxTransactionIntegrationTest` 2개, `ImageUploadOutboxS3RestartIntegrationTest` 1개, `ImageUploadOutboxLeaseFenceIntegrationTest` 1개 | H2+S3 모의 객체, 저장 롤백·새 worker의 복구·만료된 lease 결과 거절 |
| 인증 | `AuthService`, `RefreshTokenRepository`, `JwtProvider`, 프론트 `authStore.ts` | `AuthServiceTest` 49개 | 단위 테스트, 사용자 잠금 순서·회전 경합·오래된 재사용·family 로그아웃 |

백엔드 구현 루트는 `../gowoonmom/src/main/java/ko/dh/gowoonmom/`, 일반 테스트 루트는 `../gowoonmom/src/test/java/ko/dh/gowoonmom/`입니다. 결과 XML은 `../gowoonmom/build/test-results/test/`에서 확인했으며 공개 자산에 원시 로그를 복사하지 않습니다.

```powershell
cd D:\dev\gowoonmom\gowoonmom
.\gradlew.bat test --tests '*ProductOptionBulkStockIntegrationTest' --tests '*PortOnePaymentLifecycleIntegrationTest' --tests '*PaymentTxServiceTest' --tests '*AuthServiceTest' --tests '*ImageUploadOutboxTransactionIntegrationTest' --tests '*ImageUploadOutboxS3RestartIntegrationTest' --tests '*ImageUploadOutboxLeaseFenceIntegrationTest' --no-daemon
```

### 2026-09-20 재고 동시 예약 검증

기존 `MariaDbPaymentTxServiceConcurrencyIntegrationTest.concurrentSingleUnitReservationsAllowExactlyOneAndOnlyAdvanceInventoryVersion`을 실행해 1개 통과, 실패·오류·스킵 0개를 확인했습니다. 두 worker가 latch 시작 신호 후 같은 옵션의 재고 1개에 각각 1개 예약을 시도하며, 서비스의 `@Transactional` 경계로 독립 실행합니다. 성공 1건·`OUT_OF_STOCK` 1건, 최종 예약 수량 1개, 실물 재고 1개, inventory version만 1 증가하고 옵션 마스터 version은 유지됩니다. HTTP 주문 전체 흐름이나 대규모 부하를 검증한 결과로 확대하지 않습니다.

기존 `../scripts/run-isolated-mariadb-tests.ps1`로 MariaDB 11.4.11의 별도 임시 데이터 폴더·전용 계정·loopback 53306 인스턴스를 생성했습니다. 테스트 후 프로세스와 임시 데이터가 정리되며 일반 개발 DB·운영 DB·비밀정보 설정을 사용하지 않습니다. Docker 엔진이 실행 중이지 않아 Testcontainers는 도입하지 않았고, 테스트 코드는 새로 추가하지 않았습니다.

```powershell
cd D:\dev\gowoonmom
.\scripts\run-isolated-mariadb-tests.ps1 -Tests '*MariaDbPaymentTxServiceConcurrencyIntegrationTest.concurrentSingleUnitReservationsAllowExactlyOneAndOnlyAdvanceInventoryVersion'
```

결과는 `../gowoonmom/build/test-results/mariaDbIntegrationTest/TEST-ko.dh.gowoonmom.payment.service.MariaDbPaymentTxServiceConcurrencyIntegrationTest.xml`에서 확인했습니다. 이 실행은 해당 메서드 1개에 한정되며 같은 클래스의 중복 결제 테스트나 다른 MariaDB 테스트를 실행한 것으로 표시하지 않습니다. 실제 PG·AWS 장애, 부하 테스트, AI 실행기 종단 테스트와 프론트 제품 전체 회귀는 이 검증 범위 밖입니다.

## 로컬 확인

```powershell
cd D:\dev\gowoonmom\portfolio-site
npm.cmd run dev
```

터미널에 표시된 Local URL을 엽니다. Vite가 CSS의 패키지 import와 아이콘 자산을 처리하며, 기본 개발 서버는 Cloudflare 로컬 런타임을 사용합니다.

Cloudflare 로컬 런타임을 실행할 수 없는 환경에서 정적 화면만 확인하려면 다음 명령을 사용합니다.

```powershell
node --input-type=module -e 'import {createServer} from "vite"; const server = await createServer({configFile:false,server:{host:"127.0.0.1",port:5173,strictPort:true}}); await server.listen(); server.printUrls();'
```

## 검증

```powershell
cd D:\dev\gowoonmom
node .\portfolio-site\site.test.mjs
node --test .\portfolio-site\dev-server.test.mjs
```

`site.test.mjs`는 다음 내용을 확인합니다.

링크와 민감정보를 포함한 공개 제출 경계를 정적 검사로 고정합니다.

- 핵심 경력·1인 개발 범위·공개 운영 상태 문구
- 내비게이션과 내부 앵커의 실제 대상
- 회사 사례의 역할·수치·개념 흐름 표시와 미확인 성과·기술 표현의 방지
- 로컬 CSS·JavaScript 링크의 파일 존재 여부
- 외부 링크의 `target="_blank"`와 `rel="noopener noreferrer"`
- 로컬 이력서 경로, 이전 내부 작업 문구, 과도한 테스트 수치의 제거
- 공개 연락처와 이력서 PDF 링크의 실제 값
- skip link, focus 표시, 모바일 내비게이션, 긴 문자열 줄바꿈에 필요한 CSS
- secret 형태의 리터럴과 미완성 내부 마커

`dev-server.test.mjs`는 로컬 서버의 경로 경계, 보안 헤더, GET·HEAD 제한을 확인합니다.

2026-09-20 화면 검증에서는 320·390·768·1280px에서 가로 넘침 없이 섹션 제목 다음에 설명이 배치되고, 네 사례의 핵심 요약이 컨테이너 안에 표시되는 것을 확인했습니다. 상단 회사 경험 링크와 기술 스택의 AI 사례 링크, 상세 펼치기를 확인했으며 브라우저 콘솔 오류·경고는 없었습니다. `site.test.mjs`, `dev-server.test.mjs` 3개 테스트, JavaScript 문법 검사와 `npm.cmd run build`도 통과했습니다. 이 정적 사이트에는 별도 lint/typecheck 명령이 없습니다.

## 공개 기준

- 회사 업무는 기관명과 내부 식별정보를 익명화하고 역할·팀 규모·기술·책임 범위·제공된 장애 원리를 표시합니다.
- 회사 시스템의 내부 URL, 서버 주소, API 명세, DB 상세, 화면, 로그, 계정, 운영 데이터는 사이트에 포함하지 않습니다.
- 고운맘 ERD는 공개 가능한 핵심 테이블과 대표 PK·FK만 표시하고 실제 회원·주문 데이터는 포함하지 않습니다.
- 정량 근거가 없는 안정성 향상, 처리 시간 단축, 사용자·매출·트래픽 성과는 작성하지 않습니다.
- `고운맘`의 공개 운영 환경은 실사용 고객을 받기 전의 운영 검증 환경으로 설명합니다.
- AI 개발 작업은 구현 코드와 자동 테스트를 근거로 소개하며 최신 운영 배포 여부나 생산성 향상률을 추정하지 않습니다. 요청 원문, 실제 작업 ID, 실행기 키와 비공개 변경 파일은 공개하지 않습니다.
- 기존 결제 QA 이미지는 전화번호·주소 형식 값과 스캔 가능한 QR이 있어 공개 자산에서 제거했고, 민감정보가 없는 HTML/CSS 아키텍처 시각 요소로 대체했습니다.
- 공개 PDF에는 이메일·GitHub·경력·프로젝트만 포함하고 전화번호·생년월일·주소는 제외합니다.

## 배포

현재 공개 배포 대상은 사용자가 관리하는 GitHub Pages의 `portfolio.gowoonmom.kr`입니다. `.openai`와 Worker 설정은 이전 도구 설정이며 이 문서의 수정이나 빌드만으로 사이트를 게시하지 않습니다.

본문은 정적 HTML이며 기존 `npm.cmd run build`는 CSS·아이콘을 묶어 `dist/client`와 Worker 산출물을 생성합니다. GitHub Pages의 실제 배포 설정에 맞춰 정적 클라이언트와 공개 자산을 반영해야 하며, 소스 커밋만으로 어떤 경로가 게시되는지 단정하지 않습니다. 원본 HTML/CSS에는 패키지 import가 있어 Vite 처리 없이 파일만 올리면 아이콘이 누락될 수 있습니다.
공개 이력서 PDF는 `assets/lim-donghyun-backend-resume.pdf`로 연결합니다.

## 지원별 제출본

공개 사이트에는 개인정보를 줄인 PDF를 사용하고, 전화번호 등 추가 정보가 필요한 정식 이력서는 잡코리아·원티드의 지원 양식으로 제출합니다.

`../resume/gowoonmom-developer-resume.md`의 회사 경력은 웹 본문과 같은 사실관계로 유지합니다. 공개 PDF는 별도 정적 자산이며 전체 레이아웃의 재생성 원본은 없습니다. `scripts/update-resume-portfolio-notes.py`는 기존 PDF의 테이블 수 문구와 검증 범위 주석 두 줄만 수정하며 전체 이력서를 생성하지 않습니다. PDF의 회사 경력 요약에는 새 메일 사례·과업 수가 아직 반영되지 않았고, 고정된 경력 개월 수도 갱신이 필요합니다. 사이트 빌드가 PDF를 갱신하지는 않습니다.

## 파일 구성

- `index.html`: 지원자 중심 포트폴리오 본문
- `portfolio.css`: 현재 페이지의 반응형 레이아웃, 접근성, 시각 디자인
- `script.js`: 현재 연도와 내비게이션 활성 상태
- `dev-server.mjs`: 로컬 확인용 제한된 정적 파일 서버
- `site.test.mjs`: 콘텐츠·구조·링크·민감정보 smoke test
- `dev-server.test.mjs`: 로컬 서버 경계와 보안 헤더 테스트
