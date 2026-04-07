import api from './api.jsx'

const userService = {
  // GET /users/me
  getMe: async () => {
    const { data } = await api.get('/users/me')
    return data
  },

  // PATCH /users/me  — only send fields that changed
  updateMe: async (updates) => {
    const { data } = await api.patch('/users/me', updates)
    return data
  },

  // DELETE /users/me
  deleteMe: async () => {
    await api.delete('/users/me')
  },
}

export default userService
