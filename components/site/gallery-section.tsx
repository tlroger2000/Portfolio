"use client";

import Slideshow from "@/components/ui/slideshow";
import { useT } from "./language-provider";
import { AnimatedText } from "@/components/ui/animated-text";
import { visualSelection } from "@/lib/visual-selection.generated";

export function GallerySection() {
  const t = useT();

  // Landscape loose photos paired with the poetic captions (cycled if fewer).
  const slides = visualSelection.map((photo, i) => ({
    img: photo.src,
    caption: t.slides.length ? t.slides[i % t.slides.length] : [],
  }));

  return (
    <section className="relative z-10 bg-background">
      <div className="mx-auto max-w-7xl px-6 pt-24 md:px-10">
        <AnimatedText as="h2" className="text-4xl font-black tracking-tighter md:text-6xl">
          {t.gallery.heading}
        </AnimatedText>
        <p className="mt-4 max-w-md text-sm text-muted-foreground md:text-base">
          {t.gallery.sub}
        </p>
      </div>
      <div className="mt-12">
        <Slideshow slides={slides} />
      </div>
    </section>
  );
}

export default GallerySection;
