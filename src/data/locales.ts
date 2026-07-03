/// Spoken (human) languages Libre-authored courses are translated into.
/// Display data only — mirrors the app's src/data/locales.ts
/// (SUPPORTED_LOCALES / LOCALE_NAMES / LOCALE_ENGLISH_NAMES / LOCALE_FLAGS).
/// Keep this in sync when the app adds a locale.
///
/// `native` is the endonym (what a speaker of that language calls it);
/// `english` is the exonym (used in the SEO copy + chip subtitle so the
/// page ranks for "learn to code in <English name>").

export interface SpokenLanguage {
  /// App locale code.
  code: string;
  /// Endonym, e.g. "Español", "日本語".
  native: string;
  /// English name, e.g. "Spanish".
  english: string;
  /// Country-flag emoji.
  flag: string;
}

/// Ordered to lead with the highest-reach learn-to-code markets. English
/// (the authoring source) comes first.
export const SPOKEN_LANGUAGES: SpokenLanguage[] = [
  { code: "en", native: "English", english: "English", flag: "🇺🇸" },
  { code: "es", native: "Español", english: "Spanish", flag: "🇪🇸" },
  { code: "hi", native: "हिन्दी", english: "Hindi", flag: "🇮🇳" },
  { code: "ar", native: "العربية", english: "Arabic", flag: "🇸🇦" },
  { code: "bn", native: "বাংলা", english: "Bengali", flag: "🇧🇩" },
  { code: "id", native: "Bahasa Indonesia", english: "Indonesian", flag: "🇮🇩" },
  { code: "ru", native: "Русский", english: "Russian", flag: "🇷🇺" },
  { code: "fr", native: "Français", english: "French", flag: "🇫🇷" },
  { code: "ur", native: "اردو", english: "Urdu", flag: "🇵🇰" },
  { code: "jp", native: "日本語", english: "Japanese", flag: "🇯🇵" },
  { code: "tr", native: "Türkçe", english: "Turkish", flag: "🇹🇷" },
  { code: "kr", native: "한국어", english: "Korean", flag: "🇰🇷" },
  { code: "vi", native: "Tiếng Việt", english: "Vietnamese", flag: "🇻🇳" },
  { code: "fa", native: "دری", english: "Persian (Dari)", flag: "🇦🇫" },
  { code: "tl", native: "Filipino", english: "Filipino (Tagalog)", flag: "🇵🇭" },
  { code: "ne", native: "नेपाली", english: "Nepali", flag: "🇳🇵" },
  { code: "sw", native: "Kiswahili", english: "Swahili", flag: "🇰🇪" },
];

export const SPOKEN_LANGUAGE_COUNT = SPOKEN_LANGUAGES.length;
