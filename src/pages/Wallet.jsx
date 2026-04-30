import { useState } from 'react'
import {
  Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft,
  Sparkles, Crown, Check, CreditCard, Building2, QrCode, Smartphone, Zap, Gift
} from 'lucide-react'
import { walletTransactions, subscriptionPlan, businessProfile } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import './shared.css'
import './Wallet.css'

const formatRupiah = (n) => 'Rp ' + Math.abs(n).toLocaleString('id-ID')

const topupAmounts = [100000, 250000, 500000, 1000000, 2000000, 5000000]

export default function Wallet() {
  const [selectedAmount, setSelectedAmount] = useState(500000)
  const [selectedMethod, setSelectedMethod] = useState('QRIS')
  const { t } = useApp()
  const w = t.wallet

  const topupMethods = [
    { name: 'QRIS', icon: QrCode, instant: true },
    { name: 'Bank Transfer', icon: Building2, instant: false },
    { name: 'GoPay', icon: Smartphone, instant: true },
    { name: 'OVO', icon: Smartphone, instant: true },
    { name: 'DANA', icon: Smartphone, instant: true },
    { name: 'Kartu Kredit', icon: CreditCard, instant: true },
  ]

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>{w.title}</h1>
          <p>{w.subtitle}</p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary">{w.history}</button>
          <button className="btn-primary"><Plus size={14} /> {w.topUp}</button>
        </div>
      </div>

      <div className="wallet-hero glass">
        <div className="wallet-hero-bg" />
        <div className="wallet-hero-content">
          <div className="wallet-hero-top">
            <div>
              <div className="wallet-hero-label">
                <WalletIcon size={14} /> {w.activeBalance}
              </div>
              <div className="wallet-hero-amount">{formatRupiah(businessProfile.walletBalance)}</div>
              <div className="wallet-hero-meta">
                <span className="meta-up">
                  <ArrowUpRight size={11} /> {w.balanceSuffix}
                </span>
              </div>
            </div>
            <div className="wallet-card-mock">
              <div className="wcm-chip" />
              <div className="wcm-brand">UMKM HUB</div>
              <div className="wcm-num">•••• •••• •••• 4521</div>
              <div className="wcm-bottom">
                <div>
                  <div className="wcm-label">Holder</div>
                  <div className="wcm-value">{businessProfile.owner}</div>
                </div>
                <div>
                  <div className="wcm-label">Plan</div>
                  <div className="wcm-value">{businessProfile.plan}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="wallet-quick-stats">
            <div className="wqs-item">
              <div className="wqs-icon income">
                <ArrowDownLeft size={14} />
              </div>
              <div>
                <div className="wqs-label">{w.topUpThisMonth}</div>
                <div className="wqs-value">Rp 6.5jt</div>
              </div>
            </div>
            <div className="wqs-item">
              <div className="wqs-icon expense">
                <ArrowUpRight size={14} />
              </div>
              <div>
                <div className="wqs-label">{w.expenses}</div>
                <div className="wqs-value">Rp 1.6jt</div>
              </div>
            </div>
            <div className="wqs-item">
              <div className="wqs-icon ai">
                <Sparkles size={14} />
              </div>
              <div>
                <div className="wqs-label">{w.aiServices}</div>
                <div className="wqs-value">Rp 825rb</div>
              </div>
            </div>
            <div className="wqs-item">
              <div className="wqs-icon sub">
                <Crown size={14} />
              </div>
              <div>
                <div className="wqs-label">{w.subscription}</div>
                <div className="wqs-value">Rp 499rb</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wallet-grid">
        <div className="section-card glass topup-card">
          <div className="section-header">
            <div>
              <div className="section-title">{w.topUpBalance}</div>
              <div className="section-subtitle">{w.chooseAmount}</div>
            </div>
          </div>

          <div className="topup-section-label">{w.amount}</div>
          <div className="topup-amounts">
            {topupAmounts.map((amt) => (
              <button
                key={amt}
                className={`topup-amount ${selectedAmount === amt ? 'active' : ''}`}
                onClick={() => setSelectedAmount(amt)}
              >
                <div className="ta-prefix">Rp</div>
                <div className="ta-value">{(amt / 1000).toLocaleString('id-ID')}rb</div>
                {amt === 1000000 && <span className="ta-badge">{w.popular}</span>}
                {amt === 5000000 && <span className="ta-badge bonus">{w.bonusLabel}</span>}
              </button>
            ))}
          </div>

          <div className="topup-custom">
            <span>{w.customAmount}</span>
            <div className="topup-input">
              <span>Rp</span>
              <input
                type="text"
                value={selectedAmount.toLocaleString('id-ID')}
                onChange={(e) => {
                  const val = parseInt(e.target.value.replace(/\D/g, '')) || 0
                  setSelectedAmount(val)
                }}
              />
            </div>
          </div>

          <div className="topup-section-label" style={{ marginTop: 20 }}>{w.paymentMethod}</div>
          <div className="topup-methods">
            {topupMethods.map((m) => (
              <button
                key={m.name}
                className={`topup-method ${selectedMethod === m.name ? 'active' : ''}`}
                onClick={() => setSelectedMethod(m.name)}
              >
                <m.icon size={16} />
                <span>{m.name}</span>
                {m.instant && <span className="instant-badge"><Zap size={9} /> {w.instant}</span>}
                {selectedMethod === m.name && <Check size={14} className="check" />}
              </button>
            ))}
          </div>

          <button className="btn-primary topup-submit">
            {w.topUp} {formatRupiah(selectedAmount)} via {selectedMethod}
          </button>
        </div>

        <div className="section-card glass plan-card">
          <div className="plan-glow" />
          <div className="plan-header">
            <div className="plan-badge">
              <Crown size={12} /> {w.activePlan}
            </div>
            <div className="plan-name">{subscriptionPlan.current}</div>
            <div className="plan-price">
              <span>{formatRupiah(subscriptionPlan.price)}</span>
              <small>/{subscriptionPlan.billingCycle}</small>
            </div>
          </div>
          <div className="plan-billing">
            <span>{w.nextBilling}</span>
            <strong>{subscriptionPlan.nextBilling}</strong>
          </div>
          <div className="plan-features">
            {subscriptionPlan.features.map((f) => (
              <div key={f} className="plan-feature">
                <Check size={12} />
                <span>{f}</span>
              </div>
            ))}
          </div>
          <button className="btn-secondary plan-action">{w.upgradePlan}</button>

          <div className="referral-banner">
            <Gift size={16} />
            <div>
              <div className="ref-title">{w.referralTitle}</div>
              <p className="ref-desc">{w.referralDesc}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-card glass">
        <div className="section-header">
          <div>
            <div className="section-title">{w.balanceHistory}</div>
            <div className="section-subtitle">{w.historySubtitle}</div>
          </div>
          <div className="tabs">
            <button className="tab active">{w.tabAll}</button>
            <button className="tab">{w.tabTopup}</button>
            <button className="tab">{w.tabExpenses}</button>
          </div>
        </div>
        <div className="wallet-tx-list">
          {walletTransactions.map((tx) => (
            <div key={tx.id} className="wallet-tx">
              <div className={`wtx-icon ${tx.type}`}>
                {tx.type === 'topup' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
              </div>
              <div className="wtx-content">
                <div className="wtx-desc">{tx.description}</div>
                <div className="wtx-date">{tx.date}</div>
              </div>
              <div className="wtx-amounts">
                <div className={`wtx-amount ${tx.type}`}>
                  {tx.type === 'topup' ? '+' : '-'} {formatRupiah(tx.amount)}
                </div>
                <div className="wtx-balance">{w.balanceLabel} {formatRupiah(tx.balance)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
