"use client";

import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function Reviews() {
  const { t } = useLanguage();

  return (
    <section id="reviews" className="py-14 md:py-[88px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <Reveal>
          <div className="text-center max-w-[560px] mx-auto mb-12">
            <div className="inline-flex items-center text-[13px] font-bold tracking-wide text-green-dark bg-green-pale px-4 py-1.5 rounded-full mb-4.5">
              {t.reviews.eyebrow}
            </div>
            <h2 className="font-display text-[26px] md:text-[32px] font-bold">
              {t.reviews.title}
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5.5">
          {t.reviews.items.map((r, i) => (
            <Reveal key={r.name} delay={i * 90}>
              <div className="grad-card bg-white dark:bg-[#0f1d16] border border-line dark:border-white/10 rounded-[20px] p-6.5">
                <div className="text-[#F5A524] tracking-widest mb-3 text-[15px]">
                  ★★★★★
                </div>
                <p className="text-[14.5px] text-ink-soft mb-4.5">
                  &quot;{r.text}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-green-pale to-green-pale2 flex items-center justify-center font-display font-extrabold text-green-dark">
                    {r.initial}
                  </div>
                  <div>
                    <b className="text-[13.5px] block">{r.name}</b>
                    <span className="text-xs text-muted">{r.city}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
