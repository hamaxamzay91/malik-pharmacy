import { Link } from 'react-router-dom'
export default function NotFoundPage() {
  return (
    <div style={{minHeight:'80vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:20,textAlign:'center',padding:24}}>
      <div style={{fontSize:80}}>💊</div>
      <h1 className="gradient-text" style={{fontSize:'4rem',fontWeight:900}}>404</h1>
      <p style={{color:'var(--text-muted)',fontSize:'1.1rem'}}>ئەم پەیجە نەدۆزرایەوە</p>
      <Link to="/" className="btn-primary" style={{textDecoration:'none',padding:'12px 32px'}}>بگەڕێوە سەرەکی</Link>
    </div>
  )
}
