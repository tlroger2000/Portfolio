"use client";

import { Skills } from "@/components/ui/skills-showcase";
import { useT } from "./language-provider";
import { AnimatedText } from "@/components/ui/animated-text";

export function SkillsSection() {
  const t = useT();
  return (
    <section className="relative z-10 w-full bg-background px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Intro */}
        <div>
          <AnimatedText as="h2" className="text-4xl font-black tracking-tighter md:text-6xl">
            {t.skills.heading}
          </AnimatedText>
          <p className="mt-4 max-w-md text-sm text-muted-foreground md:text-base">
            {t.skills.sub}
          </p>
        </div>

        {/* Skills list */}
        <div className="flex justify-center lg:justify-end">
          <Skills kicker={t.skills.kicker} hint={t.skills.hint} />
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
