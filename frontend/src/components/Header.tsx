import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/hooks/useCart";
import { BRAND_MARK_SRC } from "@/lib/branding";

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
  const router = useRouter();
  const { totalCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [router.pathname]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative z-50 border-b border-amber-100 bg-white/90 backdrop-blur">
      <div className="container-main flex items-center justify-between gap-3 py-4">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2 text-lg font-bold text-brand-700 sm:text-xl"
          aria-label="摇摇尾巴首页"
        >
          <span className="truncate">摇摇尾巴</span>
          <Image
            src={BRAND_MARK_SRC}
            alt="摇摇小尾巴"
            width={40}
            height={40}
            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-amber-200/70 sm:h-10 sm:w-10"
            priority
          />
        </Link>
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-amber-200 text-stone-700 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="site-mobile-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <span className="sr-only">关闭菜单</span>
          ) : (
            <span className="sr-only">打开菜单</span>
          )}
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        <nav className="hidden flex-wrap items-center gap-4 text-sm font-medium text-stone-700 md:flex">
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
      {menuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-stone-900/25 md:hidden"
            aria-label="关闭菜单"
            onClick={closeMenu}
          />
          <div
            id="site-mobile-nav"
            className="relative z-50 border-t border-amber-100 bg-white shadow-lg md:hidden"
          >
            <nav className="container-main flex flex-col py-1 text-base font-medium text-stone-800">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg py-3.5 hover:bg-amber-50 hover:text-brand-700"
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/cart"
                className="rounded-lg py-3.5 hover:bg-amber-50 hover:text-brand-700"
                onClick={closeMenu}
              >
                购物车({totalCount})
              </Link>
              <Link
                href="/admin/login"
                className="rounded-lg py-3.5 hover:bg-amber-50 hover:text-brand-700"
                onClick={closeMenu}
              >
                管理员
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
