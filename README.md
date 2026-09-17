# 지원자 중심 개발자 포트폴리오

회사 업무 시스템의 운영 책임 경험과, `고운맘`을 기획부터 AWS 기반 공개 배포까지 혼자 구축한 경험을 함께 보여주는 포트폴리오입니다. AI 상품 상세 제작과 AI 개발 작업의 격리 실행·검증·승인·복구 설계도 함께 소개합니다.
프로젝트 기술 설명서가 아니라 채용 담당자가 지원자의 책임 범위와 문제 해결 방식을 빠르게 파악하는 제출본을 목표로 합니다.

본문 기준일은 2026-09-17입니다. 신규 기능은 로컬 코드·설계 문서에서 확인한 구현 범위이며 운영 배포나 외부 제공자 검증 완료를 뜻하지 않습니다. 별도 산출물인 공개 이력서 PDF는 이번 웹 본문 최신화에 포함하지 않았습니다.

## 정보 구조

첫 화면의 시스템 지도 아래에 다음 7개 섹션을 구성합니다.

1. 대표 프로젝트: 기획·설계·개발·검증·공개 배포를 1인 수행한 `고운맘`, 상세 제작·교환·운영 감시의 최근 확장
2. AI 개발 작업: 5단계 역할 기반 흐름, 운영 서버·개발 PC의 책임 분리, 격리 수정, 화면 비교, 재전송과 원본 반영
3. 실무 경험: 사내 메일·인사·노무 시스템과 IE → Whale 전환 사업의 인수·배포·안정화
4. 데이터 모델: 전체 113개 테이블 중 주문 중심 핵심 ERD와 커머스·운영·AI 작업의 경계
5. 문제 해결: 결제 상태 수렴, 실시간 재고 동시성, AI 상세 제작 3개를 기본 표시하고 Rate Limiter·계정 연동·이미지 처리 3개를 펼쳐 확인
6. 기술 스택: 실제 코드와 설정에서 확인되는 기술만 분류
7. 연락처: 공개 이력서 PDF·GitHub·이메일·고운맘 서비스 URL

ERD와 문제 해결 사례는 별도 이미지 파일 없이 HTML/CSS로 구성해 화면 크기에 맞게 읽을 수 있습니다. 공개 ERD는 핵심 PK·FK와 상태 컬럼만 표시하고, 정확한 제약조건과 인덱스는 `docs/schema.sql`을 기준으로 관리합니다.

## 내용 근거

아래는 본문을 유지보수할 때 확인할 소스입니다. 비공개 운영 기록이나 요청 본문을 공개 자산으로 복사하지 않습니다.

- 테이블 수·ERD: `../docs/schema.sql`의 고유 `CREATE TABLE` 113개. `user_account`, `sales_order`, `sales_order_item`의 현행 이름과 비회원 주문의 nullable 회원 참조를 반영했습니다. 옵션·재고의 1:1 표기는 도메인 생성 규칙을 포함합니다.
- AI 상품 상세 제작: `../docs/ai-product-detail-authoring-api.md`, `../gowoonmom/src/main/java/ko/dh/gowoonmom/product/authoring/AuthoringService.java`, `../gowoonmom-web/src/components/admin/product-detail-authoring/ProductDetailAuthoringDetail.tsx`.
- AI 개발 자동화: `../docs/ai-development-orchestrator.md`, `../tools/development-runner/README.md`. 모델 제안과 실행기의 파일 적용·검증을 분리하며 로컬 Codex App Server 연결을 사용합니다.
- 교환·운영 감시·소셜 연결 해제: `../docs/exchange-api.md`, `../docs/operations-monitoring.md`, `../docs/social-unlink-operations.md`.
- 회사 경력과 브라우저 전환 사업 성과: 지원자가 제공한 근무 기간·담당 범위·사업 인수 및 배포 경험을 기준으로 작성했습니다.

테스트 시나리오의 존재와 실제 실행 성공은 구분합니다. 이번 콘텐츠 최신화에서 백엔드·프론트엔드 제품 테스트를 재실행한 것으로 기재하지 않습니다.

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
- 로컬 CSS·JavaScript 링크의 파일 존재 여부
- 외부 링크의 `target="_blank"`와 `rel="noopener noreferrer"`
- 로컬 이력서 경로, 이전 내부 작업 문구, 과도한 테스트 수치의 제거
- 공개 연락처와 이력서 PDF 링크의 실제 값
- skip link, focus 표시, 모바일 내비게이션, 긴 문자열 줄바꿈에 필요한 CSS
- secret 형태의 리터럴과 미완성 내부 마커

`dev-server.test.mjs`는 로컬 서버의 경로 경계, 보안 헤더, GET·HEAD 제한을 확인합니다.

## 공개 기준

- 회사 업무는 기관명과 내부 식별정보를 익명화하고 역할·팀 규모·기술·책임 범위만 표시합니다.
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

## 파일 구성

- `index.html`: 지원자 중심 포트폴리오 본문
- `portfolio.css`: 현재 페이지의 반응형 레이아웃, 접근성, 시각 디자인
- `script.js`: 현재 연도와 내비게이션 활성 상태
- `dev-server.mjs`: 로컬 확인용 제한된 정적 파일 서버
- `site.test.mjs`: 콘텐츠·구조·링크·민감정보 smoke test
- `dev-server.test.mjs`: 로컬 서버 경계와 보안 헤더 테스트
