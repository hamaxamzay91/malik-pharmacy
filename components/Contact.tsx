"use client";

import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function Contact() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-14 md:py-[88px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <Reveal>
          <div className="text-center max-w-[560px] mx-auto mb-12">
            <div className="inline-flex items-center text-[13px] font-bold tracking-wide text-green-dark bg-green-pale px-4 py-1.5 rounded-full mb-4.5">
              {t.contact.eyebrow}
            </div>
            <h2 className="font-display text-[26px] md:text-[32px] font-bold">
              {t.contact.title}
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {t.contact.items.map((c, i) => (
            <Reveal key={c.title} delay={i * 50}>
              <div className="grad-card bg-white dark:bg-[#0f1d16] border border-line dark:border-white/10 rounded-[18px] p-5.5 flex gap-4 items-start">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-pale to-green-pale2 flex items-center justify-center text-xl shrink-0">
                  {c.icon}
                </div>
                <div>
                  <h4 className="text-[14.5px] mb-1 font-semibold">{c.title}</h4>
                  <span className="text-[13px] text-muted">{c.value}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
