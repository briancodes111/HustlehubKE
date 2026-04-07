import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import userService from '../services/userService.jsx'

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth()
  const showToast  = useToast()
  const navigate   = useNavigate()

  const [form, setForm] = useState({
    email:       user?.email    || '',
    username:    user?.username || '',
    newPassword: '',
  })
  const [errors,   setErrors]   = useState({})
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.email)    errs.email    = 'Email is required'
    if (!form.username) errs.username = 'Username is required'
    if (form.username.length < 3) errs.username = 'At least 3 characters'
    if (form.newPassword && form.newPassword.length < 8) errs.newPassword = 'At least 8 characters'
    return errs
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const updates = {}
    if (form.email       !== user.email)    updates.email    = form.email
    if (form.username    !== user.username) updates.username = form.username
    if (form.newPassword)                   updates.password = form.newPassword

    if (!Object.keys(updates).length) { showToast('No changes to save', 'info'); return }

    setSaving(true)
    try {
      await userService.updateMe(updates)
      await refreshUser()
      showToast('Profile updated ✓', 'success')
      setForm((prev) => ({ ...prev, newPassword: '' }))
    } catch (err) {
      showToast(err.response?.data?.detail || 'Update failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await userService.deleteMe()
      logout()
      showToast('Account deleted', 'info')
      navigate('/')
    } catch {
      showToast('Could not delete account', 'error')
      setDeleting(false)
    }
  }

  const initials = user?.username?.slice(0, 2).toUpperCase() || '??'

  return (
    <div className="container fade-up" style={{ padding: '40px 24px', maxWidth: 600 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: '-0.02em', marginBottom: 24 }}>
        Edit Profile
      </h1>

      {/* ── Avatar preview ──────────────────────────────────────── */}
      <div className="card" style={{ padding: 24, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 22, color: '#0A0A0A', fontWeight: 800,
        }}>
          {initials}
        </div>
        <div>
          <p style={{ fontWeight: 600, marginBottom: 2 }}>@{user?.username}</p>
          <p style={{ fontSize: 13, color: '#9CA3AF' }}>{user?.email}</p>
        </div>
      </div>

      {/* ── Edit form ───────────────────────────────────────────── */}
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 20 }}>Account Information</h2>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" name="email"
              value={form.email} onChange={handleChange} />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className={`form-input ${errors.username ? 'error' : ''}`} type="text" name="username"
              value={form.username} onChange={handleChange} />
            {errors.username && <span className="form-error">{errors.username}</span>}
          </div>
          <div style={{ height: 1, background: '#1F1F1F' }} />
          <p style={{ fontSize: 12, color: '#4B5563' }}>Leave password blank to keep your current one.</p>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input className={`form-input ${errors.newPassword ? 'error' : ''}`} type="password" name="newPassword"
              placeholder="Min. 8 characters" value={form.newPassword} onChange={handleChange} />
            {errors.newPassword && <span className="form-error">{errors.newPassword}</span>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: 'flex-start', padding: '11px 28px' }}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>

      {/* ── Danger zone ─────────────────────────────────────────── */}
      <div className="card" style={{ padding: 24, borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.03)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#EF4444', marginBottom: 8 }}>Danger Zone</h3>
        <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 16 }}>Permanently delete your account. This cannot be undone.</p>

        {!confirmDelete ? (
          <button className="btn" onClick={() => setConfirmDelete(true)}
            style={{ padding: '9px 20px', fontSize: 13, background: 'transparent', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
            Delete account
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <p style={{ fontSize: 13, color: '#EF4444', width: '100%' }}>Are you sure? This cannot be undone.</p>
            <button className="btn" onClick={handleDelete} disabled={deleting}
              style={{ padding: '9px 20px', fontSize: 13, background: '#EF4444', color: '#fff', border: 'none' }}>
              {deleting ? 'Deleting...' : 'Yes, delete my account'}
            </button>
            <button className="btn btn-ghost" onClick={() => setConfirmDelete(false)} style={{ padding: '9px 20px', fontSize: 13 }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
