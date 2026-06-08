import { SilhouetteHero } from "@/components/ui/silhouette-hero";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { SiteNav } from "@/components/site/nav";
import { DisciplinesGrid } from "@/components/site/disciplines-grid";
import { SkillsSection } from "@/components/site/skills-section";
import { GallerySection } from "@/components/site/gallery-section";
import { brand } from "@/lib/content";

export default function Home() {
  return (
    <>
      <SiteNav />

      {/* Immersive scroll-driven silhouette hero (text from the language context) */}
      <SilhouetteHero />

      {/* Disciplines */}
      <DisciplinesGrid />

      {/* Tools & software */}
      <SkillsSection />

      {/* Photography showcase */}
      <GallerySection />

      {/* Footer */}
      <CinematicFooter
        brandWord="ROGER"
        variant="home"
        email={brand.email}
        owner={brand.owner}
        phone={brand.phone}
        phoneDisplay={brand.phoneDisplay}
        instagramUrl={brand.instagramUrl}
        instagramHandle={brand.instagram}
        linkedinUrl={brand.linkedinUrl}
      />
    </>
  );
}
