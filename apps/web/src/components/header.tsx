"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
];

export function Header({ siteName, logo }: { siteName: string; logo: string | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur py-3.5 md:py-4.5 px-5">
      <div className="container-8xl">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            {logo ? (
              <Image src={logo} alt={siteName} width={28} height={28} className="rounded" unoptimized />
            ) : (
              <span className="flex w-7.5 h-7.5 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M16.25 3H7.75C7.06 3 6.5 3.56 6.5 4.25V21H17.5V4.25C17.5 3.56 16.94 3 16.25 3ZM11 17H9.5V14.5H11V17ZM11 13H9.5V10.5H11V13ZM11 9H9.5V6.5H11V9ZM14.5 17H13V14.5H14.5V17ZM14.5 13H13V10.5H14.5V13ZM14.5 9H13V6.5H14.5V9ZM19.25 10H19V21H22V12.75C21.9987 12.0211 21.7085 11.3224 21.1931 10.8069C20.6776 10.2915 19.9789 10.0013 19.25 10ZM4.75 10H5V21H2V12.75C2.00132 12.0211 2.29148 11.3224 2.80692 10.8069C3.32236 10.2915 4.02106 10.0013 4.75 10Z" fill="white"/>
                </svg>
              </span>
            )}
            <span className="font-fraunces text-foreground tracking-[-0.44px] text-[22px] leading-8.5 font-semibold hidden sm:inline-block">{siteName}</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-6 md:gap-7 sm:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm leading-5.5 transition-colors ${ isActive ? "font-medium text-primary" : "font-normal text-secondary hover:text-primary"}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto sm:hidden flex items-center gap-1 sm:ml-0">
            {/* <ThemeToggle /> */}
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="flex size-9 items-center justify-center rounded-lg text-muted-foreground bg-muted hover:text-foreground"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-border px-4 py-3 sm:hidden absolute top-15 left-0 w-full bg-white">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-md px-2 py-2 text-sm leading-5.5 transition-colors ${
                        isActive
                          ? "font-medium text-primary"
                          : "font-normal text-secondary hover:text-primary"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
