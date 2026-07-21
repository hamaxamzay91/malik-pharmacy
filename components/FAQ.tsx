"use client";

import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function FAQ() {
  const { t } = useLanguage();

  return (
    <section id="faq" className="py-14 md:py-[88px] bg-green-pale/40 dark:bg-transparent">
      <div className="max-w-[1180px] mx-auto px-6">
        <Reveal>
          <div className="text-center max-w-[560px] mx-auto mb-12">
            <div className="inline-flex items-center text-[13px] font-bold tracking-wide text-green-dark bg-green-pale px-4 py-1.5 rounded-full mb-4.5">
              {t.faq.eyebrow}
            </div>
            <h2 className="font-display text-[26px] md:text-[32px] font-bold">
              {t.faq.title}
            </h2>
          </div>
        </Reveal>

        <div className="max-w-[760px] mx-auto">
          {t.faq.items.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details
                open={i === 0}
                className="bg-white dark:bg-[#0f1d16] border border-line dark:border-white/10 rounded-2xl px-5.5 py-4.5 mb-3"
              >
                <summary className="font-bold text-[15px] flex justify-between items-center">
                  {f.q}
                </summary>
                <p className="mt-3 text-muted text-sm">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
