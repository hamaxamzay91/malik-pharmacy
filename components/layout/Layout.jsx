// =====================================================
// MALIK PHARMACY — Layout.jsx
// Sticky Header | Mega Menu | Dark/Light | RTL/LTR
// =====================================================

import { useState, useEffect, useRef } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiSearch, FiShoppingCart, FiHeart, FiBell, FiUser,
  FiMenu, FiX, FiSun, FiMoon, FiGlobe, FiChevronDown,
  FiPackage, FiLogOut, FiSettings, FiPhone, FiMapPin
} from 'react-icons/fi'
import { FaWhatsapp, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/index.jsx'
import { useTheme, useLang } from '../../context/index.jsx'

// ── Mega Menu Data ─────────────────────────────────
const MEGA_MENU = [
  {
    key: 'medicines',
    cols: [
      {
        title: { ku: 'دەرمانەکان', en: 'Medicines', ar: 'الأدوية' },
        links: [
          { ku: 'هەموو دەرمانەکان', en: 'All Medicines', ar: 'جميع الأدوية', to: '/medicines' },
          { ku: 'بەردەستەکان', en: 'Available', ar: 'المتوفرة', to: '/medicines?in_stock=1' },
          { ku: 'پێویستە بە ڕەچەتە', en: 'Prescription', ar: 'بوصفة طبية', to: '/medicines?prescription=1' },
          { ku: 'تازە گەیشتووەکان', en: 'New Arrivals', ar: 'وصل حديثاً', to: '/medicines?sort=newest' },
          { ku: 'زیاتر فرۆشراوەکان', en: 'Best Sellers', ar: 'الأكثر مبيعاً', to: '/medicines?sort=popular' },
        ]
      },
      {
        title: { ku: 'کاتەگۆری', en: 'Categories', ar: 'الفئات' },
        links: [
          { ku: 'ئێن‌تیبیۆتیک', en: 'Antibiotics', ar: 'مضادات حيوية', to: '/medicines?cat=antibiotics' },
          { ku: 'دووگەلی دل', en: 'Cardiology', ar: 'أمراض القلب', to: '/medicines?cat=cardiology' },
          { ku: 'شەکرەکەی', en: 'Diabetes', ar: 'السكري', to: '/medicines?cat=diabetes' },
          { ku: 'ئەناڵجیزیک', en: 'Pain Relief', ar: 'مسكنات الألم', to: '/medicines?cat=pain' },
          { ku: 'وتامین', en: 'Vitamins', ar: 'الفيتامينات', to: '/medicines?cat=vitamins' },
        ]
      },
      {
        title: { ku: 'براند', en: 'Top Brands', ar: 'أفضل الماركات' },
        links: [
          { ku: 'Pfizer', en: 'Pfizer', ar: 'فايزر', to: '/medicines?brand=pfizer' },
          { ku: 'Bayer', en: 'Bayer', ar: 'باير', to: '/medicines?brand=bayer' },
          { ku: 'Roche', en: 'Roche', ar: 'روش', to: '/medicines?brand=roche' },
          { ku: 'Novartis', en: 'Novartis', ar: 'نوفارتس', to: '/medicines?brand=novartis' },
          { ku: 'Local Brands', en: 'Local Brands', ar: 'الماركات المحلية', to: '/medicines?brand=local' },
        ]
      },
    ]
  },
]

const LANGS = [
  { code: 'ku', label: 'کوردی', flag: '🇮🇶' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

// ─────────────────────────────────────────────────
export default function Layout() {
  const { user, logout }          = useAuth()
  const { count }                 = useCart()
  const { theme, toggleTheme }    = useTheme()
  const { lang, setLang, t, isRTL } = useLang()
  const location                  = useLocation()
  const navigate                  = useNavigate()

  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [megaOpen, setMegaOpen]   = useState(false)
  const [langOpen, setLangOpen]   = useState(false)
  const [userOpen, setUserOpen]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const searchRef = useRef(null)

  // Sticky header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false)
    setMegaOpen(false)
    setUserOpen(false)
  }, [location.pathname])

  // Search
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const NAV_LINKS = [
    { label: t('nav.home'),        to: '/' },
    { label: t('nav.medicines'),   to: '/medicines', hasMega: true },
    { label: t('nav.health'),      to: '/medicines?cat=health' },
    { label: t('nav.offers'),      to: '/offers' },
    { label: t('nav.prescription'),to: '/prescription' },
    { label: t('nav.blog'),        to: '/blog' },
    { label: t('nav.about'),       to: '/about' },
    { label: t('nav.contact'),     to: '/contact' },
  ]

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/'
    return location.pathname.startsWith(to.split('?')[0])
  }

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* ── HEADER ──────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'header-scrolled py-2' : 'py-4 bg-transparent'
        }`}
        style={{
          background: scrolled
            ? (theme === 'dark' ? 'rgba(7,11,20,0.9)' : 'rgba(240,244,255,0.9)')
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border-subtle)' : 'none',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="relative">
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, boxShadow: '0 0 20px var(--color-primary-glow)',
              }}>💊</div>
              <div style={{
                position: 'absolute', inset: -2, borderRadius: 14,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                zIndex: -1, opacity: 0.3, filter: 'blur(6px)',
              }}/>
            </div>
            <div className="hidden sm:block">
              <div className="gradient-text font-bold text-lg leading-tight">
                {lang === 'ku' ? 'مەلیک' : lang === 'ar' ? 'مالك' : 'Malik'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2 }}>
                PHARMACY
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <div key={link.to} className="relative group">
                <Link
                  to={link.to}
                  onMouseEnter={() => link.hasMega && setMegaOpen(true)}
                  onMouseLeave={() => link.hasMega && setMegaOpen(false)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: isActive(link.to) ? 'var(--color-primary)' : 'var(--text-secondary)',
                    background: isActive(link.to) ? 'var(--color-primary-glow)' : 'transparent',
                    transition: 'all var(--transition-fast)',
                    display: 'flex', alignItems: 'center', gap: 4,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                  className="hover:text-[--color-primary] hover:bg-[--bg-glass]"
                >
                  {link.label}
                  {link.hasMega && <FiChevronDown size={12} />}
                </Link>

                {/* Mega Menu */}
                {link.hasMega && (
                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setMegaOpen(true)}
                        onMouseLeave={() => setMegaOpen(false)}
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: isRTL ? 'auto' : 0,
                          right: isRTL ? 0 : 'auto',
                          marginTop: 8,
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-default)',
                          borderRadius: 'var(--radius-lg)',
                          boxShadow: 'var(--shadow-lg)',
                          backdropFilter: 'blur(20px)',
                          padding: 24,
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 200px)',
                          gap: 32,
                          zIndex: 100,
                        }}
                      >
                        {MEGA_MENU[0].cols.map((col, ci) => (
                          <div key={ci}>
                            <div style={{
                              fontSize: '0.75rem', fontWeight: 700,
                              color: 'var(--color-primary)',
                              textTransform: 'uppercase', letterSpacing: 1,
                              marginBottom: 12,
                            }}>
                              {col.title[lang]}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {col.links.map((lnk, li) => (
                                <Link
                                  key={li}
                                  to={lnk.to}
                                  onClick={() => setMegaOpen(false)}
                                  style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    padding: '5px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    transition: 'all var(--transition-fast)',
                                  }}
                                  className="hover:text-[--color-primary] hover:bg-[--bg-glass]"
                                >
                                  {lnk[lang]}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="header-icon-btn"
              style={iconBtnStyle}
              title={t('nav.search')}
            >
              <FiSearch size={18} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              style={iconBtnStyle}
              title={theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
            >
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(o => !o)}
                style={{ ...iconBtnStyle, gap: 4, padding: '8px 10px' }}
              >
                <FiGlobe size={16} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  {lang.toUpperCase()}
                </span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                      position: 'absolute',
                      top: '100%', marginTop: 8,
                      [isRTL ? 'left' : 'right']: 0,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-md)',
                      overflow: 'hidden',
                      minWidth: 140,
                      zIndex: 100,
                    }}
                  >
                    {LANGS.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false) }}
                        style={{
                          width: '100%',
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 16px',
                          background: lang === l.code ? 'var(--color-primary-glow)' : 'transparent',
                          color: lang === l.code ? 'var(--color-primary)' : 'var(--text-secondary)',
                          border: 'none', cursor: 'pointer',
                          fontSize: '0.875rem', fontWeight: lang === l.code ? 600 : 400,
                          fontFamily: 'inherit',
                          transition: 'background var(--transition-fast)',
                          textAlign: isRTL ? 'right' : 'left',
                        }}
                        className="hover:bg-[--bg-glass]"
                      >
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist */}
            {user && (
              <Link to="/wishlist" style={iconBtnStyle} title={t('nav.wishlist')}>
                <FiHeart size={18} />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" style={{ ...iconBtnStyle, position: 'relative' }} title={t('nav.cart')}>
              <FiShoppingCart size={18} />
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: isRTL ? 'auto' : -6,
                  left: isRTL ? -6 : 'auto',
                  background: 'var(--color-danger)',
                  color: '#fff', borderRadius: '50%',
                  width: 18, height: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700,
                  border: '2px solid var(--bg-base)',
                }}>
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserOpen(o => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    backdropFilter: 'blur(8px)',
                    transition: 'all var(--transition-fast)',
                    fontFamily: 'inherit',
                  }}
                  className="hover:border-[--color-primary]"
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: '#000',
                  }}>
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:block max-w-[100px] truncate">{user.name}</span>
                  <FiChevronDown size={14} />
                </button>

                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{
                        position: 'absolute', top: '100%', marginTop: 8,
                        [isRTL ? 'left' : 'right']: 0,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-default)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-lg)',
                        minWidth: 200, zIndex: 100, overflow: 'hidden',
                      }}
                    >
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                      </div>
                      {[
                        { icon: <FiUser size={15}/>, label: t('nav.profile'), to: '/profile' },
                        { icon: <FiPackage size={15}/>, label: t('nav.orders'), to: '/orders' },
                        { icon: <FiHeart size={15}/>, label: t('nav.wishlist'), to: '/wishlist' },
                        ...(user.role === 'admin' ? [{ icon: <FiSettings size={15}/>, label: 'Admin', to: '/admin' }] : []),
                      ].map(item => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setUserOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 16px',
                            color: 'var(--text-secondary)', textDecoration: 'none',
                            fontSize: '0.875rem',
                            transition: 'background var(--transition-fast)',
                          }}
                          className="hover:bg-[--bg-glass] hover:text-[--color-primary]"
                        >
                          {item.icon} {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => { logout(); setUserOpen(false) }}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 16px',
                          color: 'var(--color-danger)', background: 'transparent',
                          border: 'none', cursor: 'pointer', fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          borderTop: '1px solid var(--border-subtle)',
                          textAlign: isRTL ? 'right' : 'left',
                        }}
                        className="hover:bg-red-500/10"
                      >
                        <FiLogOut size={15}/> {t('nav.logout')}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/auth/login"
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <FiUser size={15}/> {t('nav.login')}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden"
              onClick={() => setMenuOpen(o => !o)}
              style={iconBtnStyle}
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'var(--bg-elevated)',
                borderTop: '1px solid var(--border-subtle)',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      color: isActive(link.to) ? 'var(--color-primary)' : 'var(--text-secondary)',
                      background: isActive(link.to) ? 'var(--color-primary-glow)' : 'transparent',
                      textDecoration: 'none', fontWeight: 500,
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <Link to="/auth/login" className="btn-primary" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '10px' }}>
                      {t('nav.login')}
                    </Link>
                    <Link to="/auth/register" className="btn-ghost" style={{ flex: 1, textAlign: 'center', textDecoration: 'none', padding: '10px' }}>
                      {t('nav.register')}
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'flex-start',
              justifyContent: 'center', paddingTop: '15vh',
            }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 600, padding: '0 16px' }}
            >
              <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                <FiSearch style={{
                  position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                  [isRTL ? 'right' : 'left']: 20,
                  color: 'var(--color-primary)', fontSize: 20, pointerEvents: 'none',
                }}/>
                <input
                  ref={searchRef}
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('nav.search')}
                  style={{
                    width: '100%',
                    background: 'var(--bg-elevated)',
                    border: '2px solid var(--color-primary)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--text-primary)',
                    padding: isRTL ? '18px 56px 18px 20px' : '18px 20px 18px 56px',
                    fontSize: '1.1rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxShadow: '0 0 40px var(--color-primary-glow)',
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                      [isRTL ? 'left' : 'right']: 20,
                      background: 'none', border: 'none', color: 'var(--text-muted)',
                      cursor: 'pointer', fontSize: 20,
                    }}
                  >
                    <FiX/>
                  </button>
                )}
              </form>
              <div style={{ marginTop: 8, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Press ESC to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main style={{ paddingTop: 80, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: 80,
        position: 'relative', zIndex: 1,
      }}>
        {/* Top */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 24px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48 }}>

            {/* Brand */}
            <div>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 20 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                }}>💊</div>
                <div>
                  <div className="gradient-text" style={{ fontWeight: 800, fontSize: '1.2rem' }}>
                    {lang === 'ku' ? 'مەلیک دەرمانخانە' : lang === 'ar' ? 'صيدلية مالك' : 'Malik Pharmacy'}
                  </div>
                </div>
              </Link>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: 24 }}>
                {lang === 'ku'
                  ? 'دەرمانخانەی مەلیک، باشترین جێگای بۆ دەرمان و بەرهەمە تەندروستییەکانت لە کوردستان.'
                  : lang === 'ar'
                  ? 'صيدلية مالك، أفضل مكان للأدوية والمنتجات الصحية في كردستان.'
                  : 'Malik Pharmacy, the best place for medicines and health products in Kurdistan.'}
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {[
                  { icon: <FaWhatsapp/>, color: '#25D366', href: 'https://wa.me/9647500000000' },
                  { icon: <FaFacebook/>, color: '#1877F2', href: '#' },
                  { icon: <FaInstagram/>, color: '#E4405F', href: '#' },
                  { icon: <FaTiktok/>, color: 'var(--text-primary)', href: '#' },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-default)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: s.color, fontSize: 16, textDecoration: 'none',
                    transition: 'all var(--transition-fast)',
                  }}
                  className="hover:scale-110"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--color-primary)' }}>
                {t('footer.quick')}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {NAV_LINKS.slice(0, 6).map(link => (
                  <Link key={link.to} to={link.to} style={{
                    color: 'var(--text-muted)', textDecoration: 'none',
                    fontSize: '0.875rem', transition: 'color var(--transition-fast)',
                  }}
                  className="hover:text-[--color-primary]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--color-primary)' }}>
                {t('footer.contact')}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: <FiPhone/>, text: '+964 750 000 0000' },
                  { icon: <FaWhatsapp/>, text: '+964 750 000 0000' },
                  { icon: <FiMapPin/>, text: lang === 'ku' ? 'هەولێر، کوردستان' : lang === 'ar' ? 'أربيل، كردستان' : 'Erbil, Kurdistan' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--color-primary)' }}>{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--color-primary)' }}>
                {lang === 'ku' ? 'ئیمەیل وەربگرە' : lang === 'ar' ? 'اشترك في النشرة' : 'Newsletter'}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 16 }}>
                {lang === 'ku' ? 'دوایین ئۆفەر و نوێییەکانمان وەربگرە' : lang === 'ar' ? 'احصل على آخر العروض والأخبار' : 'Get our latest offers and news'}
              </p>
              <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="email"
                  placeholder={lang === 'ku' ? 'ئیمەیلت...' : 'Email...'}
                  className="input-field"
                  style={{ flex: 1, padding: '10px 14px', fontSize: '0.8rem' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '10px 16px', fontSize: '0.8rem', flexShrink: 0 }}>
                  {lang === 'ku' ? 'بنێرە' : lang === 'ar' ? 'إرسال' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '20px 24px',
          maxWidth: 1400, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap',
          justifyContent: 'space-between', alignItems: 'center', gap: 12,
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © 2026 Malik Pharmacy. {t('footer.rights')}.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { label: t('footer.privacy'), to: '/privacy' },
              { label: t('footer.terms'), to: '/terms' },
            ].map(l => (
              <Link key={l.to} to={l.to} style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}
                className="hover:text-[--color-primary]">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/9647500000000"
        target="_blank"
        rel="noreferrer"
        className="fab"
        style={{
          bottom: 24, right: isRTL ? 'auto' : 24, left: isRTL ? 24 : 'auto',
          background: '#25D366', color: '#fff', textDecoration: 'none',
        }}
        title="WhatsApp"
      >
        <FaWhatsapp size={24} />
      </a>
    </div>
  )
}

// ── Shared icon button style ───────────────────────
const iconBtnStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: 38, height: 38, borderRadius: 10,
  background: 'var(--bg-glass)',
  border: '1px solid var(--border-default)',
  color: 'var(--text-secondary)',
  cursor: 'pointer', backdropFilter: 'blur(8px)',
  transition: 'all var(--transition-fast)',
  textDecoration: 'none', flexShrink: 0,
}
