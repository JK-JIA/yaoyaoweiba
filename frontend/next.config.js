/** @type {import('next').NextConfig} */

/** 构建时用于 rewrites：把浏览器请求的 /api/* 转到真实后端（Docker 内为 http://api:4000） */
const backendForProxy =
  process.env.BACKEND_URL_FOR_PROXY ||
  process.env.API_INTERNAL_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:4000";

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const base = String(backendForProxy).replace(/\/$/, "");
    return [
      {
        source: "/api/:path*",
        destination: `${base}/api/:path*`
      }
    ];
  }
};

module.exports = nextConfig;
