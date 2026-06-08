"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type Tag = "h1" | "h2" | "h3" | "p" | "span";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/**
 * Heading that reveals word-by-word (blur + rise). Animates on mount so it can
 * never get stuck hidden; falls back to plain text under reduced motion.
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
  const MotionTag = motion[as] as typeof motion.h2;

  if (reduce) {
    const Tag = as as React.ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const segments = per === "word" ? children.split(/(\s+)/) : children.split("");

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="visible"
      variants={container}
      aria-label={children}
    >
      {segments.map((seg, i) => (
        <motion.span
          key={`${i}-${seg}`}
          variants={item}
          aria-hidden
          className="inline-block whitespace-pre"
        >
          {seg}
        </motion.span>
      ))}
    </MotionTag>
  );
}

export default AnimatedText;
