/// "Join early access updates" email-capture section near the top of the
/// homepage. Posts the email to the libre-api backend, which files it into a
/// Notion database for later outreach (POST /early-access). This is NOT a
/// newsletter signup — we explicitly tell the user we'll email them once, with
/// an invite to opt into updates when they're ready. Early sign-ups are flagged
/// so they can be granted the "founder" in-app cosmetics + badge.

import { useState, type FormEvent } from "react";
import { Sparkles, BadgeCheck, ArrowRight, Check, Loader2, Rocket } from "lucide-react";
import "./EarlyAccess.css";

// Same relay the auth flows use (see ResetPassword.tsx / VerifyEmail.tsx).
const API = "https://api.libre.academy";

type Status = "idle" | "loading" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EarlyAccess() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      setError("That doesn't look like an email address.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(`${API}/early-access`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source: "website" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Couldn't reach the server. Please try again in a moment.");
    }
  }

  return (
    <div className="early">
      <div className="early__card">
        <span className="early__eyebrow">
          <Rocket size={14} /> Early access
        </span>
        <h2 className="early__title">Join early access updates.</h2>
        <p className="early__lede">
          Libre is growing fast, with new languages, courses in your own tongue,
          and more on the way. Drop your email and you'll be first in line when
          the next builds and invites go out.
        </p>

        {status === "success" ? (
          <div className="early__success" role="status">
            <span className="early__success-icon">
              <Check size={20} />
            </span>
            <div>
              <strong>You're on the list.</strong>
              <p>
                Keep an eye on your inbox. We'll reach out when there's
                something worth sharing. Welcome aboard, founder.
              </p>
            </div>
          </div>
        ) : (
          <form className="early__form" onSubmit={onSubmit} noValidate>
            <input
              type="email"
              className="early__input"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              aria-label="Email address"
              autoComplete="email"
              required
            />
            <button
              type="submit"
              className="early__btn"
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={16} className="early__spin" /> Adding…
                </>
              ) : (
                <>
                  Join <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        {status === "error" && <p className="early__error">{error}</p>}

        {/* Perk — early users get permanent in-app cosmetics + a badge. */}
        <div className="early__perk">
          <span className="early__perk-icon">
            <BadgeCheck size={20} />
          </span>
          <p className="early__perk-text">
            <Sparkles size={14} className="early__perk-sparkle" /> Early
            supporters unlock exclusive in-app <strong>cosmetics and a founder
            badge</strong>, yours forever, no matter how big Libre gets.
          </p>
        </div>

        <p className="early__fineprint">
          This isn't a newsletter. We'll send you a <b>single</b> email later
          with an invitation to opt in to updates. No spam, no lists, and you
          can ignore it with zero consequences.
        </p>
      </div>
    </div>
  );
}
