import fs from "fs";
import path from "path";
import { defaultProducts } from "./defaultProducts";
import { Product } from "./types";

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
const filePath = path.join(dataDir, "products.json");

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function ensureUniqueSlug(base: string, used: Set<string>) {
  let next = base || `product-${Date.now()}`;
  let suffix = 1;
  while (used.has(next)) {
    next = `${base || "product"}-${suffix}`;
    suffix += 1;
  }
  used.add(next);
  return next;
}

function normalizeProductImages(item: Product): Pick<Product, "image" | "images"> {
  const fromGallery =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images.map((url) => (typeof url === "string" ? url.trim() : "")).filter(Boolean)
      : [];
  const single = typeof item.image === "string" ? item.image.trim() : "";
  const merged = fromGallery.length > 0 ? fromGallery : single ? [single] : [];
  const image = merged[0] || "";
  const images = merged.length > 1 ? merged : undefined;
  return { image, images };
}

function sanitizeProducts(input: Product[]): Product[] {
  const used = new Set<string>();
  return input.map((item, index) => {
    const fallbackName = item.name || `product-${index + 1}`;
    const slugBase = toSlug(item.slug || fallbackName);
    const slug = ensureUniqueSlug(slugBase || `product-${index + 1}`, used);
    const { image, images } = normalizeProductImages(item);
    return {
      ...item,
      id: item.id || `${Date.now()}-${index}`,
      slug,
      image,
      images
    };
  });
}

export function readProducts(): Product[] {
  try {
    if (!fs.existsSync(filePath)) {
      return sanitizeProducts([...defaultProducts]);
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return sanitizeProducts([...defaultProducts]);
    }
    return sanitizeProducts(parsed);
  } catch {
    return sanitizeProducts([...defaultProducts]);
  }
}

export function writeProducts(products: Product[]) {
  fs.mkdirSync(dataDir, { recursive: true });
  const safe = sanitizeProducts(products);
  fs.writeFileSync(filePath, JSON.stringify(safe, null, 2), "utf-8");
  return safe;
}
