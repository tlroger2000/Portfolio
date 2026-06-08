"use client";

import React, { useEffect, useState } from "react";
import { useT } from "@/components/site/language-provider";

export interface Slide {
  img: string;
  text: string[];
}

const SLIDE_IMAGES = [
  "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop",
];

export default function Component({ slides }: { slides?: Slide[] }) {
  const t = useT();
  const resolved: Slide[] =
    slides ?? SLIDE_IMAGES.map((img, i) => ({ img, text: t.slides[i] ?? [] }));

  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % resolved.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + resolved.length) % resolved.length);

  // Keyboard navigation (the copy tells visitors to use the arrow keys).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrent((prev) => (prev - 1 + resolved.length) % resolved.length);
      } else if (e.key === "ArrowRight") {
        setCurrent((prev) => (prev + 1) % resolved.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resolved.length]);

  return (
    <div className="slideshow">
      {resolved.map((slide, i) => (
        <div
          key={i}
          className={`slide ${i === current ? "active" : ""}`}
          style={{ backgroundImage: `url(${slide.img})` }}
        >
          <div className="slide-text">
            {slide.text.map((line, j) => (
              <span key={j}>{line}</span>
            ))}
          </div>
        </div>
      ))}

      {/* Controls */}
      <button className="nav left" onClick={prevSlide} aria-label="Anterior">
        ←
      </button>
      <button className="nav right" onClick={nextSlide} aria-label="Següent">
        →
      </button>

      {/* Counter */}
      <div className="counter">
        0{current + 1} / 0{resolved.length}
      </div>
    </div>
  );
}
