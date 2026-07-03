"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-ink dark:bg-[#08130e] text-[#cfe0d6] pt-14 pb-6.5">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="logo-mark w-9 h-9 rounded-[11px]" />
              <span dir="ltr" className="font-display font-extrabold text-lg text-white">
                Malik Pharmacy
              </span>
            </div>
            <p className="text-[13.5px] opacity-75">{t.footer.tagline}</p>
          </div>

          <div>
            <h5 className="text-white text-sm mb-4">{t.footer.quickLinks}</h5>
            <ul className="space-y-2.5 text-[13.5px] opacity-80">
              <li><a href="#home">{t.nav.home}</a></li>
              <li><a href="#about">{t.nav.about}</a></li>
              <li><a href="#categories">{t.nav.categories}</a></li>
              <li><a href="#contact">{t.nav.contact}</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-sm mb-4">{t.footer.legal}</h5>
            <ul className="space-y-2.5 text-[13.5px] opacity-80">
              <li><a href="#">{t.footer.privacy}</a></li>
              <li><a href="#">{t.footer.terms}</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-sm mb-4">{t.footer.social}</h5>
            <ul className="space-y-2.5 text-[13.5px] opacity-80">
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Instagram</a></li>
              <li><a href="#">WhatsApp</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5.5 flex justify-between flex-wrap gap-2.5 text-[12.5px] opacity-70">
          <span>{t.footer.rights}</span>
          <span>{t.footer.madeWith}</span>
        </div>
      </div>
    </footer>
  );
}
