/// Client-side "runner" for the live Rust lesson card. It does NOT compile
/// Rust — the marketing site is a static SPA. Instead it evaluates the one
/// thing this basics lesson asks for (what `greeting()` returns), simulates the
/// program's stdout, and runs the lesson's real test
/// (`assert_eq!(greeting(), "Hello, world!")`). The desktop app + /learn run
/// the actual toolchain; this is a faithful in-page demo of that loop.

export interface TestResult {
  name: string;
  pass: boolean;
  message: string;
}

export interface RunResult {
  stdout: string;
  tests: TestResult[];
  /// Runtime panic text (todo!/unimplemented), shown on the console.
  panic?: string;
  /// "Compile-time"-style error when the shape is wrong.
  error?: string;
}

const TEST_NAME = "greets_the_world";
const EXPECTED = "Hello, world!";

/// Pull the body of `fn greeting() -> &'static str { … }` with brace matching.
function greetingBody(code: string): string | null {
  const sig = /fn\s+greeting\s*\([^)]*\)\s*->\s*&\s*'static\s+str\s*\{/.exec(code);
  if (!sig) return null;
  let depth = 1;
  let i = sig.index + sig[0].length;
  const start = i;
  for (; i < code.length && depth > 0; i++) {
    if (code[i] === "{") depth++;
    else if (code[i] === "}") depth--;
  }
  return code.slice(start, i - 1);
}

function unescapeRust(s: string): string {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

export function runGreeting(code: string): RunResult {
  const body = greetingBody(code);
  if (body === null) {
    return {
      stdout: "",
      error:
        "error: cannot find function `greeting` — keep the `fn greeting() -> &'static str` signature.",
      tests: [{ name: TEST_NAME, pass: false, message: "greeting() not found" }],
    };
  }

  const noComments = body
    .replace(/\/\/[^\n]*/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");

  if (/todo!\s*\(\s*\)/.test(noComments) || /unimplemented!\s*\(\s*\)/.test(noComments)) {
    return {
      stdout: "",
      panic:
        "thread 'main' panicked at src/main.rs:\nnot yet implemented\nnote: run with `RUST_BACKTRACE=1` for a backtrace",
      tests: [
        {
          name: TEST_NAME,
          pass: false,
          message: "greeting() still calls todo!() — it panics instead of returning a value.",
        },
      ],
    };
  }

  const strings = [...noComments.matchAll(/"((?:[^"\\]|\\.)*)"/g)];
  if (strings.length === 0) {
    return {
      stdout: "",
      error:
        'error[E0308]: greeting() must return a string literal. Try returning "Hello, world!".',
      tests: [{ name: TEST_NAME, pass: false, message: "greeting() returns no string" }],
    };
  }

  // The return value is the last string literal in the body (final expression
  // or `return "…";`).
  const value = unescapeRust(strings[strings.length - 1][1]);
  const stdout = value + "\n"; // main(): println!("{}", greeting())
  const pass = value === EXPECTED;

  return {
    stdout,
    tests: [
      {
        name: TEST_NAME,
        pass,
        message: pass
          ? `assert_eq!(greeting(), "${EXPECTED}") ✓`
          : `assertion \`left == right\` failed\n  left: "${value}"\n right: "${EXPECTED}"`,
      },
    ],
  };
}
