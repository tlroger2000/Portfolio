"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScrollExpandMedia from "@/components/blocks/scroll-expansion-hero";
import { getDiscipline, isYoutubeItem, youtubeEmbed } from "@/lib/content";
import { useT } from "./language-provider";
import { AnimatedText } from "@/components/ui/animated-text";

export function DisciplinePageBody({ slug }: { slug: string }) {
  const t = useT();
  const d = getDiscipline(slug);
  if (!d) return null;
  const tr = t.disciplineById[slug];

  return (
    <ScrollExpandMedia
      mediaType={d.mediaType}
      mediaSrc={d.mediaSrc}
      posterSrc={d.posterSrc}
      bgImageSrc={d.bgImageSrc}
      title={tr.label}
      date={tr.kicker}
      scrollToExpand={t.work.scrollToExpand}
      textBlend
    >
      <div className="mx-auto max-w-4xl">
        <Link
          href="/#work"
          className="mb-10 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t.work.backToAll}
        </Link>

        <AnimatedText as="h2" className="mb-6 text-3xl font-bold md:text-4xl">
          {tr.tagline}
        </AnimatedText>
        <p className="mb-6 text-lg leading-relaxed text-muted-foreground">{tr.overview}</p>
        <p className="mb-12 text-lg leading-relaxed text-muted-foreground">{tr.conclusion}</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {d.gallery.map((item, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-xl border border-border ${
                i % 3 === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
              }`}
            >
              {isYoutubeItem(item) ? (
                <iframe
                  src={youtubeEmbed(item.youtube)}
                  title={`${tr.label} ${i + 1}`}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <Image
                  src={item}
                  alt={`${tr.label} ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </ScrollExpandMedia>
  );
}

export default DisciplinePageBody;
