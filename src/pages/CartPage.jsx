import { useLang } from '../context/index.jsx'
import { useCart } from '../context/index.jsx'
export default function CartPage() {
  const { items, total } = useCart()
  return (
    <div style={{padding:40,color:'var(--text-primary)'}}>
      <h1>سەبەتەی کڕین ({items.length})</h1>
      <p>کۆی گشتی: {total.toLocaleString()} د.ع</p>
    </div>
  )
}
