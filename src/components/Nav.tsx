import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Sparkles,
  BookOpen,
  Newspaper,
  ShieldCheck,
  Download,
} from "lucide-react";
import { GithubMark } from "./icons/GithubMark";
import { DiscordMark } from "./icons/DiscordMark";
import { NAV_LOGO } from "../lib/rotationLogo";
import TipPopover from "./TipPopover";
import "./Nav.css";

/// Public Discord invite — shared between the desktop nav row and
/// the mobile drawer so the URL only lives in one place.
const DISCORD_INVITE = "https://discord.gg/2yPVVfuFdW";

/// Primary nav — download-first. The in-browser learning surfaces
/// (Courses, Languages) were pulled from the top bar; the nav now
/// orients the visitor toward the desktop app: what it does
/// (Features), what it looks like (Screenshots), the docs, the
/// changelog/blog and the public security audit. Each carries an
/// icon so the bar reads at a glance.
///
/// `to` values starting with "/#" are homepage section anchors —
/// they navigate home (if needed) and ScrollToTop scrolls to the
/// section. The rest are real routes.
const LINKS: Array<{ to: string; label: string; icon: typeof Sparkles }> = [
  { to: "/#features", label: "Features", icon: Sparkles },
  { to: "/docs", label: "Docs", icon: BookOpen },
  { to: "/blog", label: "Blog", icon: Newspaper },
  { to: "/security", label: "Audit", icon: ShieldCheck },
];

export function Nav() {
  const { pathname } = useLocation();
  // Tying drawer-open state to the current pathname auto-closes the
  // mobile menu on every navigation without needing a setState-in-effect.
  const [openFor, setOpenFor] = useState<string | null>(null);
  const open = openFor === pathname;
  const setOpen = (next: boolean | ((v: boolean) => boolean)) => {
    setOpenFor((current) => {
      const wasOpen = current === pathname;
      const wantsOpen = typeof next === "function" ? next(wasOpen) : next;
      return wantsOpen ? pathname : null;
    });
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The header uses the compact "LIBRE.ACADEMY" wordmark — a wide
  // logotype reads better at bar height than the square hero mark.
  // On the homepage the bar logo stays hidden until you scroll past
  // the oversized hero logo, at which point this wordmark fades in;
  // on every other route there's no hero to scroll past, so it shows
  // immediately.
  const isHome = pathname === "/";
  const showBrand = !isHome || scrolled;
  const logo = NAV_LOGO;

  const renderLink = (l: (typeof LINKS)[number], drawer = false) => {
    const Icon = l.icon;
    const base = drawer ? "nav__drawer-link" : "nav__link";
    const inner = (
      <>
        <Icon size={drawer ? 17 : 15} aria-hidden />
        <span>{l.label}</span>
      </>
    );
    // Hash anchors can't use NavLink's route-active matching, so they
    // render as plain Links; route links keep the active underline.
    if (l.to.startsWith("/#")) {
      return (
        <Link key={l.to} to={l.to} className={base}>
          {inner}
        </Link>
      );
    }
    return (
      <NavLink
        key={l.to}
        to={l.to}
        className={({ isActive }) =>
          `${base}${isActive ? ` ${base}--active` : ""}`
        }
      >
        {inner}
      </NavLink>
    );
  };

  return (
    <header className={`nav${scrolled ? " nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <Link
          to="/"
          className="nav__brand"
          data-visible={showBrand}
          aria-label="Libre.academy home"
          tabIndex={showBrand ? 0 : -1}
        >
          {/* The rotation logo, shrunk into the bar. aria-hidden:
              the brand <Link> already carries the accessible name. */}
          <img
            src={`/logos/${logo.src}`}
            alt=""
            width={logo.w}
            height={logo.h}
            className="nav__brand-icon"
            draggable={false}
            aria-hidden
          />
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((l) => renderLink(l))}
          <a
            className="nav__link nav__link--icon"
            href="https://github.com/InfamousVague/Libre.academy"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Libre Academy on GitHub"
          >
            <GithubMark size={16} />
          </a>
          <a
            className="nav__link nav__link--icon"
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join the Libre Discord"
          >
            <DiscordMark size={16} />
          </a>
          {/* Tip jar — port of the desktop app's TipDropdown. */}
          <TipPopover />
          <Link to="/download" className="nav__cta">
            <Download size={15} aria-hidden /> Download
          </Link>
        </nav>

        <button
          type="button"
          className="nav__menu-btn"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="nav__drawer" role="dialog" aria-label="Mobile menu">
          {LINKS.map((l) => renderLink(l, true))}
          <a
            className="nav__drawer-link"
            href="https://github.com/InfamousVague/Libre.academy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubMark size={17} /> <span>GitHub</span>
          </a>
          <a
            className="nav__drawer-link"
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
          >
            <DiscordMark size={17} /> <span>Discord</span>
          </a>
          <Link to="/download" className="nav__drawer-cta">
            <Download size={16} aria-hidden /> Download the app
          </Link>
        </div>
      )}
    </header>
  );
}
