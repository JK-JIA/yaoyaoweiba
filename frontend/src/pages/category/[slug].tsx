import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import ProductSearchField from "@/components/ProductSearchField";
import { categoryMeta } from "@/data/products";
import { fetchProductsFromApi } from "@/lib/api";
import { getAllProducts, productMatchesSearch } from "@/lib/products";
import { Category, Product } from "@/types/product";

export default function CategoryPage() {
  const router = useRouter();
  const category = router.query.slug as Category;
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProductsFromApi()
      .then(setAllProducts)
      .catch(() => setAllProducts(getAllProducts()));
  }, []);

  useEffect(() => {
    setSearchQuery("");
  }, [category]);

  const categoryProducts = useMemo(
    () => allProducts.filter((item) => item.category === category),
    [allProducts, category]
  );

  const visibleProducts = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return categoryProducts;
    return categoryProducts.filter((product) => productMatchesSearch(product, searchQuery));
  }, [categoryProducts, searchQuery]);

  const searchActive = searchQuery.trim().length > 0;

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
      <section className="container-main pt-8 pb-4">
        <ProductSearchField
          id="category-product-search"
          className="mx-auto max-w-2xl"
          value={searchQuery}
          onChange={setSearchQuery}
          formAriaLabel={`在${meta.name}中搜索商品`}
          label={`在${meta.name}中搜索`}
          placeholder={`在「${meta.name}」中搜索商品…`}
        />
      </section>
      <section className="container-main pb-12 pt-2">
        <h1 className="text-2xl font-bold sm:text-3xl">{meta.name}</h1>
        <p className="mt-3 text-stone-600">{meta.description}</p>
        {categoryProducts.length === 0 ? (
          <p className="mt-8 text-center text-stone-600">该品类暂无商品。</p>
        ) : (
          <>
            {searchActive && (
              <p className="mt-4 text-sm text-stone-600" aria-live="polite">
                {visibleProducts.length > 0 ? `找到 ${visibleProducts.length} 件商品` : null}
              </p>
            )}
            {searchActive && visibleProducts.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 px-4 py-10 text-center text-stone-600">
                <p>当前品类下没有匹配「{searchQuery.trim()}」的商品，可尝试其它关键词。</p>
                <p className="mt-3">
                  <Link href="/" className="font-semibold text-brand-700 hover:underline">
                    返回首页全站搜索
                  </Link>
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {visibleProducts.map((item) => (
                  <ProductCard key={item.id} product={item} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
