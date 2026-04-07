import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function LoginPage() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const showToast    = useToast()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email)    errs.email    = 'Email is required'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await login(form)
      showToast('Welcome back! 🔥', 'success')
      navigate('/dashboard')
    } catch (err) {
      showToast(err.response?.data?.detail || 'Login failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="card fade-up" style={{ width: '100%', maxWidth: 420, padding: 36 }}>
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.02em', marginBottom: 8 }}>Welcome back</h1>
          <p style={{ color: '#9CA3AF', fontSize: 14 }}>Sign in to continue your hustle</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" name="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange} autoComplete="email" />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className={`form-input ${errors.password ? 'error' : ''}`} type="password" name="password"
              placeholder="••••••••" value={form.password} onChange={handleChange} autoComplete="current-password" />
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 4 }}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="divider" style={{ margin: '24px 0' }}>or</div>

        <p style={{ textAlign: 'center', fontSize: 14, color: '#9CA3AF' }}>
          New to HUSTLEHUBKE?{' '}
          <Link to="/register" style={{ color: '#F59E0B', fontWeight: 600 }}>Create an account</Link>
        </p>
      </div>
    </div>
  )
}
