import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Globe, Plus, Eye, MousePointer, Zap, ExternalLink,
  Edit3, BarChart3, Search, Sparkles, ArrowRight,
  CheckCircle2, Layout, ShoppingBag, MessageSquare
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { websitePages, websiteAnalytics } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import { supabase } from '../lib/supabase.js'
import './shared.css'
import './Website.css'

/* ── Onboarding wizard for new users ─────────────────────────── */
function OnboardingSetup() {
  const { profile, fetchProfile, user, lang } = useApp()
  const navigate = useNavigate()
  const [tagline, setTagline] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const id = lang === 'id'

  const categories = id
    ? ['Fashion & Pakaian', 'Makanan & Minuman', 'Kecantikan & Perawatan', 'Elektronik', 'Kerajinan Tangan', 'Kesehatan', 'Perlengkapan Rumah', 'Lainnya']
    : ['Fashion & Apparel', 'Food & Beverage', 'Beauty & Care', 'Electronics', 'Handcraft', 'Health', 'Home Goods', 'Other']

  const handleCreate = async () => {
    setLoading(true)
    setError('')
    try {
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ onboarded: true, category, tagline })
        .eq('id', user.id)

      if (dbError) {
        setError(id ? 'Gagal menyimpan. Coba lagi.' : 'Failed to save. Please try again.')
        setLoading(false)
        return
      }

      await fetchProfile(user.id)
      navigate('/')
    } catch (err) {
      setError(id ? 'Terjadi kesalahan. Coba lagi.' : 'An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleSkip = async () => {
    setLoading(true)
    try {
      await supabase.from('profiles').update({ onboarded: true }).eq('id', user.id)
      await fetchProfile(user.id)
      navigate('/')
    } catch {
      setLoading(false)
    }
  }

  const features = id
    ? [
        { icon: Layout, text: 'Landing page profesional otomatis dibuat' },
        { icon: ShoppingBag, text: 'Terhubung ke toko online kamu' },
        { icon: Sparkles, text: 'AI siap bantu buat konten bisnis' },
        { icon: MessageSquare, text: 'Chat customer terpusat di satu tempat' },
      ]
    : [
        { icon: Layout, text: 'Professional landing page created automatically' },
        { icon: ShoppingBag, text: 'Connected to your online store' },
        { icon: Sparkles, text: 'AI ready to help create business content' },
        { icon: MessageSquare, text: 'Centralized customer chat in one place' },
      ]

  return (
    <div className="onboarding-wrap">
      <div className="onboarding-left">
        <div className="onboarding-badge">
          <Sparkles size={14} />
          {id ? 'Setup Awal' : 'Initial Setup'}
        </div>
        <h1 className="onboarding-title">
          {id ? `Halo, ${profile?.owner_name?.split(' ')[0] || 'Kawan'}! 👋` : `Hey, ${profile?.owner_name?.split(' ')[0] || 'there'}! 👋`}
        </h1>
        <p className="onboarding-subtitle">
          {id
            ? 'Kamu selangkah lagi dari memiliki landing page bisnis yang profesional. Yuk, setup sekarang!'
            : "You're one step away from having a professional business landing page. Let's set it up now!"}
        </p>

        <div className="onboarding-features">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="onboarding-feature">
              <div className="onboarding-feature-icon"><Icon size={16} /></div>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="onboarding-card glass">
        <div className="onboarding-card-header">
          <div className="onboarding-card-icon"><Globe size={20} /></div>
          <div>
            <div className="onboarding-card-title">
              {id ? 'Buat Landing Page' : 'Create Landing Page'}
            </div>
            <div className="onboarding-card-sub">
              {id ? 'Untuk bisnis kamu' : 'For your business'}
            </div>
          </div>
        </div>

        <div className="onboarding-form">
          {/* Business name — read-only, comes from profile */}
          <div className="onboarding-field">
            <label>{id ? 'Nama Bisnis' : 'Business Name'}</label>
            <div className="onboarding-input-readonly">
              <Globe size={14} />
              <span>{profile?.business_name || '—'}</span>
              <CheckCircle2 size={14} className="check-icon" />
            </div>
          </div>

          {/* Category */}
          <div className="onboarding-field">
            <label>{id ? 'Kategori Bisnis' : 'Business Category'}</label>
            <select
              className="onboarding-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">{id ? '— Pilih kategori —' : '— Select category —'}</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Tagline */}
          <div className="onboarding-field">
            <label>{id ? 'Tagline / Deskripsi Singkat' : 'Tagline / Short Description'}</label>
            <input
              type="text"
              className="onboarding-input"
              placeholder={id ? 'Contoh: Produk batik premium pilihan keluarga Indonesia' : 'e.g. Premium products for every Indonesian family'}
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              maxLength={80}
            />
            <div className="onboarding-char">{tagline.length}/80</div>
          </div>
        </div>

        {error && (
          <div style={{ padding: '10px 13px', borderRadius: 9, fontSize: 13, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', marginBottom: 4 }}>
            {error}
          </div>
        )}

        <button
          className="onboarding-btn"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading
            ? (id ? 'Membuat...' : 'Creating...')
            : (id ? 'Buat Landing Page Sekarang' : 'Create Landing Page Now')
          }
          {!loading && <ArrowRight size={16} />}
        </button>

        <p className="onboarding-note">
          {id
            ? 'Kamu bisa edit kapan saja setelah ini dari menu Website.'
            : 'You can edit anytime later from the Website menu.'}
        </p>

        <button
          className="onboarding-skip-btn"
          onClick={handleSkip}
          disabled={loading}
        >
          {id ? 'Lewati untuk sekarang' : 'Skip for now'}
        </button>
      </div>
    </div>
  )
}

/* ── Main Website page ───────────────────────────────────────── */
export default function Website() {
  const { t, theme, profile } = useApp()
  const w = t.website

  const tooltipStyle = {
    background: theme === 'dark' ? 'rgba(15,20,36,0.95)' : 'rgba(255,255,255,0.97)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: 12,
    fontSize: 12,
    color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
  }

  if (!profile?.onboarded) {
    return (
      <div className="page">
        <OnboardingSetup />
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>{w.title}</h1>
          <p>{w.subtitle}</p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary"><Eye size={14} /> {w.preview}</button>
          <button className="btn-primary"><Plus size={14} /> {w.newPage}</button>
        </div>
      </div>

      <div className="website-hero glass">
        <div className="website-hero-info">
          <div className="domain-row">
            <Globe size={16} />
            <span className="domain">{profile?.business_name?.toLowerCase().replace(/\s+/g, '') || 'tokoanda'}.umkmhub.id</span>
            <span className="badge badge-success">Live</span>
            <ExternalLink size={12} className="ext-link" />
          </div>
          <h2 className="website-title">{w.running}</h2>
          <p className="website-desc">{w.siteDesc}</p>
          <div className="website-meta">
            <div className="meta-item">
              <span className="meta-label">{w.performance}</span>
              <span className="meta-value gradient-text">98/100</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">{w.seoScore}</span>
              <span className="meta-value">94/100</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">{w.uptime}</span>
              <span className="meta-value">99.98%</span>
            </div>
          </div>
        </div>
        <div className="website-preview">
          <div className="browser-frame">
            <div className="browser-bar">
              <span className="dot red" />
              <span className="dot amber" />
              <span className="dot emerald" />
              <span className="url-bar">{profile?.business_name?.toLowerCase().replace(/\s+/g, '') || 'tokoanda'}.umkmhub.id</span>
            </div>
            <div className="browser-content">
              <div className="mock-hero gradient-text">{profile?.business_name || 'Toko Anda'}</div>
              <div className="mock-sub">{profile?.plan || 'Starter'} Plan</div>
              <div className="mock-grid">
                <div className="mock-card" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }} />
                <div className="mock-card" style={{ background: 'linear-gradient(135deg, #ec4899, #f59e0b)' }} />
                <div className="mock-card" style={{ background: 'linear-gradient(135deg, #06b6d4, #10b981)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi glass">
          <div className="kpi-label">{w.todayVisitors}</div>
          <div className="kpi-value">0</div>
          <div className="kpi-meta">—</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">{w.bounceRate}</div>
          <div className="kpi-value">—</div>
          <div className="kpi-meta">—</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">{w.avgSession}</div>
          <div className="kpi-value">—</div>
          <div className="kpi-meta">—</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">{w.conversion}</div>
          <div className="kpi-value">—</div>
          <div className="kpi-meta">—</div>
        </div>
      </div>

      <div className="website-grid">
        <div className="section-card glass">
          <div className="section-header">
            <div>
              <div className="section-title">{w.traffic}</div>
              <div className="section-subtitle">{w.realtimeToday}</div>
            </div>
            <div className="tabs">
              <button className="tab active">{w.tab24h}</button>
              <button className="tab">{w.tab7d}</button>
              <button className="tab">{w.tab30d}</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={websiteAnalytics}>
              <defs>
                <linearGradient id="webGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="visitors" stroke="#06b6d4" strokeWidth={2.5} fill="url(#webGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="section-card glass">
          <div className="section-header">
            <div>
              <div className="section-title">{w.seoPerf}</div>
              <div className="section-subtitle">{w.autoAudit}</div>
            </div>
          </div>
          <div className="seo-list">
            <div className="seo-item">
              <div className="seo-icon ok"><Zap size={14} /></div>
              <div className="seo-content">
                <div className="seo-title">{w.pageSpeed}</div>
                <div className="seo-desc">LCP 1.2s • FID 32ms • CLS 0.04</div>
              </div>
              <span className="seo-score">98</span>
            </div>
            <div className="seo-item">
              <div className="seo-icon ok"><Search size={14} /></div>
              <div className="seo-content">
                <div className="seo-title">{w.metaTags}</div>
                <div className="seo-desc">{w.metaFull}</div>
              </div>
              <span className="seo-score">100</span>
            </div>
            <div className="seo-item">
              <div className="seo-icon warn"><Edit3 size={14} /></div>
              <div className="seo-content">
                <div className="seo-title">{w.altText}</div>
                <div className="seo-desc">{w.altTextWarn}</div>
              </div>
              <span className="seo-score warn">76</span>
            </div>
            <div className="seo-item">
              <div className="seo-icon ok"><BarChart3 size={14} /></div>
              <div className="seo-content">
                <div className="seo-title">{w.schemaMarkup}</div>
                <div className="seo-desc">{w.schemaAuto}</div>
              </div>
              <span className="seo-score">95</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-card glass">
        <div className="section-header">
          <div>
            <div className="section-title">{w.pages}</div>
            <div className="section-subtitle">
              {websitePages.length} {w.pageName} • {websitePages.filter(p => p.status === 'published').length} {w.active}
            </div>
          </div>
          <button className="btn-secondary"><Plus size={14} /> {w.add}</button>
        </div>
        <div className="pages-table">
          <div className="pages-table-head">
            <span>{w.pageName}</span>
            <span>{w.url}</span>
            <span>{w.visitors}</span>
            <span>{w.conversion}</span>
            <span>{w.status}</span>
            <span></span>
          </div>
          {websitePages.map((page) => (
            <div key={page.id} className="pages-table-row">
              <span className="page-name">{page.title}</span>
              <span className="page-url">{page.slug}</span>
              <span className="page-visits">
                <Eye size={12} /> {page.visits.toLocaleString('id-ID')}
              </span>
              <span className="page-conv">
                <MousePointer size={12} /> {page.conversionRate}%
              </span>
              <span>
                <span className={`badge ${page.status === 'published' ? 'badge-success' : 'badge-neutral'}`}>
                  {page.status}
                </span>
              </span>
              <button className="btn-ghost" style={{ padding: '6px 10px' }}>
                <Edit3 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
