import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const defaultRoot = path.dirname(fileURLToPath(import.meta.url));
const defaultResumeRoot = path.resolve(defaultRoot, "..", "resume");
const defaultPort = Number(process.env.PORT || 4173);
const defaultHost = process.env.HOST || "127.0.0.1";
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
};
const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
};

export function resolveRequestFile(
  requestUrl,
  rootDirectory = defaultRoot,
  resumeDirectory = defaultResumeRoot,
) {
  const root = path.resolve(rootDirectory);
  const resumeRoot = path.resolve(resumeDirectory);
  let parsed;
  let pathname;

  try {
    parsed = new URL(requestUrl || "/", "http://portfolio.local");
    pathname = parsed.pathname === "/" ? "/index.html" : decodeURIComponent(parsed.pathname);
  } catch {
    return { status: 400, filePath: null };
  }

  const isResumeRequest = pathname.startsWith("/resume/");
  const selectedRoot = isResumeRequest ? resumeRoot : root;
  const selectedPathname = isResumeRequest ? pathname.slice("/resume".length) : pathname;
  const filePath = path.resolve(selectedRoot, `.${selectedPathname}`);
  const relativePath = path.relative(selectedRoot, filePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return { status: 403, filePath: null };
  }

  return { status: 200, filePath };
}

export function createPortfolioServer({
  root = defaultRoot,
  resumeRoot = path.resolve(root, "..", "resume"),
} = {}) {
  return http.createServer(async (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, {
        ...securityHeaders,
        "Allow": "GET, HEAD",
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.end("Method not allowed");
      return;
    }

    const resolved = resolveRequestFile(request.url, root, resumeRoot);
    if (!resolved.filePath) {
      response.writeHead(resolved.status, {
        ...securityHeaders,
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.end(resolved.status === 403 ? "Forbidden" : "Bad request");
      return;
    }

    try {
      const file = await readFile(resolved.filePath);
      response.writeHead(200, {
        ...securityHeaders,
        "Content-Type": contentTypes[path.extname(resolved.filePath)] || "application/octet-stream",
      });
      response.end(request.method === "HEAD" ? undefined : file);
    } catch {
      response.writeHead(404, {
        ...securityHeaders,
        "Content-Type": "text/plain; charset=utf-8",
      });
      response.end("Not found");
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const server = createPortfolioServer();
  server.listen(defaultPort, defaultHost, () => {
    console.log(`Portfolio site: http://${defaultHost}:${defaultPort}`);
  });
}
