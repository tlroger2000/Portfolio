"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
  type Variants,
} from "framer-motion";
import { ChevronDown, X, ArrowLeft, ArrowRight, Expand } from "lucide-react";
import type { GalleryMedia } from "@/lib/galleries";
import { AnimatedText } from "@/components/ui/animated-text";

// Premium expo-out easing — the slow-out curve favoured by editorial sites.
const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Galeria editorial interactiva: masonry amb revelat animat en scroll,
 * micro-interaccions al hover i un visor a pantalla completa amb navegació
 * (teclat, swipe, clic), comptador i tira de miniatures.
 *
 * Si es passa `previewCount` i hi ha més elements, mostra només l'avançament
 * amb un botó desplegable. El visor sempre navega per TOTES les imatges del grup.
 */
export function InteractiveGallery({
  items,
  alt,
  title,
  previewCount,
  labelMore = "See all",
  labelLess = "See less",
}: {
  items: GalleryMedia[];
  alt: string;
  title?: string;
  previewCount?: number;
  labelMore?: string;
  labelLess?: string;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null); // índex dins `images`
  const [dir, setDir] = useState(0);

  // El visor es renderitza amb un portal a <body>; només existeix al client
  // (snapshot del servidor = false, evitant qualsevol ús de `document` en SSR).
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const collapsible = typeof previewCount === "number" && items.length > previewCount;
  const visible = !collapsible || open ? items : items.slice(0, previewCount);

  // El visor només recorre imatges (els vídeos es reprodueixen a la graella).
  const images = useMemo(
    () => items.filter((i): i is Extract<GalleryMedia, { kind: "image" }> => i.kind === "image"),
    [items]
  );

  const openAt = (item: GalleryMedia) => {
    const idx = images.findIndex((im) => im === item);
    if (idx >= 0) {
      setDir(0);
      setActive(idx);
    }
  };
  const close = useCallback(() => setActive(null), []);
  const go = useCallback(
    (d: number) => {
      setDir(d);
      setActive((p) => (p === null ? p : (p + d + images.length) % images.length));
    },
    [images.length]
  );
  const jumpTo = (idx: number) =>
    setActive((p) => {
      if (p !== null) setDir(idx > p ? 1 : -1);
      return idx;
    });

  // Teclat + bloqueig de scroll mentre el visor és obert.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, close, go]);

  const onDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.x < -90 || info.velocity.x < -500) go(1);
    else if (info.offset.x > 90 || info.velocity.x > 500) go(-1);
  };

  const slide: Variants = reduce
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        enter: (d: number) => ({ opacity: 0, x: d > 0 ? 120 : d < 0 ? -120 : 0, scale: 0.92 }),
        center: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.55, ease: EASE } },
        exit: (d: number) => ({
          opacity: 0,
          x: d > 0 ? -120 : d < 0 ? 120 : 0,
          scale: 0.92,
          transition: { duration: 0.4, ease: EASE },
        }),
      };

  const current = active !== null ? images[active] : null;

  const lightbox = (
    <AnimatePresence>
      {current && active !== null && (
        <motion.div
          className="fixed inset-0 z-[2000] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — visor`}
        >
          <button
            type="button"
            aria-label="Tancar"
            onClick={close}
            className="absolute inset-0 cursor-zoom-out bg-black/90 backdrop-blur-xl"
          />

          {/* Barra superior */}
          <div className="relative z-10 flex items-center justify-between px-5 py-4 sm:px-8">
            <span className="hidden truncate text-xs uppercase tracking-[0.3em] text-white/60 sm:inline">
              {alt}
            </span>
            <span className="font-mono text-sm tabular-nums text-white/80">
              {pad(active + 1)} <span className="text-white/30">/ {pad(images.length)}</span>
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Tancar"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-white/40 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Àrea de la imatge — les fletxes s'ancoren a un marc de mida fixa
              (proporció d'una imatge horitzontal) perquè no es moguin mai. */}
          <div className="relative z-10 flex flex-1 items-center justify-center overflow-hidden">
            <div className="relative flex w-[min(108vh,calc(100vw_-_8rem))] items-center justify-center">
              <AnimatePresence custom={dir} mode="wait" initial={false}>
                <motion.div
                  key={active}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag={images.length > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={onDragEnd}
                  onClick={(e) => e.stopPropagation()}
                  className="flex max-h-full cursor-grab items-center justify-center active:cursor-grabbing"
                >
                  <Image
                    src={current.src}
                    alt={`${alt} ${active + 1}`}
                    placeholder="blur"
                    sizes="92vw"
                    className="h-auto max-h-[74vh] w-auto max-w-[min(108vh,calc(100vw_-_8rem))] select-none rounded-lg object-contain shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
                    draggable={false}
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Anterior"
                    className="absolute right-full top-1/2 z-20 mr-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-md transition hover:scale-105 hover:border-white/40 hover:text-white sm:mr-3 sm:h-11 sm:w-11"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Següent"
                    className="absolute left-full top-1/2 z-20 ml-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white/80 backdrop-blur-md transition hover:scale-105 hover:border-white/40 hover:text-white sm:ml-3 sm:h-11 sm:w-11"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Barra inferior: tira de miniatures centrada */}
          {images.length > 1 && (
            <div className="relative z-10 flex justify-center px-4 pb-5 pt-2">
              <div className="flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {images.map((im, idx) => (
                  <button
                    key={`${im.name}-${idx}`}
                    type="button"
                    onClick={() => jumpTo(idx)}
                    aria-label={`Anar a la imatge ${idx + 1}`}
                    aria-current={idx === active}
                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-md transition-all duration-300 ${
                      idx === active ? "opacity-100 ring-2 ring-white" : "opacity-40 hover:opacity-80"
                    }`}
                  >
                    <Image src={im.src} alt="" fill sizes="48px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div>
      {title && (
        <motion.div
          className="mb-6 flex items-center gap-4"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <AnimatedText
            as="h3"
            className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground"
          >
            {title}
          </AnimatedText>
          <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          <span className="font-mono text-xs tabular-nums text-muted-foreground/70">
            {pad(items.length)}
          </span>
        </motion.div>
      )}

      {/* Masonry: les columnes CSS conserven la proporció natural de cada imatge. */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {visible.map((item, i) => (
          <motion.figure
            key={`${item.name}-${i}`}
            className="mb-4 break-inside-avoid"
            initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.12, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: (i % 3) * 0.07 }}
          >
            {item.kind === "image" ? (
              <button
                type="button"
                onClick={() => openAt(item)}
                aria-label={`${alt} ${i + 1} — ampliar`}
                className="group relative block w-full overflow-hidden rounded-xl border border-border bg-card"
              >
                <Image
                  src={item.src}
                  alt={`${alt} ${i + 1}`}
                  placeholder="blur"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
                {/* Vel fosc + ressaltat al hover */}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/0 transition duration-500 group-hover:ring-white/25" />
                {/* Índex editorial */}
                <span className="pointer-events-none absolute left-3 top-3 font-mono text-[11px] tracking-widest text-white/60 mix-blend-difference">
                  {pad(i + 1)}
                </span>
                {/* Acció */}
                <span className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-end opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm">
                    <Expand className="h-3.5 w-3.5" />
                  </span>
                </span>
              </button>
            ) : (
              <video
                src={item.src}
                poster={item.poster}
                controls
                muted
                loop
                playsInline
                preload="metadata"
                className="block h-auto w-full rounded-xl border border-border bg-black"
              />
            )}
          </motion.figure>
        ))}
      </div>

      {collapsible && (
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          whileTap={{ scale: 0.96 }}
          className="group mt-3 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
        >
          {open ? labelLess : `${labelMore} (${items.length})`}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : "group-hover:translate-y-0.5"}`}
          />
        </motion.button>
      )}

      {isClient && createPortal(lightbox, document.body)}
    </div>
  );
}

export default InteractiveGallery;
