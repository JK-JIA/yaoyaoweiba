import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { categoryMeta } from "@/data/products";
import { fetchProductsFromApi } from "@/lib/api";
import { getAllProducts } from "@/lib/products";
import { Category, Product } from "@/types/product";

export default function CategoryPage() {
  const router = useRouter();
  const category = router.query.slug as Category;
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProductsFromApi()
      .then(setAllProducts)
      .catch(() => setAllProducts(getAllProducts()));
  }, []);

  const products = useMemo(
    () => allProducts.filter((item) => item.category === category),
    [allProducts, category]
  );
  if (!router.isReady) {
    return (
      <section className="container-main py-12">
        <p className="text-stone-600">加载中…</p>
      </section>
    );
  }

  const meta = categoryMeta[category];
  if (!meta) {
    return (
      <section className="container-main py-12">
        <p className="text-stone-600">未找到该品类。</p>
      </section>
    );
  }

  return (
    <>
      <Head>
        <title>{`${meta.name} | 摇摇尾巴`}</title>
        <meta name="description" content={meta.description} />
      </Head>
      <section className="container-main py-12">
        <h1 className="text-3xl font-bold">{meta.name}</h1>
        <p className="mt-3 text-stone-600">{meta.description}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </>
  );
}
