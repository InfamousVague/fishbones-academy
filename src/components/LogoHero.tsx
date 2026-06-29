/// Big random logo at the top of the homepage.
///
/// The brand wants a stronger logo presence on the landing page;
/// this component picks one of the rotation logos under
/// `/public/logos/` at random on every mount, so each page-load
/// surfaces a different variant. Server-side rendering would
/// pin the choice across users, but this is a Vite SPA so the
/// random pick runs purely in the browser at first paint.
///
/// Loading strategy:
///   - `loading="eager"` + `fetchpriority="high"` so the chosen
///     logo lands as fast as possible — it will likely be the
///     LCP element on most paint paths, which is the trade-off
///     for the visual brand impact the design is going for.
///   - `decoding="async"` so layout doesn't block on decode.
///   - Each entry carries the trimmed source's exact width +
///     height so the browser reserves the right slot before the
///     pixels arrive (zero CLS). Trimmed dimensions vary per
///     logo since `magick -trim` strips whitespace differently
///     for each wordmark.

import { pickRotationLogo } from "../lib/rotationLogo";
import "./LogoHero.css";

export function LogoHero() {
  /// One themed brand logo picked at random per page load, cycling
  /// through every variant (groovy, slime, alien, atomic, noir, pulp,
  /// rocket, robot, time-warp). Stable across re-renders within a load.
  const chosen = pickRotationLogo();

  return (
    <div className="logo-hero" aria-hidden>
      <img
        src={`/logos/${chosen.src}`}
        alt="Libre Academy"
        width={chosen.w}
        height={chosen.h}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className="logo-hero__img"
      />
    </div>
  );
}
