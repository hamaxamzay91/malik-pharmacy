"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { Lang, langMeta, translations } from "@/lib/translations";

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  dir: "rtl" | "ltr";
  t: (typeof translations)["ku"];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "malik-pharmacy-lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ku");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved && translations[saved]) {
      setLangState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = langMeta[lang].htmlLang;
    document.documentElement.dir = langMeta[lang].dir;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  };

  const value = useMemo(
    () => ({
      lang,
      setLang,
      dir: langMeta[lang].dir,
      t: translations[lang],
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}
