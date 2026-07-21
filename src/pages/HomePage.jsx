// =====================================================
// MALIK PHARMACY — HomePage.jsx
// Hero 3D | Aurora | Stats | Categories | Featured
// =====================================================

import { useRef, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  FiSearch, FiArrowRight, FiArrowLeft,
  FiStar, FiShield, FiTruck, FiClock,
  FiHeart, FiShoppingCart, FiEye
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useLang } from '../context/index.jsx'
import { useCart } from '../context/index.jsx'
import { medicineApi, categoryApi, bannerApi } from '../services/api'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'
import CountUp from '../components/common/CountUp'
import ProductCard from '../components/medicines/ProductCard'
import SkeletonCard from '../components/common/SkeletonCard'

// ── Category Icons ─────────────────────────────────
const CAT_ICONS = {
  antibiotics:  '💊', vitamins: '🌿', diabetes: '🩺',
  pain:         '🩹', cardiology: '❤️', skin: '✨',
  baby:         '👶', devices: '🔬', supplements: '💪',
}

const STATS = [
  { key: 'products',   icon: '💊', suffix: '+' },
  { key: 'customers',  icon: '😊', suffix: '+' },
  { key: 'delivery',   icon: '🚚', suffix: 'hr' },
  { key: 'brands',     icon: '🏆', suffix: '+' },
]

const STAT_VALS = [2000, 15000, 2, 150]

// ─────────────────────────────────────────────────
export default function HomePage() {
  const { t, lang, isRTL } = useLang()
  const { addItem, isInCart } = useCart()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const heroRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY     = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  // Fetch data
  const { data: featuredData, isLoading: loadingFeatured } = useQuery({
    queryKey: ['medicines', 'featured', lang],
    queryFn: () => medicineApi.getAll({ featured: 1, per_page: 8, lang }),
  })
  const { data: newData, isLoading: loadingNew } = useQuery({
    queryKey: ['medicines', 'new', lang],
    queryFn: () => medicineApi.getAll({ sort: 'newest', per_page: 8, lang }),
  })
  const { data: bestData } = useQuery({
    queryKey: ['medicines', 'best', lang],
    queryFn: () => medicineApi.getAll({ sort: 'popular', per_page: 8, lang }),
  })
  const { data: catsData } = useQuery({
    queryKey: ['categories', lang],
    queryFn: () => categoryApi.getAll(),
  })

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  const featured = featuredData?.data?.data || []
  const newItems = newData?.data?.data || []
  const bestItems= bestData?.data?.data || []
  const cats     = catsData?.data?.data || []

  return (
    <div style={{ overflow: 'hidden' }}>

      {/* ── HERO SECTION ──────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
          padding: '80px 24px 60px',
        }}
      >
        {/* Background rings */}
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${400 + i * 200}px`,
            height: `${400 + i * 200}px`,
            borderRadius: '50%',
            border: `1px solid var(--border-subtle)`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.4 - i * 0.08,
            animation: `spin ${20 + i * 10}s linear infinite ${i % 2 ? 'reverse' : ''}`,
            pointerEvents: 'none',
          }}/>
        ))}

        {/* Floating pills decoration */}
        {['💊', '🌿', '🩺', '💉', '🔬', '⚕️'].map((emoji, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              fontSize: `${24 + i * 4}px`,
              top: `${15 + i * 12}%`,
              left: i % 2 === 0 ? `${5 + i * 3}%` : 'auto',
              right: i % 2 !== 0 ? `${5 + i * 3}%` : 'auto',
              opacity: 0.15,
              pointerEvents: 'none',
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4 + i * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          >
            {emoji}
          </motion.div>
        ))}

        {/* Content */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, position: 'relative', zIndex: 2 }}
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 20px', borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-glow)',
              border: '1px solid rgba(0,212,170,0.3)',
              color: 'var(--color-primary)',
              fontSize: '0.8rem', fontWeight: 600,
              marginBottom: 24, letterSpacing: 1,
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--color-primary)',
              animation: 'pulse 2s ease-in-out infinite',
            }}/>
            {lang === 'ku' ? '✦ هەمیشە ئامادەین' : lang === 'ar' ? '✦ دائماً جاهزون' : '✦ Always Ready for You'}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 20,
              letterSpacing: -2,
            }}
          >
            <span className="gradient-text">{t('home.hero_title')}</span>
            <br />
            <span style={{ color: 'var(--text-secondary)', fontWeight: 400, fontSize: '0.6em' }}>
              {lang === 'ku' ? 'دەرمانخانە' : lang === 'ar' ? 'الصيدلية' : 'Pharmacy'}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: 600, margin: '0 auto 40px',
              lineHeight: 1.8,
            }}
          >
            {t('home.hero_subtitle')}
          </motion.p>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSearch}
            style={{
              display: 'flex', gap: 0, maxWidth: 600,
              margin: '0 auto 48px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px var(--border-subtle)',
            }}
          >
            <FiSearch style={{
              position: 'absolute', top: '50%', transform: 'translateY(-50%)',
              [isRTL ? 'right' : 'left']: 20, color: 'var(--color-primary)',
              fontSize: 20, pointerEvents: 'none',
              zIndex: 1,
            }}/>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('home.hero_search')}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none', outline: 'none',
                  padding: isRTL ? '18px 56px 18px 16px' : '18px 16px 18px 56px',
                  fontSize: '0.95rem',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                }}
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              style={{ borderRadius: 0, padding: '16px 28px', flexShrink: 0 }}
            >
              {isRTL ? <FiArrowLeft/> : <FiArrowRight/>}
            </button>
          </motion.form>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/medicines" className="btn-primary" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: '1rem' }}>
              {t('home.hero_cta')}
            </Link>
            <a
              href="https://wa.me/9647500000000"
              target="_blank" rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 'var(--radius-full)',
                background: '#25D366', color: '#fff',
                textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
                transition: 'all var(--transition-fast)',
              }}
            >
              <FaWhatsapp size={18}/>
              {lang === 'ku' ? 'واتساپ' : lang === 'ar' ? 'واتساب' : 'WhatsApp'}
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}
        >
          <div style={{
            width: 24, height: 38, border: '2px solid var(--border-default)',
            borderRadius: 12, display: 'flex', justifyContent: 'center', padding: 4,
          }}>
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 4, height: 8, background: 'var(--color-primary)', borderRadius: 2 }}
            />
          </div>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2 }}>SCROLL</span>
        </motion.div>
      </section>

      {/* ── TRUST BADGES ──────────────────────────── */}
      <section style={{ padding: '0 24px', marginBottom: 80 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {[
              { icon: <FiShield size={22}/>, titleKu: 'دەرمانی ڕەسمی', titleEn: 'Certified Medicines', titleAr: 'أدوية موثقة', color: '#00D4AA' },
              { icon: <FiTruck size={22}/>, titleKu: 'گەیاندنی خێرا', titleEn: 'Fast Delivery', titleAr: 'توصيل سريع', color: '#6C63FF' },
              { icon: <FiClock size={22}/>, titleKu: '٢٤/٧ خزمەتگوزاری', titleEn: '24/7 Service', titleAr: 'خدمة 24/7', color: '#F0B429' },
              { icon: '💊', titleKu: '+٢٠٠٠ دەرمان', titleEn: '+2000 Medicines', titleAr: '+2000 دواء', color: '#FF4757', isEmoji: true },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass"
                style={{
                  padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: 16,
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${item.color}18`,
                  border: `1px solid ${item.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.color, fontSize: item.isEmoji ? 22 : undefined,
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    {lang === 'ku' ? item.titleKu : lang === 'ar' ? item.titleAr : item.titleEn}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────── */}
      <section style={{ padding: '60px 24px', marginBottom: 80, background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 24,
          }}>
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                style={{ textAlign: 'center', padding: '32px 16px' }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>{stat.icon}</div>
                <div style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 900,
                  lineHeight: 1,
                  marginBottom: 8,
                }}>
                  <span className="gradient-text">
                    <CountUp end={STAT_VALS[i]} duration={2} delay={i * 0.3} />
                    {stat.suffix}
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {t(`home.stats_${stat.key}`)}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <SectionHeader
            title={t('home.categories')}
            link="/medicines"
            linkLabel={t('common.show_more')}
            isRTL={isRTL}
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: 16,
          }}>
            {(cats.length > 0 ? cats : MOCK_CATS).map((cat, i) => (
              <motion.div
                key={cat.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                onClick={() => navigate(`/medicines?category=${cat.id || cat.slug}`)}
                style={{
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-spring)',
                }}
                whileHover={{ y: -6, boxShadow: '0 20px 40px var(--color-primary-glow)' }}
              >
                <div style={{ fontSize: 36, marginBottom: 12 }}>
                  {CAT_ICONS[cat.slug] || '💊'}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {cat[`name_${lang}`] || cat.name}
                </div>
                {cat.count > 0 && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {cat.count} {lang === 'ku' ? 'جۆر' : lang === 'ar' ? 'نوع' : 'types'}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <SectionHeader
            title={t('home.featured')}
            link="/medicines?featured=1"
            linkLabel={t('common.show_more')}
            isRTL={isRTL}
          />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 20,
          }}>
            {loadingFeatured
              ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i}/>)
              : featured.map((med, i) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <ProductCard medicine={med} lang={lang} isRTL={isRTL} />
                </motion.div>
              ))
            }
          </div>
        </div>
      </section>

      {/* ── OFFERS BANNER ─────────────────────────── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              position: 'relative',
              padding: '60px 48px',
              background: 'linear-gradient(135deg, rgba(0,212,170,0.15) 0%, rgba(108,99,255,0.15) 100%)',
              border: '1px solid var(--border-default)',
            }}
          >
            {/* Decorative */}
            <div style={{
              position: 'absolute', top: -60, right: -60,
              width: 300, height: 300, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,212,170,0.2), transparent)',
              pointerEvents: 'none',
            }}/>

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 600 }}>
              <div className="badge badge-primary" style={{ marginBottom: 16 }}>
                🔥 {lang === 'ku' ? 'ئۆفەرە تایبەتەکان' : lang === 'ar' ? 'عروض خاصة' : 'Special Offers'}
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
                {lang === 'ku' ? 'تا ٥٠٪ داشکاندن' : lang === 'ar' ? 'خصم حتى 50%' : 'Up to 50% Discount'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: '1rem' }}>
                {lang === 'ku'
                  ? 'لەسەر هەموو بەرهەمە تەندروستییەکان و وتامینەکان ئەمەو'
                  : lang === 'ar'
                  ? 'على جميع المنتجات الصحية والفيتامينات هذا الشهر'
                  : 'On all health products and vitamins this month'}
              </p>
              <Link
                to="/offers"
                className="btn-primary"
                style={{ textDecoration: 'none', padding: '14px 32px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                {lang === 'ku' ? 'ئۆفەرەکان ببینە' : lang === 'ar' ? 'اعرض العروض' : 'View Offers'}
                {isRTL ? <FiArrowLeft/> : <FiArrowRight/>}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── BEST SELLERS ──────────────────────────── */}
      <section style={{ padding: '0 24px 80px', background: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', paddingTop: 60 }}>
          <SectionHeader
            title={t('home.best_sellers')}
            link="/medicines?sort=popular"
            linkLabel={t('common.show_more')}
            isRTL={isRTL}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
            {bestItems.map((med, i) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <ProductCard medicine={med} lang={lang} isRTL={isRTL} showBadge="🔥" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESCRIPTION UPLOAD CTA ───────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card"
            style={{ padding: '60px 48px' }}
          >
            <div style={{ fontSize: 64, marginBottom: 20 }}>📋</div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: 16 }}>
              {lang === 'ku' ? 'ڕەچەتەکەت ئەپلۆدبکە' : lang === 'ar' ? 'ارفع وصفتك الطبية' : 'Upload Your Prescription'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.95rem', lineHeight: 1.8 }}>
              {lang === 'ku'
                ? 'وێنەی ڕەچەتەکەت ئەپلۆدبکە، ئێمەش دەرمانەکانت ئامادە دەکەین و دەیگەینینە دەرگاکەت.'
                : lang === 'ar'
                ? 'ارفع صورة وصفتك الطبية وسنقوم بتحضير أدويتك وتوصيلها إلى بابك.'
                : 'Upload your prescription photo and we will prepare your medicines and deliver them to your door.'}
            </p>
            <Link
              to="/prescription"
              className="btn-accent"
              style={{ textDecoration: 'none', padding: '14px 40px', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              📤 {lang === 'ku' ? 'ئەپلۆدی ڕەچەتە' : lang === 'ar' ? 'رفع الوصفة' : 'Upload Prescription'}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Style for rings */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        @keyframes spin {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// ── Section Header Component ───────────────────────
function SectionHeader({ title, link, linkLabel, isRTL }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
      <div>
        <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 800, marginBottom: 6 }}>
          {title}
        </h2>
        <div style={{
          height: 3, width: 48,
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
          borderRadius: 2,
        }}/>
      </div>
      <Link
        to={link}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          color: 'var(--color-primary)', textDecoration: 'none',
          fontWeight: 600, fontSize: '0.875rem',
          transition: 'gap var(--transition-fast)',
        }}
        className="hover:gap-3"
      >
        {linkLabel}
        {isRTL ? <FiArrowLeft size={16}/> : <FiArrowRight size={16}/>}
      </Link>
    </div>
  )
}

// ── Mock categories fallback ───────────────────────
const MOCK_CATS = [
  { id: 1, slug: 'antibiotics', name_ku: 'ئێن‌تیبیۆتیک', name_en: 'Antibiotics', name_ar: 'مضادات حيوية', count: 45 },
  { id: 2, slug: 'vitamins', name_ku: 'وتامین', name_en: 'Vitamins', name_ar: 'فيتامينات', count: 80 },
  { id: 3, slug: 'diabetes', name_ku: 'شەکرەکەی', name_en: 'Diabetes', name_ar: 'السكري', count: 30 },
  { id: 4, slug: 'pain', name_ku: 'ئەناڵجیزیک', name_en: 'Pain Relief', name_ar: 'مسكنات', count: 55 },
  { id: 5, slug: 'cardiology', name_ku: 'دووگەلی دل', name_en: 'Cardiology', name_ar: 'القلب', count: 25 },
  { id: 6, slug: 'skin', name_ku: 'پێستی چەرم', name_en: 'Skin Care', name_ar: 'العناية بالبشرة', count: 90 },
  { id: 7, slug: 'baby', name_ku: 'مناڵ', name_en: 'Baby Care', name_ar: 'العناية بالطفل', count: 40 },
  { id: 8, slug: 'supplements', name_ku: 'سوپلیمینت', name_en: 'Supplements', name_ar: 'مكملات', count: 120 },
]
