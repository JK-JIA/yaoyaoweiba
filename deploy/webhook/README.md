# GitHub Webhook 独立 Compose

与仓库根目录的 `docker-compose.yml`（`web` / `api`）**分离**，避免每次执行 `scripts/deploy-update.sh` 时顺带构建或等待 Webhook 镜像。

## 准备

```bash
cd deploy/webhook
cp env.example .env.webhook
# 编辑 .env.webhook，至少设置 GITHUB_WEBHOOK_SECRET
```

若以前在仓库根目录有 `.env.webhook`，可迁移到本目录：`mv ../../.env.webhook .`（在 `deploy/webhook` 下执行时注意路径）。

需要把 **8787** 暴露到非本机时，编辑本目录 `docker-compose.yml` 里 `ports`（例如改为 `0.0.0.0:8787:8787`），仍建议生产用 Nginx 终止 TLS。

## 启动 / 停止

```bash
cd deploy/webhook
docker compose build
docker compose up -d
docker compose logs -f
```

停止：`docker compose down`

健康检查（宿主机）：`curl -sS http://127.0.0.1:8787/health`

## Nginx

见同目录 [`nginx-snippet.conf`](nginx-snippet.conf)。部署日志仍在仓库根 `logs/webhook-deploy.log`。

## 安全

容器挂载 `/var/run/docker.sock`，可控制宿主 Docker；Webhook Secret 须足够强。
