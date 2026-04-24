import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

export default function FloatingCart() {
  const [open, setOpen] = useState(false);
  const { items, totalCount, totalPrice, updateQuantity } = useCart();

  return (
    <div
      className="fixed z-50"
      style={{
        bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))",
        right: "max(1.25rem, env(safe-area-inset-right, 0px))"
      }}
    >
      {open && (
        <div className="mb-3 w-[min(20rem,calc(100vw-1.5rem))] max-w-[calc(100vw-2rem)] rounded-2xl border border-amber-100 bg-white p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-stone-800">购物车状态</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-stone-500 hover:text-stone-700"
            >
              关闭
            </button>
          </div>
          {items.length === 0 ? (
            <p className="mt-3 text-sm text-stone-600">购物车为空，先去选购商品吧。</p>
          ) : (
            <>
              <div className="mt-3 max-h-56 space-y-2 overflow-auto">
                {items.map((item) => (
                  <div key={item.slug} className="rounded-lg bg-amber-50 p-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-stone-600">
                        {item.price} x {item.quantity}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                        className="rounded-full border border-amber-200 px-2 py-0.5 text-sm"
                      >
                        -
                      </button>
                      <span className="text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                        className="rounded-full border border-amber-200 px-2 py-0.5 text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm text-stone-700">
                共 {totalCount} 件，合计 <span className="font-semibold text-brand-700">¥{totalPrice.toFixed(2)}</span>
              </p>
            </>
          )}
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="mt-4 inline-block w-full rounded-full bg-brand-500 py-2 text-center text-sm font-semibold text-white hover:bg-brand-700"
          >
            打开购物车
          </Link>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-500 text-2xl text-white shadow-lg hover:bg-brand-700"
        aria-label="打开购物车状态"
      >
        🛒
        {totalCount > 0 && (
          <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
            {totalCount}
          </span>
        )}
      </button>
    </div>
  );
}
