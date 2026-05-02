import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Globe, ShoppingBag, Share2, MessageSquare,
  CreditCard, Wallet, Sparkles, Settings, X,
  ClipboardList, Users, Package2,
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { getInitials } from '../utils/string.js'
import LogoMark from './LogoMark.jsx'
import './Sidebar.css'

export default function Sidebar({ open, onClose }) {
  const { t, profile } = useApp()

  const businessName = profile?.business_name || 'UMKM Hub'
  const plan = profile?.plan || 'Starter'
  const avatarText = profile?.avatar || getInitials(profile?.owner_name || businessName)

  const operationalItems = [
    { path: '/',          icon: LayoutDashboard, label: 'Dashboard',   badge: null },
    { path: '/orders',    icon: ClipboardList,   label: 'Pesanan',     badge: null },
    { path: '/inventory', icon: Package2,        label: 'Inventori',   badge: null },
    { path: '/ecommerce', icon: ShoppingBag,     label: t.nav.ecommerce, badge: null },
    { path: '/payment',   icon: CreditCard,      label: t.nav.payment,   badge: null },
    { path: '/wallet',    icon: Wallet,          label: t.nav.wallet,    badge: null },
  ]

  const growthItems = [
    { path: '/website', icon: Globe,          label: t.nav.website, badge: null },
    { path: '/social',  icon: Share2,         label: t.nav.social,  badge: null },
    { path: '/studio',  icon: Sparkles,       label: t.nav.studio,  badge: 'AI' },
  ]

  const crmItems = [
    { path: '/chat', icon: MessageSquare, label: t.nav.chat, badge: null },
    { path: '/crm',  icon: Users,         label: 'CRM',      badge: null },
  ]

  const renderItems = items => items.map(item => (
    <NavLink
      key={item.path}
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      onClick={onClose}
    >
      <item.icon size={17} />
      <span className="nav-label">{item.label}</span>
      {item.badge && (
        <span className={`nav-badge ${item.badge === 'AI' ? 'ai' : ''}`}>
          {item.badge}
        </span>
      )}
    </NavLink>
  ))

  return (
    <aside className={`sidebar${open ? ' sidebar-mobile-open' : ''}`}>
      {/* Mobile close button */}
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
        <X size={18} />
      </button>

      <div className="sidebar-brand">
        <div className="brand-logo">
          <LogoMark size={32} />
        </div>
        <div className="brand-text">
          <div className="brand-name">UMKM Hub</div>
          <div className="brand-tagline">{plan}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Operasional</div>
        {renderItems(operationalItems)}

        <div className="nav-section-label" style={{ marginTop: 18 }}>Pertumbuhan</div>
        {renderItems(growthItems)}

        <div className="nav-section-label" style={{ marginTop: 18 }}>Pelanggan</div>
        {renderItems(crmItems)}

        <div className="nav-section-label" style={{ marginTop: 18 }}>{t.nav.account}</div>
        <NavLink
          to="/settings"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          onClick={onClose}
        >
          <Settings size={17} />
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
