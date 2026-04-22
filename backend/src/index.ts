import cors from "cors";
import express from "express";
import { readProducts, writeProducts } from "./store";
import { Product } from "./types";

const app = express();
const port = Number(process.env.PORT || 4000);
const adminPassword = process.env.ADMIN_PASSWORD || "yaoyaoweiba123";

/** 生产环境仅使用 FRONTEND_URL（可逗号分隔多个）；开发环境额外放行本机前端端口 */
function buildCorsOrigins(): string[] {
  const fromEnv = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    return fromEnv.length > 0 ? fromEnv : ["http://127.0.0.1:3000"];
  }
  const devFallback = ["http://127.0.0.1:3000", "http://localhost:3000"];
  return Array.from(new Set([...fromEnv, ...devFallback]));
}

const corsOrigins = buildCorsOrigins();

app.use(
  cors({
    origin: corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins,
    methods: ["GET", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Admin-Token"]
  })
);
app.use(express.json({ limit: "15mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/products", (_req, res) => {
  res.json(readProducts());
});

app.put("/api/products", (req, res) => {
  const token = req.header("x-admin-token");
  if (!token || token !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const body = req.body as unknown;
  if (!Array.isArray(body)) {
    res.status(400).json({ error: "Body must be a JSON array of products" });
    return;
  }
  try {
    const saved = writeProducts(body as Product[]);
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: "Failed to save products" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on http://0.0.0.0:${port}`);
});
