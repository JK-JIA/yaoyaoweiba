import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const detailHref = product.slug ? `/products/${product.slug}` : "#";

  return (
    <article className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
      <img src={product.image} alt={product.name} className="h-52 w-full object-cover" />
      <div className="space-y-3 p-5">
        <h3 className="text-lg font-semibold text-stone-800">{product.name}</h3>
        <p className="text-sm text-stone-600">{product.shortDescription}</p>
        <div className="space-y-3">
          <span className="font-semibold text-brand-700">{product.price}</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => addItem(product)}
              className="w-full rounded-full border border-brand-500 px-2 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50 sm:text-sm"
            >
              加入购物车
            </button>
            <Link
              href={detailHref}
              aria-disabled={!product.slug}
              className="w-full rounded-full bg-brand-500 px-2 py-2 text-center text-xs font-semibold text-white hover:bg-brand-700 sm:text-sm"
            >
              查看详情
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
