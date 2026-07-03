/// Mobile showcase — a row of phone mockups on the homepage, framing
/// real screenshots of the app running in a phone browser (the PWA).
/// Mirrors the desktop `.app-shot` section ("the whole app, in one
/// window") with its pocket-sized counterpart, so the page tells a
/// "desktop AND mobile, same app" story. The device frame is pure CSS
/// (bezel + dynamic-island pill); the screenshots are the same
/// courses, reader and code blocks the desktop app renders.
///
/// On wide screens the four phones fan out in a gently staggered row;
/// on narrow screens the row becomes a horizontal scroll-snap carousel
/// so a phone visitor literally swipes through phones.

import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import "./MobileShowcase.css";

interface PhoneShot {
  src: string;
  alt: string;
  caption: string;
  /// The one shot we visually feature (raised + ringed) — the code
  /// blocks, since readable code on a phone is the headline.
  featured?: boolean;
}

const PHONES: PhoneShot[] = [
  {
    src: "/screenshots/mobile-library.webp",
    alt: "The Libre Academy mobile library, a grid of illustrated course covers (A to Zig, Algorithms, Astro, Automate the Boring Stuff) with language filters.",
    caption: "Your whole library",
  },
  {
    src: "/screenshots/mobile-reader.webp",
    alt: "A Rust lesson open in the mobile reader, with narration, prose and an illustrated concept card, laid out for a phone screen.",
    caption: "Read anywhere",
  },
  {
    src: "/screenshots/mobile-challenge.webp",
    alt: "A Rust coding challenge on mobile, a syntax-highlighted code template with drag-in blocks, two already placed and a pool of answer chips to pick from.",
    caption: "Hands-on challenges",
    featured: true,
  },
  {
    src: "/screenshots/mobile-discover.webp",
    alt: "The mobile Discover tab, a catalog of installable courses with cover art and one-tap install.",
    caption: "Discover & install",
  },
];

export function MobileShowcase() {
  return (
    <motion.section
      className="section mobshow"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="mobshow__head">
        <span className="section__eyebrow">
          <Smartphone size={14} /> Now on your phone
        </span>
        <h2 className="section__title section__title--centered">
          The whole app, in your pocket.
        </h2>
        <p className="section__subtitle section__subtitle--centered">
          Open Libre in any mobile browser. No App Store, no install. The same{" "}
          courses, the same illustrated lessons, and hands-on coding challenges
          you solve by snapping code blocks into place, all built for thumbs, not
          keyboards. Add it to your home screen and it launches like a native
          app.
        </p>
      </div>

      <div className="mobshow__stage" role="list">
        {PHONES.map((p, i) => (
          <motion.div
            className={`mobshow__item${p.featured ? " mobshow__item--featured" : ""}`}
            role="listitem"
            key={p.src}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
          >
            <div className="mobshow__phone">
              <span className="mobshow__island" aria-hidden />
              <div className="mobshow__screen">
                <img
                  src={p.src}
                  alt={p.alt}
                  className="mobshow__img"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  width={780}
                  height={1688}
                />
              </div>
            </div>
            <span className="mobshow__caption">{p.caption}</span>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
