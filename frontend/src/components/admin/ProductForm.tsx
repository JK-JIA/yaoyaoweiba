import { useEffect, useMemo, useState } from "react";
import { Category, Product } from "@/types/product";
import { getProductImages } from "@/lib/products";

export interface ProductInput {
  name: string;
  slug: string;
  category: Category;
  price: string;
  images: string[];
  shortDescription: string;
  details: string;
  specsText: string;
  fitFor: string;
}

interface ProductFormProps {
  initialValue?: Product;
  onSubmit: (data: ProductInput) => void;
  onCancel?: () => void;
}

const emptyValue: ProductInput = {
  name: "",
  slug: "",
  category: "dog-bed",
  price: "¥0",
  images: [],
  shortDescription: "",
  details: "",
  specsText: "",
  fitFor: ""
};

function normalizeValue(product?: Product): ProductInput {
  if (!product) return emptyValue;
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    price: product.price,
    images: getProductImages(product),
    shortDescription: product.shortDescription,
    details: product.details,
    specsText: product.specs.join("\n"),
    fitFor: product.fitFor
  };
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("invalid file result"));
      }
    };
    reader.onerror = () => reject(new Error("file read failed"));
    reader.readAsDataURL(file);
  });
}

function loadImageElement(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image decode failed"));
    image.src = dataUrl;
  });
}

async function compressImage(file: File): Promise<string> {
  const sourceDataUrl = await fileToDataUrl(file);
  const image = await loadImageElement(sourceDataUrl);
  const canvas = document.createElement("canvas");
  const maxEdge = 960;
  const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
  canvas.width = Math.round(image.width * scale);
  canvas.height = Math.round(image.height * scale);

  const context = canvas.getContext("2d");
  if (!context) return sourceDataUrl;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  let quality = 0.8;
  let result = canvas.toDataURL("image/jpeg", quality);
  while (result.length > 350_000 && quality > 0.45) {
    quality -= 0.1;
    result = canvas.toDataURL("image/jpeg", quality);
  }
  return result;
}

export default function ProductForm({ initialValue, onSubmit, onCancel }: ProductFormProps) {
  const [form, setForm] = useState<ProductInput>(normalizeValue(initialValue));
  const [uploadTip, setUploadTip] = useState("");
  const [linkDraft, setLinkDraft] = useState("");
  const title = useMemo(() => (initialValue ? "编辑商品" : "新增商品"), [initialValue]);

  useEffect(() => {
    setForm(normalizeValue(initialValue));
    setUploadTip("");
    setLinkDraft("");
  }, [initialValue]);

  const handleChange = (key: keyof Omit<ProductInput, "images">, value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const setImages = (next: string[]) => {
    setForm((previous) => ({ ...previous, images: next }));
  };

  const handleFilesUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files);
    try {
      const compressed = await Promise.all(list.map((file) => compressImage(file)));
      setForm((previous) => ({ ...previous, images: [...previous.images, ...compressed] }));
      setUploadTip(`已上传并压缩 ${list.length} 张图片（保持各自比例）。`);
    } catch {
      setUploadTip("图片读取失败，请重试。");
    }
  };

  const addLink = () => {
    const url = linkDraft.trim();
    if (!url) return;
    setForm((previous) => ({ ...previous, images: [...previous.images, url] }));
    setLinkDraft("");
    setUploadTip("已添加图片链接。");
  };

  const removeImageAt = (index: number) => {
    setForm((previous) => ({ ...previous, images: previous.images.filter((_, i) => i !== index) }));
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <input className="rounded-lg border p-2" placeholder="商品名称" value={form.name} onChange={(event) => handleChange("name", event.target.value)} />
        <input className="rounded-lg border p-2" placeholder="slug（可不填，将自动生成）" value={form.slug} onChange={(event) => handleChange("slug", event.target.value)} />
        <select className="rounded-lg border p-2" value={form.category} onChange={(event) => handleChange("category", event.target.value as Category)}>
          <option value="dog-bed">狗窝</option>
          <option value="bowl">饭碗</option>
          <option value="dog-food">狗粮</option>
          <option value="treat">零食</option>
        </select>
        <input className="rounded-lg border p-2" placeholder="价格（如 ¥199）" value={form.price} onChange={(event) => handleChange("price", event.target.value)} />
      </div>

      <p className="mt-3 text-sm text-stone-600">商品图片（可多张，首张为列表封面）</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          className="min-w-[12rem] flex-1 rounded-lg border p-2"
          placeholder="粘贴图片链接后点击添加"
          value={linkDraft}
          onChange={(event) => setLinkDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addLink();
            }
          }}
        />
        <button type="button" onClick={addLink} className="rounded-lg border border-brand-500 px-3 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-50">
          添加链接
        </button>
      </div>
      <label className="mt-3 block rounded-lg border border-dashed border-amber-300 p-3 text-sm text-stone-600">
        本地上传图片（可多选，纯前端存储；按原图比例压缩边长，不强制裁切）
        <input
          type="file"
          accept="image/*"
          multiple
          className="mt-2 block w-full text-sm"
          onChange={(event) => void handleFilesUpload(event.target.files)}
        />
      </label>
      {uploadTip && <p className="mt-2 text-xs text-stone-500">{uploadTip}</p>}
      {form.images.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {form.images.map((src, index) => (
            <li key={`${index}-${src.slice(0, 24)}`} className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border bg-stone-50">
              <img src={src} alt="" className="max-h-full max-w-full object-contain" />
              <button
                type="button"
                onClick={() => removeImageAt(index)}
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-stone-800 text-xs text-white hover:bg-red-600"
                aria-label="移除图片"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
      <textarea className="mt-3 w-full rounded-lg border p-2" rows={2} placeholder="摘要" value={form.shortDescription} onChange={(event) => handleChange("shortDescription", event.target.value)} />
      <textarea className="mt-3 w-full rounded-lg border p-2" rows={3} placeholder="详情" value={form.details} onChange={(event) => handleChange("details", event.target.value)} />
      <textarea className="mt-3 w-full rounded-lg border p-2" rows={3} placeholder="规格（每行一个）" value={form.specsText} onChange={(event) => handleChange("specsText", event.target.value)} />
      <input className="mt-3 w-full rounded-lg border p-2" placeholder="适用犬型" value={form.fitFor} onChange={(event) => handleChange("fitFor", event.target.value)} />
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => onSubmit(form)} className="rounded-full bg-brand-500 px-4 py-2 text-white">
          保存
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded-full border px-4 py-2">
            取消
          </button>
        )}
      </div>
    </div>
  );
}
