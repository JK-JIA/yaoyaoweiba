import { Product } from "@/types/product";

/**
 * 浏览器端 API 根地址。
 * - 未设置或为空：使用相对路径（同域 /api/*），由 next.config.js rewrites 转到后端，适合部署。
 * - 设置为完整 URL：直连该地址（需后端 CORS 放行）。
 */
function getBrowserBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL;
  if (raw === undefined || raw === null) return "";
  const trimmed = String(raw).trim();
  if (trimmed === "" || trimmed === "same") return "";
  return trimmed.replace(/\/$/, "");
}

/** 仅服务端（SSR）请求：优先内网地址，避免 Docker 内误用 localhost */
export function getServerApiBase() {
  const internal = process.env.API_INTERNAL_URL?.trim();
  if (internal) return internal.replace(/\/$/, "");
  const pub = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (pub) return pub.replace(/\/$/, "");
  return "http://127.0.0.1:4000";
}

function joinApi(path: string, base: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}

export async function fetchProductsFromApi(): Promise<Product[]> {
  const base = typeof window === "undefined" ? getServerApiBase() : getBrowserBase();
  const response = await fetch(joinApi("/api/products", base));
  if (!response.ok) {
    throw new Error("Failed to load products");
  }
  return (await response.json()) as Product[];
}

export async function saveProductsToApi(products: Product[], adminToken: string): Promise<Product[]> {
  const base = getBrowserBase();
  const response = await fetch(joinApi("/api/products", base), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Token": adminToken
    },
    body: JSON.stringify(products)
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Save failed");
  }
  return (await response.json()) as Product[];
}
