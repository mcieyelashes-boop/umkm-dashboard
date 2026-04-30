import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Globe, ShoppingBag, Share2, MessageSquare,
  CreditCard, Wallet, Sparkles, Settings, Zap
} from 'lucide-react'
import { businessProfile } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import './Sidebar.css'

export default function Sidebar() {
  const { t } = useApp()

  const menuItems = [
    { path: '/', icon: LayoutDashboard, labelKey: 'dashboard', badge: null },
    { path: '/website', icon: Globe, labelKey: 'website', badge: null },
    { path: '/ecommerce', icon: ShoppingBag, labelKey: 'ecommerce', badge: '12' },
    { path: '/social', icon: Share2, labelKey: 'social', badge: null },
    { path: '/chat', icon: MessageSquare, labelKey: 'chat', badge: '6' },
    { path: '/payment', icon: CreditCard, labelKey: 'payment', badge: null },
    { path: '/wallet', icon: Wallet, labelKey: 'wallet', badge: null },
    { path: '/studio', icon: Sparkles, labelKey: 'studio', badge: 'AI' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <Zap size={20} fill="white" />
        </div>
        <div className="brand-text">
          <div className="brand-name">UMKM Hub</div>
          <div className="brand-tagline">Business Pro</div>
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
        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={18} />
          <span className="nav-label">{t.nav.settings}</span>
        </NavLink>
      </nav>

      <div className="sidebar-profile">
        <div className="profile-avatar">{businessProfile.avatar}</div>
        <div className="profile-info">
          <div className="profile-name">{businessProfile.name}</div>
          <div className="profile-plan">{businessProfile.plan}</div>
        </div>
      </div>
    </aside>
  )
}
