import {
  CreditCard, Wallet as WalletIcon, Building2, QrCode,
  Plus, ArrowDownToLine, Check, X, Clock, TrendingUp, Settings
} from 'lucide-react'
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { paymentMethods, transactions, revenueChart } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import './shared.css'
import './Payment.css'

const formatRupiah = (n) => 'Rp ' + n.toLocaleString('id-ID')
const formatCompact = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'jt'
  if (n >= 1000) return (n / 1000).toFixed(0) + 'k'
  return n.toString()
}

const methodIcons = {
  qr: QrCode,
  wallet: WalletIcon,
  building: Building2,
  card: CreditCard,
}

const methodGradients = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #a855f7, #ec4899)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #ec4899, #f59e0b)',
]

const statusIcons = {
  success: Check,
  pending: Clock,
  failed: X,
}

export default function Payment() {
  const { t, theme } = useApp()
  const p = t.payment
  const totalVolume = paymentMethods.reduce((sum, m) => sum + m.amount, 0)
  const totalTrx = paymentMethods.reduce((sum, m) => sum + m.volume, 0)

  const tooltipStyle = {
    background: theme === 'dark' ? 'rgba(15,20,36,0.95)' : 'rgba(255,255,255,0.97)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: 12,
    fontSize: 12,
    color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
  }

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>{p.title}</h1>
          <p>{p.subtitle}</p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary"><Settings size={14} /> {p.settingBtn}</button>
          <button className="btn-primary"><ArrowDownToLine size={14} /> {p.withdraw}</button>
        </div>
      </div>

      <div className="payment-summary glass">
        <div className="ps-main">
          <div className="ps-label">{p.totalVolume}</div>
          <div className="ps-amount">{formatRupiah(totalVolume)}</div>
          <div className="ps-meta">
            <span className="ps-stat"><TrendingUp size={12} /> {p.monthlyGrowth}</span>
            <span>·</span>
            <span>{totalTrx.toLocaleString('id-ID')} {p.transactions}</span>
          </div>
        </div>
        <div className="ps-divider" />
        <div className="ps-side">
          <div className="ps-side-row">
            <div>
              <div className="ps-side-label">{p.pendingSettlement}</div>
              <div className="ps-side-amount">Rp 18.4M</div>
            </div>
            <div className="ps-side-spark">
              <Clock size={16} color="#f59e0b" />
            </div>
          </div>
          <div className="ps-side-row">
            <div>
              <div className="ps-side-label">{p.availableWithdraw}</div>
              <div className="ps-side-amount" style={{ color: 'var(--accent-emerald)' }}>Rp 124.4M</div>
            </div>
            <div className="ps-side-spark">
              <ArrowDownToLine size={16} color="#10b981" />
            </div>
          </div>
        </div>
      </div>

      <div className="payment-methods-section">
        <div className="section-header" style={{ marginBottom: 14 }}>
          <div>
            <div className="section-title">{p.methods}</div>
            <div className="section-subtitle">{paymentMethods.length} {p.methodSub}</div>
          </div>
          <button className="btn-ghost"><Plus size={14} /> {t.common.add}</button>
        </div>
        <div className="payment-methods-grid">
          {paymentMethods.map((m, idx) => {
            const Icon = methodIcons[m.icon] || CreditCard
            const sharePercent = ((m.amount / totalVolume) * 100).toFixed(1)
            return (
              <div key={m.name} className="method-card glass">
                <div className="method-top">
                  <div className="method-icon" style={{ background: methodGradients[idx] }}>
                    <Icon size={18} color="#fff" />
                  </div>
                  <span className="badge badge-success">{t.common.success}</span>
                </div>
                <div className="method-name">{m.name}</div>
                <div className="method-stats">
                  <div className="method-stat">
                    <div className="ms-label">Volume</div>
                    <div className="ms-value">Rp {formatCompact(m.amount)}</div>
                  </div>
                  <div className="method-stat">
                    <div className="ms-label">{p.transactions}</div>
                    <div className="ms-value">{m.volume}</div>
                  </div>
                  <div className="method-stat">
                    <div className="ms-label">Fee</div>
                    <div className="ms-value">{m.fee}%</div>
                  </div>
                </div>
                <div className="method-bar">
                  <div className="method-bar-fill" style={{
                    width: `${sharePercent}%`,
                    background: methodGradients[idx],
                  }} />
                </div>
                <div className="method-share">{sharePercent}% market share</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="payment-grid">
        <div className="section-card glass">
          <div className="section-header">
            <div>
              <div className="section-title">{p.revenueChart}</div>
              <div className="section-subtitle">{p.last7days}</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueChart}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatCompact} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => formatRupiah(v)}
                cursor={{ fill: 'rgba(99,102,241,0.05)' }}
              />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]}>
                {revenueChart.map((_, idx) => (
                  <Cell key={idx} fill={`url(#bar${idx})`} />
                ))}
              </Bar>
              <defs>
                {revenueChart.map((_, idx) => (
                  <linearGradient key={idx} id={`bar${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                ))}
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="section-card glass">
          <div className="section-header">
            <div>
              <div className="section-title">Settlement</div>
              <div className="section-subtitle">Auto disbursement</div>
            </div>
          </div>
          <div className="settlement-info">
            <div className="settle-row">
              <span>Period</span>
              <span className="strong">T+1 (1 day)</span>
            </div>
            <div className="settle-row">
              <span>Bank</span>
              <span className="strong">BCA •••• 4521</span>
            </div>
            <div className="settle-row">
              <span>Next Disbursement</span>
              <span className="strong">Tomorrow, 09:00</span>
            </div>
            <div className="settle-row">
              <span>Estimate</span>
              <span className="strong" style={{ color: 'var(--accent-emerald)' }}>Rp 18.4M</span>
            </div>
          </div>
          <button className="btn-primary settle-btn">
            <ArrowDownToLine size={14} /> {p.withdraw}
          </button>
        </div>
      </div>

      <div className="section-card glass">
        <div className="section-header">
          <div>
            <div className="section-title">{p.recentTx}</div>
            <div className="section-subtitle">{p.recentTxSub}</div>
          </div>
          <div className="tabs">
            <button className="tab active">{t.common.viewAll}</button>
            <button className="tab">{p.success}</button>
            <button className="tab">{p.pending}</button>
            <button className="tab">{p.failed}</button>
          </div>
        </div>
        <div className="trx-table">
          <div className="trx-thead">
            <span>Trx ID</span>
            <span>{p.customer}</span>
            <span>{p.method}</span>
            <span>{p.amount}</span>
            <span>Fee</span>
            <span>{p.status}</span>
            <span>{p.date}</span>
          </div>
          {transactions.map((tx) => {
            const StatusIcon = statusIcons[tx.status]
            return (
              <div key={tx.id} className="trx-trow">
                <span className="trx-id">{tx.id}</span>
                <span>{tx.customer}</span>
                <span className="trx-method">{tx.method}</span>
                <span className="trx-amount">{formatRupiah(tx.amount)}</span>
                <span className="trx-fee">{tx.fee > 0 ? formatRupiah(tx.fee) : '-'}</span>
                <span>
                  <span className={`badge status-${tx.status}`}>
                    <StatusIcon size={10} style={{ verticalAlign: '-1px' }} /> {tx.status}
                  </span>
                </span>
                <span className="trx-time">{tx.time}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
