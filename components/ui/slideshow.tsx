"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";

export interface Slide {
  img: StaticImageData;
  caption?: string[];
}

export default function Slideshow({ slides }: { slides: Slide[] }) {
  const count = slides.length;
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % count);
  const prev = () => setCurrent((prev) => (prev - 1 + count) % count);

  // Keyboard navigation (the copy tells visitors to use the arrow keys).
  useEffect(() => {
    if (count === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setCurrent((prev) => (prev - 1 + count) % count);
      } else if (e.key === "ArrowRight") {
        setCurrent((prev) => (prev + 1) % count);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count]);

  if (count === 0) return null;

  return (
    <div className="slideshow">
      {slides.map((slide, i) => (
        <div key={i} className={`slide ${i === current ? "active" : ""}`}>
          <Image
            src={slide.img}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            placeholder="blur"
            className="object-cover"
          />
          {slide.caption && slide.caption.length > 0 && (
            <div className="slide-text">
              {slide.caption.map((line, j) => (
                <span key={j}>{line}</span>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Controls */}
      <button className="nav left" onClick={prev} aria-label="Anterior">
        ←
      </button>
      <button className="nav right" onClick={next} aria-label="Següent">
        →
      </button>

      {/* Counter */}
      <div className="counter">
        0{current + 1} / 0{count}
      </div>
    </div>
  );
}
