/// A full-bleed section background that PARALLAXES as the section
/// scrolls through the viewport — the vintage paperback atmosphere for
/// one themed homepage "scene". The image layer is taller than the
/// section and drifts vertically (opposite-ish to scroll) so it reads
/// with depth; soft top/bottom mask fades it into the neighbouring
/// solid-black sections. `prefers-reduced-motion` pins it static.
///
/// Render it as the first child of a `.parallax-host` element
/// (position: relative; isolation: isolate). It sits at z-index -1,
/// behind any <ScrollAsset> (also -1, later in the DOM) and the text.

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import "./ParallaxBg.css";

interface ParallaxBgProps {
  /// Filename under /public/backgrounds/ (e.g. "bg-showcase.jpg").
  src: string;
  /// CSS background-position for the cover image.
  position?: string;
  /// Base opacity of the atmosphere (the art is already dark).
  opacity?: number;
  /// Vertical parallax travel in px across the section's scroll.
  travel?: number;
  /// Which edges fade into black.
  fade?: "top" | "bottom" | "both" | "none";
}

export function ParallaxBg({
  src,
  position = "center",
  opacity = 1,
  travel = 90,
  fade = "both",
}: ParallaxBgProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-travel, travel]);

  return (
    <div ref={ref} className={`parallax-bg parallax-bg--fade-${fade}`} aria-hidden>
      <motion.div
        className="parallax-bg__layer"
        style={{
          backgroundImage: `url(/backgrounds/${src})`,
          backgroundPosition: position,
          opacity,
          y: reduce ? 0 : y,
        }}
      />
    </div>
  );
}
