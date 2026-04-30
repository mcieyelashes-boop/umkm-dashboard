import {
  Globe, Plus, Eye, MousePointer, Zap, ExternalLink,
  Edit3, BarChart3, Search
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { websitePages, websiteAnalytics } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import './shared.css'
import './Website.css'

export default function Website() {
  const { t, theme } = useApp()
  const w = t.website

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
            <span className="domain">tokoberkahjaya.com</span>
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
              <span className="url-bar">tokoberkahjaya.com</span>
            </div>
            <div className="browser-content">
              <div className="mock-hero gradient-text">Toko Berkah Jaya</div>
              <div className="mock-sub">Premium UMKM Store</div>
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
          <div className="kpi-value">2,148</div>
          <div className="kpi-meta up">{w.fromYesterday}</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">{w.bounceRate}</div>
          <div className="kpi-value">32.4%</div>
          <div className="kpi-meta up">{w.betterBounce}</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">{w.avgSession}</div>
          <div className="kpi-value">3:42</div>
          <div className="kpi-meta up">{w.longerSession}</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">{w.conversion}</div>
          <div className="kpi-value">4.8%</div>
          <div className="kpi-meta up">+0.6%</div>
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
