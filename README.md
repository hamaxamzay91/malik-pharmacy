# Malik Pharmacy — Next.js Project

پرۆژەی Next.js + TypeScript + Tailwind CSS بۆ وێبسایتی Malik Pharmacy.

## دەستپێکردن

```bash
npm install
npm run dev
```

پاشان بڕۆ بۆ: http://localhost:3000

## پێکهاتەی پرۆژە

```
app/
  layout.tsx      → فۆنت و RTL setup
  page.tsx         → پەڕەی سەرەکی، هەموو بەشەکان کۆدەکاتەوە
  globals.css      → CSS variables و ستایلی تایبەت (کاپسوول، EKG، لۆگۆ)
components/
  Header.tsx       → نڤیگەیشن + دوگمەی Dark Mode
  Hero.tsx         → بەشی سەرەوە
  About.tsx        → دەربارەمان
  Categories.tsx   → بەشەکانی بەرهەم (٦ کارت)
  PopularProducts.tsx → بەرهەمی پۆپولار
  Features.tsx     → تایبەتمەندییەکان
  Reviews.tsx       → هەڵسەنگاندنی کڕیاران
  FAQ.tsx           → پرسیاری باو (accordion)
  Contact.tsx       → زانیاری پەیوەندی
  Footer.tsx        → خوارەوەی پەڕە
  DarkModeToggle.tsx → دوگمەی گۆڕینی ڕووناکی/تاریکی (client component)
```

## هەنگاوی داهاتوو

- زیادکردنی state management و شاپینگ کارت (Zustand یان Context API)
- بەستنەوە بە دەیتابەیس (PostgreSQL + Prisma) بۆ بەرهەم و داواکارییەکان
- Authentication (Firebase Auth یان NextAuth)
- Dashboard بۆ بەڕێوەبردنی بەرهەم و داواکارییەکان
- پەیوەستکردنی وێنەی ڕاستەقینەی بەرهەمەکان (لە بری emoji placeholder)

## ستایل و ڕەنگ

ڕەنگە سەرەکییەکان لە `tailwind.config.ts`دا دیاریکراون:
- سەوز (`green`): `#0F9D58`
- شین (`blue`): `#2563EB`

Dark mode بە شێوازی `class` کاردەکات — Tailwind دوگمەی گۆڕین لە Header کۆنترۆڵی دەکات.
