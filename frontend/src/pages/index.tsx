import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FactorySection from "@/components/FactorySection";
import ProductCard from "@/components/ProductCard";
import { fetchProductsFromApi } from "@/lib/api";
import { getAllProducts } from "@/lib/products";
import { Product } from "@/types/product";

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>(getAllProducts());

  useEffect(() => {
    fetchProductsFromApi()
      .then(setFeatured)
      .catch(() => setFeatured(getAllProducts()));
  }, []);

  return (
    <>
      <Head>
        <title>摇摇尾巴 | 宠物用品官网</title>
        <meta
          name="description"
          content="摇摇尾巴宠物用品官网，主营狗窝、饭碗、狗粮、零食，提供安心喂养与舒适陪伴的宠物生活方案。"
        />
      </Head>
      <section className="container-main py-14">
        <div className="rounded-3xl bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">YaoYaoWeiBa</p>
          <h1 className="mt-3 text-4xl font-bold text-stone-800">安心喂养，舒适陪伴，精选品质</h1>
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

      <section className="container-main pb-12">
        <div className="mb-5 flex flex-wrap items-center gap-2 sm:gap-3">
          <h2 className="text-2xl font-bold">热销商品</h2>
          <Image
            src="/images/home-hot-side.png"
            alt=""
            width={44}
            height={44}
            className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-amber-200/60 sm:h-11 sm:w-11"
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <FactorySection />
    </>
  );
}
