/// A big foreground "moving asset" that parallaxes as its section
/// scrolls through the viewport — the rocket flying up, the kaiju
/// looming, the saucer drifting, etc.
///
/// The asset can be a still image OR a transparent looping video
/// (detected by file extension). Videos render as a muted, inline,
/// looping <video> with the matching still PNG as its poster — so
/// browsers that can't play the alpha WebM (Safari) and reduced-motion
/// users simply see the static frame. An IntersectionObserver defers
/// loading + playback until the asset nears the viewport and pauses it
/// once it leaves, so an off-screen alpha video never burns decode time.
///
/// It tracks its OWN scroll position (framer-motion `useScroll` with
/// the wrapper as target, progress 0 → 1 as the asset travels from the
/// bottom of the viewport to the top) and maps that onto translateY
/// (parallax), a slight rotateZ tilt and a scale. Only cheap 2D
/// transforms run so the movement stays GPU-composited and smooth.
/// `prefers-reduced-motion` drops all of it to a static image.
///
/// Render it as a direct child of a `.parallax-host` (or any
/// `position: relative; isolation: isolate` host): it sits at
/// `z-index: -1`, above the atmosphere backdrop but behind the text,
/// and a placement class positions/sizes it in the section's detail
/// zone (away from the text-safe area).

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import "./ScrollAsset.css";

type Range = [number, number];

interface ScrollAssetProps {
  /// Filename under /public/backgrounds/ (e.g. "asset-rocket.png" or
  /// "asset-kaiju.webm"), or an absolute path. A video extension
  /// (.webm/.mp4/.mov) switches this to looping-video mode.
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

const VIDEO_RE = /\.(webm|mp4|mov)$/i;

export function ScrollAsset({
  src,
  place,
  y = [70, -70],
  scale = [1, 1],
  rotateZ = [0, 0],
  opacity = [1, 1],
}: ScrollAssetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
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
  const isVideo = VIDEO_RE.test(src);
  // The MOV / WebM / PNG siblings share the asset's basename (all exported
  // to the same crop, so swapping never shifts the layout).
  const base = url.replace(VIDEO_RE, "");
  const poster = isVideo ? `${base}.png` : url;

  // Only decode the alpha video while it's near the viewport: load +
  // play on approach, pause on exit. preload="none" keeps the file off
  // the wire until the observer first calls play().
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [isVideo, reduce]);

  const motionStyle = {
    y: yV,
    scale: scaleV,
    rotateZ: rotateZV,
    opacity: opacityV,
  };

  return (
    <div ref={ref} className={`scroll-asset scroll-asset--${place}`} aria-hidden>
      {reduce ? (
        // Reduced motion: static poster frame, no parallax, no playback.
        <img
          src={poster}
          alt=""
          className="scroll-asset__img"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      ) : isVideo ? (
        <motion.video
          ref={videoRef}
          className="scroll-asset__img"
          poster={poster}
          loop
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          draggable={false}
          style={motionStyle}
        >
          {/* Safari ignores VP9's alpha plane and would render the keyed-
              out (magenta) background, so give WebKit an HEVC-with-alpha
              MOV first; it's listed ahead of the WebM and Chrome/Firefox
              skip the quicktime container and fall through to the WebM. */}
          <source src={`${base}.mov`} type="video/quicktime" />
          <source src={`${base}.webm`} type="video/webm" />
        </motion.video>
      ) : (
        <motion.img
          src={url}
          alt=""
          className="scroll-asset__img"
          draggable={false}
          loading="lazy"
          decoding="async"
          style={motionStyle}
        />
      )}
    </div>
  );
}
