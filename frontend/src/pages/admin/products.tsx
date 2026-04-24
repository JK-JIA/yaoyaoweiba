import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductForm, { ProductInput } from "@/components/admin/ProductForm";
import { fetchProductsFromApi, saveProductsToApi } from "@/lib/api";
import { getAdminSecret, isAdminAuthed, setAdminAuthed } from "@/lib/adminAuth";
import { ensureUniqueSlug, getAllProducts, getProductCoverImage, toSlug } from "@/lib/products";
import { Product } from "@/types/product";

function buildProduct(data: ProductInput, usedSlugs: Set<string>, previous?: Product): Product {
  const generatedSlug = ensureUniqueSlug(toSlug(data.slug || data.name) || `product-${Date.now()}`, usedSlugs);
  const urls = data.images.map((item) => item.trim()).filter(Boolean);
  const image = urls[0] || "";
  const images = urls.length > 1 ? urls : undefined;
  return {
    id: previous?.id || Date.now().toString(),
    slug: generatedSlug,
    name: data.name.trim(),
    category: data.category,
    price: data.price.trim(),
    image,
    ...(images ? { images } : {}),
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
  const [draftKey, setDraftKey] = useState(0);

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
          const origin = typeof window !== "undefined" ? window.location.origin : "";
          setLoadError(
            `无法连接商品接口（已请求 ${origin}/api/products）。请确认后端已启动、Nginx 将 /api 交给 Next 或后端、并已执行 docker compose build --no-cache web 且硬刷新浏览器。`
          );
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
      setSaveError(
        "保存失败：请确认后端可访问、管理员密码与 ADMIN_PASSWORD 一致；若接口走同域 /api，请确认反代与 CORS 配置正确。"
      );
    }
  };

  const handleCreate = async (data: ProductInput) => {
    const usedSlugs = new Set(products.map((item) => item.slug));
    const newProduct = buildProduct(data, usedSlugs);
    await persist([...products, newProduct]);
    setDraftKey((key) => key + 1);
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
    if (editing?.id === id) setEditing(undefined);
  };

  const handleReset = async () => {
    await persist(getAllProducts());
    setEditing(undefined);
    setDraftKey((key) => key + 1);
  };

  const handleFormSubmit = (data: ProductInput) => {
    if (editing) return handleUpdate(data);
    return handleCreate(data);
  };

  const formKey = editing ? editing.id : `new-${draftKey}`;

  return (
    <>
      <Head>
        <title>商品管理 | 摇摇尾巴</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-amber-50/90 via-stone-50 to-stone-100/80">
        <section className="container-main max-w-5xl py-10">
          <header className="mb-8 flex flex-col gap-4 rounded-2xl border border-amber-100/80 bg-white/95 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Admin</p>
              <h1 className="mt-1 text-2xl font-bold text-stone-900 sm:text-3xl">商品管理后台</h1>
              <p className="mt-1 text-sm text-stone-500">同一表单：未选「编辑」时为新增；在列表中点编辑后在此修改并保存。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-amber-200 bg-amber-50/80 px-4 py-2 text-sm font-medium text-stone-800 hover:bg-amber-100"
              >
                恢复默认商品
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminAuthed(false);
                  router.push("/admin/login");
                }}
                className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                退出登录
              </button>
            </div>
          </header>

          {loadError && (
            <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">{loadError}</p>
          )}
          {saveError && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{saveError}</p>
          )}

          {editing && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-200 bg-brand-50/60 px-4 py-3 text-sm text-brand-900">
              <span>
                正在编辑：<strong>{editing.name}</strong>
              </span>
              <button
                type="button"
                onClick={() => setEditing(undefined)}
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-800 ring-1 ring-brand-200 hover:bg-brand-50"
              >
                改为新增商品
              </button>
            </div>
          )}

          <ProductForm
            key={formKey}
            initialValue={editing}
            onSubmit={(data) => void handleFormSubmit(data)}
            onCancel={editing ? () => setEditing(undefined) : undefined}
          />

          <details className="mt-6 rounded-xl border border-stone-200 bg-white/80 px-4 py-2 text-xs text-stone-500">
            <summary className="cursor-pointer select-none font-medium text-stone-600">部署与构建说明</summary>
            <p className="mt-2 leading-relaxed">
              前端构建标记：<span className="font-mono text-stone-800">{process.env.NEXT_PUBLIC_BUILD_TAG ?? "unknown"}</span>
              。若上方报错仍出现「默认 localhost:4000」等旧文案，说明<strong>不是</strong>本构建；请服务器执行{" "}
              <code className="rounded bg-stone-100 px-1">docker compose build --no-cache web &amp;&amp; docker compose up -d</code> 并确认项目根存在{" "}
              <code className="rounded bg-stone-100 px-1">.env</code>（由 <code className="rounded bg-stone-100 px-1">.env.example</code> 复制）。
            </p>
          </details>

          <div className="mt-10 min-w-0 rounded-2xl border border-amber-100/80 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-3">
              <h2 className="text-lg font-semibold text-stone-900">当前商品列表</h2>
              <span className="text-sm text-stone-500">共 {products.length} 件</span>
            </div>
            <ul className="mt-4 divide-y divide-stone-100">
              {products.map((item) => (
                <li key={item.id}>
                  <article className="flex flex-wrap items-center gap-4 py-4 first:pt-0">
                    <img
                      src={getProductCoverImage(item)}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded-xl object-cover ring-1 ring-amber-100"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-stone-900">{item.name}</p>
                      <p className="mt-0.5 break-words text-sm text-stone-600">
                        {item.price} · <span className="break-all font-mono text-stone-500">{item.slug}</span>
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 hover:bg-brand-100"
                        onClick={() => setEditing(item)}
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-red-200 bg-red-50/80 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100"
                        onClick={() => void handleDelete(item.id)}
                      >
                        删除
                      </button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
}
