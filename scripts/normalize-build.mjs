import { cp, mkdir, readdir, rename, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const client = path.join(dist, "client");
const server = path.join(dist, "server");

await mkdir(path.join(client, "assets"), { recursive: true });
await cp(path.join(root, "assets"), path.join(client, "assets"), { recursive: true });
await cp(path.join(root, "script.js"), path.join(client, "script.js"));

const entries = await readdir(dist, { withFileTypes: true });
const workerDirectory = entries.find(
  (entry) => entry.isDirectory() && ![".openai", "client", "server"].includes(entry.name),
);

if (!workerDirectory) {
  throw new Error("Cloudflare worker build directory was not found.");
}

await rm(server, { recursive: true, force: true });
await rename(path.join(dist, workerDirectory.name), server);
