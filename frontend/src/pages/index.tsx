import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import FactorySection from "@/components/FactorySection";
import ProductCard from "@/components/ProductCard";
import ProductSearchField from "@/components/ProductSearchField";
import { categoryMeta } from "@/data/products";
import { fetchProductsFromApi } from "@/lib/api";
import { BRAND_MARK_SRC } from "@/lib/branding";
import { categories, getAllProducts, productMatchesSearch } from "@/lib/products";
import { Product } from "@/types/product";

const HOME_CATEGORY_PREVIEW = 3;

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>(getAllProducts());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProductsFromApi()
      .then(setAllProducts)
      .catch(() => setAllProducts(getAllProducts()));
  }, []);

  const searchActive = searchQuery.trim().length > 0;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allProducts.filter((product) => productMatchesSearch(product, searchQuery));
  }, [allProducts, searchQuery]);

  const sections = useMemo(() => {
    return categories
      .map((category) => {
        const meta = categoryMeta[category];
        const items = allProducts.filter((product) => product.category === category);
        const preview = items.slice(0, HOME_CATEGORY_PREVIEW);
        return { category, meta, preview, total: items.length };
      })
      .filter((section) => section.preview.length > 0);
  }, [allProducts]);

  return (
    <>
      <Head>
        <title>摇摇尾巴 | 宠物用品官网</title>
        <meta
          name="description"
          content="摇摇尾巴宠物用品官网，主营狗窝、饭碗、狗粮、零食，提供安心喂养与舒适陪伴的宠物生活方案。"
        />
      </Head>
      <section className="container-main pt-8 pb-4">
        <ProductSearchField
          id="home-product-search"
          className="mx-auto max-w-2xl"
          value={searchQuery}
          onChange={setSearchQuery}
          formAriaLabel="站内商品搜索"
          label="搜索商品"
        />
      </section>
      <section className="container-main pb-14 pt-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">YaoYaoWeiBa</p>
          <h1 className="mt-3 text-3xl font-bold text-stone-800 sm:text-4xl">安心喂养，舒适陪伴，精选品质</h1>
          <p className="mt-4 max-w-2xl text-stone-600">
            摇摇尾巴专注宠物狗用品，为每一位毛孩子带来更舒适的休息、更科学的喂养与更健康的奖励体验。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/category/dog-bed" className="rounded-full bg-brand-500 px-5 py-3 font-semibold text-white">
              选购狗窝
            </Link>
            <Link href="/contact" className="rounded-full border border-brand-500 px-5 py-3 font-semibold text-brand-700">
              立即咨询
            </Link>
          </div>
        </div>
      </section>

      {searchActive && (
        <section className="container-main pb-12" aria-live="polite">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-amber-100/80 pb-3">
            <h2 className="text-xl font-bold sm:text-2xl">搜索结果</h2>
            <p className="text-sm text-stone-600">
              共 {searchResults.length} 件
              {searchResults.length === 0 && " · 试试其它词，或清空搜索浏览分类"}
            </p>
          </div>
          {searchResults.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 px-4 py-8 text-center text-stone-600">
              没有找到匹配「{searchQuery.trim()}」的商品。
            </p>
          )}
        </section>
      )}

      {!searchActive &&
        sections.map(({ category, meta, preview, total }) => (
          <section key={category} className="container-main pb-12">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-amber-100/80 pb-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h2 className="text-xl font-bold sm:text-2xl">{meta.name}</h2>
                <Image
                  src={BRAND_MARK_SRC}
                  alt=""
                  width={40}
                  height={40}
                  className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-amber-200/60 sm:h-10 sm:w-10"
                />
              </div>
              {total > HOME_CATEGORY_PREVIEW ? (
                <Link
                  href={`/category/${category}`}
                  className="text-sm font-semibold text-brand-700 hover:text-brand-800 hover:underline"
                >
                  更多（{total} 件）
                </Link>
              ) : (
                <Link href={`/category/${category}`} className="text-sm font-semibold text-stone-500 hover:text-brand-700 hover:underline">
                  进入品类
                </Link>
              )}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {preview.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ))}

      <FactorySection />
    </>
  );
}
