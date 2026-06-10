"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import ScrollExpandMedia from "@/components/blocks/scroll-expansion-hero";
import {
  getDiscipline,
  isYoutubeItem,
  isInstagramItem,
  youtubeEmbed,
  instagramEmbed,
  type GalleryItem,
} from "@/lib/content";
import { getSectionGallery } from "@/lib/galleries";
import { useT } from "./language-provider";
import { AnimatedText } from "@/components/ui/animated-text";
import { InteractiveGallery } from "@/components/ui/interactive-gallery";
import { MagazineFlipbook } from "@/components/ui/flipbook";

// Mateixa corba i revelat (fos + desenfocat en scroll) que la galeria de foto.
const REVEAL_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Una targeta de la graella de fallback: un reel/post d'Instagram (vertical),
 * un vídeo de YouTube o una imatge. Apareix amb un revelat animat en scroll,
 * igual que la galeria de la secció de foto.
 */
function FallbackItem({
  item,
  index,
  label,
}: {
  item: GalleryItem;
  index: number;
  label: string;
}) {
  const reduce = useReducedMotion();
  const reveal = {
    initial: reduce ? false : { opacity: 0, y: 28, filter: "blur(10px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, amount: 0.12, margin: "0px 0px -8% 0px" },
    transition: { duration: 0.7, ease: REVEAL_EASE, delay: (index % 3) * 0.07 },
  } as const;

  // Instagram: alçada fixa vertical (els reels són en format retrat).
  if (isInstagramItem(item)) {
    return (
      <motion.div
        {...reveal}
        className="relative overflow-hidden rounded-xl border border-border bg-card"
      >
        <iframe
          src={instagramEmbed(item.instagram)}
          title={`${label} ${index + 1}`}
          className="h-[620px] w-full"
          loading="lazy"
          scrolling="no"
          allow="encrypted-media"
          allowFullScreen
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      {...reveal}
      className={`relative overflow-hidden rounded-xl border border-border ${
        index % 3 === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
      }`}
    >
      {isYoutubeItem(item) ? (
        <iframe
          src={youtubeEmbed(item.youtube)}
          title={`${label} ${index + 1}`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <Image
          src={item}
          alt={`${label} ${index + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      )}
    </motion.div>
  );
}

export function DisciplinePageBody({ slug }: { slug: string }) {
  const t = useT();
  const d = getDiscipline(slug);
  if (!d) return null;
  const tr = t.disciplineById[slug];

  // Real media mapped from components/images/<folder>/...
  const section = getSectionGallery(slug);
  const groups = section?.groups ?? [];
  const rootItems = section?.rootItems ?? [];
  // When a section is split into subfolders we show those (loose root photos are
  // reserved for the home "visual selection"); otherwise show the flat folder.
  const hasReal = groups.length > 0 || rootItems.length > 0;

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
      <div className="mx-auto max-w-6xl">
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
        </div>

        {slug === "disseny" && (
          <div className="mb-16">
            <MagazineFlipbook heading="Magazine" />
          </div>
        )}

        {hasReal ? (
          groups.length > 0 ? (
            <div className="space-y-16">
              {groups.map((g) => (
                <InteractiveGallery
                  key={g.path.join("/")}
                  title={g.path.join(" · ")}
                  items={g.items}
                  alt={`${tr.label} — ${g.name}`}
                  previewCount={3}
                  labelMore={t.work.seeAll}
                  labelLess={t.work.seeLess}
                />
              ))}
            </div>
          ) : (
            <InteractiveGallery items={rootItems} alt={tr.label} />
          )
        ) : d.sections && d.sections.length > 0 ? (
          /* Subseccions amb títol (p.ex. vídeo: Videoclips, After-Party…). */
          <div className="space-y-16">
            {d.sections.map((sec) => {
              // Els reels d'Instagram són verticals: graella de més columnes.
              const vertical = sec.items.every(isInstagramItem);
              return (
                <div key={sec.title}>
                  <AnimatedText
                    as="h3"
                    className="mb-6 text-2xl font-bold md:text-3xl"
                  >
                    {sec.title}
                  </AnimatedText>
                  <div
                    className={
                      vertical
                        ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid grid-cols-1 gap-4 sm:grid-cols-2"
                    }
                  >
                    {sec.items.map((item, i) => (
                      <FallbackItem
                        key={i}
                        item={item}
                        index={i}
                        label={`${tr.label} — ${sec.title}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Fallback for sections without real images yet (web / 3d). */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {d.gallery.map((item, i) => (
              <FallbackItem key={i} item={item} index={i} label={tr.label} />
            ))}
          </div>
        )}
      </div>
    </ScrollExpandMedia>
  );
}

export default DisciplinePageBody;
