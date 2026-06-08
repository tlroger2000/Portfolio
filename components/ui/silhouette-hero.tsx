"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { HeroSection } from "./horizon-hero-section";
import siluetaImg from "@/components/images/silueta.webp";
import { useT } from "@/components/site/language-provider";
import { TextEffect } from "./text-effect";
import { AnimatedText } from "./animated-text";

const NAME = "ROGER\nTORRES LINARES";

export interface SilhouetteHeroProps {
  /** 3 seccions: índex 0 és la vista inicial; 1 i 2 es revelen amb scroll. */
  sections?: HeroSection[];
  /** Ruta del PNG de la silueta dins /public (recomanat fons transparent). */
  silhouetteSrc?: string;
}

// Elements gràfics decoratius. x/y = posició del centre (%). depth = velocitat
// de parallax (px per px de scroll). rot = graus de rotació per px de scroll.
type FloaterType = "ring" | "dot" | "diamond" | "plus" | "line" | "arc";
interface Floater {
  type: FloaterType;
  x: string;
  y: string;
  size: number;
  depth: number;
  rot?: number;
  hue?: "violet" | "blue" | "pink" | "white";
  float?: boolean;
}

const FLOATERS: Floater[] = [
  { type: "ring", x: "16%", y: "26%", size: 150, depth: 0.16, rot: 0.02, hue: "violet", float: true },
  { type: "ring", x: "82%", y: "32%", size: 260, depth: 0.1, rot: -0.015, hue: "blue" },
  { type: "ring", x: "70%", y: "72%", size: 90, depth: 0.42, rot: 0.05, hue: "pink", float: true },
  { type: "arc", x: "26%", y: "70%", size: 220, depth: 0.22, rot: -0.03, hue: "violet" },
  { type: "diamond", x: "88%", y: "58%", size: 26, depth: 0.5, rot: 0.06, hue: "white", float: true },
  { type: "diamond", x: "10%", y: "48%", size: 18, depth: 0.6, rot: -0.04, hue: "blue" },
  { type: "plus", x: "30%", y: "18%", size: 22, depth: 0.45, hue: "white", float: true },
  { type: "plus", x: "64%", y: "22%", size: 16, depth: 0.55, hue: "violet" },
  { type: "plus", x: "90%", y: "80%", size: 20, depth: 0.35, hue: "pink" },
  { type: "line", x: "50%", y: "12%", size: 180, depth: 0.28, rot: 0.01, hue: "violet" },
  { type: "line", x: "20%", y: "86%", size: 130, depth: 0.4, rot: -0.02, hue: "blue" },
  { type: "dot", x: "40%", y: "40%", size: 8, depth: 0.65, hue: "white", float: true },
  { type: "dot", x: "58%", y: "64%", size: 6, depth: 0.7, hue: "violet" },
  { type: "dot", x: "76%", y: "46%", size: 10, depth: 0.5, hue: "pink", float: true },
  { type: "dot", x: "12%", y: "68%", size: 7, depth: 0.58, hue: "white" },
  { type: "dot", x: "86%", y: "20%", size: 9, depth: 0.62, hue: "blue", float: true },
];

export const SilhouetteHero = ({
  sections,
  silhouetteSrc = siluetaImg.src,
}: SilhouetteHeroProps) => {
  const t = useT();
  const resolvedSections: HeroSection[] =
    sections ?? [
      { title: NAME, line1: t.hero.role, line2: t.hero.tagline },
      t.hero.sections[1],
      t.hero.sections[2],
    ];
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [hideSilhouette, setHideSilhouette] = useState(false);

  // Scroll-driven parallax (writes CSS vars so each element keeps its own base
  // transform/centering defined in CSS).
  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const items = Array.from(bg.querySelectorAll<HTMLElement>("[data-depth]"));
    const depths = items.map((el) => parseFloat(el.dataset.depth || "0"));
    const rots = items.map((el) => parseFloat(el.dataset.rot || "0"));
    const cur = items.map(() => ({ y: 0, r: 0 }));

    let scrollY = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      scrollY = window.scrollY;
    };

    const tick = () => {
      for (let i = 0; i < items.length; i++) {
        const targetY = scrollY * depths[i];
        const targetR = scrollY * rots[i];
        cur[i].y += (targetY - cur[i].y) * 0.12;
        cur[i].r += (targetR - cur[i].r) * 0.12;
        items[i].style.setProperty("--py", cur[i].y.toFixed(2) + "px");
        if (rots[i]) items[i].style.setProperty("--rot", cur[i].r.toFixed(2) + "deg");
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const renderFloater = (f: Floater, i: number) => {
    const className = `shero-floater shero-${f.type} hue-${f.hue ?? "violet"} ${
      f.float ? "shero-anim-float" : ""
    }`;
    const style: CSSProperties = {
      left: f.x,
      top: f.y,
      width: f.size,
      height: f.type === "line" ? 2 : f.size,
    };

    if (f.type === "plus") {
      return (
        <svg
          key={i}
          className={className}
          style={style}
          data-depth={f.depth}
          data-rot={f.rot ?? ""}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M12 2 V22 M2 12 H22" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    }
    if (f.type === "arc") {
      return (
        <svg
          key={i}
          className={className}
          style={style}
          data-depth={f.depth}
          data-rot={f.rot ?? ""}
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden
        >
          <path d="M5 50 A45 45 0 0 1 95 50" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    }
    return (
      <div
        key={i}
        className={className}
        style={style}
        data-depth={f.depth}
        data-rot={f.rot ?? ""}
        aria-hidden
      />
    );
  };

  const mainSection = resolvedSections[0];
  const scrollSections = resolvedSections.slice(1);

  return (
    <div ref={containerRef} className="hero-container">
      {/* Duotone (violet→blue) filter applied to the silhouette */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
        <filter id="shero-duotone" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0.2126 0.7152 0.0722 0 0
                    0 0 0 1 0"
          />
          <feComponentTransfer>
            <feFuncR type="table" tableValues="0.082 0.815" />
            <feFuncG type="table" tableValues="0.063 0.84" />
            <feFuncB type="table" tableValues="0.227 1.0" />
          </feComponentTransfer>
        </filter>
      </svg>

      {/* Animated graphic background (replaces the Three.js canvas) */}
      <div ref={bgRef} className="shero-bg" aria-hidden>
        <div className="shero-grid" data-depth="0.04" />
        <div className="shero-blob shero-blob--1" data-depth="0.14" />
        <div className="shero-blob shero-blob--2" data-depth="0.22" />
        <div className="shero-blob shero-blob--3" data-depth="0.34" />

        {FLOATERS.map(renderFloater)}

        {/* Silhouette */}
        <div className="shero-aura" data-depth="0.05" />
        {!hideSilhouette && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={silhouetteSrc}
            alt=""
            aria-hidden
            className="shero-silhouette"
            data-depth="0.03"
            onError={() => setHideSilhouette(true)}
          />
        )}

        <div className="shero-vignette" />
      </div>

      {/* Main content — the name animates in per character (blur reveal) */}
      <div className="hero-content cosmos-content">
        <h1 className="hero-title" aria-label={mainSection.title.replace("\n", " ")}>
          {mainSection.title.split("\n").map((line, i) => (
            <TextEffect
              key={`${line}-${i}`}
              as="span"
              per="char"
              preset="blur"
              delay={0.15 + i * 0.4}
              className="block max-w-[92vw] text-center"
            >
              {line}
            </TextEffect>
          ))}
        </h1>
        <div className="hero-subtitle cosmos-subtitle">
          <p className="subtitle-line">{mainSection.line1}</p>
          <p className="subtitle-line">{mainSection.line2}</p>
        </div>
      </div>

      {/* Additional sections for scrolling */}
      <div className="scroll-sections">
        {scrollSections.map((section, i) => (
          <section key={i} className="content-section">
            <AnimatedText as="h1" className="hero-title">
              {section.title}
            </AnimatedText>
            <div className="hero-subtitle cosmos-subtitle">
              <p className="subtitle-line">{section.line1}</p>
              <p className="subtitle-line">{section.line2}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default SilhouetteHero;
