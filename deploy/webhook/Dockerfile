# Webhook 容器：内置 Node 20 + docker CLI + Compose 插件，无需在宿主机安装 Node。
# 需挂载：项目根 → /repo、/var/run/docker.sock；公网仓库 git pull 无需额外凭证。
FROM node:20-bookworm-slim

ARG DOCKER_CLI_VERSION=25.0.3
ARG COMPOSE_VERSION=2.24.5

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl git bash \
  && ARCH=$(uname -m) \
  && case "$ARCH" in \
       x86_64) DOCKER_ARCH=x86_64 ;; \
       aarch64) DOCKER_ARCH=aarch64 ;; \
       arm64) DOCKER_ARCH=aarch64 ;; \
       *) echo "unsupported arch: $ARCH"; exit 1 ;; \
     esac \
  && curl -fsSL "https://download.docker.com/linux/static/stable/${DOCKER_ARCH}/docker-${DOCKER_CLI_VERSION}.tgz" \
    | tar xz --strip-components=1 -C /usr/local/bin docker/docker \
  && mkdir -p /usr/local/lib/docker/cli-plugins \
  && curl -fsSL "https://github.com/docker/compose/releases/download/v${COMPOSE_VERSION}/docker-compose-linux-${DOCKER_ARCH}" \
    -o /usr/local/lib/docker/cli-plugins/docker-compose \
  && chmod +x /usr/local/lib/docker/cli-plugins/docker-compose /usr/local/bin/docker \
  && apt-get purge -y curl \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /repo
EXPOSE 8787

CMD ["node", "scripts/github-webhook-deploy.mjs"]
