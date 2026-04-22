FROM docker.m.daocloud.io/library/node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
# 浏览器留空则走同域 /api（见 next.config.js rewrites），部署后勿写 localhost
ARG NEXT_PUBLIC_API_URL=
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
# 构建 rewrites 用：Compose 里传 http://api:4000；本地构建默认本机后端
ARG BACKEND_URL_FOR_PROXY=http://127.0.0.1:4000
ENV BACKEND_URL_FOR_PROXY=$BACKEND_URL_FOR_PROXY
ARG NEXT_PUBLIC_ADMIN_PASSWORD=yaoyaoweiba123
ENV NEXT_PUBLIC_ADMIN_PASSWORD=$NEXT_PUBLIC_ADMIN_PASSWORD
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
