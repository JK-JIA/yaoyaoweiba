import { categoryMeta, products } from "@/data/products";
import { Category, Product } from "@/types/product";

/**
 * Heavier discovery (faceted PLP filters, SKU pickers on cards, wishlist / recently viewed)
 * stays deferred until the catalog grows. The home page offers lightweight substring search.
 */

export function getProductImages(product: Product): string[] {
  const fromGallery = product.images?.map((url) => url.trim()).filter(Boolean) ?? [];
  if (fromGallery.length > 0) {
    return fromGallery;
  }
  const single = product.image?.trim();
  return single ? [single] : [];
}

export function getProductCoverImage(product: Product): string {
  return getProductImages(product)[0] ?? "";
}

/** Home / client-side search: name, slug, copy, specs, price, category label; space-separated tokens must all match. */
export function productMatchesSearch(product: Product, rawQuery: string): boolean {
  const trimmed = rawQuery.trim().toLowerCase();
  if (!trimmed) return false;
  const meta = categoryMeta[product.category];
  const parts = [
    product.name,
    product.slug,
    product.shortDescription,
    product.details,
    product.fitFor,
    product.price,
    ...product.specs,
    meta?.name ?? "",
    meta?.description ?? ""
  ];
  const haystack = parts.join(" ").toLowerCase();
  const tokens = trimmed.split(/\s+/).filter(Boolean);
  return tokens.every((token) => haystack.includes(token));
}

export const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const ensureUniqueSlug = (base: string, used: Set<string>) => {
  let next = base || `product-${Date.now()}`;
  let suffix = 1;
  while (used.has(next)) {
    next = `${base || "product"}-${suffix}`;
    suffix += 1;
  }
  used.add(next);
  return next;
};

export const getAllProducts = () => products;

export const getProductBySlug = (slug: string) => products.find((product) => product.slug === slug);

export const getProductsByCategory = (category: Category) =>
  products.filter((product) => product.category === category);

export const getCategoryMeta = (category: Category) => categoryMeta[category];

export const categories = Object.keys(categoryMeta) as Category[];
