import {
  ArrowUpRight, Wallet, ShoppingBag, Globe, Heart,
  Eye, Zap, MessageSquare, Sparkles, TrendingUp, Package,
  ShoppingCart
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { useApp } from '../context/AppContext.jsx'
import './Dashboard.css'

const formatRupiah = (n) => 'Rp ' + (n ?? 0).toLocaleString('id-ID')
const formatCompact = (n) => {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1) + 'jt'
  if (n >= 1000) return 'Rp ' + (n / 1000).toFixed(0) + 'rb'
  return 'Rp ' + n
}

const iconMap = { wallet: Wallet, shopping: ShoppingBag, globe: Globe, heart: Heart }

const DAYS_ID = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Dashboard() {
  const { t, theme, profile, lang } = useApp()
  const d = t.dashboard

  const ownerName = profile?.owner_name?.split(' ')[0] || ''
  const walletBalance = profile?.wallet_balance ?? 0

  const days = lang === 'id' ? DAYS_ID : DAYS_EN
  const emptyChart = days.map(name => ({ name, revenue: 0, orders: 0 }))

  const stats = [
    { label: d.totalRevenue ?? 'Total Pendapatan', value: formatRupiah(0), change: '0%', positive: true, icon: 'wallet' },
    { label: d.orders ?? 'Pesanan', value: '0', change: '0%', positive: true, icon: 'shopping' },
    { label: d.webVisitors ?? 'Pengunjung Web', value: '0', change: '0%', positive: true, icon: 'globe' },
    { label: d.socialEngagement ?? 'Engagement Sosmed', value: '0', change: '0%', positive: true, icon: 'heart' },
  ]

  const tooltipStyle = {
    background: theme === 'dark' ? 'rgba(15,20,36,0.95)' : 'rgba(255,255,255,0.97)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: 12,
    fontSize: 12,
    color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">{d.greeting}{ownerName ? ` ${ownerName}` : ''} 👋</h1>
          <p className="page-subtitle">{d.subtitle}</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary">
            <Eye size={14} /> {d.report}
          </button>
          <button className="btn-primary">
            <Sparkles size={14} /> {d.aiInsights}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, idx) => {
          const Icon = iconMap[stat.icon]
          return (
            <div key={idx} className="stat-card glass">
              <div className={`stat-icon stat-icon-${idx}`}>
                <Icon size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-change up">
                  <ArrowUpRight size={12} />
                  {stat.change} <span>{d.vsLastMonth}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="dashboard-grid">
        {/* Revenue chart */}
        <div className="glass chart-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">{d.salesPerf}</h3>
              <p className="card-subtitle">{d.last7days}</p>
            </div>
            <div className="chart-tabs">
              <button className="chart-tab active">{d.revenue}</button>
              <button className="chart-tab">{d.orders}</button>
            </div>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={emptyChart}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatCompact} domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatRupiah(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wallet balance card */}
        <div className="glass chart-card-side">
          <div className="card-header">
            <div>
              <h3 className="card-title">{lang === 'id' ? 'Saldo Wallet' : 'Wallet Balance'}</h3>
              <p className="card-subtitle">{lang === 'id' ? 'Saldo tersedia di akun kamu' : 'Available balance in your account'}</p>
            </div>
          </div>
          <div style={{ padding: '16px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {lang === 'id' ? 'Total Saldo' : 'Total Balance'}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {formatRupiah(walletBalance)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>
              {lang === 'id' ? 'Plan aktif: ' : 'Active plan: '}
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{profile?.plan || 'Starter'}</span>
            </div>
          </div>
          <Link to="/wallet" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', marginTop: 12 }}>
            <Wallet size={14} />
            {lang === 'id' ? 'Top Up Saldo' : 'Top Up Balance'}
          </Link>
        </div>
      </div>

      <div className="dashboard-grid-2">
        {/* Recent orders — empty state */}
        <div className="glass orders-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">{d.recentOrders}</h3>
              <p className="card-subtitle">0 {d.newOrders}</p>
            </div>
            <Link to="/ecommerce" className="card-link">{d.viewAll}</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 12, color: 'var(--text-tertiary)' }}>
            <ShoppingCart size={36} strokeWidth={1.2} style={{ opacity: 0.4 }} />
            <div style={{ fontSize: 14, fontWeight: 500 }}>
              {lang === 'id' ? 'Belum ada pesanan' : 'No orders yet'}
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, textAlign: 'center', maxWidth: 200 }}>
              {lang === 'id'
                ? 'Pesanan dari toko kamu akan muncul di sini'
                : 'Orders from your store will appear here'}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="glass quick-actions-card">
          <div className="card-header">
            <h3 className="card-title">{d.quickAccess}</h3>
          </div>
          <div className="quick-actions-grid">
            <Link to="/studio" className="quick-action ai">
              <Sparkles size={20} />
              <div>
                <div className="qa-title">AI Studio</div>
                <div className="qa-desc">{d.createContent}</div>
              </div>
            </Link>
            <Link to="/chat" className="quick-action">
              <MessageSquare size={20} />
              <div>
                <div className="qa-title">Chat</div>
                <div className="qa-desc">{d.newMessages}</div>
              </div>
            </Link>
            <Link to="/wallet" className="quick-action">
              <Wallet size={20} />
              <div>
                <div className="qa-title">{d.topUp}</div>
                <div className="qa-desc">{d.fillBalance}</div>
              </div>
            </Link>
            <Link to="/social" className="quick-action">
              <TrendingUp size={20} />
              <div>
                <div className="qa-title">{d.post}</div>
                <div className="qa-desc">{d.autoSchedule}</div>
              </div>
            </Link>
          </div>

          <div className="ai-insight">
            <div className="ai-glow" />
            <Zap size={14} />
            <div>
              <div className="ai-title">{d.aiInsightLabel}</div>
              <p className="ai-text">{d.aiInsightText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
