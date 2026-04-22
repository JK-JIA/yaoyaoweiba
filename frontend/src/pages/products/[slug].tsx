import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { fetchProductsFromApi } from "@/lib/api";
import { getAllProducts } from "@/lib/products";
import { Product } from "@/types/product";

export default function ProductDetailPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>(getAllProducts());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductsFromApi()
      .then(setProducts)
      .catch(() => setProducts(getAllProducts()))
      .finally(() => setLoading(false));
  }, []);

  const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : router.query.slug;
  const product = useMemo(
    () => products.find((item) => item.slug === slug),
    [products, slug]
  );

  if (!router.isReady || loading) {
    return (
      <section className="container-main py-12">
        <p className="text-stone-600">加载中…</p>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="container-main py-12">
        <p className="text-stone-600">未找到该商品。</p>
      </section>
    );
  }

  return (
    <>
      <Head>
        <title>{`${product.name} | 摇摇尾巴`}</title>
        <meta name="description" content={product.shortDescription} />
      </Head>
      <section className="container-main py-12">
        <div className="grid gap-8 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-2">
          <img src={product.image} alt={product.name} className="h-80 w-full rounded-2xl object-cover" />
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-3 text-2xl font-semibold text-brand-700">{product.price}</p>
            <p className="mt-4 text-stone-600">{product.details}</p>
            <p className="mt-4 text-sm text-stone-700">
              <span className="font-semibold">适用犬型：</span>
              {product.fitFor}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-stone-600">
              {product.specs.map((spec) => (
                <li key={spec}>{spec}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => addItem(product)}
                className="rounded-full border border-brand-500 px-5 py-3 font-semibold text-brand-700 hover:bg-brand-50"
              >
                加入购物车
              </button>
              <Link
                href="/contact"
                className="inline-block rounded-full bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-700"
              >
                咨询购买
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
