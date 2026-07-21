import { createContext, useContext, useState, useEffect, useCallback, useReducer } from 'react'
import toast from 'react-hot-toast'
import { translations } from '../utils/translations'

// ── CART ──────────────────────────────────────────
const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.item.id)
      if (existing) {
        return { ...state, items: state.items.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i) }
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] }
    }
    case 'REMOVE': return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY':
      if (action.qty <= 0) return { ...state, items: state.items.filter(i => i.id !== action.id) }
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i) }
    case 'CLEAR': return { ...state, items: [] }
    case 'SET_COUPON': return { ...state, coupon: action.coupon }
    default: return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: JSON.parse(localStorage.getItem('mp_cart') || '[]'),
    coupon: null,
  })

  useEffect(() => { localStorage.setItem('mp_cart', JSON.stringify(state.items)) }, [state.items])

  const total = state.items.reduce((s, i) => s + (i.sale_price || i.price) * i.qty, 0)
  const count = state.items.reduce((s, i) => s + i.qty, 0)
  const shipping = total >= 50000 ? 0 : 3000
  const finalTotal = total + shipping

  const addItem = useCallback((item) => { dispatch({ type: 'ADD', item }); toast.success('زیادکرا بۆ سەبەتە ✓') }, [])
  const removeItem = useCallback((id) => dispatch({ type: 'REMOVE', id }), [])
  const updateQty = useCallback((id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const isInCart = useCallback((id) => state.items.some(i => i.id === id), [state.items])

  return (
    <CartContext.Provider value={{ items: state.items, count, total, shipping, finalTotal, addItem, removeItem, updateQty, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}

// ── THEME ─────────────────────────────────────────
const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('mp_theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('mp_theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => setTheme(t => t === 'dark' ? 'light' : 'dark'), [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

// ── LANG ──────────────────────────────────────────
const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('mp_lang') || 'ku')

  useEffect(() => {
    const dir = lang === 'en' ? 'ltr' : 'rtl'
    document.documentElement.setAttribute('lang', lang)
    document.documentElement.setAttribute('dir', dir)
    localStorage.setItem('mp_lang', lang)
  }, [lang])

  const t = useCallback((key) => {
    const keys = key.split('.')
    let val = translations[lang]
    for (const k of keys) val = val?.[k]
    return val ?? key
  }, [lang])

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRTL: lang !== 'en' }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
