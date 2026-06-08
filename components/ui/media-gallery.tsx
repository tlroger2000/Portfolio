import Image from "next/image";
import type { GalleryMedia } from "@/lib/galleries";

/**
 * Responsive masonry of real media (photos + videos). CSS columns keep each
 * item's natural aspect ratio (no cropping); images get blur-up placeholders,
 * videos get their extracted poster frame and inline controls.
 */
export function MediaGallery({
  items,
  alt,
}: {
  items: GalleryMedia[];
  alt: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {items.map((item, i) =>
        item.kind === "image" ? (
          <Image
            key={`${item.name}-${i}`}
            src={item.src}
            alt={`${alt} ${i + 1}`}
            placeholder="blur"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="mb-4 block h-auto w-full break-inside-avoid rounded-xl border border-border transition-transform duration-500 hover:scale-[1.02]"
          />
        ) : (
          <video
            key={`${item.name}-${i}`}
            src={item.src}
            poster={item.poster}
            controls
            muted
            loop
            playsInline
            preload="metadata"
            className="mb-4 block h-auto w-full break-inside-avoid rounded-xl border border-border bg-black"
          />
        )
      )}
    </div>
  );
}

export default MediaGallery;
