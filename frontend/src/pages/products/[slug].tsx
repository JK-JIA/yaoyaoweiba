import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/hooks/useCart";
import ImagePreviewLightbox from "@/components/ImagePreviewLightbox";
import { fetchProductsFromApi } from "@/lib/api";
import { getAllProducts, getProductImages } from "@/lib/products";
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

  const gallery = useMemo(() => (product ? getProductImages(product) : []), [product]);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setActiveImage(0);
    setLightboxOpen(false);
  }, [slug]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const swipeRef = useRef<{ x: number; y: number; tracking: boolean }>({ x: 0, y: 0, tracking: false });
  const suppressLightboxClickRef = useRef(false);

  const handleGalleryTouchStart = (event: React.TouchEvent) => {
    if (gallery.length < 2) return;
    const t = event.touches[0];
    swipeRef.current = { x: t.clientX, y: t.clientY, tracking: true };
  };

  const handleGalleryTouchEnd = (event: React.TouchEvent) => {
    if (gallery.length < 2 || !swipeRef.current.tracking) return;
    swipeRef.current.tracking = false;
    const t = event.changedTouches[0];
    const dx = t.clientX - swipeRef.current.x;
    const dy = t.clientY - swipeRef.current.y;
    const minSwipe = 48;
    if (Math.abs(dx) < minSwipe || Math.abs(dx) < Math.abs(dy) * 1.15) return;
    suppressLightboxClickRef.current = true;
    window.setTimeout(() => {
      suppressLightboxClickRef.current = false;
    }, 380);
    setActiveImage((i) => {
      if (dx < 0) return (i + 1) % gallery.length;
      return (i - 1 + gallery.length) % gallery.length;
    });
  };

  const handleGalleryTouchCancel = () => {
    swipeRef.current.tracking = false;
  };

  const handleMainImageActivate = () => {
    if (suppressLightboxClickRef.current) return;
    openLightbox(activeImage);
  };

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

  const mainSrc = gallery[activeImage] ?? product.image;

  return (
    <>
      <Head>
        <title>{`${product.name} | 摇摇尾巴`}</title>
        <meta name="description" content={product.shortDescription} />
      </Head>
      <ImagePreviewLightbox
        open={lightboxOpen}
        images={gallery.length > 0 ? gallery : [product.image]}
        index={lightboxIndex}
        alt={product.name}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setLightboxIndex}
      />
      <section className="container-main py-12">
        <div className="grid gap-6 rounded-3xl bg-white p-4 shadow-sm sm:p-6 md:grid-cols-2 md:gap-8">
          <div className="min-w-0">
            <button
              type="button"
              onClick={handleMainImageActivate}
              onTouchStart={handleGalleryTouchStart}
              onTouchEnd={handleGalleryTouchEnd}
              onTouchCancel={handleGalleryTouchCancel}
              className={`group relative block w-full overflow-hidden rounded-2xl outline-none ring-brand-400 focus-visible:ring-2 ${
                gallery.length > 1 ? "touch-pan-y cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
              }`}
              aria-label={gallery.length > 1 ? "滑动切换图片，点击放大查看商品图" : "点击放大查看商品图"}
            >
              <div className="flex h-[min(22rem,58vh)] min-h-[14rem] w-full items-center justify-center rounded-2xl bg-stone-50 sm:min-h-[16rem] md:h-80 md:min-h-0">
                <img
                  src={mainSrc}
                  alt={product.name}
                  className="pointer-events-none max-h-full max-w-full object-contain"
                />
              </div>
              <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-xs text-white opacity-90 md:opacity-0 md:transition md:group-hover:opacity-100">
                点击放大
              </span>
            </button>
            {gallery.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {gallery.map((src, index) => (
                  <button
                    key={`${index}-${src.slice(0, 48)}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border-2 bg-stone-50 transition ${
                      index === activeImage ? "border-brand-500 ring-2 ring-brand-200" : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                    aria-label={`切换到第 ${index + 1} 张`}
                  >
                    <img src={src} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
            <p className="mt-3 text-xl font-semibold text-brand-700 sm:text-2xl">{product.price}</p>
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
                className="min-h-[44px] rounded-full border border-brand-500 px-5 py-3 font-semibold text-brand-700 hover:bg-brand-50"
              >
                加入购物车
              </button>
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-brand-500 px-5 py-3 font-semibold text-white hover:bg-brand-700"
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
