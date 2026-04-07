import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const statCards = [
  { label: 'Hustle Score',    icon: '⚡' },
  { label: 'Profile Views',   icon: '👁' },
  { label: 'Connections',     icon: '🤝' },
  { label: 'Active Listings', icon: '📦' },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const initials    = user?.username?.slice(0, 2).toUpperCase() || '??'
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })
    : '—'

  return (
    <div className="container fade-up" style={{ padding: '40px 24px', maxWidth: 960 }}>
      {/* ── Welcome banner ──────────────────────────────────────── */}
      <div className="card" style={{
        padding: 28, marginBottom: 24,
        display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
        background: 'linear-gradient(135deg, #111111 0%, #161208 100%)',
        borderColor: 'rgba(245,158,11,0.15)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 20, color: '#0A0A0A', fontWeight: 800,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 2 }}>Welcome back,</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '-0.02em' }}>@{user?.username}</h2>
          <p style={{ color: '#4B5563', fontSize: 12, marginTop: 2 }}>Member since {memberSince}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{
            padding: '4px 10px', borderRadius: 99,
            background: user?.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${user?.is_active ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
            fontSize: 11, fontWeight: 600, color: user?.is_active ? '#10B981' : '#EF4444',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: user?.is_active ? '#10B981' : '#EF4444' }} />
            {user?.is_active ? 'Active' : 'Inactive'}
          </span>
          {user?.is_superuser && (
            <span style={{
              padding: '4px 10px', borderRadius: 99,
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
              fontSize: 11, color: '#818CF8', fontWeight: 600,
            }}>
              Admin
            </span>
          )}
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {statCards.map((s) => (
          <div key={s.label} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 12, color: '#4B5563', marginBottom: 6 }}>{s.label}</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 28 }}>—</p>
              </div>
              <span style={{ fontSize: 22 }}>{s.icon}</span>
            </div>
            <p style={{ fontSize: 11, color: '#F59E0B', marginTop: 8 }}>Coming soon</p>
          </div>
        ))}
      </div>

      {/* ── Account info ────────────────────────────────────────── */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>Account Details</h3>
          <Link to="/profile" className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 13 }}>Edit profile →</Link>
        </div>
        <div style={{ display: 'grid', gap: 0 }}>
          {[
            { label: 'Email',    value: user?.email },
            { label: 'Username', value: `@${user?.username}` },
            { label: 'User ID',  value: `#${user?.id}` },
            { label: 'Status',   value: user?.is_active ? 'Active' : 'Inactive', accent: true },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 0',
              borderBottom: i < arr.length - 1 ? '1px solid #1A1A1A' : 'none',
            }}>
              <span style={{ fontSize: 13, color: '#4B5563' }}>{row.label}</span>
              <span style={{ fontSize: 14, color: row.accent ? '#10B981' : '#F9FAFB', fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
