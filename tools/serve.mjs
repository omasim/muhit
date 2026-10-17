import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve, dirname, sep, extname } from "node:path";
import { fileURLToPath } from "node:url";

// Development-only server. It binds to this computer, not the public network.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4393);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error("PORT 1 ile 65535 arasında bir tam sayı olmalı.");
  process.exit(1);
}
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ttf": "font/ttf",
  ".pdf": "application/pdf",
  ".md": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};
const server = http.createServer(async (req, res) => {
  if (!["GET", "HEAD"].includes(req.method)) {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end("Method not allowed");
    return;
  }
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (
      pathname.includes("\0") ||
      pathname.split(/[\\/]/).some((part) => part.startsWith("."))
    ) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    let target = resolve(root, "." + pathname);
    if (target !== root && !target.startsWith(root + sep)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    let info = await stat(target);
    if (info.isDirectory()) {
      target = resolve(target, target === root ? "index.html" : "index.html");
      info = await stat(target);
    }
    if (!info.isFile()) throw new Error("Not a file");
    res.writeHead(200, {
      "Content-Type": mime[extname(target)] || "application/octet-stream",
      "Content-Length": info.size,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    const stream = createReadStream(target);
    stream.on("error", () => res.destroy());
    stream.pipe(res);
  } catch (error) {
    if (error instanceof URIError) {
      res.writeHead(400);
      res.end("Bad request");
    } else {
      res.writeHead(404);
      res.end("Dosya bulunamadı.");
    }
  }
});
server.on("error", (error) => {
  console.error(
    error.code === "EADDRINUSE"
      ? `Port ${port} kullanımda. PORT değişkeniyle başka bir port seçin.`
      : error.message,
  );
  process.exit(1);
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Muhit arayüz sistemi: http://127.0.0.1:${port}/`),
);
