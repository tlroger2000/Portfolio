// -----------------------------------------------------------------------------
// Portfolio content config — edita aquí els textos, imatges i dades.
// Substitueix les URLs d'Unsplash pel teu propi material quan el tinguis.
// -----------------------------------------------------------------------------

// Mèdia destacat de cada disciplina (hero + fons + portada). Canvia aquí la foto
// o disseny; els vídeos locals viuen a /public/media (els hi copia
// scripts/gen-galleries.cjs des de components/images/).
import fotoHero from "@/components/images/fotos/IMG_4665.jpg";
import fotoBg from "@/components/images/fotos/IMG_5212.jpg";
import fotoCover from "@/components/images/fotos/IMG_4726.jpg";
import dissenyCover from "@/components/images/graphic_design/Lowlight.png";

const u = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

export const brand = {
  /** Logotip curt a la barra superior. */
  name: "ROGER TORRES",
  /** Nom complet mostrat en gran al hero. */
  fullName: "ROGER TORRES LINARES",
  /** Nom per al copyright i crèdits. */
  owner: "Roger Torres Linares",
  /** Resum de la professió (subtítol del hero). */
  role: "Creador visual multidisciplinari",
  email: "tlroger2000@gmail.com",
  phone: "+34665657414",
  phoneDisplay: "665 65 74 14",
  instagram: "thebeast_shots",
  instagramUrl: "https://instagram.com/thebeast_shots",
  linkedinUrl: "https://www.linkedin.com/in/roger-torres-linares-275178170/",
  tagline: "Vídeo · Foto · Disseny gràfic · Web · 3D",
};

/** Un element de galeria: una imatge (URL) o un vídeo de YouTube. */
export type GalleryItem = string | { youtube: string };

export interface Discipline {
  slug: string;
  label: string;
  index: string;
  tagline: string;
  /** Etiqueta curta mostrada sobre el mèdia del hero d'expansió. */
  kicker: string;
  mediaType: "image" | "video";
  mediaSrc: string;
  /** Imatge de pòster del vídeo (es mostra mentre carrega o si el vídeo falla). */
  posterSrc?: string;
  bgImageSrc: string;
  /** Imatge de portada de la targeta a la home (per defecte, la 1a imatge de la galeria). */
  cover?: string;
  overview: string;
  conclusion: string;
  gallery: GalleryItem[];
}

/** True si un element de galeria és un vídeo de YouTube. */
export const isYoutubeItem = (item: GalleryItem): item is { youtube: string } =>
  typeof item === "object" && item !== null && "youtube" in item;

/** Converteix una URL de YouTube en URL d'incrustació (embed). */
export const youtubeEmbed = (url: string): string => {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  const id = m?.[1];
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : url;
};

export const disciplines: Discipline[] = [
  {
    slug: "video",
    label: "Vídeo",
    index: "01",
    tagline: "Narrativa en moviment",
    kicker: "Producció audiovisual",
    mediaType: "video",
    // URL neta de YouTube (sense &list/&start_radio perquè l'embed funcioni).
    mediaSrc: "https://www.youtube.com/watch?v=ediozrCDths",
    posterSrc: "https://img.youtube.com/vi/ediozrCDths/sddefault.jpg",
    bgImageSrc: "https://img.youtube.com/vi/ediozrCDths/sddefault.jpg",
    cover: "https://img.youtube.com/vi/ediozrCDths/sddefault.jpg",
    overview:
      "Producció i postproducció de vídeo: peces de marca, videoclips, documentals i contingut per a xarxes. Cada projecte busca un to visual propi, des del concepte fins al color grading final.",
    conclusion:
      "Del guió a l'entrega: rodatge, muntatge, motion graphics i so. Explica'm la teva idea i la convertim en imatge en moviment.",
    gallery: [
      { youtube: "https://www.youtube.com/watch?v=9ydk2k4pcBw" },
      u("1469474968028-56623f02e42e"),
      u("1470071459604-3b5ec3a7fe05"),
      u("1441974231531-c6227db76b6e"),
    ],
  },
  {
    slug: "foto",
    label: "Fotografia",
    index: "02",
    tagline: "Capturar l'instant",
    kicker: "Fotografia",
    mediaType: "image",
    mediaSrc: fotoHero.src,
    bgImageSrc: fotoBg.src,
    cover: fotoCover.src,
    overview:
      "Fotografia de producte, retrat, esdeveniment i paisatge. Una mirada que treballa la llum, la composició i el moment per crear imatges amb intenció.",
    conclusion:
      "Sessions a mida, retoc i direcció d'art. Imatges pensades per a la teva marca, projecte o història personal.",
    gallery: [
      u("1470071459604-3b5ec3a7fe05"),
      u("1441974231531-c6227db76b6e"),
      u("1426604966848-d7adac402bff"),
      u("1506744038136-46273834b3fb"),
    ],
  },
  {
    slug: "disseny",
    label: "Disseny gràfic",
    index: "03",
    tagline: "Identitat i forma",
    kicker: "Disseny gràfic",
    mediaType: "video",
    mediaSrc: "/media/graphic_design/MotionGraphic.mp4",
    posterSrc: "/media/graphic_design/MotionGraphic.poster.jpg",
    bgImageSrc: "/media/graphic_design/MotionGraphic.poster.jpg",
    cover: dissenyCover.src,
    overview:
      "Identitats visuals, branding, editorial i disseny per a impressió i digital. Sistemes coherents que comuniquen amb claredat i personalitat.",
    conclusion:
      "Logotips, guies d'estil, packaging i peces gràfiques. Construïm una marca que es reconegui a primer cop d'ull.",
    gallery: [
      u("1558655146-9f40138edfeb"),
      u("1561070791-2526d30994b5"),
      u("1620121692029-d088224ddc74"),
      u("1635776062127-d379bfcba9f8"),
    ],
  },
  {
    slug: "web",
    label: "Web",
    index: "04",
    tagline: "Experiències digitals",
    kicker: "Desenvolupament web",
    mediaType: "video",
    mediaSrc: "/media/Web/web-lgtbicostabrava.mp4",
    posterSrc: "/media/Web/web-lgtbicostabrava.poster.jpg",
    bgImageSrc: "/media/Web/web-lgtbicostabrava.poster.jpg",
    cover: "/media/Web/web-lgtbicostabrava.poster.jpg",
    overview:
      "Disseny i desenvolupament de webs i aplicacions modernes amb React, Next.js i animacions interactives. Rendiment, accessibilitat i una estètica acurada.",
    conclusion:
      "Des de la landing fins a la plataforma completa: codi net, responsive i pensat per convertir. Donem vida a la teva presència digital.",
    gallery: [
      u("1542744173-8e7e53415bb0"),
      u("1517180102446-f3ece451e9d8"),
      u("1518770660439-4636190af475"),
      u("1620121692029-d088224ddc74"),
    ],
  },
  {
    slug: "3d",
    label: "3D",
    index: "05",
    tagline: "Volum i textura",
    kicker: "Disseny 3D",
    mediaType: "video",
    mediaSrc: "/media/3d/PlasmaBall_Roger_Torres_Linares.mp4",
    posterSrc: "/media/3d/PlasmaBall_Roger_Torres_Linares.poster.jpg",
    bgImageSrc: "/media/3d/PlasmaBall_Roger_Torres_Linares.poster.jpg",
    cover: "/media/3d/PlasmaBall_Roger_Torres_Linares.poster.jpg",
    overview:
      "Modelatge, render i animació 3D per a producte, art conceptual i experiències immersives. Materials, il·luminació i composició cuidats al detall.",
    conclusion:
      "Visualitzacions realistes o abstractes, llestes per a web, vídeo o impressió. Donem profunditat i textura a les teves idees.",
    gallery: [
      u("1620121692029-d088224ddc74"),
      u("1635776062127-d379bfcba9f8"),
      u("1518770660439-4636190af475"),
      u("1558655146-9f40138edfeb"),
    ],
  },
];

export const getDiscipline = (slug: string) =>
  disciplines.find((d) => d.slug === slug);

/**
 * Imatge de portada d'una disciplina per a la graella: la `cover` explícita o,
 * si no n'hi ha, la primera imatge (URL) de la galeria — mai un element de vídeo,
 * que no és una imatge vàlida per a <Image>.
 */
export const disciplineCover = (d: Discipline): string =>
  d.cover ?? d.gallery.find((g): g is string => typeof g === "string") ?? "";
