import api from './api.jsx'

const authService = {
  // POST /auth/register
  register: async ({ email, username, password }) => {
    const { data } = await api.post('/auth/register', { email, username, password })
    return data
  },

  // POST /auth/login  — FastAPI OAuth2 expects form-encoded data
  login: async ({ email, password }) => {
    const formData = new URLSearchParams()
    formData.append('username', email)   // FastAPI uses "username" field name
    formData.append('password', password)
    const { data } = await api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    localStorage.setItem('token', data.access_token)
    return data
  },

  // Clear local session (JWT is stateless — no backend call needed)
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

export default authService
