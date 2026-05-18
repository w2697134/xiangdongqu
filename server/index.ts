import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { createServer as createHttpsServer } from "node:https";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import aiConsultHandler from "../api/ai-consult.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "../..");
const distDir = resolve(rootDir, "dist");
const indexHtml = join(distDir, "index.html");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3000);
const httpsPort = process.env.HTTPS_PORT ? Number(process.env.HTTPS_PORT) : null;
const sslCertPath = process.env.SSL_CERT_PATH;
const sslKeyPath = process.env.SSL_KEY_PATH;

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function sendFile(filePath: string, statusCode = 200) {
  return {
    pipe(res: ServerResponse) {
      res.statusCode = statusCode;
      res.setHeader("Content-Type", contentTypes[extname(filePath).toLowerCase()] || "application/octet-stream");
      createReadStream(filePath).pipe(res);
    },
  };
}

function resolveStaticPath(pathname: string) {
  const decoded = decodeURIComponent(pathname);
  const safePath = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const filePath = resolve(distDir, `.${safePath}`);

  if (!filePath.startsWith(distDir)) {
    return null;
  }

  if (existsSync(filePath) && statSync(filePath).isFile()) {
    return filePath;
  }

  return null;
}

function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/ai-consult") {
    void aiConsultHandler(req, res);
    return;
  }

  const staticPath = resolveStaticPath(url.pathname);

  if (staticPath) {
    sendFile(staticPath).pipe(res);
    return;
  }

  if (existsSync(indexHtml)) {
    sendFile(indexHtml).pipe(res);
    return;
  }

  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("Not found");
}

const server = createServer(handleRequest);

server.listen(port, host, () => {
  console.log(`xiangdongqu server listening on http://${host}:${port}`);
});

if (httpsPort && sslCertPath && sslKeyPath) {
  const httpsServer = createHttpsServer(
    {
      cert: readFileSync(sslCertPath),
      key: readFileSync(sslKeyPath),
    },
    handleRequest,
  );

  httpsServer.listen(httpsPort, host, () => {
    console.log(`xiangdongqu server listening on https://${host}:${httpsPort}`);
  });
}
