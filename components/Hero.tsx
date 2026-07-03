"use client";

import { useLanguage } from "@/context/LanguageContext";
import Reveal from "./Reveal";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative overflow-hidden pt-[64px] pb-[60px]">
      <div className="dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_30%,transparent_75%)]" />
      <div className="glow-blob w-[420px] h-[420px] bg-green/20 -top-40 -right-20 -z-10" />
      <div className="glow-blob w-[320px] h-[320px] bg-blue/15 top-40 -left-24 -z-10" />

      <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1.05fr_.95fr] gap-12 items-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 text-[13px] font-bold tracking-wide text-green-dark bg-green-pale dark:bg-green-pale2 dark:text-[#5FE0A0] px-4 py-1.5 rounded-full mb-4.5">
            {t.hero.eyebrow}
          </div>
          <h1 className="font-display text-[32px] md:text-[46px] font-extrabold leading-[1.28] mb-5 tracking-tight">
            {t.hero.title1}{" "}
            <span className="bg-gradient-to-l from-green to-green-dark bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
            <br />
            {t.hero.title2}
          </h1>
          <p dir="ltr" className="font-display text-[16px] md:text-[17px] text-muted mb-7 font-medium">
            {t.hero.subtitle}
          </p>
          <div className="flex gap-3.5 mb-10 flex-wrap">
            <a
              href="#categories"
              className="shine-btn inline-flex items-center gap-2 justify-center px-6.5 py-3.5 rounded-[13px] font-bold text-[15px] bg-gradient-to-br from-blue to-blue-dark text-white shadow-[0_14px_28px_-12px_rgba(37,99,235,0.55)] hover:-translate-y-0.5 transition"
            >
              {t.hero.shopNow}
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 justify-center px-6.5 py-3.5 rounded-[13px] font-bold text-[15px] border-[1.5px] border-line hover:border-green hover:text-green-dark transition"
            >
              {t.hero.contactUs}
            </a>
          </div>
          <div className="flex gap-3 flex-wrap">
            {t.hero.badges.map((label, i) => (
              <div
                key={label}
                className="flex items-center gap-2.5 bg-white/80 dark:bg-[#0f1d16]/80 backdrop-blur border border-line dark:border-white/10 px-4 py-2.5 rounded-[14px] text-[13.5px] font-bold shadow-[0_8px_20px_-14px_rgba(0,0,0,0.15)]"
              >
                <span className={`w-2 h-2 rounded-full ${i === 1 ? "bg-blue" : "bg-green"}`} />
                {label}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="relative h-[420px] flex items-center justify-center">
            <div className="absolute w-[340px] h-[340px] rounded-full bg-[radial-gradient(circle_at_30%_30%,theme(colors.green.pale2),transparent_70%)]" />
            <div className="cap cap1 animate-float" />
            <div className="cap cap2 animate-float" />
            <div className="cap cap3 animate-float" />
            <div className="cross-core w-[150px] h-[150px] rounded-[32px] relative z-[2]" />
            <svg
              className="ekg absolute bottom-6 left-1/2 -translate-x-1/2 w-[280px] opacity-80"
              viewBox="0 0 280 40"
            >
              <path d="M0 20 L60 20 L75 5 L90 35 L105 20 L280 20" />
            </svg>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
