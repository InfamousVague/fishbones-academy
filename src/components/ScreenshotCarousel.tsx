/// A small auto-advancing carousel of app screenshots for the homepage.
/// Slides crossfade (opacity only — cheap + GPU-composited), auto-advance
/// every few seconds, pause on hover/focus, and can be driven by the dots
/// or the hover arrows. `prefers-reduced-motion` stops the auto-advance
/// and the fade, leaving a manually-navigable gallery.

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./ScreenshotCarousel.css";

export interface Shot {
  src: string;
  alt: string;
}

export function ScreenshotCarousel({
  images,
  interval = 5000,
}: {
  images: Shot[];
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const n = images.length;

  const go = (i: number) => setIndex(((i % n) + n) % n);

  useEffect(() => {
    if (reduce || paused || n <= 1) return;
    const id = setInterval(() => setIndex((x) => (x + 1) % n), interval);
    return () => clearInterval(id);
  }, [reduce, paused, n, interval]);

  return (
    <div
      className="shotcar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="shotcar__frame">
        {images.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={i === index ? img.alt : ""}
            className={`shotcar__img${i === index ? " shotcar__img--active" : ""}`}
            draggable={false}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            aria-hidden={i !== index}
          />
        ))}

        {n > 1 && (
          <>
            <button
              type="button"
              className="shotcar__arrow shotcar__arrow--prev"
              onClick={() => go(index - 1)}
              aria-label="Previous screenshot"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="shotcar__arrow shotcar__arrow--next"
              onClick={() => go(index + 1)}
              aria-label="Next screenshot"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {n > 1 && (
        <div className="shotcar__dots" role="tablist" aria-label="Screenshots">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              className={`shotcar__dot${i === index ? " shotcar__dot--active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Show screenshot ${i + 1} of ${n}`}
              aria-selected={i === index}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  );
}
