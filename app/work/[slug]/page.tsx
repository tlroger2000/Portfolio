import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { SiteNav } from "@/components/site/nav";
import { DisciplinePageBody } from "@/components/site/discipline-page-body";
import { disciplines, getDiscipline, brand } from "@/lib/content";

export function generateStaticParams() {
  return disciplines.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDiscipline(slug);
  if (!d) return { title: "No trobat" };
  return {
    title: `${d.label} — ${brand.name}`,
    description: d.overview,
  };
}

export default async function DisciplinePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getDiscipline(slug);
  if (!d) notFound();

  return (
    <>
      <SiteNav />

      <DisciplinePageBody slug={slug} />

      <CinematicFooter
        brandWord={d.label.toUpperCase()}
        variant="work"
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
