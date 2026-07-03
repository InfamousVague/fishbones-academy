/// Homepage section selling the multi-language (spoken-language) course
/// translations. Distinct from the /languages page, which covers the 26
/// *programming* languages — this is about learning to code in your own
/// human language. The copy carries the English language names so the page
/// ranks for "learn to code in <language>" searches; the chips show the
/// endonyms so a native speaker recognises their own language at a glance.

import { SPOKEN_LANGUAGES, SPOKEN_LANGUAGE_COUNT } from "../data/locales";
import "./MultilingualSection.css";

export function MultilingualSection() {
  return (
    <div className="multiling">
      <div className="home-row-head home-row-head--centered">
        <span className="section__eyebrow">Now in your language</span>
        <h2 className="section__title section__title--centered">
          Learn to code in the language you think in.
        </h2>
        <p className="section__subtitle section__subtitle--centered">
          Code is universal, so the explanations shouldn't be gated behind
          English. We're translating every course into {SPOKEN_LANGUAGE_COUNT}{" "}
          languages, so the lessons, hints, and the AI tutor speak yours while
          the code stays the same. Learn to code in Spanish, Hindi, Arabic,
          Bengali, Indonesian, Russian, French, Japanese, and more.
        </p>
      </div>

      <ul className="multiling__grid" aria-label="Languages courses are available in">
        {SPOKEN_LANGUAGES.map((l) => (
          <li key={l.code} className="multiling__chip">
            <span className="multiling__flag" aria-hidden="true">
              {l.flag}
            </span>
            <span className="multiling__names">
              <span className="multiling__native" lang={l.code}>
                {l.native}
              </span>
              <span className="multiling__en">{l.english}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="multiling__note">
        Rolling out now, course by course. Missing strings fall back to English,
        so nothing ever blocks a lesson.
      </p>
    </div>
  );
}
