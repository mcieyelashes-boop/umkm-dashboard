import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Website from './pages/Website.jsx'
import Ecommerce from './pages/Ecommerce.jsx'
import Social from './pages/Social.jsx'
import Chat from './pages/Chat.jsx'
import Payment from './pages/Payment.jsx'
import Wallet from './pages/Wallet.jsx'
import ContentStudio from './pages/ContentStudio.jsx'
import Settings from './pages/Settings.jsx'
import Auth from './pages/Auth.jsx'
import { useApp } from './context/AppContext.jsx'

function ProtectedRoute({ children }) {
  const { user, authLoading, profile } = useApp()
  const location = useLocation()

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--text-secondary)',
        fontSize: '14px',
        gap: '10px',
      }}>
        <div style={{
          width: 20, height: 20,
          border: '2px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        Loading...
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />

  // New user: redirect to website onboarding (allow /website and /settings through)
  if (profile && !profile.onboarded && location.pathname !== '/website' && location.pathname !== '/settings') {
    return <Navigate to="/website" replace />
  }

  return children
}

function PublicRoute({ children }) {
  const { user, authLoading } = useApp()
  if (authLoading) return null
  if (user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={
        <PublicRoute>
          <Auth />
        </PublicRoute>
      } />

      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/website" element={<Website />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
        <Route path="/social" element={<Social />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/studio" element={<ContentStudio />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
