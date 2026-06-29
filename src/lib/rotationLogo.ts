/// Source-of-truth for the Libre.academy brand logos.
///
/// Two surfaces render a brand logo:
///   1. <LogoHero> — the oversized hero logo filling the homepage hero
///      (the first thing you see). It picks ONE logo at random from the
///      ROTATION_LOGOS pool per page load (see pickRotationLogo) so the
///      brand mark cycles through every themed variant — groovy, slime,
///      alien, atomic, noir, pulp, rocket, robot, time-warp.
///   2. <Nav> — the compact NAV_LOGO wordmark that fades INTO the top
///      menu bar once you scroll past the hero (and shows immediately on
///      every non-home route). It stays a fixed wide wordmark because a
///      horizontal logotype reads far better at bar height than the
///      square/varied rotation marks.

export interface RotationLogo {
  src: string;
  /// Exact post-`magick -trim` pixel dimensions, passed straight to the
  /// <img> width/height attrs so the browser reserves the right
  /// aspect-ratio slot (zero layout shift) at any rendered size.
  w: number;
  h: number;
}

/// Themed hero logo variants. The hero shows one at random per load.
export const ROTATION_LOGOS: RotationLogo[] = [
  { src: "logo-groovy.png", w: 1024, h: 840 },
  { src: "logo-slime.png", w: 1400, h: 708 },
  { src: "logo-alien.png", w: 1184, h: 477 },
  { src: "logo-atomic.png", w: 1070, h: 761 },
  { src: "logo-noir.png", w: 1400, h: 568 },
  { src: "logo-pulp.png", w: 1094, h: 1126 },
  { src: "logo-rocket.png", w: 1226, h: 991 },
  { src: "logo-robot.png", w: 1400, h: 308 },
  { src: "logo-timewarp.png", w: 1290, h: 1012 },
];

/// The compact "LIBRE.ACADEMY" wordmark that lives in the top nav bar.
/// A wide horizontal logotype reads better at bar height than the varied
/// rotation marks, so the nav uses its own dedicated image. Dimensions
/// are the exact post-trim pixel size of nav-logo.png (zero layout shift).
export const NAV_LOGO: RotationLogo = {
  src: "nav-logo.png",
  w: 640,
  h: 272,
};

let picked: RotationLogo | null = null;

/// Returns the hero logo chosen for this page load, picking once at
/// random and then returning the same entry on every subsequent call
/// (stable across re-renders / route changes). A hard reload re-evaluates
/// this module and yields a fresh pick.
export function pickRotationLogo(): RotationLogo {
  if (!picked) {
    picked = ROTATION_LOGOS[Math.floor(Math.random() * ROTATION_LOGOS.length)];
  }
  return picked;
}
