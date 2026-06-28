/// Shared source-of-truth for the rotating Libre.academy logo.
///
/// Two surfaces render a logo from this pool:
///   1. <LogoHero> — the oversized brand logo at the top of the
///      homepage hero (the first thing you see).
///   2. <Nav> — the compact logo that fades INTO the top menu bar
///      once you scroll past the hero (and shows immediately on
///      every non-home route, where there is no hero to scroll past).
///
/// `pickRotationLogo()` memoises a single random pick for the whole
/// page load, so the exact logo you saw filling the hero is the one
/// that docks into the nav as you scroll — a deliberate continuity
/// beat rather than two unrelated random picks. A full page reload
/// re-evaluates this module and yields a fresh pick.

export interface RotationLogo {
  src: string;
  /// Exact post-`magick -trim` pixel dimensions, passed straight to
  /// the <img> width/height attrs so the browser reserves the right
  /// aspect-ratio slot (zero layout shift) at any rendered size.
  w: number;
  h: number;
}

export const ROTATION_LOGOS: RotationLogo[] = [
  { src: "logo-01.png", w: 640, h: 525 },
  { src: "logo-02.png", w: 1024, h: 518 },
  { src: "logo-03.png", w: 1024, h: 531 },
  { src: "logo-04.png", w: 1024, h: 365 },
];

/// The dedicated "groovy" psychedelic header logo (derived from the
/// full-res master). The top nav ALWAYS uses this one image — it reads
/// best in the bar — instead of rotating; the hero still rotates
/// through the ROTATION_LOGOS pool on each load.
export const GROOVY_LOGO: RotationLogo = {
  src: "header-logo.png",
  w: 1100,
  h: 902,
};

let picked: RotationLogo | null = null;

/// Returns the logo chosen for this page load, picking once and then
/// returning the same entry on every subsequent call (so hero + nav
/// stay in sync). Reset on hard reload via module re-evaluation.
export function pickRotationLogo(): RotationLogo {
  if (!picked) {
    picked = ROTATION_LOGOS[Math.floor(Math.random() * ROTATION_LOGOS.length)];
  }
  return picked;
}
