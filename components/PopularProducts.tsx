"use client";

import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function PopularProducts() {
  const { t } = useLanguage();

  return (
    <section id="popular" className="py-14 md:py-[88px] bg-green-pale/40 dark:bg-transparent">
      <div className="max-w-[1180px] mx-auto px-6">
        <Reveal>
          <div className="text-center max-w-[560px] mx-auto mb-12">
            <div className="inline-flex items-center text-[13px] font-bold tracking-wide text-green-dark bg-green-pale px-4 py-1.5 rounded-full mb-4.5">
              {t.products.eyebrow}
            </div>
            <h2 className="font-display text-[26px] md:text-[32px] font-bold mb-2.5">
              {t.products.title}
            </h2>
            <p className="text-muted text-[15px]">{t.products.subtitle}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {t.products.items.map((p, i) => (
            <Reveal key={p.name} delay={i * 70}>
              <div className="grad-card bg-white dark:bg-[#0f1d16] border border-line dark:border-white/10 rounded-[20px] overflow-hidden hover:-translate-y-1 hover:shadow-brand">
                <div className="h-[150px] bg-gradient-to-br from-green-pale to-green-pale2 flex items-center justify-center text-[44px] relative">
                  {p.icon}
                  {p.tag && (
                    <span className="absolute top-2.5 end-2.5 bg-gradient-to-br from-blue to-blue-dark text-white text-[10.5px] font-extrabold px-2.5 py-1 rounded-lg">
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="p-4.5 pt-4">
                  <h4 className="text-[14.5px] mb-3 font-semibold">{p.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-extrabold text-green-dark text-base">
                      {p.price}
                    </span>
                    <button className="shine-btn w-9 h-9 rounded-[10px] bg-gradient-to-br from-green to-green-dark text-white flex items-center justify-center text-lg hover:scale-105 transition">
                      +
                    </button>
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
