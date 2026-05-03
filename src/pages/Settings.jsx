import { Bell, Lock, Globe, CreditCard, Users, Zap, Shield, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import './shared.css'
import './Settings.css'

export default function Settings() {
  const { t, profile, user } = useApp()
  const s = t.settings

  // Compute display values from real profile
  const ownerName    = profile?.owner_name   || '—'
  const businessName = profile?.business_name || 'Bisnis Saya'
  const planName     = profile?.plan          || 'Starter'
  const userEmail    = user?.email            || '—'
  const avatarText   = ownerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'

  const settingSections = [
    { icon: Users, titleKey: 'businessProfile', descKey: 'businessProfileDesc', badge: null },
    { icon: Bell, titleKey: 'notifications', descKey: 'notificationsDesc', badge: null },
    { icon: Lock, titleKey: 'security', descKey: 'securityDesc', badge: s.active },
    { icon: Globe, titleKey: 'domain', descKey: 'domainDesc', badge: null },
    { icon: CreditCard, titleKey: 'billing', descKey: 'billingDesc', badge: null },
    { icon: Zap, titleKey: 'api', descKey: 'apiDesc', badge: 'Pro' },
    { icon: Shield, titleKey: 'privacy', descKey: 'privacyDesc', badge: null },
  ]

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>{s.title}</h1>
          <p>{s.subtitle}</p>
        </div>
      </div>

      <div className="settings-profile glass">
        <div className="settings-avatar">{avatarText}</div>
        <div className="settings-info">
          <div className="settings-name">{businessName}</div>
          <div className="settings-meta">
            <span>{ownerName}</span>
            <span>·</span>
            <span className="settings-email">{userEmail}</span>
            <span>·</span>
            <span className="badge badge-primary">{planName}</span>
          </div>
        </div>
        <button className="btn-secondary">{s.editProfile}</button>
      </div>

      <div className="settings-grid">
        {settingSections.map((sec) => (
          <button key={sec.titleKey} className="settings-item glass">
            <div className="settings-item-icon">
              <sec.icon size={18} />
            </div>
            <div className="settings-item-content">
              <div className="settings-item-title">
                {s[sec.titleKey]}
                {sec.badge && (
                  <span className={`badge ${sec.badge === 'Pro' ? 'badge-primary' : 'badge-success'}`}>
                    {sec.badge}
                  </span>
                )}
              </div>
              <div className="settings-item-desc">{s[sec.descKey]}</div>
            </div>
            <ChevronRight size={16} className="settings-chev" />
          </button>
        ))}
      </div>

      <div className="danger-card glass">
        <div>
          <div className="danger-title">{s.dangerZone}</div>
          <div className="danger-desc">{s.dangerDesc}</div>
        </div>
        <button className="btn-danger">{s.deleteAccount}</button>
      </div>
    </div>
  )
}
