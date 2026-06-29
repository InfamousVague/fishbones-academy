import { Fragment } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Code2,
  Sparkles,
  Layers,
  ShieldOff,
  Flame,
  Cpu,
  Download,
} from "lucide-react";
import { LANGUAGES } from "../data/languages";
import { COURSE_COUNT_ROUNDED, LANGUAGE_COUNT } from "../lib/siteStats";
import { BookCarousel } from "../components/spotlights/BookCarousel";
import { CodecademyComparison } from "../components/CodecademyComparison";
import { MoreComparisons } from "../components/MoreComparisons";
import { LogoHero } from "../components/LogoHero";
import { ParallaxBg } from "../components/ParallaxBg";
import { ScrollAsset } from "../components/ScrollAsset";
import "./Home.css";

/// Homepage architecture:
///   1. Hero (SEO H1: "Free interactive coding courses…") with
///      LibreHeader.png + ambient ParticleField overlay
///   2. WorkbenchSpotlight  — animated in-browser code editor demo
///   3. BookCarousel        — auto-scrolling marquee of every course
///   4. EvmChainSpotlight   — replica of the in-app ChainDock
///   5. FEATURES strip      — interactive lessons / editor / hidden
///                            tests / AI tutor (Codecademy-comparable
///                            head terms tuned for the same query
///                            family)
///   6. Long-form rows      — Runs in your browser / Bring your own
///                            book / Free + open source
///   7. Final CTA           — "Start learning free"
///
/// SEO strategy: lead with the head term ("Free interactive coding
/// courses") in the <title>, H1, og:title and og:description so
/// Google sees consistent topical signal. Body copy expands on the
/// differentiator (26 languages, in-browser editor, hidden tests,
/// open source, no signup wall) — the things Codecademy /
/// freeCodeCamp / Scrimba can't all claim simultaneously.
///
/// Story arc: hook (free + interactive) → proof (editor demo +
/// course breadth + advanced runtimes) → spec sheet (why it's
/// different from the other free-courses sites) → CTA.

/// Feature cards target the "what do I get when I sign up?" question
/// that visitors land with after a "learn to code free" search. Each
/// card pairs the SEO-friendly head term ("Interactive lessons",
/// "In-browser code editor", "Hidden test grading", "AI tutor") with
/// a body that says HOW it works rather than just what it is. The
/// vocabulary deliberately mirrors what Codecademy / freeCodeCamp /
/// Scrimba listings use — so a query like "interactive code editor
/// online free" is more likely to surface the right card.
const FEATURES = [
  {
    icon: BookOpen,
    title: "Interactive lessons",
    body:
      "Read short prose chunks with syntax-highlighted snippets, inline glossary popovers, and a 'You'll learn' card up front so you know what's coming. Every lesson ends in a hands-on exercise — no passive video watching.",
  },
  {
    icon: Code2,
    title: "Built-in code editor",
    body:
      "A real Monaco editor (the engine VS Code is built on) opens next to every lesson. Click Run, see test output instantly. No tab-switching, no localhost setup, no Docker.",
  },
  {
    icon: Layers,
    title: "Hidden-test grading",
    body:
      `Hundreds of curated coding exercises across ${LANGUAGE_COUNT} languages, each with hidden tests that pass-or-fail your work the same way a real interview screen does. Difficulty tags, topic groups, instant feedback.`,
  },
  {
    icon: Cpu,
    title: "Free AI tutor",
    body:
      "A floating tutor reads the lesson, your code, and the hidden tests so it can answer in context. Defaults to a local Ollama model — no API keys, no usage bills, no signup wall.",
  },
];

const FEATURE_ROWS = [
  {
    eyebrow: "Every language, one app",
    title: "Twenty-six programming languages. One download.",
    body:
      "JavaScript, TypeScript and Python run in-browser via Web Workers and Pyodide. Solidity compiles with solc-js and executes on an in-process EVM. Rust and Go proxy to the official playgrounds. C, C++, Java, Kotlin, C#, Swift, Zig and Assembly run on your local toolchain through the optional desktop app — and if a compiler is missing, Libre Academy offers a one-click install.",
    bullets: [
      "JavaScript, TypeScript, Python — Web Workers + Pyodide",
      "Solidity + EVM smart contracts — full in-browser chain",
      "React, Three.js, Svelte, Astro, Solid, HTMX — sandboxed iframes",
      "Rust, Go, C, C++, Java, Kotlin, C#, Swift, Zig, Assembly — desktop",
    ],
  },
  {
    eyebrow: "Free + open source",
    title: "No paywall. No signup wall. No data harvesting.",
    body:
      "Libre Academy is free forever — MIT licensed, no premium tier, no upsell. Progress lives in a local SQLite database on your machine. The AI tutor defaults to a local Ollama model so your conversations stay on your machine. No analytics, no error reporters, no tracking pixels. Sign up only if you want to sync XP between devices — and even then, all we store is a tiny JSON progress record.",
    bullets: [
      "Free forever — MIT licensed source on GitHub",
      "No account required to learn — sample any course in 30 seconds",
      "Optional cloud sync — just XP + completion timestamps",
      "AI tutor defaults to local Ollama, never a third-party API",
    ],
  },
];

/// Per long-form row theme, by index. A themed row gets a parallaxing
/// genre atmosphere + a scroll-driven moving asset + its accent colour;
/// `null` rows stay solid black, so the page alternates themed scenes
/// with calm black breathers (and we only need a handful of bg images).
const ROW_THEMES: Array<
  | { theme: string; bg: string; asset: { src: string; place: string } }
  | null
> = [
  // Row 0 — "every language, one app" → kaiju (teal). Transparent
  // looping video (Safari/reduced-motion fall back to asset-kaiju.png).
  {
    theme: "theme-kaiju",
    bg: "bg-courses-hero.jpg",
    asset: { src: "asset-kaiju.webm", place: "kaiju" },
  },
  // Row 1 — "free + open source / no paywall" → alien invasion (lime),
  // with the flying-saucer asset.
  {
    theme: "theme-alien",
    bg: "bg-languages-hero.jpg",
    asset: { src: "asset-saucer.png", place: "saucer" },
  },
];

export function Home() {
  const browserLangs = LANGUAGES.filter((l) => l.inBrowser).slice(0, 12);

  return (
    <div className="home">
      {/* ─── Hero ──────────────────────────────────────────
          Layered top-to-bottom:
            1. Particle field — ambient drifting dots
            2. LibreHeader.png — the ribbon-snake brand artwork,
               centered as the hero centerpiece
            3. Eyebrow → headline → lede → CTAs → hint
            4. Stats strip
          The artwork carries the visual identity; the copy
          underneath delivers the value prop without fighting it. */}
      <section className="home-hero parallax-host">
        {/* Cosmic deep-space atmosphere — the nebula + planets fill
            the hero, gently parallaxing on scroll. Small travel so the
            nebula stays framed around the logo at the top of the page. */}
        <ParallaxBg
          src="bg-home-hero.jpg"
          position="center top"
          fade="bottom"
          travel={28}
        />

        <div className="home-hero__inner home-hero__inner--stacked">
          {/* Big groovy psychedelic logo — the brand first impression,
              sitting above the eyebrow / H1 / lede. The same artwork
              the header uses. */}
          <LogoHero />
          <motion.div
            className="home-hero__copy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >
            <span className="home-hero__eyebrow">
              <span className="home-hero__pulse" /> Open source · Free forever ·
              MIT licensed
            </span>
            {/* H1: declarative claim leading with the primary
                keyword "learn to code free" (verbatim match to
                <title> + og:title — Google weights cross-element
                consistency). Second sentence packs the two
                differentiator numbers (courses + languages) into
                the headline so even a clipped SERP preview carries
                the proof. Period after "free" is intentional — the
                no-nonsense voice doesn't sell, it asserts. */}
            <h1 className="home-hero__title">
              Learn to code, free. {COURSE_COUNT_ROUNDED} courses, {LANGUAGE_COUNT} languages,
              zero paywall.
            </h1>
          </motion.div>
        </div>
      </section>
      {/* ─── Book carousel ───────────────────────────────── */}
      <BookCarousel />

      {/* ─── Feature cards ──────────────────────────────── */}
      <section
        className="section section--tight parallax-host theme-robots"
        id="features"
      >
        <ParallaxBg src="bg-showcase.jpg" fade="both" />
        <ScrollAsset
          src="asset-robot.png"
          place="robot"
          y={[60, -60]}
          rotateZ={[-3, 3]}
          rotateY={[-9, 9]}
          scale={[1, 1.06]}
        />
        <div className="home-row-head home-row-head--centered">
          <span className="section__eyebrow">What you get, for free</span>
          {/* H2 mirrors the H1 head term ("interactive coding
              courses") to reinforce topical relevance for that
              query family. Subtitle below carries the differentiator
              ("real editor, hidden tests") so the section reads as
              "here's why it's different from other free-courses
              sites" not just "here are some features." */}
          <h2 className="section__title section__title--centered">
            Yes, FREE! Unlike college...
          </h2>
          <p className="section__subtitle section__subtitle--centered">
            Interactive lessons, a real in-browser code editor, and
            hidden-test grading on every exercise. No signup. No upsell.
          </p>
        </div>
        <div className="home-features">
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              className="card home-features__card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <span className="home-features__icon">
                <f.icon size={20} />
              </span>
              <h3 className="home-features__title">{f.title}</h3>
              <p className="home-features__body">{f.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ─── Long-form feature rows — alternating themed parallax
          scenes and solid-black breathers (see ROW_THEMES). ─────── */}
      {FEATURE_ROWS.map((row, i) => {
        const t = ROW_THEMES[i];
        return (
        <Fragment key={row.eyebrow}>
        <motion.section
          className={`section home-row${t ? ` parallax-host ${t.theme}` : ""}`}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {t && <ParallaxBg src={t.bg} fade="both" />}
          {t && (
            <ScrollAsset
              src={t.asset.src}
              place={t.asset.place}
              y={[50, -50]}
              rotateZ={[-3, 3]}
              rotateY={[-9, 9]}
              scale={[1, 1.06]}
            />
          )}
          <div
            className={`home-row__layout${i % 2 === 1 ? " home-row__layout--reverse" : ""}`}
          >
            <div className="home-row__copy">
              <span className="section__eyebrow">{row.eyebrow}</span>
              <h2 className="section__title">{row.title}</h2>
              <p className="home-row__body">{row.body}</p>
              <ul className="home-row__bullets">
                {row.bullets.map((b) => (
                  <li key={b}>
                    <span className="home-row__bullet-dot" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <aside className="home-row__visual">
              {i === 0 && <RuntimeBoard languages={browserLangs} />}
              {i === 1 && <PipelineBoard />}
              {i === 2 && <PrincipleBoard />}
            </aside>
          </div>
        </motion.section>

        {/* "No paywall. Ever." pillar — moved out of the comparison to
            sit on a solid-black breather between the kaiju row and the
            alien/saucer row, so the differentiator lands mid-scroll
            rather than buried under the table at the foot of the page. */}
        {i === 0 && (
          <section className="section">
            <div className="cmp__pillar">
              <div className="cmp__pillar-mark" aria-hidden>
                ∞
              </div>
              <div className="cmp__pillar-copy">
                <h3 className="cmp__pillar-title">No paywall. Ever.</h3>
                <p className="cmp__pillar-lede">
                  Libre Academy is MIT-licensed and will stay free forever. If a
                  future maintainer ever tries to put a course behind a paywall,
                  fork the repo and host the open version yourself.
                </p>
              </div>
            </div>
          </section>
        )}
        </Fragment>
        );
      })}

      {/* ─── Comparisons (moved to the bottom) ───────────────
          The marquee Codecademy table + the Treehouse / DataCamp
          mini-comparisons. Kept on a solid-black stretch near the
          foot of the page so the honest row-by-row proof is the
          last thing before the closing download CTA. */}
      <CodecademyComparison />
      {/* ─── Download banner — moved up to sit just under the
          hero (time-warp scene, violet). ─────────────────────── */}
      <section className="section section--narrow home-final parallax-host theme-timewarp">
        <ParallaxBg src="bg-final-cta.jpg" fade="both" opacity={0.85} />
        <ScrollAsset
          src="asset-rocket.png"
          place="rocket"
          y={[40, -150]}
          rotateZ={[-4, 6]}
          rotateY={[-8, 10]}
          scale={[0.95, 1.12]}
        />
        <h2 className="section__title section__title--centered">
          Download Libre Academy — free til' the heat death of the universe.
        </h2>
        <p className="section__subtitle section__subtitle--centered">
          Twenty-six languages, {COURSE_COUNT_ROUNDED} courses, fifteen-hundred-plus
          interactive lessons — all in one free, open-source app. No signup, no
          credit card. Install it and start writing code.
        </p>
        <div className="home-final__actions">
          <Link to="/download" className="btn btn--warm btn--lg">
            <Download size={16} /> Download the desktop app
          </Link>
          <Link to="/courses" className="btn btn--ghost btn--lg">
            Browse all courses <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <MoreComparisons />
    </div>
  );
}

function RuntimeBoard({ languages }: { languages: typeof LANGUAGES }) {
  return (
    <div className="home-board">
      <div className="home-board__head">
        <span>Runtime</span>
        <span>Where it runs</span>
      </div>
      <div className="home-board__rows">
        {languages.map((l) => (
          <div key={l.id} className="home-board__row">
            <span className="home-board__chip">{l.glyph}</span>
            <span className="home-board__name">{l.name}</span>
            <span className={`home-board__run home-board__run--${l.run}`}>
              {l.run === "browser"
                ? "Browser"
                : l.run === "sandbox"
                  ? "Sandbox"
                  : "Local"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PipelineBoard() {
  return (
    <div className="home-pipeline">
      <div className="home-pipeline__node">
        <BookOpen size={18} />
        <span>Your book</span>
        <small>PDF · EPUB · docs site</small>
      </div>
      <div className="home-pipeline__arrow" aria-hidden>
        <span className="home-pipeline__bead" />
      </div>
      <div className="home-pipeline__node home-pipeline__node--accent">
        <Sparkles size={18} />
        <span>Claude pipeline</span>
        <small>structures + writes exercises</small>
      </div>
      <div className="home-pipeline__arrow" aria-hidden>
        <span className="home-pipeline__bead home-pipeline__bead--delay" />
      </div>
      <div className="home-pipeline__node">
        <Code2 size={18} />
        <span>Course</span>
        <small>chapters · lessons · tests</small>
      </div>
    </div>
  );
}

function PrincipleBoard() {
  const items = [
    { icon: ShieldOff, label: "Zero telemetry", value: "0 events" },
    { icon: Flame, label: "Streaks", value: "1-day grace" },
    { icon: Cpu, label: "AI tutor", value: "Local Ollama" },
    { icon: BookOpen, label: "Source", value: "MIT licensed" },
  ];
  return (
    <div className="home-principles">
      {items.map((it) => (
        <div key={it.label} className="home-principles__item">
          <span className="home-principles__icon">
            <it.icon size={16} />
          </span>
          <span className="home-principles__label">{it.label}</span>
          <span className="home-principles__value">{it.value}</span>
        </div>
      ))}
    </div>
  );
}
