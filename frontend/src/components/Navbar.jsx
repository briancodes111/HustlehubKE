import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from './Toast.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const showToast = useToast()

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully', 'info')
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(10,10,10,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #1F1F1F',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to={user ? '/dashboard' : '/'} style={{
          fontFamily: 'var(--font-display)', fontSize: 20,
          letterSpacing: '-0.02em', color: '#F9FAFB',
        }}>
          HUSTLE<span style={{ color: '#F59E0B' }}>HUB</span>
          <span style={{ color: '#4B5563', fontSize: 14 }}>KE</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {user ? (
            <>
              <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
              <NavLink to="/profile"   active={isActive('/profile')}>Profile</NavLink>
              <button className="btn btn-ghost" onClick={handleLogout} style={{ padding: '8px 18px', fontSize: 14 }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" active={isActive('/login')}>Login</NavLink>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: 14 }}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
      color: active ? '#F59E0B' : '#9CA3AF',
      background: active ? 'rgba(245,158,11,0.08)' : 'transparent',
      transition: 'all 0.15s',
    }}>
      {children}
    </Link>
  )
}
