import {
  Minus, Wallet, ShoppingBag, Globe, Heart,
  Eye, Zap, MessageSquare, Sparkles, TrendingUp,
  ShoppingCart, ChevronRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { useApp } from '../context/AppContext.jsx'
import { useOrderStats, useOrders } from '../hooks/useOrders.js'
import { formatRupiah, formatCompact } from '../utils/currency.js'
import './Dashboard.css'

const iconMap = { wallet: Wallet, shopping: ShoppingBag, globe: Globe, heart: Heart }

const DAYS_ID = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const DAYS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Dashboard() {
  const { t, theme, profile, lang } = useApp()
  const d = t.dashboard

  const { stats: orderStats, chart: revenueData, loading: statsLoading } = useOrderStats()
  const { orders: recentOrders, loading: ordersLoading } = useOrders()

  const ownerName = profile?.owner_name?.split(' ')[0] || ''
  const walletBalance = profile?.wallet_balance ?? 0

  const days = lang === 'id' ? DAYS_ID : DAYS_EN
  const emptyChart = days.map(name => ({ name, revenue: 0, orders: 0 }))
  const chartData = (!statsLoading && revenueData.length > 0) ? revenueData : emptyChart

  const stats = [
    {
      label: d.totalRevenue ?? 'Total Pendapatan',
      value: statsLoading ? '—' : formatCompact(orderStats?.revenue ?? 0),
      change: statsLoading ? '—' : `${orderStats?.today ?? 0} hari ini`,
      positive: true, icon: 'wallet',
    },
    {
      label: d.orders ?? 'Pesanan',
      value: statsLoading ? '—' : (orderStats?.total ?? 0).toLocaleString('id-ID'),
      change: statsLoading ? '—' : `${orderStats?.pending ?? 0} perlu proses`,
      positive: true, icon: 'shopping',
    },
    { label: d.webVisitors ?? 'Pengunjung Web',       value: '—', change: 'Segera hadir', positive: true, icon: 'globe'   },
    { label: d.socialEngagement ?? 'Engagement Sosmed', value: '—', change: 'Segera hadir', positive: true, icon: 'heart'  },
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
                <div className="stat-change neutral">
                  <Minus size={12} />
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
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatCompact} domain={chartData === emptyChart ? [0, 100] : ['auto', 'auto']} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCompact(v)} />
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
        {/* Recent orders */}
        <div className="glass orders-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">{d.recentOrders}</h3>
              <p className="card-subtitle">{orderStats?.today ?? 0} {d.newOrders}</p>
            </div>
            <Link to="/orders" className="card-link">{d.viewAll}</Link>
          </div>
          {ordersLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
              <div className="spinner" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 0', gap: 12, color: 'var(--text-tertiary)' }}>
              <ShoppingCart size={36} strokeWidth={1.2} style={{ opacity: 0.4 }} />
              <div style={{ fontSize: 14, fontWeight: 500 }}>
                {lang === 'id' ? 'Belum ada pesanan' : 'No orders yet'}
              </div>
            </div>
          ) : (
            <div className="dash-recent-orders">
              {recentOrders.slice(0, 5).map(o => (
                <div key={o.id} className="dash-order-row">
                  <div className="dash-order-avatar">{o.customer_avatar || o.customer_name?.[0] || '?'}</div>
                  <div className="dash-order-info">
                    <div className="dash-order-name">{o.customer_name}</div>
                    <div className="dash-order-items">{o.items}</div>
                  </div>
                  <div className="dash-order-right">
                    <div className="dash-order-amount">{formatCompact(o.total)}</div>
                    <div className={`dash-order-status s-${o.status}`}>{o.status}</div>
                  </div>
                </div>
              ))}
              <Link to="/orders" className="dash-view-all">
                Lihat semua {recentOrders.length} pesanan <ChevronRight size={13} />
              </Link>
            </div>
          )}
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
