"use client";

import { type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useT } from "./language-provider";
import { LanguageSwitcher } from "./language-switcher";
import logo from "@/components/visual_Identity/logo-white.png";

export function SiteNav() {
  const t = useT();
  const pathname = usePathname();

  // On the home page the logo just scrolls back to the top; elsewhere it navigates home.
  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          onClick={handleLogoClick}
          aria-label="Beast Shots"
          className="inline-flex items-center mix-blend-difference"
        >
          <Image
            src={logo}
            alt="Beast Shots"
            priority
            className="h-25 w-auto md:h-29"
          />
        </Link>
        <div className="flex items-center gap-5 text-xs font-semibold uppercase tracking-[0.2em] text-white mix-blend-difference">
          <Link href="/#work" className="hidden transition-opacity hover:opacity-60 sm:inline">
            {t.nav.work}
          </Link>
          <Link href="/#contacte" className="transition-opacity hover:opacity-60">
            {t.nav.contact}
          </Link>
          <span className="h-3 w-px bg-white/40" aria-hidden />
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
}

export default SiteNav;
