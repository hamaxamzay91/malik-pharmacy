"use client";

import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function Categories() {
  const { t } = useLanguage();

  return (
    <section id="categories" className="py-14 md:py-[88px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <Reveal>
          <div className="text-center max-w-[560px] mx-auto mb-12">
            <div className="inline-flex items-center text-[13px] font-bold tracking-wide text-green-dark bg-green-pale px-4 py-1.5 rounded-full mb-4.5">
              {t.categories.eyebrow}
            </div>
            <h2 className="font-display text-[26px] md:text-[32px] font-bold mb-2.5">
              {t.categories.title}
            </h2>
            <p className="text-muted text-[15px]">{t.categories.subtitle}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {t.categories.items.map((c, i) => (
            <Reveal key={c.name} delay={i * 60}>
              <div className="grad-card bg-white dark:bg-[#0f1d16] border border-line dark:border-white/10 rounded-[18px] p-6 text-center cursor-pointer hover:-translate-y-1.5 hover:shadow-brand">
                <div className="w-[52px] h-[52px] mx-auto mb-3.5 rounded-2xl bg-gradient-to-br from-green-pale to-green-pale2 flex items-center justify-center text-2xl">
                  {c.icon}
                </div>
                <span className="text-[13.5px] font-bold">{c.name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
