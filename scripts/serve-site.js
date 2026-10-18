#!/usr/bin/env node
// Dependency-free local preview of the same static output deployed to Vercel.
import "./build-site.js";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, resolve, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../site/dist");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".sh": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    const path = resolve(
      root,
      `.${decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname)}`,
    );
    if (!path.startsWith(root + sep)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    const body = await readFile(path);
    response.writeHead(200, {
      "Content-Type": types[extname(path)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Lilt landing preview: http://localhost:${port}`),
);
