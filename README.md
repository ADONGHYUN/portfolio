# 지원자 중심 개발자 포트폴리오

회사 업무 시스템의 운영 책임 경험과, `고운맘`을 기획부터 AWS 기반 공개 배포까지 혼자 구축한 경험을 함께 보여주는 포트폴리오입니다. AI 개발 작업의 격리 실행·검증·승인·복구 설계도 함께 소개합니다.
프로젝트 기술 설명서가 아니라 채용 담당자가 지원자의 책임 범위와 문제 해결 방식을 빠르게 파악하는 제출본을 목표로 합니다.

## 정보 구조

첫 화면의 시스템 지도 아래에 다음 7개 섹션을 구성합니다.

1. 대표 프로젝트: 기획·설계·개발·검증·공개 배포를 1인 수행한 `고운맘`
2. AI 개발 작업: 5단계 역할 기반 흐름, 서버·실행기의 책임 분리, 격리 수정, 재전송과 원본 반영
3. 실무 경험: 고객 기관을 익명화한 사내 메일 시스템과 인사·노무 시스템
4. 데이터 모델: 50개 이상 테이블의 도메인 지도와 주문 중심 핵심 ERD
5. 문제 해결: 결제 상태 수렴, 실시간 재고 동시성, 계정 연동, Rate Limiter, 이미지 사례 5개
6. 기술 스택: 실제 코드와 설정에서 확인되는 기술만 분류
7. 연락처: 공개 이력서 PDF·GitHub·이메일·고운맘 서비스 URL

ERD와 문제 해결 사례는 별도 이미지 파일 없이 HTML/CSS로 구성해 화면 크기에 맞게 읽을 수 있습니다. 공개 ERD는 핵심 PK·FK와 상태 컬럼만 표시하고, 정확한 제약조건과 인덱스는 `docs/schema.sql`을 기준으로 관리합니다.

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

본문은 정적 HTML이며 Vite 빌드로 CSS·아이콘을 묶고 Sites용 Worker를 생성합니다. `npm.cmd run build`로 검증하며 `.openai/hosting.json`의 기존 Sites 프로젝트와 접근 범위를 유지합니다. 원본 디렉터리를 빌드 없이 공개하면 CSS 패키지 import가 처리되지 않습니다.
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
