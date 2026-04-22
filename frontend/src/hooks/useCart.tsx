import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { getStoredCart, parsePrice, setStoredCart, toCartItem } from "@/lib/cart";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  addItem: (product: Product) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getStoredCart());
  }, []);

  useEffect(() => {
    setStoredCart(items);
  }, [items]);

  const totalCount = useMemo(
    () => items.reduce((accumulator, item) => accumulator + item.quantity, 0),
    [items]
  );
  const totalPrice = useMemo(
    () => items.reduce((accumulator, item) => accumulator + parsePrice(item.price) * item.quantity, 0),
    [items]
  );

  const addItem = (product: Product) => {
    setItems((previous) => {
      const existing = previous.find((item) => item.slug === product.slug);
      if (existing) {
        return previous.map((item) =>
          item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...previous, toCartItem(product)];
    });
  };

  const removeItem = (slug: string) => {
    setItems((previous) => previous.filter((item) => item.slug !== slug));
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(slug);
      return;
    }
    setItems((previous) => previous.map((item) => (item.slug === slug ? { ...item, quantity } : item)));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, totalCount, totalPrice, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
