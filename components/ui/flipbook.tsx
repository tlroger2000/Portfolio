"use client";

import { useEffect, useRef, useState } from "react";
import { PageFlip } from "page-flip";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { magazine } from "@/lib/flipbook.generated";

/**
 * Virtual magazine: real page-turn animation (page-flip / StPageFlip) driven by
 * the pre-rasterised, compressed page images. Arrow buttons flip pages; the book
 * is also draggable / clickable on the page corners.
 */
export function MagazineFlipbook({ heading }: { heading?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const [page, setPage] = useState(0);

  const total = magazine.pages.length;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || total === 0) return;

    const ratio = magazine.height / magazine.width;
    const base = 460;
    const flip = new PageFlip(el, {
      width: base,
      height: Math.round(base * ratio),
      size: "stretch",
      minWidth: 260,
      maxWidth: 600,
      minHeight: Math.round(260 * ratio),
      maxHeight: Math.round(600 * ratio),
      maxShadowOpacity: 0.5,
      showCover: true,
      mobileScrollSupport: true,
      useMouseEvents: true,
    });

    flip.loadFromImages(magazine.pages.map((p) => p.src));
    flip.on("flip", (e) => setPage(e.data));
    flipRef.current = flip;

    return () => {
      flip.destroy();
      flipRef.current = null;
    };
  }, [total]);

  if (total === 0) return null;

  return (
    <div>
      {heading && (
        <h3 className="mb-6 text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          {heading}
        </h3>
      )}

      <div className="flex flex-col items-center">
        {/* page-flip renders the book inside this element */}
        <div ref={containerRef} className="w-full max-w-[680px] select-none" />

        <div className="mt-8 flex items-center gap-6">
          <button
            type="button"
            onClick={() => flipRef.current?.flipPrev()}
            aria-label="Pàgina anterior"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {Math.min(page + 1, total)} / {total}
          </span>
          <button
            type="button"
            onClick={() => flipRef.current?.flipNext()}
            aria-label="Pàgina següent"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MagazineFlipbook;
