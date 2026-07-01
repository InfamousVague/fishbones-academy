/// A live, interactive Rust lesson card for the homepage — a real lesson from
/// "The Rust Programming Language" (Getting Started → Write Your First Rust
/// Program), with an editable code pane and pass/fail tests, mirroring the
/// desktop app's read → edit → run → grade loop. Execution is simulated
/// in-page (see lib/rustRunner); the desktop app + /learn run the real
/// toolchain.

import { useRef, useState, type KeyboardEvent } from "react";
import { Play, RotateCcw, Check, X, Terminal, FlaskConical } from "lucide-react";
import { highlightRust } from "../lib/rustHighlight";
import { runGreeting, type RunResult } from "../lib/rustRunner";
import "./LiveLessonCard.css";

const STARTER = `/// Returns the message your program prints.
pub fn greeting() -> &'static str {
    // TODO: return the string literal "Hello, world!"
    todo!()
}

fn main() {
    println!("{}", greeting());
}
`;

const SOLUTION = `pub fn greeting() -> &'static str {
    "Hello, world!"
}

fn main() {
    println!("{}", greeting());
}
`;

function CodeEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const sync = () => {
    if (taRef.current && preRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop;
      preRef.current.scrollLeft = taRef.current.scrollLeft;
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const s = ta.selectionStart;
      const en = ta.selectionEnd;
      onChange(value.slice(0, s) + "    " + value.slice(en));
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + 4;
      });
    }
  };

  return (
    <div className="ce">
      <pre className="ce__hl" ref={preRef} aria-hidden>
        <code dangerouslySetInnerHTML={{ __html: highlightRust(value) + "\n" }} />
      </pre>
      <textarea
        ref={taRef}
        className="ce__ta"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={sync}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        wrap="off"
        aria-label="Rust code editor"
      />
    </div>
  );
}

export function LiveLessonCard() {
  const [code, setCode] = useState(STARTER);
  const [result, setResult] = useState<RunResult | null>(null);
  const [tab, setTab] = useState<"console" | "tests">("console");
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    // brief "compile" beat so it reads as a real run
    window.setTimeout(() => {
      setResult(runGreeting(code));
      setRunning(false);
      setTab("tests");
    }, 420);
  };

  const reset = () => {
    setCode(STARTER);
    setResult(null);
    setTab("console");
  };

  const passed = result?.tests.every((t) => t.pass) ?? false;
  const consoleText =
    result?.panic ?? result?.error ?? result?.stdout ?? "";

  return (
    <div className="live-card">
      {/* ── Lesson pane ── */}
      <div className="live-card__lesson">
        <span className="live-card__eyebrow">
          <FlaskConical size={14} /> Try it live · Rust
        </span>
        <h3 className="live-card__title">Write your first Rust program</h3>
        <p className="live-card__prose">
          The <code>greeting()</code> function's only job is to return the text
          your program prints. Fill in its body so it returns the string literal{" "}
          <code>"Hello, world!"</code>, then hit <b>Run</b>. A Rust function
          whose last line is a value — no semicolon — returns that value.
        </p>
        <p className="live-card__note">
          The hidden test checks that <code>greeting()</code> returns exactly
          that. Stuck? Hit <b>Solution</b>.
        </p>
        <span className="live-card__attrib">
          From <i>The Rust Programming Language</i> · Getting Started
        </span>
      </div>

      {/* ── Editor + output pane ── */}
      <div className="live-card__editor">
        <div className="live-card__bar">
          <span className="live-card__file">
            <span className="live-card__dot" /> main.rs
          </span>
          <div className="live-card__actions">
            <button
              type="button"
              className="live-card__btn"
              onClick={() => {
                setCode(SOLUTION);
                setResult(null);
                setTab("console");
              }}
            >
              Solution
            </button>
            <button type="button" className="live-card__btn" onClick={reset}>
              <RotateCcw size={13} /> Reset
            </button>
            <button
              type="button"
              className="live-card__btn live-card__btn--run"
              onClick={run}
              disabled={running}
            >
              <Play size={13} /> {running ? "Running…" : "Run"}
            </button>
          </div>
        </div>

        <CodeEditor value={code} onChange={setCode} />

        <div className="live-card__output">
          <div className="live-card__tabs">
            <button
              type="button"
              className={`live-card__tab${tab === "console" ? " is-active" : ""}`}
              onClick={() => setTab("console")}
            >
              <Terminal size={13} /> Console
            </button>
            <button
              type="button"
              className={`live-card__tab${tab === "tests" ? " is-active" : ""}`}
              onClick={() => setTab("tests")}
            >
              <FlaskConical size={13} /> Tests
              {result && (
                <span
                  className={`live-card__pill${passed ? " is-pass" : " is-fail"}`}
                >
                  {passed ? "pass" : "fail"}
                </span>
              )}
            </button>
          </div>

          <div className="live-card__panel">
            {tab === "console" ? (
              consoleText ? (
                <pre
                  className={`live-card__console${result?.panic || result?.error ? " is-err" : ""}`}
                >
                  {consoleText}
                </pre>
              ) : (
                <p className="live-card__placeholder">
                  Run your code — program output appears here.
                </p>
              )
            ) : result ? (
              <ul className="live-card__tests">
                {result.tests.map((t) => (
                  <li key={t.name} className={t.pass ? "is-pass" : "is-fail"}>
                    <span className="live-card__test-icon">
                      {t.pass ? <Check size={14} /> : <X size={14} />}
                    </span>
                    <span className="live-card__test-body">
                      <code>{t.name}</code>
                      <span className="live-card__test-msg">{t.message}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="live-card__placeholder">
                Hit Run — hidden tests grade your code here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
