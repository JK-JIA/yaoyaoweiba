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

默认监听 `http://localhost:4000`。环境变量：

- `ADMIN_PASSWORD`：管理保存接口密码（默认 `yaoyaoweiba123`）
- `FRONTEND_URL`：CORS 允许的站点（默认 `http://localhost:3000`）

**2）启动前端**

```bash
cd frontend
npm install
npm run dev
```

环境变量（可选）：

- `NEXT_PUBLIC_API_URL`：浏览器访问的 API 根地址（默认 `http://localhost:4000`）
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

在项目根目录：

```bash
docker compose up --build
```

- 前端：<http://localhost:3000>（页面内请求走 **同域 `/api`**，由 Next 反代到 `api` 容器，**不要**在浏览器里写 `localhost:4000`）  
- 后端（宿主机直连调试用）：<http://localhost:4000>  
- 商品数据卷：`api_data`（容器内 `/app/data`）

修改管理员密码时，请同时设置构建参数与后端环境（示例 `.env`）：

```env
ADMIN_PASSWORD=你的强密码
# 留空：浏览器使用当前站点 /api，由前端容器反代到 api:4000（推荐）
NEXT_PUBLIC_API_URL=
FRONTEND_URL=http://localhost:3000
```

线上若有域名，请把 `FRONTEND_URL` 设为实际站点地址（与浏览器访问一致），以便后端 CORS 在需要时放行。使用 Nginx 时：要么 **`/api` 反代到后端**，要么 **`/api` 仍交给 Next** 由容器内 rewrites 转发，二选一即可；**切勿**把前端里的 `NEXT_PUBLIC_API_URL` 设为 `http://localhost:4000`（浏览器会连用户自己电脑）。

`docker compose` 会使用 `ADMIN_PASSWORD` 作为前端镜像构建参数 `NEXT_PUBLIC_ADMIN_PASSWORD`，保证登录校验与保存接口一致。

## API 说明

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| GET | `/api/products` | 获取商品列表 |
| PUT | `/api/products` | 全量保存商品，请求头 `X-Admin-Token: <ADMIN_PASSWORD>` |

购物车仍为浏览器 `localStorage`，不经过后端。
