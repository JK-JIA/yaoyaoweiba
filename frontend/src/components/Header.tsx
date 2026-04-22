import Link from "next/link";
import { useCart } from "@/hooks/useCart";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/category/dog-bed", label: "狗窝" },
  { href: "/category/bowl", label: "饭碗" },
  { href: "/category/dog-food", label: "狗粮" },
  { href: "/category/treat", label: "零食" },
  { href: "/about", label: "关于我们" },
  { href: "/contact", label: "联系我们" }
];

export default function Header() {
  const { totalCount } = useCart();

  return (
    <header className="border-b border-amber-100 bg-white/90 backdrop-blur">
      <div className="container-main flex flex-wrap items-center justify-between gap-3 py-4">
        <Link href="/" className="text-xl font-bold text-brand-700">
          摇摇尾巴
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm font-medium text-stone-700">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-brand-700">
              {item.label}
            </Link>
          ))}
          <Link href="/cart" className="hover:text-brand-700">
            购物车({totalCount})
          </Link>
          <Link href="/admin/login" className="hover:text-brand-700">
            管理员
          </Link>
        </nav>
      </div>
    </header>
  );
}
