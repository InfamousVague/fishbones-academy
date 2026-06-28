/// A big foreground "moving asset" that animates in 3D as its hero
/// section scrolls through the viewport — the rocket flying up, the
/// kaiju looming, the saucer drifting, etc.
///
/// It tracks its OWN scroll position (framer-motion `useScroll` with
/// the wrapper as target, progress 0 → 1 as the asset travels from the
/// bottom of the viewport to the top) and maps that progress onto
/// translateY (parallax), a little rotateX/rotateY/rotateZ tilt and a
/// scale — the wrapper carries a CSS `perspective` so the rotations
/// read as real 3D depth rather than a flat skew. `prefers-reduced-
/// motion` drops all of it to a static image.
///
/// Render it as a direct child of an isolated `.atmos` hero (or any
/// `position: relative; isolation: isolate` host): it sits at
/// `z-index: -1`, above the atmosphere backdrop but behind the text,
/// and a placement class positions/sizes it in the hero's detail zone
/// (away from the text-safe area).

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import "./ScrollAsset.css";

type Range = [number, number];

interface ScrollAssetProps {
  /// Filename under /public/backgrounds/ (e.g. "asset-rocket.png"), or
  /// an absolute path.
  src: string;
  /// Placement modifier class (see ScrollAsset.css), e.g. "rocket".
  place: string;
  /// translateY in px across scroll progress 0 → 1 (parallax drift).
  y?: Range;
  /// uniform scale across progress 0 → 1.
  scale?: Range;
  /// degrees of in-plane (2D) rotation across progress 0 → 1.
  rotateZ?: Range;
  /// Deprecated 3D props — accepted for call-site compatibility but
  /// no longer applied (the 3D perspective tilt was dropped for
  /// scroll performance; only cheap 2D transforms run now).
  rotateX?: Range;
  rotateY?: Range;
  /// opacity across progress 0 → 1.
  opacity?: Range;
}

export function ScrollAsset({
  src,
  place,
  y = [70, -70],
  scale = [1, 1],
  rotateZ = [0, 0],
  opacity = [1, 1],
}: ScrollAssetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Progress 0 when the asset's top enters the bottom of the viewport,
  // 1 when its bottom leaves the top — i.e. its whole travel through
  // the screen. Only cheap 2D transforms are derived from it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yV = useTransform(scrollYProgress, [0, 1], y);
  const scaleV = useTransform(scrollYProgress, [0, 1], scale);
  const rotateZV = useTransform(scrollYProgress, [0, 1], rotateZ);
  const opacityV = useTransform(scrollYProgress, [0, 1], opacity);

  const url = src.startsWith("/") ? src : `/backgrounds/${src}`;

  return (
    <div ref={ref} className={`scroll-asset scroll-asset--${place}`} aria-hidden>
      {reduce ? (
        <img
          src={url}
          alt=""
          className="scroll-asset__img"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <motion.img
          src={url}
          alt=""
          className="scroll-asset__img"
          draggable={false}
          loading="lazy"
          decoding="async"
          style={{
            y: yV,
            scale: scaleV,
            rotateZ: rotateZV,
            opacity: opacityV,
          }}
        />
      )}
    </div>
  );
}
