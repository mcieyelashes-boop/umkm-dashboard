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
import Onboarding from './pages/Onboarding.jsx'
import Welcome from './pages/Welcome.jsx'
import { useApp } from './context/AppContext.jsx'

const Spinner = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: 'var(--bg-primary)',
  }}>
    <div style={{
      width: 22, height: 22,
      border: '2.5px solid rgba(124,58,237,0.25)',
      borderTopColor: '#7c3aed',
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
)

function ProtectedRoute({ children }) {
  const { user, authLoading, profile } = useApp()
  const location = useLocation()

  if (authLoading) return <Spinner />
  if (!user) return <Navigate to="/auth" replace />

  // New user → onboarding wizard (allow /onboarding and /settings through)
  const allowed = ['/onboarding', '/settings']
  if (profile && !profile.onboarded && !allowed.includes(location.pathname)) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}

function PublicRoute({ children }) {
  const { user, authLoading } = useApp()
  if (authLoading) return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        width: 20, height: 20,
        border: '2px solid rgba(124,58,237,0.3)',
        borderTopColor: '#7c3aed',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
  if (user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/auth" element={
        <PublicRoute><Auth /></PublicRoute>
      } />

      {/* Email verification success — public (handles PKCE code) */}
      <Route path="/welcome" element={<Welcome />} />

      {/* Onboarding — full-screen, outside Layout */}
      <Route path="/onboarding" element={
        <ProtectedRoute><Onboarding /></ProtectedRoute>
      } />

      {/* Dashboard shell */}
      <Route element={
        <ProtectedRoute><Layout /></ProtectedRoute>
      }>
        <Route path="/"          element={<Dashboard />} />
        <Route path="/website"   element={<Website />} />
        <Route path="/ecommerce" element={<Ecommerce />} />
        <Route path="/social"    element={<Social />} />
        <Route path="/chat"      element={<Chat />} />
        <Route path="/payment"   element={<Payment />} />
        <Route path="/wallet"    element={<Wallet />} />
        <Route path="/studio"    element={<ContentStudio />} />
        <Route path="/settings"  element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
