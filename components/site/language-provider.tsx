"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { type Dict, type Lang, translations } from "@/lib/i18n";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "rtl-lang";
const DEFAULT_LANG: Lang = "ca";

// ---------------------------------------------------------------------------
// Tiny localStorage-backed store. Reading the preference through
// useSyncExternalStore keeps the initial value out of a setState-in-effect and
// stays hydration-safe (the server snapshot is always the default), while also
// syncing the language across browser tabs.
// ---------------------------------------------------------------------------
let currentLang: Lang = DEFAULT_LANG;
let hydrated = false;
const listeners = new Set<() => void>();

function readStored(): Lang {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v && v in translations ? (v as Lang) : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

function subscribe(onChange: () => void): () => void {
  // Hydrate from storage the first time the store is observed (client only).
  if (!hydrated) {
    hydrated = true;
    currentLang = readStored();
  }
  listeners.add(onChange);

  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      currentLang = readStored();
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = (): Lang => currentLang;
const getServerSnapshot = (): Lang => DEFAULT_LANG;

function writeLang(lang: Lang) {
  currentLang = lang;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable (private mode / disabled) — keep in-memory value */
  }
  listeners.forEach((l) => l());
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keep <html lang> in sync with the active language.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value: LanguageContextValue = {
    lang,
    setLang: writeLang,
    t: translations[lang],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

/** Shortcut to the current dictionary. */
export function useT() {
  return useLanguage().t;
}
