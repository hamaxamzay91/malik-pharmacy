// =====================================================
// MALIK PHARMACY — Admin Dashboard
// Real-time Stats | Charts | Orders | Glassmorphism
// =====================================================

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign,
  FiTrendingUp, FiTrendingDown, FiAlertCircle,
  FiEye, FiEdit, FiCheckCircle, FiXCircle, FiClock,
  FiBarChart2, FiRefreshCw, FiDownload,
} from 'react-icons/fi'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { adminApi } from '../../services/api'
import { useLang } from '../../context/index.jsx'

const COLORS = ['#00D4AA', '#6C63FF', '#F0B429', '#FF4757', '#2ED573']

const STATUS_BADGE = {
  pending:    { color: '#F0B429', bg: 'rgba(240,180,41,0.15)',  label: { ku: 'چاوەڕوان', en: 'Pending', ar: 'قيد الانتظار' } },
  confirmed:  { color: '#6C63FF', bg: 'rgba(108,99,255,0.15)', label: { ku: 'دڵنیاکراوە', en: 'Confirmed', ar: 'مؤكد' } },
  processing: { color: '#00D4AA', bg: 'rgba(0,212,170,0.15)',  label: { ku: 'پرۆسەدەکرێت', en: 'Processing', ar: 'قيد المعالجة' } },
  shipped:    { color: '#2ED573', bg: 'rgba(46,213,115,0.15)', label: { ku: 'نێردراوە', en: 'Shipped', ar: 'تم الشحن' } },
  delivered:  { color: '#2ED573', bg: 'rgba(46,213,115,0.15)', label: { ku: 'گەیشتووە', en: 'Delivered', ar: 'تم التوصيل' } },
  cancelled:  { color: '#FF4757', bg: 'rgba(255,71,87,0.15)',  label: { ku: 'هەڵوەشاندرا', en: 'Cancelled', ar: 'ملغى' } },
}

// ─────────────────────────────────────────────────
export default function AdminDashboard() {
  const { lang, t } = useLang()
  const [range, setRange] = useState('7d')

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'dashboard', range],
    queryFn: () => adminApi.getDashboard(),
    refetchInterval: 60000, // auto-refresh every min
  })

  const dash = data?.data?.data || MOCK_DASHBOARD

  const STAT_CARDS = [
    {
      icon: <FiDollarSign size={22}/>,
      value: dash.total_revenue?.toLocaleString() || '0',
      suffix: lang === 'ku' ? ' د.ع' : ' IQD',
      label: lang === 'ku' ? 'داهاتی گشتی' : lang === 'ar' ? 'إجمالي الإيرادات' : 'Total Revenue',
      trend: dash.revenue_trend || 12.5,
      color: '#00D4AA',
    },
    {
      icon: <FiShoppingBag size={22}/>,
      value: dash.total_orders || 0,
      label: lang === 'ku' ? 'کۆی سفارشەکان' : lang === 'ar' ? 'إجمالي الطلبات' : 'Total Orders',
      trend: dash.orders_trend || 8.2,
      color: '#6C63FF',
    },
    {
      icon: <FiUsers size={22}/>,
      value: dash.total_customers || 0,
      label: lang === 'ku' ? 'کریارەکان' : lang === 'ar' ? 'العملاء' : 'Customers',
      trend: dash.customers_trend || 5.1,
      color: '#F0B429',
    },
    {
      icon: <FiPackage size={22}/>,
      value: dash.total_products || 0,
      label: lang === 'ku' ? 'بەرهەمەکان' : lang === 'ar' ? 'المنتجات' : 'Products',
      trend: dash.products_trend || -2.3,
      color: '#FF4757',
    },
  ]

  return (
    <div style={{ padding: 24 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 4 }}>
            {lang === 'ku' ? 'داشبۆرد' : lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {lang === 'ku' ? 'ئامار و ڕاپۆرتی ئەمرۆ' : lang === 'ar' ? 'إحصائيات وتقارير اليوم' : "Today's stats and reports"}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Range selector */}
          {['7d', '30d', '90d', '1y'].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              style={{
                padding: '8px 16px', borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-default)',
                background: range === r ? 'var(--color-primary)' : 'var(--bg-glass)',
                color: range === r ? '#000' : 'var(--text-secondary)',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                fontFamily: 'inherit',
                transition: 'all var(--transition-fast)',
              }}
            >
              {r}
            </button>
          ))}
          <button
            onClick={() => refetch()}
            style={{
              padding: '8px 12px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-glass)', border: '1px solid var(--border-default)',
              color: 'var(--text-secondary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: '0.8rem', fontFamily: 'inherit',
            }}
          >
            <FiRefreshCw size={14}/> {lang === 'ku' ? 'نوێبکەرەوە' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ──────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 20, marginBottom: 32,
      }}>
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass"
            style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}
          >
            {/* Glow */}
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 120, height: 120, borderRadius: '50%',
              background: `radial-gradient(circle, ${card.color}18, transparent)`,
              pointerEvents: 'none',
            }}/>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: `${card.color}18`,
                border: `1px solid ${card.color}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: card.color,
              }}>
                {card.icon}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                color: card.trend >= 0 ? '#2ED573' : '#FF4757',
                fontSize: '0.8rem', fontWeight: 700,
              }}>
                {card.trend >= 0 ? <FiTrendingUp size={14}/> : <FiTrendingDown size={14}/>}
                {Math.abs(card.trend)}%
              </div>
            </div>

            <div style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 900, color: 'var(--text-primary)' }}>
              {card.value}{card.suffix || ''}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
              {card.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── CHARTS ──────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 32 }}>

        {/* Revenue Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass"
          style={{ padding: 24 }}
        >
          <h3 style={{ fontWeight: 700, marginBottom: 24, fontSize: '1rem' }}>
            {lang === 'ku' ? 'داهاتی رۆژانە' : lang === 'ar' ? 'الإيرادات اليومية' : 'Daily Revenue'}
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dash.revenue_chart || MOCK_REVENUE}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                  borderRadius: 12, color: 'var(--text-primary)',
                }}
              />
              <Line
                type="monotone" dataKey="revenue"
                stroke="var(--color-primary)" strokeWidth={2.5}
                dot={{ fill: 'var(--color-primary)', r: 4 }}
                activeDot={{ r: 6, boxShadow: '0 0 12px var(--color-primary)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass"
          style={{ padding: 24 }}
        >
          <h3 style={{ fontWeight: 700, marginBottom: 24, fontSize: '1rem' }}>
            {lang === 'ku' ? 'دۆخی سفارشەکان' : 'Order Status'}
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={dash.orders_by_status || MOCK_PIE}
                dataKey="count"
                nameKey="status"
                cx="50%" cy="50%"
                innerRadius={50} outerRadius={80}
              >
                {(dash.orders_by_status || MOCK_PIE).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-default)',
                  borderRadius: 12, color: 'var(--text-primary)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
            {(dash.orders_by_status || MOCK_PIE).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length] }}/>
                {STATUS_BADGE[item.status]?.label[lang] || item.status}
                <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>({item.count})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── BOTTOM GRID ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass"
          style={{ padding: 24 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>
              {lang === 'ku' ? 'دوایین سفارشەکان' : 'Recent Orders'}
            </h3>
            <Link to="/admin/orders" style={{ color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
              {lang === 'ku' ? 'هەموویان' : 'View All'}
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(dash.recent_orders || MOCK_ORDERS).map((order) => {
              const st = STATUS_BADGE[order.status] || STATUS_BADGE.pending
              return (
                <div
                  key={order.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'var(--bg-elevated)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, flexShrink: 0,
                    }}>📦</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', truncate: true }}
                        className="truncate">
                        {order.order_number}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                        {order.user_name}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 'var(--radius-full)',
                      background: st.bg, color: st.color,
                      fontSize: '0.7rem', fontWeight: 700,
                    }}>
                      {st.label[lang]}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-primary)', flexShrink: 0 }}>
                    {order.total?.toLocaleString()} {lang === 'ku' ? 'د.ع' : 'IQD'}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass"
          style={{ padding: 24 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <FiAlertCircle style={{ color: 'var(--color-warning)' }}/>
              {lang === 'ku' ? 'ستۆکی کەم' : 'Low Stock Alert'}
            </h3>
            <Link to="/admin/products?stock=low" style={{ color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
              {lang === 'ku' ? 'هەموویان' : 'View All'}
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(dash.low_stock || MOCK_LOW_STOCK).map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)',
                  border: `1px solid ${item.stock <= 5 ? 'rgba(255,71,87,0.3)' : 'var(--border-subtle)'}`,
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div style={{ fontSize: 20 }}>💊</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8rem' }} className="truncate">
                      {item[`name_${lang}`] || item.name_ku}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      SKU: {item.sku}
                    </div>
                  </div>
                </div>
                <div style={{
                  padding: '4px 12px', borderRadius: 'var(--radius-full)',
                  background: item.stock <= 5 ? 'rgba(255,71,87,0.15)' : 'rgba(240,180,41,0.15)',
                  color: item.stock <= 5 ? 'var(--color-danger)' : 'var(--color-warning)',
                  fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                }}>
                  {item.stock}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ── Admin Layout ───────────────────────────────────
export function AdminLayout() { return null } // defined in components/admin/

// ── Mock data (until API is connected) ────────────
const MOCK_DASHBOARD = {
  total_revenue: 45_890_000,
  revenue_trend: 12.5,
  total_orders: 342,
  orders_trend: 8.2,
  total_customers: 1856,
  customers_trend: 5.1,
  total_products: 2100,
  products_trend: -2.3,
}

const MOCK_REVENUE = [
  { date: 'Mon', revenue: 4500000 }, { date: 'Tue', revenue: 5200000 },
  { date: 'Wed', revenue: 4800000 }, { date: 'Thu', revenue: 6100000 },
  { date: 'Fri', revenue: 7200000 }, { date: 'Sat', revenue: 8900000 },
  { date: 'Sun', revenue: 9100000 },
]

const MOCK_PIE = [
  { status: 'pending', count: 45 }, { status: 'confirmed', count: 28 },
  { status: 'processing', count: 12 }, { status: 'shipped', count: 18 },
  { status: 'delivered', count: 220 },
]

const MOCK_ORDERS = [
  { id: 1, order_number: 'MP-20260001', user_name: 'هاما ئەحمەد', status: 'pending', total: 45000 },
  { id: 2, order_number: 'MP-20260002', user_name: 'ئازادی کەریم', status: 'processing', total: 82500 },
  { id: 3, order_number: 'MP-20260003', user_name: 'سارا علی', status: 'shipped', total: 33000 },
  { id: 4, order_number: 'MP-20260004', user_name: 'بریار محمد', status: 'delivered', total: 125000 },
  { id: 5, order_number: 'MP-20260005', user_name: 'نەرمین جلال', status: 'cancelled', total: 67000 },
]

const MOCK_LOW_STOCK = [
  { sku: 'AMX-500', name_ku: 'ئەموکسیسیلین ٥٠٠', name_en: 'Amoxicillin 500', stock: 3 },
  { sku: 'MET-250', name_ku: 'مێتفۆرمین ٢٥٠', name_en: 'Metformin 250', stock: 8 },
  { sku: 'ASP-100', name_ku: 'ئاسپرین ١٠٠', name_en: 'Aspirin 100', stock: 5 },
  { sku: 'VIT-C', name_ku: 'وتامین C', name_en: 'Vitamin C', stock: 12 },
]
