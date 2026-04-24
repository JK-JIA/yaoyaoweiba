import Head from "next/head";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart();

  return (
    <>
      <Head>
        <title>购物车 | 摇摇尾巴</title>
        <meta name="description" content="查看已选商品并完成结算确认。" />
      </Head>
      <section className="container-main py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold sm:text-3xl">购物车</h1>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="min-h-[44px] self-start rounded-full border border-red-300 px-4 py-2 text-sm text-red-600 sm:self-auto"
            >
              清空购物车
            </button>
          )}
        </div>
        {items.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-stone-600">购物车还是空的，去挑选一些毛孩子喜欢的商品吧。</p>
            <Link href="/" className="mt-4 inline-block rounded-full bg-brand-500 px-5 py-3 text-white">
              去逛逛
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.slug}
                  className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center"
                >
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-stone-50">
                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="text-sm text-brand-700">{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                      className="flex h-11 min-w-[44px] items-center justify-center rounded-full border px-3 text-lg leading-none"
                      aria-label="减少数量"
                    >
                      -
                    </button>
                    <span className="min-w-[2ch] text-center tabular-nums">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                      className="flex h-11 min-w-[44px] items-center justify-center rounded-full border px-3 text-lg leading-none"
                      aria-label="增加数量"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.slug)}
                      className="ml-3 text-sm text-red-600"
                    >
                      删除
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-lg font-semibold">结算信息</h3>
              <p className="mt-4 text-stone-600">
                合计：<span className="text-xl font-bold text-brand-700 sm:text-2xl">¥{totalPrice.toFixed(2)}</span>
              </p>
              <p className="mt-2 text-xs text-stone-500">当前为前端结算演示版本，支付功能后续接入。</p>
              <Link
                href="/contact"
                className="mt-4 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-brand-500 py-3 text-center font-semibold text-white"
              >
                去结算（咨询下单）
              </Link>
            </aside>
          </div>
        )}
      </section>
    </>
  );
}
