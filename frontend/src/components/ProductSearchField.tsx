interface ProductSearchFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** `aria-label` on the form (e.g. 站内商品搜索 / 本品类内搜索) */
  formAriaLabel: string;
  /** Visually hidden label text for the input */
  label: string;
  placeholder?: string;
  className?: string;
}

export default function ProductSearchField({
  id,
  value,
  onChange,
  formAriaLabel,
  label,
  placeholder = "搜索商品名称、品类或关键词…",
  className = ""
}: ProductSearchFieldProps) {
  const active = value.trim().length > 0;

  return (
    <form
      className={className}
      role="search"
      aria-label={formAriaLabel}
      onSubmit={(event) => event.preventDefault()}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative w-full">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" aria-hidden>
          🔍
        </span>
        <input
          id={id}
          type="search"
          autoComplete="off"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-full border border-amber-200/80 bg-white py-3 pl-10 pr-20 text-stone-800 shadow-sm outline-none ring-brand-500/30 placeholder:text-stone-400 focus:border-brand-400 focus:ring-2"
        />
        {active && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-amber-50 hover:text-stone-900"
          >
            清除
          </button>
        )}
      </div>
    </form>
  );
}
