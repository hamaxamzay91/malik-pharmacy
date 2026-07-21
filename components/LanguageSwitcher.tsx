"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Lang, langMeta } from "@/lib/translations";

const order: Lang[] = ["ku", "en", "ar"];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-green-pale/60 dark:bg-white/5 rounded-full p-1">
      {order.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          data-active={lang === l}
          className="lang-pill px-3 py-1.5 rounded-full text-[12.5px] font-bold text-ink-soft dark:text-white/70"
        >
          {langMeta[l].label}
        </button>
      ))}
    </div>
  );
}
