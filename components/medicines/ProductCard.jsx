// =====================================================
// MALIK PHARMACY — ProductCard.jsx
// Glass | 3D Tilt | Hover Actions | Multi-lang
// =====================================================

import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiEye, FiStar } from 'react-icons/fi'
import { useCart } from '../../context/index.jsx'
import { useAuth } from '../../context/AuthContext'
import { wishlistApi } from '../../services/api'
import toast from 'react-hot-toast'

export default function ProductCard({ medicine, lang = 'ku', isRTL = true, showBadge }) {
  const { addItem, isInCart }  = useCart()
  const { user }               = useAuth()
  const [wished, setWished]    = useState(false)
  const [loading, setLoading]  = useState(false)
  const [tilt, setTilt]        = useState({ x: 0, y: 0 })
  const cardRef                = useRef(null)

  const isCartd    = isInCart(medicine.id)
  const price      = medicine.price || 0
  const salePrice  = medicine.sale_price
  const discountPct = salePrice ? Math.round((1 - salePrice / price) * 100) : 0
  const displayPrice = salePrice || price
  const name       = medicine.name || medicine[`name_${lang}`] || medicine.name_ku || 'دەرمان'
  const image      = medicine.main_image || '/placeholder-medicine.png'
  const inStock    = medicine.stock_quantity > 0

  // ── 3D Tilt Effect ──────────────────────────────
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 16
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -16
    setTilt({ x, y })
  }

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 })

  // ── Add to Cart ──────────────────────────────────
  const handleAddCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!inStock) {
      toast.error(lang === 'ku' ? 'تەواوبووە' : lang === 'ar' ? 'نفذ المخزون' : 'Out of stock')
      return
    }
    if (medicine.requires_prescription && !user) {
      toast.error(lang === 'ku' ? 'پێویستی بە ڕەچەتەیە' : 'Prescription required')
      return
    }
    addItem({
      id:          medicine.id,
      name,
      price,
      sale_price:  salePrice,
      main_image:  image,
      slug:        medicine.slug,
    })
  }

  // ── Wishlist Toggle ──────────────────────────────
  const handleWishlist = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error(lang === 'ku' ? 'تکایە چوونەژوورەوە بکە' : 'Please login first')
      return
    }
    setLoading(true)
    try {
      await wishlistApi.toggle(medicine.id)
      setWished(w => !w)
      toast.success(wished
        ? (lang === 'ku' ? 'لە دڵخوازەکانت لابرا' : 'Removed from wishlist')
        : (lang === 'ku' ? 'زیادکرا بۆ دڵخوازەکان ❤️' : 'Added to wishlist ❤️')
      )
    } catch {
      toast.error('Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        transformStyle: 'preserve-3d',
        transition: 'transform 0.15s ease',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <Link
        to={`/medicines/${medicine.slug}`}
        style={{ textDecoration: 'none', display: 'block' }}
      >
        <div
          className="product-card"
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Badges */}
          <div style={{
            position: 'absolute', top: 12,
            [isRTL ? 'right' : 'left']: 12,
            display: 'flex', flexDirection: 'column', gap: 6, zIndex: 2,
          }}>
            {showBadge && (
              <span className="badge badge-danger">{showBadge}</span>
            )}
            {discountPct > 0 && (
              <span className="badge badge-danger">-{discountPct}%</span>
            )}
            {medicine.is_featured === 1 && !showBadge && (
              <span className="badge badge-accent">⭐</span>
            )}
            {medicine.requires_prescription === 1 && (
              <span className="badge" style={{ background: 'rgba(240,180,41,0.15)', color: 'var(--color-gold)' }}>Rx</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="card-actions" style={{
            [isRTL ? 'left' : 'right']: 12,
          }}>
            <button
              className="card-action-btn"
              onClick={handleWishlist}
              disabled={loading}
              title={lang === 'ku' ? 'دڵخواز' : 'Wishlist'}
              style={{ color: wished ? 'var(--color-danger)' : undefined }}
            >
              <FiHeart size={15} fill={wished ? 'currentColor' : 'none'}/>
            </button>
            <Link
              to={`/medicines/${medicine.slug}`}
              className="card-action-btn"
              onClick={e => e.stopPropagation()}
              title={lang === 'ku' ? 'زانیاری' : 'Details'}
            >
              <FiEye size={15}/>
            </Link>
          </div>

          {/* Image */}
          <div className="card-image">
            <img
              src={image}
              alt={name}
              loading="lazy"
              onError={e => { e.target.src = '/placeholder-medicine.png' }}
            />
            {!inStock && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  background: 'var(--color-danger)', color: '#fff',
                  padding: '6px 16px', borderRadius: 'var(--radius-full)',
                  fontWeight: 700, fontSize: '0.8rem',
                }}>
                  {lang === 'ku' ? 'تەواوبووە' : lang === 'ar' ? 'نفذ' : 'Out of Stock'}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: '16px 16px 20px' }}>
            {/* Brand */}
            {medicine.brand_name && (
              <div style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: 4, letterSpacing: 0.5 }}>
                {medicine.brand_name}
              </div>
            )}

            {/* Name */}
            <h3 style={{
              fontSize: '0.9rem', fontWeight: 700,
              marginBottom: 8, lineHeight: 1.4,
              color: 'var(--text-primary)',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {name}
            </h3>

            {/* Rating */}
            {medicine.rating_avg > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <div className="stars" style={{ fontSize: 12 }}>
                  {[1,2,3,4,5].map(s => (
                    <FiStar
                      key={s}
                      size={12}
                      fill={s <= Math.round(medicine.rating_avg) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  ({medicine.rating_count || 0})
                </span>
              </div>
            )}

            {/* Price + Cart */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: salePrice ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                  {displayPrice.toLocaleString()}
                  <span style={{ fontSize: '0.7rem', fontWeight: 500, marginRight: 2, marginLeft: 2 }}>
                    {lang === 'ku' ? 'د.ع' : lang === 'ar' ? 'د.ع' : 'IQD'}
                  </span>
                </div>
                {salePrice && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    {price.toLocaleString()}
                  </div>
                )}
              </div>

              <motion.button
                onClick={handleAddCart}
                whileTap={{ scale: 0.9 }}
                disabled={!inStock}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: isCartd
                    ? 'var(--color-success)'
                    : !inStock
                    ? 'var(--bg-elevated)'
                    : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                  color: isCartd || !inStock ? '#fff' : '#000',
                  border: 'none', cursor: inStock ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all var(--transition-fast)',
                  boxShadow: isCartd ? '0 0 16px rgba(46,213,115,0.4)' : inStock ? '0 4px 16px var(--color-primary-glow)' : 'none',
                }}
                title={lang === 'ku' ? 'زیادی بکە بۆ سەبەتە' : 'Add to Cart'}
              >
                <FiShoppingCart size={16}/>
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
