import Image from "next/image";
import { BRAND_MARK_SRC } from "@/lib/branding";

export default function FactorySection() {
  return (
    <section className="container-main pb-12">
      <div className="rounded-3xl bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Factory & Quality</p>
          <Image
            src={BRAND_MARK_SRC}
            alt=""
            width={64}
            height={64}
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-amber-200/50 sm:h-14 sm:w-14"
            aria-hidden
          />
        </div>
        <h2 className="mt-3 text-xl font-bold sm:text-2xl">用心做宠物用品，让家长放心</h2>
        <p className="mt-4 text-stone-700">
          我们用心对待每一个毛孩子，从原料筛选、生产工艺到出厂检测，始终坚持专业品控与优选标准，
          让每一件宠物用品都兼顾安全、舒适和实用。
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="font-semibold">专业品控</p>
            <p className="mt-2 text-sm text-stone-600">关键节点多轮抽检，确保质量稳定。</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="font-semibold">优选原料</p>
            <p className="mt-2 text-sm text-stone-600">优先采用安全、耐用、对宠物友好的材料。</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="font-semibold">持续改进</p>
            <p className="mt-2 text-sm text-stone-600">根据养宠家庭反馈不断优化产品体验。</p>
          </div>
        </div>
      </div>
    </section>
  );
}
