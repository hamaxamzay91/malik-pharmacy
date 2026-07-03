"use client";

import DarkModeToggle from "./DarkModeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

export default function Header() {
  const { t } = useLanguage();

  const links = [
    { href: "#home", label: t.nav.home },
    { href: "#about", label: t.nav.about },
    { href: "#categories", label: t.nav.categories },
    { href: "#reviews", label: t.nav.reviews },
    { href: "#faq", label: t.nav.faq },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 bg-paper/80 dark:bg-[#0b1611]/80 backdrop-blur-xl backdrop-saturate-150 border-b border-line dark:border-white/10">
      <nav className="max-w-[1180px] mx-auto flex items-center justify-between px-6 py-3.5 gap-4">
        <div className="flex items-center gap-2.5 font-extrabold text-xl shrink-0">
          <div className="logo-mark w-9 h-9 rounded-[11px] shadow-brand" />
          <span className="font-display" dir="ltr">
            Malik Pharmacy
          </span>
        </div>

        <div className="hidden lg:flex gap-7 font-semibold text-[14.5px] text-ink-soft dark:text-white/70">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative py-1 hover:text-green-dark dark:hover:text-[#5FE0A0] transition"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <LanguageSwitcher />
          <DarkModeToggle />
          <button className="hidden sm:flex w-10 h-10 rounded-xl border border-line dark:border-white/10 items-center justify-center text-ink-soft dark:text-white/70 hover:border-green hover:text-green transition">
            🛒
          </button>
          <a
            href="#categories"
            className="shine-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] font-bold text-sm bg-gradient-to-br from-blue to-blue-dark text-white shadow-[0_14px_28px_-12px_rgba(37,99,235,0.55)] hover:-translate-y-0.5 transition"
          >
            {t.nav.shopNow}
          </a>
        </div>
      </nav>
    </header>
  );
}
