import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductForm, { ProductInput } from "@/components/admin/ProductForm";
import { fetchProductsFromApi, saveProductsToApi } from "@/lib/api";
import { getAdminSecret, isAdminAuthed, setAdminAuthed } from "@/lib/adminAuth";
import { ensureUniqueSlug, getAllProducts, toSlug } from "@/lib/products";
import { Product } from "@/types/product";

function buildProduct(data: ProductInput, usedSlugs: Set<string>, previous?: Product): Product {
  const generatedSlug = ensureUniqueSlug(toSlug(data.slug || data.name) || `product-${Date.now()}`, usedSlugs);
  return {
    id: previous?.id || Date.now().toString(),
    slug: generatedSlug,
    name: data.name.trim(),
    category: data.category,
    price: data.price.trim(),
    image: data.image.trim(),
    shortDescription: data.shortDescription.trim(),
    details: data.details.trim(),
    specs: data.specsText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    fitFor: data.fitFor.trim()
  };
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | undefined>();
  const [saveError, setSaveError] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!isAdminAuthed()) {
      router.replace("/admin/login");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const list = await fetchProductsFromApi();
        if (!cancelled) {
          setProducts(list);
          setLoadError("");
        }
      } catch {
        if (!cancelled) {
          setLoadError("无法连接商品接口，请确认后端已启动（默认 http://localhost:4000）。");
          setProducts(getAllProducts());
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const persist = async (nextProducts: Product[]) => {
    const token = getAdminSecret();
    if (!token) {
      setSaveError("未找到管理员凭证，请重新登录。");
      return;
    }
    try {
      const saved = await saveProductsToApi(nextProducts, token);
      setProducts(saved);
      setSaveError("");
    } catch {
      setSaveError("保存失败：请检查后端是否运行，或管理员密码是否与接口环境变量 ADMIN_PASSWORD 一致。");
    }
  };

  const handleCreate = async (data: ProductInput) => {
    const usedSlugs = new Set(products.map((item) => item.slug));
    const newProduct = buildProduct(data, usedSlugs);
    await persist([...products, newProduct]);
  };

  const handleUpdate = async (data: ProductInput) => {
    if (!editing) return;
    const usedSlugs = new Set(products.filter((item) => item.id !== editing.id).map((item) => item.slug));
    const updated = buildProduct(data, usedSlugs, editing);
    await persist(products.map((item) => (item.id === editing.id ? updated : item)));
    setEditing(undefined);
  };

  const handleDelete = async (id: string) => {
    await persist(products.filter((item) => item.id !== id));
  };

  const handleReset = async () => {
    await persist(getAllProducts());
    setEditing(undefined);
  };

  return (
    <>
      <Head>
        <title>商品管理 | 摇摇尾巴</title>
      </Head>
      <section className="container-main py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold">商品管理后台</h1>
          <div className="flex gap-2">
            <button type="button" onClick={handleReset} className="rounded-full border px-4 py-2 text-sm">
              恢复默认商品
            </button>
            <button
              type="button"
              onClick={() => {
                setAdminAuthed(false);
                router.push("/admin/login");
              }}
              className="rounded-full border px-4 py-2 text-sm"
            >
              退出登录
            </button>
          </div>
        </div>
        {loadError && (
          <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            {loadError}
          </p>
        )}
        {saveError && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {saveError}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <ProductForm onSubmit={handleCreate} />
          <ProductForm initialValue={editing} onSubmit={handleUpdate} onCancel={() => setEditing(undefined)} />
        </div>

        <div className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="text-xl font-semibold">当前商品列表</h2>
          <div className="mt-4 space-y-3">
            {products.map((item) => (
              <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-stone-600">
                    {item.price} · {item.slug}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="rounded-full border px-3 py-1 text-sm" onClick={() => setEditing(item)}>
                    编辑
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-red-300 px-3 py-1 text-sm text-red-600"
                    onClick={() => handleDelete(item.id)}
                  >
                    删除
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
