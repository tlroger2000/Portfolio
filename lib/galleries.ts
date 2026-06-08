// Public helpers over the generated media manifest. Components import from here
// (stable API) rather than from the auto-generated file directly.
import { galleries } from "./galleries.generated";

export type {
  GalleryImage,
  GalleryVideo,
  GalleryMedia,
  GalleryGroup,
  SectionGallery,
} from "./galleries.generated";
export { galleries } from "./galleries.generated";

/** Real media for a discipline slug, or undefined if the folder has none. */
export const getSectionGallery = (slug: string) => galleries[slug];

/** Whether a discipline has any real media mapped from components/images. */
export const hasGallery = (slug: string) => {
  const s = galleries[slug];
  return !!s && (s.rootItems.length > 0 || s.groups.length > 0);
};
