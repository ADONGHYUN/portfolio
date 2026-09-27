import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const files = {
  html: resolve(root, "index.html"),
  css: resolve(root, "portfolio.css"),
  script: resolve(root, "script.js"),
  devServer: resolve(root, "dev-server.mjs"),
  readme: resolve(root, "README.md"),
};

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

for (const [name, path] of Object.entries(files)) {
  assert(existsSync(path), `${name} is missing: ${path}`);
}

const html = readFileSync(files.html, "utf8");
const css = readFileSync(files.css, "utf8");
const script = readFileSync(files.script, "utf8");
const devServer = readFileSync(files.devServer, "utf8");
const readme = readFileSync(files.readme, "utf8");

const requiredHtml = [
  "Java·Spring 백엔드 개발자",
  "요구사항 정의부터 설계·개발·배포·운영 검증까지",
  "사업자등록 완료",
  "공개 운영 중",
  "UI 보완 중으로 일반 주문은 아직 불가합니다",
  "2024.11.25 - 2025.05.23",
  "gowoonmom.kr",
  "Java/Spring 기반 업무 시스템 개발·운영",
  "메일 시스템을 단독 운영하면서 인사·노무 개선 사업의 기능 개발을 병행",
  "MariaDB 통합 · 통과",
  "재고 1개에 동일 옵션 예약 요청 2건을 동시에 실행",
  "최종 reserved_quantity = 1",
  "주문·결제·재고·배송의 핵심 관계",
  "payment_attempt",
  "notification_outbox",
  "사내 메일 시스템 개발·운영",
  "3인 팀",
  "메일 배포를 인수한 뒤",
  "타 시스템 연계 API 개발 및 유지보수",
  "전체 10개 과업 중",
  "5개 과업을 개별 담당해 완료하고, 1개 과업을 공동 완료",
  "1년 미만 대상자에게 연가를 1일씩 부여하는 스케줄러",
  "OZ Report 기반 근무성적평정 PDF 다운로드",
  "실패 조건을 정하고, 데이터가 어떻게 남는지 확인",
  "검증 환경과 범위",
  "실제 고객 장애 대응이 아니라",
  "H2(테스트용 DB)",
  "마지막 1개를 두 요청이 예약한다면",
  "동일 PAID webhook 동시 처리",
  "inventory_option_balance",
  "원자적 UPDATE",
  "낙관적 충돌 검사",
  "비관적 락",
  "ROTATED 후 5초 이내",
  "예약 가능한 수량을 DB의 갱신 조건으로 강제합니다",
  "핵심 구현: 재고 예약 SQL",
  "S3 복사는 성공했는데 DB에 완료를 못 남겼다면",
  "대안과 선택 이유",
  "운영 보호 장치",
  "Java 17 · Spring Boot 3",
  "Next.js 16 · React 19 · TypeScript 5",
  "AWS Lightsail",
  "Docker Compose",
  "https://gowoonmom.kr/",
  "회사명과 근무 기간",
  "./assets/lim-donghyun-backend-resume.pdf",
  "https://github.com/ADONGHYUN",
  "dh7005@naver.com",
  "rel=\"noopener noreferrer\"",
];

for (const phrase of requiredHtml) {
  assert(html.includes(phrase), `index.html must include: ${phrase}`);
}

const forbiddenPublicCopy = [
  "대기업 지원용",
  "대기업 서비스 개발 직무",
  "Evidence Matrix",
  "Enterprise Fit",
  "면접 브리프",
  "이력서 경로 복사",
  "../resume/",
  "payment-qa.png",
  "백엔드 1,593개",
  "프론트 911개",
  "Portfolio URL은 배포 전 교체",
  "구현·테스트 코드 근거",
  "이번 작업",
  "이 작업에서는",
  "이번 사례",
  "미실행",
  "별도 검증 코드",
  "ProductOptionService",
  "ProductOptionMapper.xml",
  "IntegrationTest",
  "docs/schema.sql",
  "한계와 다음 판단",
  "추가 검증이 필요합니다",
  "큐 도입을 검토합니다",
  "공개 서비스의 활성 기능과는 구분",
  "113개 테이블",
  "Testcontainers",
  "공개 가오픈",
  "실제 고객 유입 전",
  "총 1년 7개월",
];

for (const phrase of forbiddenPublicCopy) {
  assert(!html.includes(phrase), `public index.html must not include: ${phrase}`);
}

assert((html.match(/<h1\b/g) || []).length === 1, "index.html must contain exactly one h1");
assert(html.includes('<main id="main-content">'), "main content landmark is missing");
assert(html.includes('class="skip-link"'), "skip link is missing");
assert(html.includes('aria-label="주요 섹션"'), "navigation label is missing");
const cases = [...html.matchAll(/<article id="(case-[^"]+)" class="case-study">([\s\S]*?)<\/article>/g)];
assert(cases.length === 4, "four primary Gowoonmom cases are required");
for (const [, id, content] of cases) {
  for (const phrase of ["원인과 제약", "대안과 선택 이유", "실제 구현", 'class="data-flow"', "검증 시나리오와 결과", "운영 보호 장치", 'class="case-brief"', "<dt>문제</dt>", "<dt>선택</dt>", "<dt>검증</dt>"]) {
    assert(content.includes(phrase), `${id} must include ${phrase}`);
  }
  assert(!/<details\b[^>]*\bopen\b/.test(content), `${id} implementation details must start collapsed`);
  assert(content.indexOf('class="case-brief"') < content.indexOf('class="case-summary"'), `${id} must show problem, choice and verification before the detailed explanation`);
  const checks = content.match(/<div class="case-checks"[\s\S]*?<\/dl>/)?.[0] || "";
  assert(!checks.includes("evidence-pending"), `${id} must not mix unverified expectations with confirmed results`);
}
const reservationSql = html.match(/<pre class="implementation-code"><code>([\s\S]*?)<\/code><\/pre>/)?.[1] || "";
for (const guard of ["UPDATE inventory_option_balance", "stock_quantity - reserved_quantity - sales_hold_quantity &gt;= #{quantity}", "po.deleted_at IS NULL", "po.option_status = 'SELLABLE'", "p.deleted_at IS NULL", "p.product_status = 'ACTIVE'"]) {
  assert(reservationSql.includes(guard), `visible reservation SQL must retain its guard: ${guard}`);
}
assert(html.indexOf('id="problem-solving"') < html.indexOf('id="data-model"'), "technical cases must precede the detailed ERD");
assert(html.indexOf('id="problem-solving"') < html.indexOf('id="ai-orchestration"'), "AI tooling must not displace the core backend cases");
assert(html.indexOf('id="고운맘"') < html.indexOf('id="experience"'), "gowoonmom project must appear before company experience");
assert(html.indexOf('id="problem-solving"') < html.indexOf('id="experience"'), "Gowoonmom cases must remain the primary cases");
assert(html.indexOf('id="experience"') < html.indexOf('id="ai-orchestration"'), "company problem solving must precede AI tooling");
assert(html.indexOf('id="experience"') < html.indexOf('id="data-model"'), "company problem solving must precede the detailed architecture and ERD");
assert(html.indexOf('class="architecture-support"') > html.indexOf('id="data-model"'), "the architecture must support the cases rather than delay them");

const companyExperience = html.match(/<section id="experience"[\s\S]*?(?=\n      <section id=")/)?.[0] || "";
const companyCase = companyExperience.match(/<article id="mail-incident"[\s\S]*?<\/article>/)?.[0] || "";
assert(companyCase, "the company mail incident case is missing");
assert(companyExperience.indexOf('id="mail-incident"') < companyExperience.indexOf('id="company-responsibilities"'), "the company incident must precede routine responsibilities");
for (const phrase of [
  'href="#mail-incident"',
  "공용 첨부 임시폴더 삭제로 발생한 행정우편 장애 해결",
  "전달받은 파일·설정 목록에 따라 수행",
  "배포 목록의 파일 누락과 아래 첨부파일 삭제 오류는 별개의 문제",
  "폐쇄망 상주 환경",
  "기존 시스템을 직접 분석·수정하고 운영 배포를 수행",
]) {
  assert(companyExperience.includes(phrase), `company experience must include: ${phrase}`);
}
for (const phrase of [
  "<dt>문제</dt>", "<dt>핵심 판단</dt>", "<dt>확인 결과</dt>",
  "장애 원리를 설명하기 위한 개념 흐름",
  "난수 이름 폴더", "해당 하위 폴더만 삭제",
  "시스템 설정에서 임시 저장소 경로", "추가로 지정한 보호 경로",
  "금요일 새벽부터 토요일 점심까지",
  "다음 주 화요일", "당일 저녁",
  "행정우편의 첨부·발송이 정상 동작하는지 직접 확인",
  "일반 메일 발송과 행정우편 작성을 동시에 진행",
  "동일 오류는 재발하지 않았습니다",
  'href="#company-responsibilities"',
]) {
  assert(companyCase.includes(phrase), `mail case must retain its scope: ${phrase}`);
}
assert(!/<details\b[^>]*\bopen\b/.test(companyCase), "company case details must initially be collapsed");
assert(!/<img\b/.test(companyCase), "company case must not present invented screenshots as evidence");
for (const unsupportedClaim of [
  "전 시스템 배포 총괄", "전체 전환 사업 리딩", "기여도 60%", "생산성 2배",
  "일정 50%", "조기 완료", "재발 0건", "자동화 테스트", "회귀 테스트",
  "UUID", "심볼릭 링크", "경로 정규화", "분산 락", "트랜잭션 격리",
  "체크리스트 자동화", "AI를 전혀 사용하지", "추후 작성",
]) {
  assert(!companyExperience.includes(unsupportedClaim), `unverified company claim: ${unsupportedClaim}`);
}

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert(ids.length === new Set(ids).size, "duplicate HTML id found");
for (const [, references] of html.matchAll(/aria-labelledby="([^"]+)"/g)) {
  for (const id of references.split(/\s+/)) assert(ids.includes(id), `accessible heading target is missing: ${id}`);
}
const workSummary = html.match(/<aside class="work-summary"[\s\S]*?<\/aside>/)?.[0] || "";
assert(workSummary.includes('href="#mail-incident"'), "the concise work summary must link directly to the incident");
assert(html.indexOf(workSummary) > html.indexOf('id="hero-title"') && html.indexOf(workSummary) < html.indexOf('id="고운맘"'), "the work summary must be secondary to the hero and visible before long case details");
const stack = html.match(/<section id="stack"[\s\S]*?<\/section>/)?.[0] || "";
assert((stack.match(/<article>/g) || []).length === 6, "the technology stack must use six concise tool categories");
for (const detail of ["JSON Schema", "격리 작업 공간", "상태 머신", "Heartbeat", "Lease", "불변 revision", "입력 스냅샷", "상품 기준 해시"]) {
  assert(!stack.includes(detail), `implementation detail belongs in a case, not the stack: ${detail}`);
}
assert(!companyExperience.includes("GPT") && !companyExperience.includes("코딩 에이전트"), "company environment copy must stay concise");

const navigationBlock = html.match(/<nav class="top-nav"[\s\S]*?<\/nav>/)?.[0] || "";
const navigationTargets = [...navigationBlock.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
assert(navigationTargets.length === 5, "header navigation must contain project, AI, experience, ERD and problem-solving links");
assert(navigationTargets.includes("ai-orchestration"), "AI orchestration must be reachable from the header");

for (const target of navigationTargets) {
  assert(ids.includes(target), `navigation target is missing: #${target}`);
}

const hashTargets = [...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
for (const target of hashTargets) {
  assert(ids.includes(target), `internal anchor is missing: #${target}`);
}

function attributeValue(attributes, name) {
  return attributes.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? null;
}

const anchors = [...html.matchAll(/<a\b([^>]*)>/g)].map((match) => match[1]);
for (const attributes of anchors) {
  const href = attributeValue(attributes, "href");
  const target = attributeValue(attributes, "target");
  const rel = attributeValue(attributes, "rel") || "";

  assert(href, "anchor without href found");

  if (/^https:\/\//.test(href)) {
    assert(target === "_blank", `external link must open in a new tab: ${href}`);
    const relTokens = new Set(rel.split(/\s+/).filter(Boolean));
    assert(relTokens.has("noopener") && relTokens.has("noreferrer"), `external link must use noopener noreferrer: ${href}`);
  }
}

const localReferences = [...html.matchAll(/(?:href|src)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((reference) => !reference.startsWith("#") && !/^(?:https:|mailto:|data:)/.test(reference));

for (const reference of localReferences) {
  const localPath = resolve(root, reference.split(/[?#]/, 1)[0]);
  assert(localPath.startsWith(root), `local reference escapes portfolio root: ${reference}`);
  assert(existsSync(localPath), `local reference is broken: ${reference}`);
}

const publicPathPatterns = [
  /[A-Za-z]:\\[^\s"']+/,
  /file:\/\//i,
  /\/Users\//,
  /\/home\/[^/]+\//,
  /href="[^"]+\.md(?:[?#][^"]*)?"/i,
];

for (const pattern of publicPathPatterns) {
  assert(!pattern.test(html), `public index.html contains a local or source-document path: ${pattern}`);
}

const requiredCss = [
  ".skip-link",
  ":focus-visible",
  "word-break: keep-all",
  "overflow-x: auto",
  "scroll-margin-top",
  "overflow-wrap: anywhere",
  "@media (prefers-reduced-motion: reduce)",
  "@media (max-width: 900px)",
  "@media (max-width: 680px)",
  ".case-study-list",
  ".data-flow",
  ".case-summary",
  ".architecture-flow",
  ".erd-lanes",
  ".erd-relation",
  ".company-case-summary",
  ".company-case-details > summary",
  ".mail-interference",
  ".work-summary",
  ".case-brief",
  ".architecture-support",
];

for (const phrase of requiredCss) {
  assert(css.includes(phrase), `portfolio.css must include: ${phrase}`);
}

const sectionHeadingRule = css.match(/(?:^|\n)\.section-heading\s*\{([^}]+)\}/)?.[1] || "";
assert(sectionHeadingRule.includes("grid-template-columns: minmax(0, 1fr)"), "all section headings must stack the eyebrow, title and description in one column");
assert(sectionHeadingRule.includes("align-items: start"), "section headings must align their content at the start");
const projectHeadingRule = css.match(/(?:^|\}\s*)\.project-heading\s*\{([^}]+)\}/)?.[1] || "";
assert(projectHeadingRule.includes("grid-template-columns: minmax(0, 1fr) auto"), "project title and status must keep their distinct desktop layout");

const requiredScript = ["current-year", "IntersectionObserver", "aria-current", "setActiveSection"];
for (const phrase of requiredScript) {
  assert(script.includes(phrase), `script.js must include: ${phrase}`);
}

for (const phrase of ["navigator.clipboard", "resumePath", "copy-resume-path"]) {
  assert(!script.includes(phrase), `script.js must not expose a local resume path: ${phrase}`);
}

for (const phrase of [
  "createPortfolioServer",
  "resolveRequestFile",
  "Content-Security-Policy",
  "X-Content-Type-Options",
  "Referrer-Policy",
]) {
  assert(devServer.includes(phrase), `dev-server.mjs must include: ${phrase}`);
}

for (const phrase of ["지원자 중심", "7개 섹션", "링크와 민감정보", "공개 연락처", "공개 이력서 PDF"]) {
  assert(readme.includes(phrase), `README.md must include: ${phrase}`);
}

const combined = `${html}\n${css}\n${script}\n${devServer}\n${readme}`;
const forbiddenPatterns = [
  /secret\s*[:=]\s*['"][^'"]+/i,
  /api[_-]?key\s*[:=]\s*['"][^'"]+/i,
  /jwt[_-]?secret\s*[:=]\s*['"][^'"]+/i,
  /oauth[_-]?secret\s*[:=]\s*['"][^'"]+/i,
  /password\s*[:=]\s*['"][^'"]+/i,
];

for (const pattern of forbiddenPatterns) {
  assert(!pattern.test(combined), `secret-like or private-network literal found: ${pattern}`);
}

const privateNetworkAddress = /\b(?:10|127|169\.254|172\.(?:1[6-9]|2\d|3[01])|192\.168)\.\d{1,3}\.\d{1,3}\b/;
assert(!privateNetworkAddress.test(html), "public index.html must not contain a private-network address");

for (const marker of ["TBD", "TODO", "FIXME"]) {
  assert(!combined.includes(marker), `unresolved internal marker found: ${marker}`);
}

console.log("portfolio smoke test passed");
