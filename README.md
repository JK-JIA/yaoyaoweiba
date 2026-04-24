# 摇摇尾巴（前后端分离）

- `frontend/`：Next.js 官网与管理后台页面  
- `backend/`：Express 商品 API（`GET/PUT /api/products`），数据持久化到 `data/products.json`（Docker 卷）

## 本地开发（不用 Docker）

**1）启动后端**

```bash
cd backend
npm install
npm run dev
```

默认监听 **`http://127.0.0.1:4000`**（与 `PORT` 一致）。环境变量：

- `ADMIN_PASSWORD`：管理保存接口密码（默认 `yaoyaoweiba123`）
- `FRONTEND_URL`：CORS 允许的站点；可逗号分隔多个；不设时开发模式会包含本机常用前端 Origin

**2）启动前端**

```bash
cd frontend
npm install
npm run dev
```

环境变量（可选）：

- `NEXT_PUBLIC_API_URL`：留空时浏览器走 **同域 `/api`**（`next dev` 会反代到 `127.0.0.1:4000`）；仅在同域反代不可用时再填完整 API 根地址  
- `API_INTERNAL_URL`：仅服务端请求用（本地一般可不设）  
- `NEXT_PUBLIC_ADMIN_PASSWORD`：需与后端 `ADMIN_PASSWORD` 一致，否则登录后保存会 401

## 减小上传体积（不要整目录打包 1GB+）

体积主要来自 **`node_modules`**、**`frontend/.next`**、误在**仓库根**运行的 **`node_modules` / `.next`**。这些应在服务器或 Docker 构建时再生成，不要随源码上传。

推荐做法（任选）：

1. **Git**：只 `git push`，服务器 `git pull` 后分别在 `frontend`、`backend` 执行 `npm ci`（或 `docker compose build`）。  
2. **必须 zip 上传时**：在项目根执行  
   `powershell -ExecutionPolicy Bypass -File .\scripts\make-deploy-bundle.ps1`  
   会在根目录生成 `yaoyaoweiba-site-deploy-时间戳.zip`（仅源码与配置，不含上述大目录）。  
3. **本地一键清理大目录**（删后需重新 `npm ci`）：  
   `powershell -ExecutionPolicy Bypass -File .\scripts\prune-heavy-folders.ps1`  
   会移除根目录及 `frontend` / `backend` 下的 `node_modules`、`.next`、`dist` 等。  
4. **手动**：勿在仓库根执行 `npm install`；若已有根目录 `node_modules`、`.next`、`.npm-cache`，可直接删除。

## Docker Compose（同一台机器）

**重要**：Compose 只会自动读取项目根目录的 **`.env`**，**不会**读取 `.env.example`。部署前请执行：

```bash
cp .env.example .env
# 再编辑 .env，至少设置 FRONTEND_URL 为你的 https 域名
```

在项目根目录：

```bash
docker compose up --build
```

**服务器上 `git pull` 之后**：只执行 `docker compose up -d` **不会**用新代码重建镜像，浏览器仍是旧版。请执行：

```bash
docker compose build web && docker compose up -d
```

或使用：`bash scripts/deploy-update.sh`

若仍异常，可强制无缓存构建：`docker compose build --no-cache web && docker compose up -d`

- 前端（宿主机）：**`http://127.0.0.1:3000`**（页面内请求走 **同域 `/api`**，由 Next 反代到 `api` 容器）  
- 后端（宿主机直连调试用）：**`http://127.0.0.1:4000`**  
- 商品数据卷：`api_data`（容器内 `/app/data`）

**生产环境**：在项目根创建 `.env`（可参考 `.env.example`），至少设置：

```env
ADMIN_PASSWORD=你的强密码
NEXT_PUBLIC_API_URL=
FRONTEND_URL=https://你的实际域名
```

`FRONTEND_URL` 必须与浏览器地址栏的 **协议 + 域名（+ 非默认端口）** 完全一致；多个前台域名用英文逗号分隔。后端在 `NODE_ENV=production` 时 **只信任** `FRONTEND_URL` 列出的 Origin（外加未配置时的兜底，见代码）。

使用 Nginx 时：`/api` 交给 Next（由容器内 rewrites 转发）或 **`/api` 直接反代到后端** 均可；**切勿**在公网前端构建里把 `NEXT_PUBLIC_API_URL` 写成指向访客本机的回环地址。

`docker compose` 会使用 `ADMIN_PASSWORD` 作为前端镜像构建参数 `NEXT_PUBLIC_ADMIN_PASSWORD`，保证登录校验与保存接口一致。

## GitHub Webhook 自动部署（阿里云 Ubuntu，方案二）

推送 `main` 后由 GitHub 调用你服务器上的 HTTPS 地址，本机进程校验签名后**后台**执行 `scripts/deploy-update.sh`（先返回 202，避免 GitHub 10 秒超时）。

### 独立目录（与主栈分离）

Webhook 使用 **[`deploy/webhook/`](deploy/webhook/)** 下单独的 `docker-compose.yml`，与仓库根目录的 **`web` / `api` 主 compose 分离**。这样执行 `scripts/deploy-update.sh` 时**只会**构建/拉起 `web`、`api`，**不会**顺带构建或等待 Webhook，耗时更可控。

说明与命令见 **[`deploy/webhook/README.md`](deploy/webhook/README.md)**；环境变量模板：**[`deploy/webhook/env.example`](deploy/webhook/env.example)**（复制为同目录 `.env.webhook`）。

### 公网 IP 能否不写域名

- **不能只写 `http://公网IP/...`**：在 github.com 上添加 Webhook 时，一般**必须使用 HTTPS**（HTTP 公网地址通常无法通过或会被拒）。
- **`https://公网IP/...` 可以填进 GitHub**，但浏览器/GitHub 会校验证书：公网受信任 CA **几乎不给裸 IP 签发证书**，所以实际很难比「**域名 A 记录 → 你的 IP + Let’s Encrypt**」更简单。
- **仅临时测试**：可对 IP 做自签 HTTPS，并在 GitHub Webhook 里**关闭 SSL verification**（不安全，不建议生产）。

### 启动方式（Docker 推荐）

```bash
cd deploy/webhook
cp env.example .env.webhook
# 编辑 .env.webhook（至少 GITHUB_WEBHOOK_SECRET）
docker compose build
docker compose up -d
curl -sS http://127.0.0.1:8787/health
```

**systemd（Docker）**：将 [`scripts/github-webhook-deploy.service`](scripts/github-webhook-deploy.service) 中 `WorkingDirectory` 改为你的仓库路径下的 `deploy/webhook`，再 `systemctl enable --now`（`ExecStart` 使用 `docker compose up github-webhook` 前台运行，便于自动重启）。

**备选：宿主机直接跑 Node（需 Node 18+）**：在仓库根 `set -a && source deploy/webhook/.env.webhook && set +a && node scripts/github-webhook-deploy.mjs`。unit 示例见 [`scripts/github-webhook-deploy.node.service.example`](scripts/github-webhook-deploy.node.service.example)。

**安全**：Webhook 容器挂载 **`/var/run/docker.sock`**，等同高权限操作宿主 Docker；**Secret** 须足够强，**8787** 建议只给本机 + Nginx，勿对公网裸暴露。

### Nginx 对外 HTTPS

将 [`deploy/webhook/nginx-snippet.conf`](deploy/webhook/nginx-snippet.conf) 中的 `location` 块加入你已有 **HTTPS** 的 `server { }`（域名证书建议 Let’s Encrypt）。`proxy_pass` 指向 **`http://127.0.0.1:8787`**（与 `deploy/webhook/docker-compose.yml` 默认端口映射一致）。

### 在 GitHub 添加 Webhook

仓库 **Settings → Webhooks → Add webhook**：

- **Payload URL**：`https://你的域名/github/webhook`（与 `GITHUB_WEBHOOK_PATH` 一致）
- **Content type**：`application/json`
- **Secret**：与 `GITHUB_WEBHOOK_SECRET` **完全一致**
- **Events**：仅 **Just the push event**（或 Individual events 里勾选 push）

保存后可用 **Redeliver** 测一次；非 `main` 的 push 会返回 `ignored`；成功触发部署时响应 **`accepted`**（202），详细日志在仓库目录 `logs/webhook-deploy.log`。

### 与 GitHub Actions SSH 部署的关系

若仓库里启用了 [`.github/workflows/deploy-aliyun.yml`](.github/workflows/deploy-aliyun.yml)（SSH 方案），可与 Webhook **二选一**或并存（会重复构建）；仅用 Webhook 时建议把该 workflow 改为仅 `workflow_dispatch` 或删除。

## API 说明

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/products` | 获取商品列表 |
| PUT | `/api/products` | 全量保存商品，请求头 `X-Admin-Token: <ADMIN_PASSWORD>` |

购物车数据仅存于**浏览器端存储**，不经过后端。
