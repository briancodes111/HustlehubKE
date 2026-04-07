import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const features = [
  { icon: '⚡', title: 'Fast & Secure',   desc: 'JWT-protected accounts with bcrypt password security built in.' },
  { icon: '🌍', title: 'Built for Kenya', desc: 'Designed from the ground up for the Kenyan hustle ecosystem.' },
  { icon: '🚀', title: 'Launch Ready',    desc: 'Profile, storefront, and hustle dashboard — all in one place.' },
]

export default function LandingPage() {
  const { user } = useAuth()
  if (user) return <Navigate to="/dashboard" replace />

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container fade-up" style={{ textAlign: 'center', padding: '80px 24px' }}>
          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 99, padding: '6px 16px', fontSize: 13, color: '#F59E0B',
            fontWeight: 500, marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 6px #F59E0B', display: 'block' }} />
            Now live in Kenya
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(42px, 8vw, 80px)',
            lineHeight: 1.05, letterSpacing: '-0.03em',
            marginBottom: 24, color: '#F9FAFB',
          }}>
            Your hustle,<br />
            <span style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              elevated.
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: '#9CA3AF', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 40px' }}>
            HUSTLEHUBKE is the platform built for Kenyan entrepreneurs, freelancers,
            and side-hustlers to showcase work, connect, and grow.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 16 }}>
              Start hustling →
            </Link>
            <Link to="/login" className="btn btn-ghost" style={{ padding: '14px 32px', fontSize: 16 }}>
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderTop: '1px solid #1F1F1F' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {features.map((f) => (
              <div key={f.title} className="card fade-up" style={{ padding: 28 }}>
                <div style={{
                  fontSize: 28, marginBottom: 16, width: 52, height: 52,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(245,158,11,0.08)', borderRadius: 12,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
