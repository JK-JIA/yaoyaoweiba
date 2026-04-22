import { categoryMeta, products } from "@/data/products";
import { Category, Product } from "@/types/product";

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
