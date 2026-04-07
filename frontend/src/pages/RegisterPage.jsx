import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const showToast    = useToast()
  const [form, setForm]       = useState({ email: '', username: '', password: '', confirm: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email'
    if (!form.username) errs.username = 'Username is required'
    else if (form.username.length < 3) errs.username = 'At least 3 characters'
    else if (!/^[a-zA-Z0-9_-]+$/.test(form.username)) errs.username = 'Letters, numbers, _ and - only'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'At least 8 characters'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await register({ email: form.email, username: form.username, password: form.password })
      showToast('Account created! Welcome to HUSTLEHUBKE 🚀', 'success')
      navigate('/dashboard')
    } catch (err) {
      showToast(err.response?.data?.detail || 'Registration failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const strength = form.password.length === 0 ? 0 : form.password.length < 8 ? 1 : form.password.length < 12 ? 2 : 3
  const strengthColors = ['#1F1F1F', '#EF4444', '#F59E0B', '#10B981']
  const strengthLabels = ['', 'Weak', 'Good', 'Strong']

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div className="card fade-up" style={{ width: '100%', maxWidth: 440, padding: 36 }}>
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '-0.02em', marginBottom: 8 }}>Start your hustle</h1>
          <p style={{ color: '#9CA3AF', fontSize: 14 }}>Join thousands of Kenyan entrepreneurs</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" name="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange} />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Username</label>
            <input className={`form-input ${errors.username ? 'error' : ''}`} type="text" name="username"
              placeholder="john_doe" value={form.username} onChange={handleChange} />
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className={`form-input ${errors.password ? 'error' : ''}`} type="password" name="password"
              placeholder="Min. 8 characters" value={form.password} onChange={handleChange} />
            {form.password.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1, 2, 3].map((n) => (
                    <div key={n} style={{ flex: 1, height: 3, borderRadius: 99, background: strength >= n ? strengthColors[strength] : '#1F1F1F', transition: 'background 0.2s' }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: strengthColors[strength] }}>{strengthLabels[strength]}</span>
              </div>
            )}
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className={`form-input ${errors.confirm ? 'error' : ''}`} type="password" name="confirm"
              placeholder="Repeat your password" value={form.confirm} onChange={handleChange} />
            {errors.confirm && <span className="form-error">{errors.confirm}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}
            style={{ width: '100%', padding: '13px', fontSize: 15, marginTop: 4 }}>
            {loading ? 'Creating account...' : 'Create account →'}
          </button>
        </form>

        <div className="divider" style={{ margin: '24px 0' }}>or</div>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#9CA3AF' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#F59E0B', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
