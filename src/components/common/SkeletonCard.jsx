// SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <div className="skeleton" style={{ aspectRatio: '1', width: '100%' }} />
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="skeleton" style={{ height: 12, borderRadius: 6, width: '60%' }} />
        <div className="skeleton" style={{ height: 16, borderRadius: 6, width: '90%' }} />
        <div className="skeleton" style={{ height: 14, borderRadius: 6, width: '75%' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <div className="skeleton" style={{ height: 20, borderRadius: 6, width: '40%' }} />
          <div className="skeleton" style={{ height: 36, width: 36, borderRadius: 10 }} />
        </div>
      </div>
    </div>
  )
}
