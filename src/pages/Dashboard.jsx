import {
  ArrowUpRight, ArrowDownRight, Wallet, ShoppingBag, Globe, Heart,
  TrendingUp, Eye, Package, Zap, MessageSquare, Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell
} from 'recharts'
import {
  overviewStats, revenueChart, channelDistribution,
  recentOrders, products, businessProfile
} from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import './Dashboard.css'

const formatRupiah = (n) => 'Rp ' + n.toLocaleString('id-ID')
const formatCompact = (n) => {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1) + 'jt'
  if (n >= 1000) return 'Rp ' + (n / 1000).toFixed(0) + 'rb'
  return 'Rp ' + n
}

const iconMap = { wallet: Wallet, shopping: ShoppingBag, globe: Globe, heart: Heart }

export default function Dashboard() {
  const { t, theme } = useApp()
  const d = t.dashboard
  const lowStock = products.filter(p => p.status === 'low' || p.status === 'out')

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
          <h1 className="page-title">{d.greeting} {businessProfile.owner.split(' ')[0]} 👋</h1>
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

      <div className="stats-grid">
        {overviewStats.map((stat, idx) => {
          const Icon = iconMap[stat.icon]
          return (
            <div key={idx} className="stat-card glass">
              <div className={`stat-icon stat-icon-${idx}`}>
                <Icon size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                <div className={`stat-change ${stat.positive ? 'up' : 'down'}`}>
                  {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change} <span>{d.vsLastMonth}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="dashboard-grid">
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
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatCompact} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatRupiah(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass chart-card-side">
          <div className="card-header">
            <div>
              <h3 className="card-title">{d.channelDist}</h3>
              <p className="card-subtitle">{d.revenueSource}</p>
            </div>
          </div>
          <div className="pie-wrapper">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={channelDistribution}
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {channelDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="channel-list">
            {channelDistribution.map((c) => (
              <div key={c.name} className="channel-item">
                <div className="channel-dot" style={{ background: c.color }} />
                <span className="channel-name">{c.name}</span>
                <span className="channel-value">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid-2">
        <div className="glass orders-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">{d.recentOrders}</h3>
              <p className="card-subtitle">{recentOrders.length} {d.newOrders}</p>
            </div>
            <Link to="/ecommerce" className="card-link">{d.viewAll}</Link>
          </div>
          <div className="orders-list">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="order-row">
                <div className="order-customer">
                  <div className="order-avatar">{order.customer.charAt(0)}</div>
                  <div>
                    <div className="order-name">{order.customer}</div>
                    <div className="order-product">{order.product}</div>
                  </div>
                </div>
                <div className="order-meta">
                  <span className="order-channel">{order.channel}</span>
                  <span className={`order-status status-${order.status}`}>{order.status}</span>
                </div>
                <div className="order-amount">{formatRupiah(order.amount)}</div>
              </div>
            ))}
          </div>
        </div>

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
                <div className="qa-desc">6 {d.newMessages}</div>
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

          {lowStock.length > 0 && (
            <div className="alert-section">
              <div className="alert-header">
                <Package size={14} />
                <span>{d.lowStock}</span>
              </div>
              {lowStock.map((p) => (
                <div key={p.id} className="alert-item">
                  <span className="alert-name">{p.name}</span>
                  <span className={`alert-stock ${p.status}`}>
                    {p.status === 'out' ? d.outOfStock : `${p.stock} pcs`}
                  </span>
                </div>
              ))}
            </div>
          )}

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
