import { navItems, siteName } from "@/data/mock";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold text-white">{siteName}</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-400">
            围绕向东渠建设记忆、红色文化、水利工程和地方资料，集中展示导览、档案、精神、价值、资讯和影像内容。
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4" aria-label="页脚导航">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-sm px-2 py-1 text-stone-400 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
