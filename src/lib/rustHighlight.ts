/// Tiny zero-dependency Rust syntax highlighter for the live lesson card's
/// editor. Returns HTML (token <span>s) for a highlighted backdrop behind a
/// transparent <textarea>. Good enough for the basics-level snippets shown on
/// the marketing site — not a full Rust grammar.

const KEYWORDS = new Set([
  "as", "async", "await", "break", "const", "continue", "crate", "dyn", "else",
  "enum", "extern", "false", "fn", "for", "if", "impl", "in", "let", "loop",
  "match", "mod", "move", "mut", "pub", "ref", "return", "self", "static",
  "struct", "super", "trait", "true", "type", "unsafe", "use", "where", "while",
]);

const TYPES = new Set([
  "Self", "str", "String", "bool", "char", "i8", "i16", "i32", "i64", "i128",
  "isize", "u8", "u16", "u32", "u64", "u128", "usize", "f32", "f64", "Vec",
  "Option", "Result", "Box",
]);

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function highlightRust(code: string): string {
  // Priority order: comments, strings, attributes, lifetimes, macros, numbers,
  // then identifiers (classified afterwards).
  const re =
    /(\/\/[^\n]*)|(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*")|(#!?\[[^\]]*\])|('[A-Za-z_][A-Za-z0-9_]*\b)|([A-Za-z_][A-Za-z0-9_]*!)|(\b\d[\d_]*(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)/g;
  let out = "";
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    out += esc(code.slice(last, m.index));
    last = re.lastIndex;
    const t = m[0];
    if (m[1] || m[2]) out += `<span class="tok-com">${esc(t)}</span>`;
    else if (m[3]) out += `<span class="tok-str">${esc(t)}</span>`;
    else if (m[4]) out += `<span class="tok-attr">${esc(t)}</span>`;
    else if (m[5]) out += `<span class="tok-life">${esc(t)}</span>`;
    else if (m[6]) out += `<span class="tok-mac">${esc(t)}</span>`;
    else if (m[7]) out += `<span class="tok-num">${esc(t)}</span>`;
    else if (m[8]) {
      if (KEYWORDS.has(t)) out += `<span class="tok-kw">${esc(t)}</span>`;
      else if (TYPES.has(t)) out += `<span class="tok-type">${esc(t)}</span>`;
      else if (/^\s*\(/.test(code.slice(re.lastIndex)))
        out += `<span class="tok-fn">${esc(t)}</span>`;
      else out += esc(t);
    } else out += esc(t);
  }
  out += esc(code.slice(last));
  return out;
}
