"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { disciplines, disciplineCover } from "@/lib/content";
import { useT } from "./language-provider";
import { AnimatedText } from "@/components/ui/animated-text";

export function DisciplinesGrid() {
  const t = useT();
  return (
    <section
      id="work"
      className="relative z-10 w-full bg-background px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <AnimatedText as="h2" className="text-4xl font-black tracking-tighter md:text-6xl">
            {t.disciplines.heading}
          </AnimatedText>
          <p className="max-w-md text-sm text-muted-foreground md:text-base">
            {t.disciplines.sub}
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {disciplines.map((d, i) => (
            <Link
              key={d.slug}
              href={`/work/${d.slug}`}
              className={`group relative block overflow-hidden rounded-2xl border border-border bg-card ${
                i === 0
                  ? "aspect-[16/10] sm:col-span-2 lg:col-span-2"
                  : "aspect-[4/3]"
              }`}
            >
              <Image
                src={disciplineCover(d)}
                alt={t.disciplineById[d.slug].label}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <span className="text-xs font-mono tracking-widest text-white/70">
                  {d.index}
                </span>
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white md:text-3xl">
                      {t.disciplineById[d.slug].label}
                    </h3>
                    <p className="mt-1 text-sm text-white/70">
                      {t.disciplineById[d.slug].tagline}
                    </p>
                  </div>
                  <ArrowUpRight className="h-6 w-6 shrink-0 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DisciplinesGrid;
