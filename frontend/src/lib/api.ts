import { Product } from "@/types/product";

function getBrowserBase() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
}

export function getServerApiBase() {
  return process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
}

export async function fetchProductsFromApi(): Promise<Product[]> {
  const base = typeof window === "undefined" ? getServerApiBase() : getBrowserBase();
  const response = await fetch(`${base}/api/products`);
  if (!response.ok) {
    throw new Error("Failed to load products");
  }
  return (await response.json()) as Product[];
}

export async function saveProductsToApi(products: Product[], adminToken: string): Promise<Product[]> {
  const base = getBrowserBase();
  const response = await fetch(`${base}/api/products`, {
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
