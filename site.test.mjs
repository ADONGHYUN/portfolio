import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const files = {
  html: resolve(root, "index.html"),
  css: resolve(root, "styles.css"),
  notionCss: resolve(root, "notion.css"),
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
  "Java/Spring 백엔드 개발자",
  "총 1년 7개월",
  "AWS 기반 공개 환경에서 직접 운영",
  "공개 운영",
  "gowoonmom.kr",
  "50개 이상 테이블",
  "주문·결제·재고·배송의 핵심 관계",
  "payment_attempt",
  "notification_outbox",
  "사내 메일 시스템 개발·운영",
  "3인 팀",
  "개발부터 운영 환경의 문제 해결까지 전 범위를 책임",
  "타 시스템 연계 API 개발 및 유지보수",
  "스케줄러 기반 API 개발",
  "실사용 고객을 받기 전",
  "5분 안에 고객 화면과 운영 구조를 확인",
  "데이터 흐름으로 설명하는 문제 해결",
  "결제 상태 수렴",
  "실시간 재고 동시성 제어",
  "inventory_option_balance",
  "원자적 UPDATE",
  "낙관적 락",
  "비관적 락",
  "안전한 소셜 계정 연결",
  "MariaDB 기반 Public API Rate Limiter",
  "S3 이미지 처리의 재시도와 복구",
  "Spring Legacy · JSP · Oracle DB",
  "Java 17 · Spring Boot 3.5.16",
  "Next.js 16.2.11 · React 19.2.4 · TypeScript 5",
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
];

for (const phrase of forbiddenPublicCopy) {
  assert(!html.includes(phrase), `public index.html must not include: ${phrase}`);
}

assert((html.match(/<h1\b/g) || []).length === 1, "index.html must contain exactly one h1");
assert(html.includes('<main id="main-content">'), "main content landmark is missing");
assert(html.includes('class="skip-link"'), "skip link is missing");
assert(html.includes('aria-label="주요 섹션"'), "navigation label is missing");
assert((html.match(/class="case-study"/g) || []).length === 5, "exactly five problem-solving case studies are required");
assert((html.match(/class="data-flow"/g) || []).length === 5, "every case study must contain one data-flow diagram");
assert((html.match(/data-case-tier="additional" hidden/g) || []).length === 2, "two secondary case studies must start collapsed");
assert(html.indexOf('id="고운맘"') < html.indexOf('id="experience"'), "gowoonmom project must appear before company experience");

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert(ids.length === new Set(ids).size, "duplicate HTML id found");

const navigationBlock = html.match(/<nav class="top-nav"[\s\S]*?<\/nav>/)?.[0] || "";
const navigationTargets = [...navigationBlock.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
assert(navigationTargets.length === 7, "sidebar navigation must contain seven concise sections");

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
  "@media (max-width: 980px)",
  "@media (max-width: 520px)",
  ".case-study-list",
  ".data-flow",
  ".case-summary",
  ".architecture-card",
  ".erd-lanes",
  ".erd-relation",
];

for (const phrase of requiredCss) {
  assert(css.includes(phrase), `styles.css must include: ${phrase}`);
}

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

for (const phrase of ["지원자 중심", "6개 섹션", "링크와 민감정보", "공개 연락처", "공개 이력서 PDF"]) {
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
