"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { disciplines, brand } from "@/lib/content";
import { useT } from "./language-provider";
import TextRoll from "@/components/ui/text-roll";

export function SideMenu() {
  const t = useT();
  const links = [
    { label: t.menu.home, href: "/" },
    ...disciplines.map((d) => ({
      label: t.disciplineById[d.slug].label,
      href: `/work/${d.slug}`,
    })),
    { label: t.menu.contact, href: "/#contacte" },
  ];

  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change — adjust during render instead of in an effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  // Esc to close + lock scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        aria-label={open ? "Tancar menú" : "Obrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fixed left-5 top-1/2 z-[60] flex h-12 w-12 -translate-y-1/2 flex-col items-center justify-center gap-[6px] rounded-full text-white outline-none mix-blend-difference focus-visible:ring-2 focus-visible:ring-white/70 md:left-8"
      >
        <span
          className={`block h-[2px] w-7 bg-current transition-transform duration-300 ${
            open ? "translate-y-[8px] rotate-45" : ""
          }`}
        />
        <span
          className={`block h-[2px] w-7 bg-current transition-opacity duration-300 ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`block h-[2px] w-7 bg-current transition-transform duration-300 ${
            open ? "-translate-y-[8px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* Overlay panel */}
      <div
        className={`fixed inset-0 z-[55] transition-all duration-500 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Tancar menú"
          onClick={() => setOpen(false)}
          className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-xl"
        />

        {/* Nav */}
        <nav
          className={`absolute left-0 top-0 flex h-full w-full max-w-md flex-col justify-center gap-2 bg-background/80 px-10 py-20 backdrop-blur-2xl transition-transform duration-500 md:px-16 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <p className="mb-8 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
            {brand.name}
          </p>
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="group flex items-center gap-4 py-2 outline-none"
            >
              <span className="font-mono text-xs text-muted-foreground transition-colors group-hover:text-primary">
                {String(i).padStart(2, "0")}
              </span>
              <TextRoll className="text-3xl font-black tracking-tight text-foreground transition-transform duration-300 group-hover:translate-x-2 group-focus-visible:translate-x-2 md:text-4xl">
                {l.label}
              </TextRoll>
            </Link>
          ))}

          <div className="mt-10 flex flex-col gap-1 text-sm text-muted-foreground">
            <a href={`mailto:${brand.email}`} className="transition-colors hover:text-foreground">
              {brand.email}
            </a>
            <a href={`tel:${brand.phone}`} className="transition-colors hover:text-foreground">
              {brand.phoneDisplay}
            </a>
            <a
              href={brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              @{brand.instagram}
            </a>
            <a
              href={brand.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}

export default SideMenu;
