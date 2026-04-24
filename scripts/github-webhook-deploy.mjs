#!/usr/bin/env node
/**
 * GitHub Webhook → 异步执行 scripts/deploy-update.sh（方案二）
 *
 * 环境变量（推荐 deploy/webhook/.env.webhook + systemd EnvironmentFile 加载）：
 *   GITHUB_WEBHOOK_SECRET  必填，与 GitHub Webhook 里填的 Secret 一致
 *   GITHUB_WEBHOOK_PORT    默认 8787
 *   GITHUB_WEBHOOK_HOST    默认 127.0.0.1（仅本机；前面用 Nginx 反代 TLS）
 *   GITHUB_WEBHOOK_PATH    默认 /github/webhook（须与 GitHub 里填的 URL 路径一致）
 *   GITHUB_WEBHOOK_BRANCH  默认 main，仅该分支 push 会触发部署
 *   GITHUB_WEBHOOK_REPO    可选，形如 owner/repo，限制只有该仓库能触发
 *
 * 收到合法 push 后返回 202，部署在后台跑，避免 GitHub 10s 超时。
 */
import http from "node:http";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = process.env.WEBHOOK_REPO_ROOT
  ? path.resolve(process.env.WEBHOOK_REPO_ROOT)
  : path.resolve(__dirname, "..");

const SECRET = process.env.GITHUB_WEBHOOK_SECRET || "";
const PORT = Number(process.env.GITHUB_WEBHOOK_PORT || "8787", 10);
const HOST = process.env.GITHUB_WEBHOOK_HOST || "127.0.0.1";
const HOOK_PATH = process.env.GITHUB_WEBHOOK_PATH || "/github/webhook";
const BRANCH = process.env.GITHUB_WEBHOOK_BRANCH || "main";
const REPO_FULL = (process.env.GITHUB_WEBHOOK_REPO || "").trim();

if (!SECRET) {
  console.error("github-webhook-deploy: 请设置环境变量 GITHUB_WEBHOOK_SECRET");
  process.exit(1);
}

function verifySignature(rawBody, sigHeader) {
  if (!sigHeader || typeof sigHeader !== "string" || !sigHeader.startsWith("sha256=")) {
    return false;
  }
  const theirs = sigHeader.slice("sha256=".length);
  const ours = crypto.createHmac("sha256", SECRET).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(theirs, "hex"), Buffer.from(ours, "hex"));
  } catch (_e) {
    return false;
  }
}

function shouldDeploy(bodyStr) {
  let payload;
  try {
    payload = JSON.parse(bodyStr);
  } catch (_e) {
    return false;
  }
  if (REPO_FULL) {
    const repo = payload.repository;
    const fullName = repo && repo.full_name;
    if (fullName !== REPO_FULL) {
      return false;
    }
  }
  if (payload.ref !== `refs/heads/${BRANCH}`) {
    return false;
  }
  return true;
}

function runDeploy() {
  const logDir = path.join(REPO_ROOT, "logs");
  fs.mkdirSync(logDir, { recursive: true });
  const logPath = path.join(logDir, "webhook-deploy.log");
  const logFd = fs.openSync(logPath, "a");
  const stamp = new Date().toISOString();
  fs.writeSync(logFd, `\n--- ${stamp} webhook → deploy-update.sh ---\n`);
  const scriptPath = path.join(REPO_ROOT, "scripts", "deploy-update.sh");
  if (!fs.existsSync(scriptPath)) {
    fs.writeSync(logFd, `ERROR: missing ${scriptPath}\n`);
    fs.closeSync(logFd);
    return;
  }
  const child = spawn("bash", [scriptPath], {
    cwd: REPO_ROOT,
    detached: true,
    stdio: ["ignore", logFd, logFd]
  });
  child.on("error", (err) => {
    try {
      fs.writeSync(logFd, `spawn error: ${err.message}\n`);
    } catch (_e) {
      /* ignore */
    }
  });
  child.unref();
}

function pathnameOnly(url) {
  try {
    return new URL(url || "/", "http://localhost").pathname;
  } catch (_e) {
    return "";
  }
}

const server = http.createServer((req, res) => {
  const pathname = pathnameOnly(req.url);

  if (req.method === "GET" && pathname === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }).end("ok");
    return;
  }

  if (req.method !== "POST" || pathname !== HOOK_PATH) {
    res.writeHead(404).end();
    return;
  }

  const chunks = [];
  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const raw = Buffer.concat(chunks);
    const sig = req.headers["x-hub-signature-256"];
    if (!verifySignature(raw, sig)) {
      res.writeHead(401, { "Content-Type": "text/plain; charset=utf-8" }).end("invalid signature");
      return;
    }
    const bodyStr = raw.toString("utf8");
    if (!shouldDeploy(bodyStr)) {
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }).end("ignored");
      return;
    }
    runDeploy();
    res.writeHead(202, { "Content-Type": "text/plain; charset=utf-8" }).end("accepted");
  });
});

server.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`github-webhook-deploy: http://${HOST}:${PORT}${HOOK_PATH} (GET /health)`);
});
