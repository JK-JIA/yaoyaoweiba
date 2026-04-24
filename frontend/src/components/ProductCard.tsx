import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { getProductCoverImage } from "@/lib/products";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const detailHref = product.slug ? `/products/${product.slug}` : "#";

  return (
    <article className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
      <img
        src={getProductCoverImage(product)}
        alt={product.name}
        className="h-44 w-full object-cover sm:h-52"
      />
      <div className="space-y-3 p-4 sm:p-5">
        <h3 className="text-base font-semibold text-stone-800 sm:text-lg">{product.name}</h3>
        <p className="text-sm text-stone-600">{product.shortDescription}</p>
        <div className="space-y-3">
          <span className="font-semibold text-brand-700">{product.price}</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => addItem(product)}
              className="flex min-h-[44px] w-full items-center justify-center rounded-full border border-brand-500 px-2 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50 sm:text-sm"
            >
              加入购物车
            </button>
            <Link
              href={detailHref}
              aria-disabled={!product.slug}
              className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-brand-500 px-2 py-2 text-center text-xs font-semibold text-white hover:bg-brand-700 sm:text-sm"
            >
              查看详情
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
