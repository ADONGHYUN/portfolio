# Design QA

## 2026-10-07 가독성과 정보 위계 보완

### Findings

- 최종 화면 비교에서 수정이 필요한 P0·P1·P2 문제는 발견하지 않았다.
- 코드 검토에서 발견한 P3: 기존 `#top .system-summary h1` 규칙이 새 이름 크기를 덮어썼다. 오래된 규칙을 제거한 뒤 데스크톱·모바일 화면을 다시 확인했다.
- 이번 작업은 공개 화면의 복제가 아니라, 기존 색감과 사실관계를 유지하며 정보 밀도를 줄이는 개선이다. 소개·서비스 화면 중심의 첫 화면, 짧은 제목, 기본 접힌 기술 상세는 의도한 변경이다.

### 비교 근거

- 원본: `https://portfolio.gowoonmom.kr/`의 비로그인 첫 화면.
- 구현: `http://127.0.0.1:5173/`, `C:\dh\gowoonmom\portfolio\index.html`, `portfolio.css`.
- 근거 폴더: `C:\Users\PC\.codex\visualizations\2026\10\07\01a11448-61dc-76b2-b157-85a5869d59aa\portfolio-audit`.
- 원본 캡처: `source-top-1280.jpg` (1265 × 712px). 구현: `updated-top-desktop.jpg` (1265 × 810px). CSS viewport는 1280 × 820이며 캡처 가능한 높이가 달라 비교에서는 위쪽 1265 × 712px로 동일하게 잘랐다. 이미지 확대·축소나 밀도 보정은 하지 않았다.
- 같은 URL 첫 화면·비로그인·밝은 테마를 `comparison-desktop.png`에 나란히 배치해 비교했다. 변경된 레이아웃과 문구는 개선 범위이며 동일 디자인 재현으로 평가하지 않았다.
- 추가 구현 근거: `updated-top-mobile.jpg`, `updated-cases-mobile.jpg` (390 × 844 CSS viewport), `updated-cases-desktop.jpg`, `updated-mail-desktop.jpg` (1280px 폭).
- 별도 세부 영역 비교는 필요하지 않았다. 동일 폭의 원본·구현 전체 비교에서 헤더·글자·간격이 판독 가능했고, 기술 사례와 모바일은 저장한 원본 크기 캡처에서 개별 확인했다.

### 필수 시각 항목

| 항목 | 결과 | 확인 내용 |
| --- | --- | --- |
| 글꼴·정보 위계 | 통과 | 한글 폴백을 보완하고 이름·소개·본문·작은 라벨의 크기를 구분했다. 모바일 제목과 본문의 줄바꿈·잘림을 확인했다. |
| 간격·배치 | 통과 | 격자 배경과 중복 라벨을 줄이고 첫 화면을 두 영역으로 정리했다. 모바일에서는 한 열, 기술 사례 요약은 모바일 한 열·데스크톱 세 열이다. |
| 색상 | 통과 | 기존 종이색 배경·짙은 본문·와인색 강조·파란 링크를 유지하고 구분선의 농도를 낮췄다. |
| 이미지 | 통과 | 실제 공개 고객 화면을 1170 × 578px JPG로 사용했다. 비율·잘림·압축 상태를 확인했다. 회원·주문·관리자 화면은 포함하지 않았다. |
| 문구·내용 | 통과 | 제목을 짧게 정리하고 사례별 결과를 먼저 표시했다. 개발 환경 검증과 운영 장애 경험의 구분, 원래 검증 날짜, 일반 주문 불가 안내는 유지했다. |

### 실행 검증과 남은 범위

- 320·390·768·1280px에서 문서 가로 넘침이 없었다.
- 네 기술 사례와 회사 사례의 상세 열기·닫기, 검증 환경·날짜 펼치기, 내부 앵커 이동을 확인했다.
- 재고 사례의 Enter·Space 조작과 내부 SQL 펼치기, 모바일에서 PDF 링크까지 키보드 이동을 확인했다. 콘솔 오류·경고는 없었다.
- `node site.test.mjs`, `node --test dev-server.test.mjs` (3개), `node --check script.js`, `git diff --check`, `npm.cmd run build`가 통과했다. 마지막 HTML·CSS·자산 변경 뒤 smoke test와 빌드를 다시 통과했다.
- 실물 모바일 기기와 전체 스크린리더 검증은 하지 않았다. GitHub Pages 게시·운영 배포는 실행하지 않았다.
- 완료 항목: 첫 화면 정리, 실제 서비스 이미지, 짧은 제목, 요약·상세 분리, 모바일·키보드 확인, 기존 사실관계 유지.

final result: passed

아래는 이전 작업의 검증 이력이다.

## 2026-10-01 구매 흐름 사례 보완

- 현재 구현: `C:\dh\gowoonmom\portfolio\index.html`, `portfolio.css`.
- 기존 네 가지 핵심 사례 뒤에 장바구니 저장 불확실성·결제 재시도·상품 카드 일괄 조회·키보드 조작 내용을 추가했다. 회사 경험과 기존 사례의 검증일은 유지했다.
- 로컬 개발 화면에서 320·390·768·1280px의 문서 가로 넘침이 없음을 확인했다. 새 사례 영역은 320·390px에서 1열, 768·1280px에서 2열이다.
- 390 × 844에서 새 제목·네 사례·검증 안내의 실제 줄바꿈과 표시를 확인했다. 1280 × 900에서는 네 사례를 2열로 읽을 수 있다. 브라우저 콘솔 오류·경고는 없었다.
- `site.test.mjs`, `dev-server.test.mjs` 3개 테스트, JavaScript 문법 검사, `git diff --check`, 프로덕션 빌드가 통과했다. 내부 앵커와 PDF·자산 경로는 정적 검사로 확인했다.
- 데스크톱 화면 근거: `C:\Users\PC\.codex\visualizations\2026\10\01\01a0f4c8-6e51-70e0-8e41-45a03212d40e\portfolio-update-desktop.jpg`.
- 아래 디자인 비교는 이전 작업 환경에서 보관한 과거 근거다. 최신 화면이나 현재 PC의 실행 경로로 간주하지 않는다.

## Scope

- Selected direction: `02 — Living System Map`
- Source image: `C:\Users\dh700\.codex\generated_images\01a00064-84c0-7c32-8558-5a5ecf35ebf2\exec-fa6b1bec-428e-4d12-9707-7b813fb12c00.png`
- Implementation: `D:\dev\gowoonmom\portfolio-site\index.html`
- Desktop viewport: `1440 × 1024`
- Mobile viewport: `390 × 844`

## Visual evidence

- Desktop implementation: `C:\Users\dh700\.codex\visualizations\2026\08\14\01a00064-84c0-7c32-8558-5a5ecf35ebf2\system-map-implementation-desktop-final.png`
- Mobile implementation: `C:\Users\dh700\.codex\visualizations\2026\08\14\01a00064-84c0-7c32-8558-5a5ecf35ebf2\system-map-implementation-mobile-final.png`
- Source / implementation composite: `C:\Users\dh700\.codex\visualizations\2026\08\14\01a00064-84c0-7c32-8558-5a5ecf35ebf2\system-map-comparison-current.png`

The source and implementation were normalized to the same `720 × 512` panel size and placed side by side. The first viewport was used for the final desktop comparison.

## Fidelity review

| Surface | Result | Notes |
| --- | --- | --- |
| Layout | Passed | Compact identity header, service facts, five-step commerce flow, architecture/data/infra/evidence rows, and bottom actions follow the source hierarchy. |
| Typography | Passed | Korean sans-serif display type and monospace system metadata reproduce the technical-publication tone. |
| Color | Passed | Off-white paper, charcoal type, rose structure lines, blue system highlights, and green live state are consistent. |
| Icons | Passed | Phosphor regular icons are used consistently. No emoji or custom SVG icon system remains in the redesigned first view. |
| Content | Passed | Mock-only Redis, EC2, RDS, and CloudWatch claims were replaced with the actual project stack: Lightsail, Docker Compose, Nginx, MariaDB, S3, and CloudFront. |
| Responsive behavior | Passed | At `390 × 844`, facts become a two-column grid and commerce nodes become a readable vertical flow without horizontal overflow. |

## Interaction and runtime checks

- Main navigation anchors: checked.
- Resume PDF link and external service link attributes: checked.
- Additional problem-solving cases toggle: native `details/summary` changed from closed to open, and cases `04` and `05` became visible without relying on JavaScript.
- Browser console warnings/errors: none.
- Production build: `pnpm run build` passed.

## Iteration history

1. Replaced the previous Notion-like header and card hero with a full living-system map.
2. Added explicit flow connectors and a shared dependency line so order, payment, inventory, delivery, and refund read as one system.
3. Reduced unused space in the action area and aligned it with a terminal-style status strip.
4. Corrected the mobile flow copy, reduced first-view spacing, and retained the developer identity in the compact header.
5. Replaced the script-dependent problem-solving toggle with native disclosure UI and normalized the visible case order to `01 → 02 → 03`.

## Remaining intentional difference

- P3: The source uses trapezoid-like commerce modules. The implementation uses rectangular modules to preserve clearer semantics, reliable responsiveness, and accessible HTML without decorative CSS artwork.

final result: passed
