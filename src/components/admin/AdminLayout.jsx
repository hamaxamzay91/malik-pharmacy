// AdminLayout.jsx
import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useLang } from '../../context/index.jsx'
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers,
  FiBarChart2, FiSettings, FiMenu, FiX, FiLogOut,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { t, isRTL } = useLang()
  const { logout } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(true)

  const links = [
    { to: '/admin',            icon: <FiGrid/>,       label: 'داشبۆرد' },
    { to: '/admin/products',   icon: <FiPackage/>,    label: 'بەرهەمەکان' },
    { to: '/admin/orders',     icon: <FiShoppingBag/>,label: 'سفارشەکان' },
    { to: '/admin/customers',  icon: <FiUsers/>,      label: 'کریارەکان' },
    { to: '/admin/analytics',  icon: <FiBarChart2/>,  label: 'ئەنالیتیکس' },
    { to: '/admin/settings',   icon: <FiSettings/>,   label: 'ڕێکخستنەکان' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Sidebar */}
      <aside style={{
        width: open ? 240 : 64,
        background: 'var(--bg-surface)',
        borderLeft: isRTL ? 'none' : '1px solid var(--border-subtle)',
        borderRight: isRTL ? '1px solid var(--border-subtle)' : 'none',
        transition: 'width 0.3s ease',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, bottom: 0,
        [isRTL ? 'right' : 'left']: 0,
        zIndex: 100, overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💊</div>
          {open && <span className="gradient-text" style={{ fontWeight: 800, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>Admin Panel</span>}
        </div>

        {/* Links */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {links.map(link => {
            const active = location.pathname === link.to
            return (
              <Link key={link.to} to={link.to} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 'var(--radius-md)',
                color: active ? 'var(--color-primary)' : 'var(--text-secondary)',
                background: active ? 'var(--color-primary-glow)' : 'transparent',
                textDecoration: 'none', fontWeight: active ? 700 : 400,
                fontSize: '0.875rem', transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap', overflow: 'hidden',
              }}>
                <span style={{ flexShrink: 0, fontSize: 18 }}>{link.icon}</span>
                {open && link.label}
              </Link>
            )
          })}
        </nav>

        {/* Toggle + Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button onClick={logout} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px', borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger)', background: 'transparent',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden',
          }}>
            <FiLogOut style={{ flexShrink: 0, fontSize: 18 }}/> {open && 'دەرچوون'}
          </button>
          <button onClick={() => setOpen(o => !o)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '10px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-glass)', border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)', cursor: 'pointer',
          }}>
            {open ? <FiX/> : <FiMenu/>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{
        flex: 1,
        [isRTL ? 'marginRight' : 'marginLeft']: open ? 240 : 64,
        transition: 'margin 0.3s ease',
        minHeight: '100vh',
        background: 'var(--bg-base)',
      }}>
        <Outlet />
      </main>
    </div>
  )
}
