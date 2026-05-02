import { useState, useMemo } from 'react'
import {
  Users, Search, Plus, TrendingUp, Phone, Mail,
  MessageSquare, Filter, MoreHorizontal, Star,
  ShoppingBag, Globe, Instagram, Facebook,
  ChevronRight, DollarSign, Target, Award,
  GripVertical,
} from 'lucide-react'
import { crmContacts, crmDeals } from '../data/mockData.js'
import './shared.css'
import './CRM.css'

const formatRupiah = n => {
  if (n >= 1000000) return 'Rp ' + (n / 1000000).toFixed(1) + 'Jt'
  return 'Rp ' + n.toLocaleString('id-ID')
}

/* ── Source icons ── */
const SOURCE = {
  shopee:    { label: 'Shopee',    color: '#f97316' },
  tokopedia: { label: 'Tokopedia', color: '#10b981' },
  instagram: { label: 'Instagram', color: '#ec4899' },
  facebook:  { label: 'Facebook',  color: '#6366f1' },
  whatsapp:  { label: 'WhatsApp',  color: '#25d366' },
  website:   { label: 'Website',   color: '#7c3aed' },
  tiktok:    { label: 'TikTok',    color: '#06b6d4' },
}

/* ── Pipeline stages ── */
const STAGES = [
  { key: 'lead',      label: 'Lead',       color: '#6366f1', desc: 'Potensi baru'       },
  { key: 'prospek',   label: 'Prospek',    color: '#f59e0b', desc: 'Tertarik produk'    },
  { key: 'negosiasi', label: 'Negosiasi',  color: '#06b6d4', desc: 'Diskusi harga'      },
  { key: 'closing',   label: 'Closing',    color: '#a855f7', desc: 'Hampir deal'        },
  { key: 'won',       label: 'Menang 🎉',  color: '#10b981', desc: 'Deal berhasil'      },
]

/* ── Tags ── */
const TAG_COLOR = {
  VIP:      { bg: '#f59e0b18', color: '#f59e0b' },
  Reseller: { bg: '#6366f118', color: '#818cf8' },
  Fashion:  { bg: '#ec489918', color: '#ec4899' },
  'F&B':    { bg: '#10b98118', color: '#10b981' },
  Kuliner:  { bg: '#10b98118', color: '#10b981' },
}

function ContactCard({ c, selected, onSelect }) {
  const src = SOURCE[c.source] || { label: c.source, color: '#6366f1' }
  return (
    <div className={`crm-contact-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="crm-contact-top">
        <div className="crm-avatar">
          {c.avatar}
          <div className="crm-avatar-source" style={{ background: src.color }} />
        </div>
        <div className="crm-contact-info">
          <div className="crm-contact-name">{c.name}</div>
          <div className="crm-contact-meta">{src.label} · {c.lastContact}</div>
        </div>
        <div className="crm-contact-spend">{formatRupiah(c.totalSpend)}</div>
      </div>
      <div className="crm-contact-tags">
        {c.tags.map(tag => {
          const tc = TAG_COLOR[tag] || { bg: '#6366f118', color: '#818cf8' }
          return <span key={tag} className="crm-tag" style={{ background: tc.bg, color: tc.color }}>{tag}</span>
        })}
        <span className="crm-orders-badge">{c.orders} order</span>
      </div>
    </div>
  )
}

function DealCard({ deal }) {
  const stage = STAGES.find(s => s.key === deal.stage)
  return (
    <div className="crm-deal-card glass">
      <div className="crm-deal-header">
        <div className="crm-deal-title">{deal.title}</div>
        <button className="crm-deal-more"><MoreHorizontal size={13} /></button>
      </div>
      <div className="crm-deal-contact">{deal.contact}</div>
      <div className="crm-deal-footer">
        <div className="crm-deal-value">{formatRupiah(deal.value)}</div>
        <div className="crm-deal-prob" style={{ color: stage?.color }}>
          {deal.probability}%
        </div>
      </div>
      <div className="crm-deal-due">Jatuh tempo: {deal.due}</div>
      <div className="crm-deal-bar">
        <div className="crm-deal-bar-fill" style={{ width: `${deal.probability}%`, background: stage?.color }} />
      </div>
    </div>
  )
}

export default function CRM() {
  const [view,          setView]          = useState('pipeline') // pipeline | contacts
  const [selectedContact, setSelectedContact] = useState(null)
  const [search,        setSearch]        = useState('')

  const filteredContacts = useMemo(() =>
    crmContacts.filter(c =>
      !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    ), [search])

  const totalPipelineValue = crmDeals
    .filter(d => d.stage !== 'won')
    .reduce((s, d) => s + d.value, 0)

  const wonValue = crmDeals
    .filter(d => d.stage === 'won')
    .reduce((s, d) => s + d.value, 0)

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>CRM & Pipeline</h1>
          <p>Kelola kontak pelanggan dan pantau pipeline penjualan</p>
        </div>
        <div className="page-actions">
          <div className="crm-view-toggle">
            <button className={view === 'pipeline' ? 'active' : ''} onClick={() => setView('pipeline')}>
              <Target size={14} /> Pipeline
            </button>
            <button className={view === 'contacts' ? 'active' : ''} onClick={() => setView('contacts')}>
              <Users size={14} /> Kontak
            </button>
          </div>
          <button className="btn-primary"><Plus size={14} /> Tambah Kontak</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi glass">
          <div className="kpi-label">Total Kontak</div>
          <div className="kpi-value">{crmContacts.length}</div>
          <div className="kpi-meta up">+3 bulan ini</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Pipeline Aktif</div>
          <div className="kpi-value">{formatRupiah(totalPipelineValue)}</div>
          <div className="kpi-meta">{crmDeals.filter(d => d.stage !== 'won').length} deal aktif</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Won Bulan Ini</div>
          <div className="kpi-value" style={{ color: '#10b981' }}>{formatRupiah(wonValue)}</div>
          <div className="kpi-meta up">+{crmDeals.filter(d => d.stage === 'won').length} deal closed</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Win Rate</div>
          <div className="kpi-value">68%</div>
          <div className="kpi-meta up">+5% vs bulan lalu</div>
        </div>
      </div>

      {view === 'pipeline' ? (
        /* ── Pipeline Kanban ── */
        <div className="crm-pipeline-wrap">
          <div className="crm-pipeline">
            {STAGES.map(stage => {
              const stageDeals = crmDeals.filter(d => d.stage === stage.key)
              const stageValue = stageDeals.reduce((s, d) => s + d.value, 0)
              return (
                <div key={stage.key} className="crm-stage-col">
                  <div className="crm-stage-header">
                    <div className="crm-stage-dot" style={{ background: stage.color }} />
                    <div>
                      <div className="crm-stage-label">{stage.label}</div>
                      <div className="crm-stage-sub">{stage.desc}</div>
                    </div>
                    <div className="crm-stage-val">{formatRupiah(stageValue)}</div>
                  </div>
                  <div className="crm-stage-count">{stageDeals.length} deal</div>
                  <div className="crm-stage-cards">
                    {stageDeals.map(deal => <DealCard key={deal.id} deal={deal} />)}
                    <button className="crm-add-deal">
                      <Plus size={13} /> Tambah deal
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* ── Contacts view ── */
        <div className="crm-contacts-layout">
          {/* Contact list */}
          <div className="section-card glass crm-contacts-panel">
            <div className="crm-list-header">
              <div className="section-title">Semua Kontak</div>
              <div className="crm-search">
                <Search size={13} />
                <input placeholder="Cari nama, telepon…" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="crm-contact-list">
              {filteredContacts.map(c => (
                <ContactCard
                  key={c.id}
                  c={c}
                  selected={selectedContact?.id === c.id}
                  onSelect={() => setSelectedContact(c)}
                />
              ))}
            </div>
          </div>

          {/* Contact detail */}
          <div className="section-card glass crm-detail-panel">
            {selectedContact ? (
              <ContactDetail contact={selectedContact} />
            ) : (
              <div className="crm-detail-empty">
                <Users size={32} opacity={0.3} />
                <p>Pilih kontak untuk melihat detail</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ContactDetail({ contact: c }) {
  const src = SOURCE[c.source] || { label: c.source, color: '#6366f1' }
  const deals = crmDeals.filter(d => d.contact === c.name)

  return (
    <div className="crm-detail">
      {/* Header */}
      <div className="crm-detail-header">
        <div className="crm-detail-avatar">{c.avatar}</div>
        <div>
          <div className="crm-detail-name">{c.name}</div>
          <div className="crm-detail-src" style={{ color: src.color }}>{src.label}</div>
        </div>
        <div className="crm-detail-actions">
          <button className="ord-action-btn" title="Telepon"><Phone size={14} /></button>
          <button className="ord-action-btn" title="Email"><Mail size={14} /></button>
          <button className="ord-action-btn" title="Chat"><MessageSquare size={14} /></button>
        </div>
      </div>

      {/* Stats */}
      <div className="crm-detail-stats">
        <div className="crm-d-stat">
          <div className="crm-d-stat-val">{c.orders}</div>
          <div className="crm-d-stat-label">Total Order</div>
        </div>
        <div className="crm-d-stat">
          <div className="crm-d-stat-val">{formatRupiah(c.totalSpend)}</div>
          <div className="crm-d-stat-label">Total Belanja</div>
        </div>
        <div className="crm-d-stat">
          <div className="crm-d-stat-val" style={{ color: STAGES.find(s => s.key === c.stage)?.color }}>
            {STAGES.find(s => s.key === c.stage)?.label}
          </div>
          <div className="crm-d-stat-label">Stage</div>
        </div>
      </div>

      {/* Info */}
      <div className="crm-detail-info">
        <div className="crm-info-row"><Phone size={13} /><span>{c.phone}</span></div>
        <div className="crm-info-row"><Mail size={13} /><span>{c.email}</span></div>
        <div className="crm-info-row"><Globe size={13} /><span>Terakhir kontak: {c.lastContact}</span></div>
      </div>

      {/* Tags */}
      <div className="crm-detail-tags">
        {c.tags.map(tag => {
          const tc = TAG_COLOR[tag] || { bg: '#6366f118', color: '#818cf8' }
          return <span key={tag} className="crm-tag" style={{ background: tc.bg, color: tc.color }}>{tag}</span>
        })}
      </div>

      {/* Related deals */}
      {deals.length > 0 && (
        <div className="crm-detail-deals">
          <div className="crm-detail-section-title">Deal Terkait</div>
          {deals.map(deal => (
            <div key={deal.id} className="crm-detail-deal-item">
              <div className="crm-ddeal-info">
                <div className="crm-ddeal-title">{deal.title}</div>
                <div className="crm-ddeal-val">{formatRupiah(deal.value)}</div>
              </div>
              <div className="crm-ddeal-stage" style={{
                color: STAGES.find(s => s.key === deal.stage)?.color,
                background: STAGES.find(s => s.key === deal.stage)?.color + '18',
              }}>
                {STAGES.find(s => s.key === deal.stage)?.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
