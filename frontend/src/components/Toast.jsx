import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

const META = {
  success: { icon: '✓', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)', color: '#10B981' },
  error:   { icon: '✕', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',  color: '#EF4444' },
  info:    { icon: 'i', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)', color: '#F59E0B' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 10000 }}>
        {toasts.map((t) => {
          const m = META[t.type] || META.info
          return (
            <div key={t.id} style={{
              background: m.bg, border: `1px solid ${m.border}`,
              borderRadius: 10, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
              maxWidth: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              animation: 'fadeUp 0.3s ease',
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%', background: m.color,
                color: '#0A0A0A', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>
                {m.icon}
              </span>
              <span style={{ fontSize: 14, color: '#F9FAFB', lineHeight: 1.4 }}>{t.message}</span>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx.show
}
