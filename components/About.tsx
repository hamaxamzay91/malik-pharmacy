"use client";

import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function About() {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-14 md:py-[88px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <Reveal>
          <div className="relative bg-green-pale dark:bg-green-pale2 rounded-[32px] p-8 md:p-12 overflow-hidden">
            <div className="glow-blob w-[260px] h-[260px] bg-green/25 -top-20 -left-16" />
            <div className="grid grid-cols-1 lg:grid-cols-[.9fr_1.1fr] gap-12 items-center relative">
              <div>
                <div className="inline-flex items-center text-[13px] font-bold tracking-wide text-green-dark bg-white/80 dark:bg-white/10 backdrop-blur px-4 py-1.5 rounded-full mb-4.5">
                  {t.about.eyebrow}
                </div>
                <h2 className="font-display text-[26px] md:text-[32px] font-bold mb-4">
                  {t.about.title}
                </h2>
                <p className="text-ink-soft text-[15.5px] mb-3.5">{t.about.p1}</p>
                <p className="text-ink-soft text-[15.5px] mb-3.5">{t.about.p2}</p>
                <div className="flex gap-9 mt-6 flex-wrap">
                  {t.about.stats.map((s) => (
                    <div key={s.label}>
                      <b className="block font-display text-[30px] md:text-[32px] font-extrabold text-green-dark">
                        {s.value}
                      </b>
                      <span className="text-[13px] text-muted font-semibold">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-[280px] rounded-3xl bg-gradient-to-br from-green-dark to-green-deep relative overflow-hidden flex items-center justify-center shadow-2xl">
                <span className="absolute font-display font-extrabold text-white/10 text-[120px] -top-7 -right-2.5">
                  +
                </span>
                <span className="absolute font-display font-extrabold text-white/10 text-[70px] -bottom-2.5 left-5">
                  +
                </span>
                <p className="relative z-[1] text-white text-center px-10 font-display font-semibold text-[19px] leading-relaxed">
                  {t.about.quote}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
