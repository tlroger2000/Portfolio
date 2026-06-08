"use client";

import { LANGS } from "@/lib/i18n";
import { useLanguage } from "./language-provider";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-white mix-blend-difference"
      role="group"
      aria-label="Idioma"
    >
      {LANGS.map((l, i) => (
        <span key={l.code} className="flex items-center">
          {i > 0 && <span className="mx-1 opacity-40">/</span>}
          <button
            type="button"
            onClick={() => setLang(l.code)}
            aria-pressed={lang === l.code}
            aria-label={l.name}
            className={`transition-opacity hover:opacity-100 ${
              lang === l.code ? "opacity-100" : "opacity-50"
            }`}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
