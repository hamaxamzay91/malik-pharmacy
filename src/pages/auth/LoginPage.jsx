import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, pass)
      navigate('/')
    } catch {
      toast.error('ئیمەیل یان ووشەی نهێنی هەڵەیە')
    } finally { setLoading(false) }
  }
  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div className="glass-card" style={{width:'100%',maxWidth:400,padding:40}}>
        <h1 className="gradient-text" style={{fontWeight:800,marginBottom:8,fontSize:'1.75rem'}}>چوونەژوورەوە</h1>
        <p style={{color:'var(--text-muted)',marginBottom:32,fontSize:'0.875rem'}}>بەخێربێیتەوە دەرمانخانەی مەلیک</p>
        <form onSubmit={handle} style={{display:'flex',flexDirection:'column',gap:16}}>
          <input className="input-field" type="email" placeholder="ئیمەیل" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <input className="input-field" type="password" placeholder="ووشەی نهێنی" value={pass} onChange={e=>setPass(e.target.value)} required/>
          <button className="btn-primary" type="submit" disabled={loading} style={{padding:'14px',fontSize:'1rem',opacity:loading?0.7:1}}>
            {loading ? 'چاوەڕوان بە...' : 'چوونەژوورەوە'}
          </button>
        </form>
        <p style={{marginTop:20,textAlign:'center',color:'var(--text-muted)',fontSize:'0.875rem'}}>
          هەژمارت نییە؟ <Link to="/auth/register" style={{color:'var(--color-primary)',fontWeight:600}}>تۆمارکردن</Link>
        </p>
      </div>
    </div>
  )
}
