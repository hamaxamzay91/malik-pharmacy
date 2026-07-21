// LoadingScreen.jsx
export default function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 20,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 18,
        background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 32,
        boxShadow: '0 0 40px var(--color-primary-glow)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}>
        💊
      </div>
      <div className="loader-ring" />
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
