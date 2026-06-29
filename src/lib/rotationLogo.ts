/// Source-of-truth for the Libre.academy brand logos.
///
/// Two surfaces render a brand logo, each with its own dedicated image:
///   1. <LogoHero> — the oversized GROOVY_LOGO filling the homepage
///      hero (the first thing you see).
///   2. <Nav> — the compact NAV_LOGO wordmark that fades INTO the top
///      menu bar once you scroll past the hero (and shows immediately
///      on every non-home route, where there is no hero to scroll past).
///
/// The ROTATION_LOGOS pool + pickRotationLogo() below are retained for
/// reference but no longer drive either surface — both now use a fixed
/// dedicated logo rather than rotating.

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

/// The dedicated "groovy" psychedelic logo (derived from the full-res
/// master). The hero ALWAYS uses this one image — it reads best filling
/// the hero — instead of rotating through the ROTATION_LOGOS pool.
export const GROOVY_LOGO: RotationLogo = {
  src: "header-logo.png",
  w: 1100,
  h: 902,
};

/// The compact "LIBRE.ACADEMY" wordmark that lives in the top nav bar.
/// A wide horizontal logotype reads better at bar height than the
/// square groovy mark, so the nav is decoupled from the hero logo and
/// uses its own dedicated image. Dimensions are the exact post-trim
/// pixel size of nav-logo.png (zero layout shift).
export const NAV_LOGO: RotationLogo = {
  src: "nav-logo.png",
  w: 640,
  h: 272,
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
