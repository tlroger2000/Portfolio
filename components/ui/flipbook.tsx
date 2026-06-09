"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PageFlip } from "page-flip";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { magazine } from "@/lib/flipbook.generated";

/**
 * Virtual magazine: real page-turn animation (page-flip / StPageFlip) driven by
 * the pre-rasterised, compressed page images. Arrow buttons flip pages; the book
 * is also draggable / clickable on the page corners. A fullscreen mode enlarges
 * the spread so the magazine text is readable.
 *
 * The book is created ONCE on an imperatively-owned host element. Switching to
 * fullscreen just MOVES that host into the overlay (and back) and refits it —
 * we never destroy/recreate, which is what used to make it blank out randomly
 * or vanish after closing fullscreen. Initialisation also waits until the host
 * actually has a width, so it can't render into the still-laying-out hero.
 */
export function MagazineFlipbook({ heading }: { heading?: string }) {
  const inlineMountRef = useRef<HTMLDivElement>(null);
  const fullMountRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const flipRef = useRef<PageFlip | null>(null);
  const pageRef = useRef(0);
  const [page, setPage] = useState(0);
  const [ready, setReady] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const total = magazine.pages.length;

  // Build the page-flip instance exactly once.
  useEffect(() => {
    if (total === 0) return;
    const mount = inlineMountRef.current;
    if (!mount) return;

    const host = document.createElement("div");
    host.style.width = "100%";
    mount.appendChild(host);
    hostRef.current = host;

    let cancelled = false;
    let raf = 0;
    const ratio = magazine.height / magazine.width;

    const init = () => {
      if (cancelled) return;
      // The host can be 0-wide while the parent hero is still animating in.
      // Wait for a real width so page-flip measures something valid.
      if (host.clientWidth < 50) {
        raf = requestAnimationFrame(init);
        return;
      }
      const flip = new PageFlip(host, {
        width: 520,
        height: Math.round(520 * ratio),
        size: "stretch",
        minWidth: 250,
        maxWidth: 1100,
        minHeight: Math.round(250 * ratio),
        maxHeight: Math.round(1100 * ratio),
        maxShadowOpacity: 0.5,
        showCover: true,
        mobileScrollSupport: true,
        useMouseEvents: true,
      });
      flip.loadFromImages(magazine.pages.map((p) => p.src));
      flip.on("flip", (e) => {
        pageRef.current = e.data as number;
        setPage(e.data as number);
      });
      flipRef.current = flip;
      setReady(true);
    };
    init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      flipRef.current?.destroy();
      flipRef.current = null;
      host.remove();
      hostRef.current = null;
      setReady(false);
    };
  }, [total]);

  // Move the (single) host between the inline and fullscreen mounts and refit
  // it to the new container — no destroy/recreate.
  useEffect(() => {
    const host = hostRef.current;
    if (!ready || !host) return;
    const mount = fullscreen ? fullMountRef.current : inlineMountRef.current;
    if (!mount) return;
    mount.appendChild(host);

    // Force page-flip to re-measure (canvas size + page bounds) once layout has
    // settled. A couple of frames + a late tick covers the fullscreen animation.
    let raf2 = 0;
    const refit = () => window.dispatchEvent(new Event("resize"));
    const raf1 = requestAnimationFrame(() => {
      refit();
      raf2 = requestAnimationFrame(refit);
    });
    const t = window.setTimeout(refit, 120);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      clearTimeout(t);
    };
  }, [fullscreen, ready]);

  const openFullscreen = () => setFullscreen(true);
  const closeFullscreen = () => setFullscreen(false);

  // Lock page scroll + wire keyboard controls while fullscreen.
  useEffect(() => {
    if (!fullscreen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFullscreen();
      else if (e.key === "ArrowRight") flipRef.current?.flipNext();
      else if (e.key === "ArrowLeft") flipRef.current?.flipPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [fullscreen]);

  if (total === 0) return null;

  const controls = (
    <div className="flex items-center gap-6 py-2">
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
  );

  return (
    <div>
      {heading && (
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            {heading}
          </h3>
          <button
            type="button"
            onClick={openFullscreen}
            aria-label="Veure a pantalla completa"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-foreground/10"
          >
            <Maximize2 className="h-4 w-4" /> Pantalla completa
          </button>
        </div>
      )}

      {/* Inline book — the host lives here unless fullscreen has borrowed it. */}
      <div className={fullscreen ? "hidden" : "flex flex-col items-center"}>
        <div ref={inlineMountRef} className="w-full max-w-[1000px] select-none" />
        <div className="mt-6">{controls}</div>
      </div>

      {/* Fullscreen overlay — rendered through a portal on <body> so it escapes
          the animated/transformed ancestors and covers the site header. The
          spread is fitted to the viewport HEIGHT (fixed aspect ratio) so the
          whole double-page is visible at once, no scroll. */}
      {fullscreen &&
        createPortal(
          <div className="fixed inset-0 z-[200] flex flex-col bg-background">
            <button
              type="button"
              onClick={closeFullscreen}
              aria-label="Tancar pantalla completa"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-opacity hover:opacity-80"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-1 items-center justify-center overflow-hidden px-4 pt-4">
              <div
                ref={fullMountRef}
                className="select-none"
                style={{
                  height: "100%",
                  maxWidth: "96vw",
                  aspectRatio: `${2 * magazine.width} / ${magazine.height}`,
                }}
              />
            </div>

            <div className="flex justify-center pb-4 pt-2">{controls}</div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default MagazineFlipbook;
