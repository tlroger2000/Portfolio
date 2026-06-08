"use client";

import { useEffect, useRef } from "react";
import type { HeroSection } from "./horizon-hero-section";

export interface VideoScrollHeroProps {
  /** Ruta del vídeo dins /public, p. ex. "/hero.mp4". */
  videoSrc: string;
  /** Imatge de fons mentre carrega el vídeo (recomanat). */
  poster?: string;
  /** 3 seccions: índex 0 és la vista inicial; 1 i 2 es revelen amb scroll. */
  sections?: HeroSection[];
  /** Llargada de scroll en alçades de pantalla (per defecte 3). */
  scrollLength?: number;
  /**
   * "scrub" → el vídeo avança lligat al scroll (cal mp4 optimitzat o seqüència).
   * "play"  → el vídeo es reprodueix sol en bucle de fons.
   */
  mode?: "scrub" | "play";
}

const DEFAULT_SECTIONS: HeroSection[] = [
  { title: "STUDIO", line1: "La teva animació", line2: "feta a After Effects" },
  { title: "CRAFT", line1: "Capes que cobren vida", line2: "a mesura que baixes" },
  { title: "VISION", line1: "El teu segell visual", line2: "en moviment" },
];

export const VideoScrollHero = ({
  videoSrc,
  poster,
  sections = DEFAULT_SECTIONS,
  scrollLength = 3,
  mode = "scrub",
}: VideoScrollHeroProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Play mode (or reduced motion): just loop the video in the background.
    if (mode === "play" || prefersReduced) {
      video.muted = true;
      video.loop = true;
      video.play().catch(() => {});
    }

    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const windowHeight = window.innerHeight;
      const maxScroll = Math.max(el.offsetHeight - windowHeight, 1);
      const progress = Math.min(window.scrollY / maxScroll, 1);

      if (mode === "scrub" && !prefersReduced && video.duration) {
        targetTime.current = progress * video.duration;
      }
    };

    // Smoothly ease the video's currentTime toward the scroll target.
    const tick = () => {
      if (mode === "scrub" && !prefersReduced && video.readyState >= 2) {
        const diff = targetTime.current - video.currentTime;
        if (Math.abs(diff) > 0.01) {
          video.currentTime += diff * 0.15;
        }
      }
      rafId.current = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [mode]);

  const splitTitle = (text: string) =>
    text.split("\n").map((line, li) => (
      <span key={li} className="title-line">
        {line.split(" ").map((word, wi) => (
          <span key={wi} className="title-word">
            {word.split("").map((char, ci) => (
              <span key={ci} className="title-char">
                {char}
              </span>
            ))}
          </span>
        ))}
      </span>
    ));

  const main = sections[0];
  const rest = sections.slice(1);

  return (
    <div
      ref={containerRef}
      className="hero-container"
      style={{ height: `${scrollLength * 100}vh` }}
    >
      <video
        ref={videoRef}
        className="hero-video"
        src={videoSrc}
        poster={poster}
        muted
        playsInline
        preload="auto"
      />

      <div className="hero-content">
        <h1 className="hero-title">{splitTitle(main.title)}</h1>
        <div className="hero-subtitle">
          <p className="subtitle-line">{main.line1}</p>
          <p className="subtitle-line">{main.line2}</p>
        </div>
      </div>

      <div className="scroll-sections">
        {rest.map((section, i) => (
          <section key={i} className="content-section">
            <h1 className="hero-title">{section.title}</h1>
            <div className="hero-subtitle">
              <p className="subtitle-line">{section.line1}</p>
              <p className="subtitle-line">{section.line2}</p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default VideoScrollHero;
