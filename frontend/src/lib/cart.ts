import { Product } from "@/types/product";
import { CartItem } from "@/types/cart";

const CART_KEY = "yaoyaoweiba_cart";

/** 主价格在「/」前，避免「¥239 / 2.5kg」把规格里的 2.5 拼进金额变成 2392.5。 */
export function parsePrice(price: string): number {
  const head = price.split("/")[0] ?? price;
  const normalized = head.replace(/[^0-9.]/g, "");
  return Number.parseFloat(normalized) || 0;
}

export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function setStoredCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function toCartItem(product: Product): CartItem {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.image,
    quantity: 1
  };
}
