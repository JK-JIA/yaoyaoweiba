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

## API 说明

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/products` | 获取商品列表 |
| PUT | `/api/products` | 全量保存商品，请求头 `X-Admin-Token: <ADMIN_PASSWORD>` |

购物车数据仅存于**浏览器端存储**，不经过后端。
