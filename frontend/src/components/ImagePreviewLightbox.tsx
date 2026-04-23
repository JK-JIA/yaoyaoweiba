import { useCallback, useEffect } from "react";

interface ImagePreviewLightboxProps {
  open: boolean;
  images: string[];
  index: number;
  alt: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

export default function ImagePreviewLightbox({
  open,
  images,
  index,
  alt,
  onClose,
  onIndexChange
}: ImagePreviewLightboxProps) {
  const safeIndex = images.length ? Math.min(Math.max(0, index), images.length - 1) : 0;
  const src = images[safeIndex] ?? "";

  const goPrev = useCallback(() => {
    if (images.length < 2) return;
    onIndexChange((safeIndex - 1 + images.length) % images.length);
  }, [images.length, onIndexChange, safeIndex]);

  const goNext = useCallback(() => {
    if (images.length < 2) return;
    onIndexChange((safeIndex + 1) % images.length);
  }, [images.length, onIndexChange, safeIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, goPrev, goNext]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open || !src) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="图片预览"
      onClick={onClose}
    >
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-2xl font-bold text-stone-800 shadow hover:bg-white md:left-6 md:px-4"
            aria-label="上一张"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-2xl font-bold text-stone-800 shadow hover:bg-white md:right-6 md:px-4"
            aria-label="下一张"
          >
            ›
          </button>
        </>
      )}
      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
        {images.length > 1 && (
          <p className="rounded-full bg-black/50 px-3 py-1 text-xs text-white">
            {safeIndex + 1} / {images.length}
          </p>
        )}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="rounded-full bg-white/95 px-5 py-2 text-sm font-semibold text-stone-800 shadow hover:bg-white"
        >
          关闭
        </button>
      </div>
      <img
        src={src}
        alt={alt}
        className="max-h-[90vh] max-w-full object-contain shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  );
}
