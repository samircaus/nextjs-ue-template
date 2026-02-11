"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface AppHeaderProps {
  isPreview?: boolean;
}

export default function AppHeader(props: AppHeaderProps) {
  const { isPreview = false } = props;
  const pathname = usePathname();
  const logoLabel = isPreview ? "WKND Preview" : "WKND";

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Magazine", href: "/blog" },
    { name: "Adventures", href: "/adventures" },
    { name: "About", href: "/about" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-black/95 dark:supports-[backdrop-filter]:bg-black/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-sm font-bold text-white dark:bg-zinc-50 dark:text-zinc-900">
            W
          </div>
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {logoLabel}
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/adventures"
            className="hidden rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:block"
          >
            Find Adventures
          </Link>
        </div>
      </nav>
    </header>
  );
}
