import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({name:'',email:'',password:''})
  const [loading, setLoading] = useState(false)
  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      navigate('/')
      toast.success('بەخێربێیتەوە! 🎉')
    } catch {
      toast.error('هەڵەیەک ڕووی دا')
    } finally { setLoading(false) }
  }
  return (
    <div style={{minHeight:'80vh',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div className="glass-card" style={{width:'100%',maxWidth:400,padding:40}}>
        <h1 className="gradient-text" style={{fontWeight:800,marginBottom:8,fontSize:'1.75rem'}}>تۆمارکردن</h1>
        <form onSubmit={handle} style={{display:'flex',flexDirection:'column',gap:16,marginTop:24}}>
          <input className="input-field" placeholder="ناوی تەواو" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
          <input className="input-field" type="email" placeholder="ئیمەیل" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
          <input className="input-field" type="password" placeholder="ووشەی نهێنی" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/>
          <button className="btn-primary" type="submit" disabled={loading} style={{padding:'14px',fontSize:'1rem'}}>
            {loading ? 'چاوەڕوان بە...' : 'تۆمارکردن'}
          </button>
        </form>
        <p style={{marginTop:20,textAlign:'center',color:'var(--text-muted)',fontSize:'0.875rem'}}>
          هەژمارت هەیە؟ <Link to="/auth/login" style={{color:'var(--color-primary)',fontWeight:600}}>چوونەژوورەوە</Link>
        </p>
      </div>
    </div>
  )
}
