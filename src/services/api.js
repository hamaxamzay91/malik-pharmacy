// =====================================================
// MALIK PHARMACY — API Service (Axios)
// =====================================================

import axios from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

// ── Axios Instance ─────────────────────────────────
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// ── Request Interceptor ────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mp_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const lang = localStorage.getItem('mp_lang') || 'ku'
    config.params = { ...config.params, lang }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor ───────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message

    if (status === 401) {
      localStorage.removeItem('mp_token')
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login'
      }
    } else if (status === 403) {
      toast.error('مۆڵەتت نییە')
    } else if (status === 429) {
      toast.error('زۆر داواکاری نێردراو. کەمێک چاوەڕوان بە.')
    } else if (status >= 500) {
      toast.error('هەڵەی سێرڤەر. دووبارە هەوڵبدەرەوە.')
    }

    return Promise.reject(error)
  }
)

// ── Medicine API ───────────────────────────────────
export const medicineApi = {
  getAll:     (params) => api.get('/medicines', { params }),
  getOne:     (id)     => api.get(`/medicines/${id}`),
  getBySlug:  (slug)   => api.get(`/medicines/${slug}`),
  create:     (data)   => api.post('/medicines', data),
  update:     (id, data) => api.put(`/medicines/${id}`, data),
  delete:     (id)     => api.delete(`/medicines/${id}`),
  search:     (query)  => api.get('/search', { params: { q: query } }),
  getRelated: (id)     => api.get(`/medicines/${id}/related`),
}

// ── Category API ───────────────────────────────────
export const categoryApi = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
}

// ── Cart API ───────────────────────────────────────
export const cartApi = {
  get:    ()           => api.get('/cart'),
  add:    (data)       => api.post('/cart', data),
  update: (id, qty)    => api.put(`/cart/${id}`, { qty }),
  remove: (id)         => api.delete(`/cart/${id}`),
  clear:  ()           => api.delete('/cart'),
}

// ── Order API ──────────────────────────────────────
export const orderApi = {
  getAll:       ()           => api.get('/orders'),
  getOne:       (id)         => api.get(`/orders/${id}`),
  create:       (data)       => api.post('/orders', data),
  updateStatus: (id, status, note) =>
    api.patch(`/orders/${id}`, { status, note }),
}

// ── Auth API ───────────────────────────────────────
export const authApi = {
  login:         (data) => api.post('/auth/login', data),
  register:      (data) => api.post('/auth/register', data),
  logout:        ()     => api.post('/auth/logout'),
  forgotPass:    (email) => api.post('/auth/forgot-password', { email }),
  resetPass:     (data)  => api.post('/auth/reset-password', data),
}

// ── User API ───────────────────────────────────────
export const userApi = {
  getProfile:     ()       => api.get('/profile'),
  updateProfile:  (data)   => api.put('/profile', data),
  getAddresses:   ()       => api.get('/profile/addresses'),
  addAddress:     (data)   => api.post('/profile/addresses', data),
  updateAddress:  (id, d)  => api.put(`/profile/addresses/${id}`, d),
  deleteAddress:  (id)     => api.delete(`/profile/addresses/${id}`),
  uploadAvatar:   (file)   => {
    const fd = new FormData()
    fd.append('avatar', file)
    return api.post('/profile/avatar', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

// ── Prescription API ───────────────────────────────
export const prescriptionApi = {
  upload: (file, notes) => {
    const fd = new FormData()
    fd.append('prescription', file)
    if (notes) fd.append('notes', notes)
    return api.post('/prescriptions', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  getAll: () => api.get('/prescriptions'),
}

// ── Review API ─────────────────────────────────────
export const reviewApi = {
  getAll:  (medicineId) => api.get('/reviews', { params: { medicine_id: medicineId } }),
  create:  (data)       => api.post('/reviews', data),
}

// ── Coupon API ─────────────────────────────────────
export const couponApi = {
  validate: (code, total) => api.post('/coupons/validate', { code, total }),
}

// ── Wishlist API ───────────────────────────────────
export const wishlistApi = {
  getAll: ()       => api.get('/wishlist'),
  toggle: (id)     => api.post('/wishlist', { medicine_id: id }),
}

// ── Blog API ───────────────────────────────────────
export const blogApi = {
  getAll: (params) => api.get('/blogs', { params }),
  getOne: (slug)   => api.get(`/blogs/${slug}`),
}

// ── Contact API ────────────────────────────────────
export const contactApi = {
  send: (data) => api.post('/contact', data),
}

// ── Admin API ──────────────────────────────────────
export const adminApi = {
  getDashboard:  ()       => api.get('/admin/dashboard'),
  getAnalytics:  (range)  => api.get('/admin/analytics', { params: { range } }),
  getSettings:   ()       => api.get('/admin/settings'),
  updateSettings:(data)   => api.put('/admin/settings', data),
  getUsers:      (params) => api.get('/admin/users', { params }),
  backup:        ()       => api.post('/admin/backup'),
}

// ── Notification API ───────────────────────────────
export const notificationApi = {
  getAll:   ()   => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}`),
  markAll:  ()   => api.patch('/notifications'),
}

// ── Banner API ─────────────────────────────────────
export const bannerApi = {
  getAll: (position) => api.get('/banners', { params: { position } }),
}

// ── Settings API (public) ──────────────────────────
export const settingsApi = {
  getPublic: () => api.get('/settings'),
}

// ── FAQ API ────────────────────────────────────────
export const faqApi = {
  getAll: () => api.get('/faqs'),
}

// ── Career API ─────────────────────────────────────
export const careerApi = {
  getAll: ()        => api.get('/careers'),
  apply:  (id, fd)  => api.post(`/careers/${id}/apply`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}
