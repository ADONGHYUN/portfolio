import assert from "node:assert/strict";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import http from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

import { createPortfolioServer, resolveRequestFile } from "./dev-server.mjs";

test("request paths stay inside the selected portfolio root", () => {
  const root = path.resolve(tmpdir(), "portfolio-site");
  const resumeRoot = path.resolve(tmpdir(), "resume");

  assert.equal(resolveRequestFile("/", root, resumeRoot).filePath, path.join(root, "index.html"));
  assert.equal(resolveRequestFile("/assets/payment-qa.png", root, resumeRoot).filePath, path.join(root, "assets", "payment-qa.png"));
  assert.equal(
    resolveRequestFile("/resume/gowoonmom-developer-resume.md", root, resumeRoot).filePath,
    path.join(resumeRoot, "gowoonmom-developer-resume.md"),
  );
  assert.deepEqual(
    resolveRequestFile("/%2e%2e%2fportfolio-site-secrets%2fsecret.txt", root, resumeRoot),
    { status: 403, filePath: null },
  );
  assert.deepEqual(
    resolveRequestFile("/resume/%2e%2e%2fsecret.txt", root, resumeRoot),
    { status: 403, filePath: null },
  );
  assert.deepEqual(resolveRequestFile("/%E0%A4%A", root, resumeRoot), { status: 400, filePath: null });
});

test("default server root is anchored to the module rather than the caller working directory", async () => {
  const source = await readFile(new URL("./dev-server.mjs", import.meta.url), "utf8");

  assert.match(source, /path\.dirname\(fileURLToPath\(import\.meta\.url\)\)/);
  assert.doesNotMatch(source, /defaultRoot\s*=\s*path\.resolve\(process\.cwd\(\)\)/);
});

test("server returns security headers and rejects unsupported methods", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "gowoonmom-portfolio-server-"));
  const resumeRoot = path.join(root, "resume-files");
  const server = createPortfolioServer({ root, resumeRoot });

  try {
    await mkdir(resumeRoot, { recursive: true });
    await writeFile(path.join(root, "index.html"), "<!doctype html><title>portfolio</title>", "utf8");
    await writeFile(path.join(resumeRoot, "resume.md"), "# Resume", "utf8");
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    assert.ok(address && typeof address === "object");

    const getResponse = await request({ port: address.port, method: "GET", path: "/" });
    assert.equal(getResponse.statusCode, 200);
    assert.equal(getResponse.headers["x-content-type-options"], "nosniff");
    assert.match(getResponse.headers["content-security-policy"], /default-src 'self'/);

    const resumeResponse = await request({ port: address.port, method: "GET", path: "/resume/resume.md" });
    assert.equal(resumeResponse.statusCode, 200);
    assert.match(resumeResponse.headers["content-type"], /text\/markdown/);

    const postResponse = await request({ port: address.port, method: "POST", path: "/" });
    assert.equal(postResponse.statusCode, 405);
    assert.equal(postResponse.headers.allow, "GET, HEAD");
  } finally {
    server.close();
    await once(server, "close").catch(() => {});
    await rm(root, { recursive: true, force: true });
  }
});

function request(options) {
  return new Promise((resolve, reject) => {
    const request = http.request({ host: "127.0.0.1", ...options }, (response) => {
      response.resume();
      response.once("end", () => resolve(response));
    });
    request.once("error", reject);
    request.end();
  });
}
