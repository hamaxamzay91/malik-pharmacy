"use client";

import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function Features() {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-14 md:py-[88px]">
      <div className="max-w-[1180px] mx-auto px-6">
        <Reveal>
          <div className="relative bg-ink dark:bg-green-pale2 rounded-[32px] px-6 md:px-10 py-14 text-white overflow-hidden">
            <div className="glow-blob w-[300px] h-[300px] bg-green/20 -bottom-24 -right-16" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center relative">
              {t.features.map((f) => (
                <div key={f.label}>
                  <div className="w-[54px] h-[54px] mx-auto mb-3.5 rounded-2xl bg-white/10 flex items-center justify-center text-2xl text-[#5FE0A0]">
                    {f.icon}
                  </div>
                  <h4 className="text-[14px] font-bold">{f.label}</h4>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
