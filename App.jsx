import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider, ThemeProvider, LangProvider } from './context/index.jsx'
import Layout from './components/layout/Layout'
import AdminLayout from './components/admin/AdminLayout'
import HomePage from './pages/HomePage'
import LoadingScreen from './components/common/LoadingScreen'

const MedicinesPage    = lazy(() => import('./pages/MedicinesPage'))
const CartPage         = lazy(() => import('./pages/CartPage'))
const LoginPage        = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage     = lazy(() => import('./pages/auth/RegisterPage'))
const NotFoundPage     = lazy(() => import('./pages/NotFoundPage'))
const AdminDashboard   = lazy(() => import('./pages/admin/Dashboard'))

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000*60*5, retry: 2, refetchOnWindowFocus: false } }
})

function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/auth/login" replace />
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/" replace />
  return children
}

const toastOptions = {
  duration: 3000,
  style: {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-default)',
    borderRadius: '12px',
    fontSize: '0.875rem',
  },
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <LangProvider>
            <AuthProvider>
              <CartProvider>
                <div className="aurora-bg" aria-hidden="true" />
                <Suspense fallback={<LoadingScreen />}>
                  <Routes>
                    <Route element={<Layout />}>
                      <Route index element={<HomePage />} />
                      <Route path="medicines" element={<Suspense fallback={<LoadingScreen/>}><MedicinesPage /></Suspense>} />
                      <Route path="cart" element={<Suspense fallback={<LoadingScreen/>}><CartPage /></Suspense>} />
                      <Route path="auth/login" element={<GuestRoute><Suspense fallback={<LoadingScreen/>}><LoginPage /></Suspense></GuestRoute>} />
                      <Route path="auth/register" element={<GuestRoute><Suspense fallback={<LoadingScreen/>}><RegisterPage /></Suspense></GuestRoute>} />
                      <Route path="*" element={<Suspense fallback={<LoadingScreen/>}><NotFoundPage /></Suspense>} />
                    </Route>
                    <Route path="admin" element={
                      <ProtectedRoute roles={['admin','manager','pharmacist']}>
                        <AdminLayout />
                      </ProtectedRoute>
                    }>
                      <Route index element={<Suspense fallback={<LoadingScreen/>}><AdminDashboard /></Suspense>} />
                    </Route>
                  </Routes>
                </Suspense>
                <Toaster position="top-right" toastOptions={toastOptions} />
              </CartProvider>
            </AuthProvider>
          </LangProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
