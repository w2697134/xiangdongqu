"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems, siteName } from "@/data/mock";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#fffaf2]/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className="mr-3 inline-flex h-10 shrink-0 items-center justify-center rounded-sm border border-stone-300 px-3 text-sm font-medium text-stone-800 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "关闭" : "菜单"}
        </button>

        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center gap-3 pr-3"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#9f1f2f] text-sm font-semibold text-white">
            向东
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-stone-950 sm:text-base">
              <span className="sm:hidden">向东渠数字馆</span>
              <span className="hidden sm:inline">{siteName}</span>
            </span>
            <span className="hidden text-xs text-stone-500 sm:block">
              红色文化数字展馆
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="主导航">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-sm px-3 py-2 text-sm transition",
                isActive(item.href)
                  ? "bg-[#9f1f2f] text-white"
                  : "text-stone-700 hover:bg-stone-100 hover:text-stone-950",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {open ? (
        <nav
          id="mobile-navigation"
          className="border-t border-stone-200 bg-[#fffaf2] px-4 py-3 lg:hidden"
          aria-label="移动端导航"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 sm:grid-cols-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={[
                  "rounded-sm px-3 py-3 text-sm font-medium transition",
                  isActive(item.href)
                    ? "bg-[#9f1f2f] text-white"
                    : "bg-white text-stone-700 hover:bg-stone-100",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
