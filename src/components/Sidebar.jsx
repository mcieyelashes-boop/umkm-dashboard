import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Globe, ShoppingBag, Share2, MessageSquare,
  CreditCard, Wallet, Sparkles, Settings, Zap, X
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { getInitials } from '../utils/string.js'
import './Sidebar.css'

export default function Sidebar({ open, onClose }) {
  const { t, profile } = useApp()

  const businessName = profile?.business_name || 'UMKM Hub'
  const plan = profile?.plan || 'Starter'
  const avatarText = profile?.avatar || getInitials(profile?.owner_name || businessName)

  const menuItems = [
    { path: '/', icon: LayoutDashboard, labelKey: 'dashboard', badge: null },
    { path: '/website', icon: Globe, labelKey: 'website', badge: null },
    { path: '/ecommerce', icon: ShoppingBag, labelKey: 'ecommerce', badge: null },
    { path: '/social', icon: Share2, labelKey: 'social', badge: null },
    { path: '/chat', icon: MessageSquare, labelKey: 'chat', badge: null },
    { path: '/payment', icon: CreditCard, labelKey: 'payment', badge: null },
    { path: '/wallet', icon: Wallet, labelKey: 'wallet', badge: null },
    { path: '/studio', icon: Sparkles, labelKey: 'studio', badge: 'AI' },
  ]

  return (
    <aside className={`sidebar${open ? ' sidebar-mobile-open' : ''}`}>
      {/* Mobile close button */}
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
        <X size={18} />
      </button>

      <div className="sidebar-brand">
        <div className="brand-logo">
          <Zap size={20} fill="white" />
        </div>
        <div className="brand-text">
          <div className="brand-name">UMKM Hub</div>
          <div className="brand-tagline">{plan}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">{t.nav.mainMenu}</div>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <item.icon size={18} />
            <span className="nav-label">{t.nav[item.labelKey]}</span>
            {item.badge && (
              <span className={`nav-badge ${item.badge === 'AI' ? 'ai' : ''}`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}

        <div className="nav-section-label" style={{ marginTop: 24 }}>{t.nav.account}</div>
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <Settings size={18} />
          <span className="nav-label">{t.nav.settings}</span>
        </NavLink>
      </nav>

      <div className="sidebar-profile">
        <div className="profile-avatar">{avatarText}</div>
        <div className="profile-info">
          <div className="profile-name">{businessName}</div>
          <div className="profile-plan">{plan}</div>
        </div>
      </div>
    </aside>
  )
}
