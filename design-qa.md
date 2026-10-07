# Design QA

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
