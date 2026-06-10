"use client";

import React from "react";
import { useReducedMotion } from "framer-motion";
import { TextEffect } from "./text-effect";
import { SpecialText } from "./special-text";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

/**
 * Títol animat, centralitzat per a tota la web. S'anima quan entra a la vista
 * (en scroll), no pas en muntar — així els títols de seccions sota el plec
 * també s'animen quan hi arribes.
 *   · h2 (i h1 / p / span) → revelat paraula a paraula amb desenfocat
 *     (TextEffect, preset "blur").
 *   · h3 → efecte "decode"/scramble monoespaiat (SpecialText).
 * Sota "prefers-reduced-motion" cau a text pla sense animació.
 */
export function AnimatedText({
  children,
  as = "h2",
  className,
  per = "word",
}: {
  children: string;
  as?: Tag;
  className?: string;
  per?: "word" | "char";
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    const Tag = as as React.ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  // h3 → "decode" monoespaiat quan entra a la vista (manté la semàntica <h3>).
  if (as === "h3") {
    return (
      <h3 className={className}>
        <SpecialText inView>{children}</SpecialText>
      </h3>
    );
  }

  // h1 / h2 / p / span → desenfocat paraula a paraula en entrar a la vista.
  return (
    <TextEffect as={as} per={per} preset="blur" inView className={className}>
      {children}
    </TextEffect>
  );
}

export default AnimatedText;
