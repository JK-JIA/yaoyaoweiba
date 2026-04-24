#!/usr/bin/env bash
# 在服务器项目根目录执行：拉代码并无缓存重建（否则浏览器仍是旧 JS）
# GitHub Webhook 使用独立 compose：deploy/webhook/，本脚本不构建/启动 webhook。
set -euo pipefail
cd "$(dirname "$0")/.."
git pull
# Docker 只读取 .env，不读取 .env.example；若无 .env 请先：cp .env.example .env
export NEXT_PUBLIC_BUILD_TAG="${NEXT_PUBLIC_BUILD_TAG:-$(date +%Y%m%d-%H%M)}"
docker compose build --no-cache web api
docker compose up -d
echo "Done. 请在浏览器对管理页 Ctrl+Shift+R 硬刷新；构建标记见页面底部。"
