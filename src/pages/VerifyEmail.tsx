// /verify-email — landing page for the link in the signup
// confirmation email. Reads `?token=…` from the URL and POSTs it to the
// relay's `/auth/verify-email/confirm` endpoint on mount. On success the
// account is activated; we route the user to /learn to sign in (the
// confirm also mints a session, but the embedded learn-app owns its own
// auth storage, so — like ResetPassword — we don't try to bridge it and
// just send them to a clean sign-in).
//
// Shares the reset-card chrome (reset-page / reset-card classes) with
// ResetPassword — both are small single-purpose email-link landings.

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./ResetPassword.css";

// The live relay. Same host the desktop app and the rest of the auth
// flow talk to — `https://api.libre.academy/auth/*` (no `/fishbones/`
// prefix; that was the pre-rebrand naming).
const RELAY_URL = "https://api.libre.academy";

type Phase = "verifying" | "success" | "error";

export function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";

  const [phase, setPhase] = useState<Phase>(token ? "verifying" : "error");
  const [errorMsg, setErrorMsg] = useState<string | null>(
    token
      ? null
      : "This confirmation link is missing its token. Open the link from your email again, or request a new one from the sign-in screen.",
  );

  // Consume the token exactly once on mount. The relay's confirm
  // endpoint is single-use (the token is deleted on success), so a
  // double-fire — e.g. React 18 StrictMode's dev double-invoke — would
  // make the second call 401 and flip a just-succeeded page to error.
  // Guard with a ran-once flag so only the first attempt counts.
  useEffect(() => {
    if (!token) return;
    let ran = false;
    void (async () => {
      if (ran) return;
      ran = true;
      try {
        const res = await fetch(`${RELAY_URL}/auth/verify-email/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (res.ok) {
          setPhase("success");
          return;
        }
        if (res.status === 401) {
          setErrorMsg(
            "This confirmation link is invalid or has expired. Sign in to have a fresh one sent.",
          );
        } else {
          setErrorMsg(
            `Couldn't confirm your email (${res.status}). Please try again in a moment.`,
          );
        }
        setPhase("error");
      } catch (err) {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "Couldn't reach the server. Please try again.",
        );
        setPhase("error");
      }
    })();
  }, [token]);

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h1 className="reset-card__title">Confirm your email</h1>

        {phase === "verifying" ? (
          <p className="reset-card__blurb">Confirming your email address…</p>
        ) : phase === "success" ? (
          <>
            <p className="reset-card__blurb reset-card__blurb--success">
              Your email is confirmed and your account is active. Open the Libre
              desktop app and sign in to sync your progress — or download it
              below if you don't have it yet.
            </p>
            <Link to="/download" className="reset-card__cta">
              Download the app
            </Link>
          </>
        ) : (
          <>
            <p className="reset-card__blurb reset-card__blurb--error">
              {errorMsg ?? "Something went wrong. Please try again."}
            </p>
            <Link to="/" className="reset-card__cta">
              Back to Libre
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
