import { useState } from 'react'
import {
  SearchCheck, Globe, TrendingUp, AlertCircle, CheckCircle2,
  ExternalLink, RefreshCw, Plus, ChevronRight, BarChart2,
  FileText, Link2, Star, Zap, Eye,
} from 'lucide-react'
import './shared.css'
import './SEO.css'

/* ── Score ring ── */
function ScoreRing({ score, size = 80 }) {
  const r = (size / 2) - 8
  const circ = 2 * Math.PI * r
  const fill = circ * (1 - score / 100)
  const color = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <svg width={size} height={size} className="seo-score-ring">
      <circle cx={size/2} cy={size/2} r={r} stroke="var(--border)" strokeWidth={6} fill="none" />
      <circle
        cx={size/2} cy={size/2} r={r}
        stroke={color} strokeWidth={6} fill="none"
        strokeDasharray={circ} strokeDashoffset={fill}
        strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fill={color} fontSize={18} fontWeight={700}>{score}</text>
    </svg>
  )
}

/* ── Issue row ── */
function IssueRow({ icon: Icon, title, desc, status }) {
  const s = {
    good:    { color: '#10b981', bg: '#10b98115', label: 'OK' },
    warning: { color: '#f59e0b', bg: '#f59e0b15', label: 'Perlu Perbaikan' },
    error:   { color: '#ef4444', bg: '#ef444415', label: 'Error' },
  }[status]
  return (
    <div className="seo-issue-row">
      <div className="seo-issue-icon" style={{ background: s.bg, color: s.color }}>
        <Icon size={14} />
      </div>
      <div className="seo-issue-body">
        <div className="seo-issue-title">{title}</div>
        <div className="seo-issue-desc">{desc}</div>
      </div>
      <span className="seo-issue-badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
    </div>
  )
}

/* ── Keyword row ── */
function KeywordRow({ keyword, position, volume, change }) {
  const up = change > 0
  return (
    <div className="seo-kw-row">
      <div className="seo-kw-name">{keyword}</div>
      <div className="seo-kw-pos">#{position}</div>
      <div className="seo-kw-vol">{volume.toLocaleString('id-ID')}/bln</div>
      <div className={`seo-kw-change ${up ? 'up' : change < 0 ? 'down' : 'flat'}`}>
        {change > 0 ? `↑${change}` : change < 0 ? `↓${Math.abs(change)}` : '—'}
      </div>
    </div>
  )
}

const ISSUES = [
  { icon: FileText,  title: 'Meta Title',        desc: 'Judul halaman sudah optimal (50–60 karakter)',           status: 'good'    },
  { icon: FileText,  title: 'Meta Description',  desc: 'Deskripsi terlalu pendek — tambahkan hingga 155 karakter', status: 'warning' },
  { icon: Globe,     title: 'SSL / HTTPS',        desc: 'Website sudah menggunakan HTTPS',                        status: 'good'    },
  { icon: Zap,       title: 'Kecepatan Halaman', desc: 'Load time 3.2 detik — idealnya di bawah 2 detik',       status: 'warning' },
  { icon: Eye,       title: 'Alt Text Gambar',   desc: '4 gambar tidak memiliki alt text',                       status: 'error'   },
  { icon: Link2,     title: 'Broken Links',       desc: 'Tidak ada broken link ditemukan',                       status: 'good'    },
  { icon: FileText,  title: 'Heading Structure', desc: 'H1 ada, tapi tidak ada H2 pada konten utama',            status: 'warning' },
  { icon: Globe,     title: 'Sitemap XML',        desc: 'Sitemap belum ditemukan di /sitemap.xml',               status: 'error'   },
]

const KEYWORDS = [
  { keyword: 'bulu mata', position: 4,  volume: 12400, change: 2  },
  { keyword: 'eyelash extension jakarta', position: 7,  volume: 3200,  change: -1 },
  { keyword: 'jasa pasang bulu mata', position: 12, volume: 1800,  change: 3  },
  { keyword: 'eyelash murah', position: 18, volume: 5400,  change: 0  },
  { keyword: 'bulu mata natural', position: 23, volume: 2100,  change: 5  },
]

export default function SEO() {
  const [url, setUrl] = useState('https://mci-eyelashes.site')
  const [tab, setTab] = useState('overview') // overview | keywords | issues

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>SEO Manager</h1>
          <p>Pantau dan optimalkan performa pencarian website kamu</p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary"><RefreshCw size={14} /> Analisa Ulang</button>
          <button className="btn-primary"><Plus size={14} /> Tambah Halaman</button>
        </div>
      </div>

      {/* URL Bar */}
      <div className="seo-url-bar glass">
        <Globe size={15} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        <input
          className="seo-url-input"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://website-kamu.com"
        />
        <a href={url} target="_blank" rel="noopener noreferrer" className="seo-url-open">
          <ExternalLink size={13} /> Buka
        </a>
      </div>

      {/* Score KPIs */}
      <div className="seo-scores">
        <div className="seo-score-card glass">
          <ScoreRing score={72} />
          <div className="seo-score-info">
            <div className="seo-score-label">SEO Score</div>
            <div className="seo-score-sub">Perlu beberapa perbaikan</div>
          </div>
        </div>
        <div className="seo-score-card glass">
          <ScoreRing score={88} />
          <div className="seo-score-info">
            <div className="seo-score-label">Performa</div>
            <div className="seo-score-sub">Kecepatan loading bagus</div>
          </div>
        </div>
        <div className="seo-score-card glass">
          <ScoreRing score={95} />
          <div className="seo-score-info">
            <div className="seo-score-label">Aksesibilitas</div>
            <div className="seo-score-sub">Hampir sempurna</div>
          </div>
        </div>
        <div className="seo-score-card glass">
          <ScoreRing score={60} />
          <div className="seo-score-info">
            <div className="seo-score-label">Best Practices</div>
            <div className="seo-score-sub">Ada beberapa isu teknis</div>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="kpi-grid">
        <div className="kpi glass">
          <div className="kpi-label">Kata Kunci Terlacak</div>
          <div className="kpi-value">24</div>
          <div className="kpi-meta up">+3 bulan ini</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Rata-rata Posisi</div>
          <div className="kpi-value" style={{ color: '#f59e0b' }}>#12.4</div>
          <div className="kpi-meta up">↑ naik 2 posisi</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Klik Organik / Bln</div>
          <div className="kpi-value">1.2rb</div>
          <div className="kpi-meta up">+18% vs bulan lalu</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Isu Ditemukan</div>
          <div className="kpi-value" style={{ color: '#ef4444' }}>5</div>
          <div className="kpi-meta">2 error · 3 warning</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="section-card glass">
        <div className="seo-tabs">
          {[
            { key: 'overview', label: 'Overview',      icon: BarChart2   },
            { key: 'keywords', label: 'Kata Kunci',    icon: TrendingUp  },
            { key: 'issues',   label: 'Isu & Perbaikan', icon: AlertCircle },
          ].map(t => (
            <button
              key={t.key}
              className={`seo-tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="seo-overview">
            <div className="seo-overview-section">
              <div className="seo-section-title">Isu Prioritas Tinggi</div>
              {ISSUES.filter(i => i.status !== 'good').map((issue, idx) => (
                <IssueRow key={idx} {...issue} />
              ))}
            </div>
            <div className="seo-overview-section">
              <div className="seo-section-title">Yang Sudah Baik ✓</div>
              {ISSUES.filter(i => i.status === 'good').map((issue, idx) => (
                <IssueRow key={idx} {...issue} />
              ))}
            </div>
          </div>
        )}

        {tab === 'keywords' && (
          <div className="seo-keywords">
            <div className="seo-kw-header">
              <span>Kata Kunci</span>
              <span>Posisi</span>
              <span>Volume</span>
              <span>Perubahan</span>
            </div>
            {KEYWORDS.map((kw, idx) => (
              <KeywordRow key={idx} {...kw} />
            ))}
            <button className="seo-add-kw">
              <Plus size={13} /> Tambah kata kunci
            </button>
          </div>
        )}

        {tab === 'issues' && (
          <div className="seo-issues-list">
            {ISSUES.map((issue, idx) => (
              <IssueRow key={idx} {...issue} />
            ))}
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className="section-card glass seo-tips-card">
        <div className="seo-section-title" style={{ marginBottom: 16 }}>💡 Tips SEO Cepat</div>
        <div className="seo-tips-grid">
          {[
            { icon: FileText,     tip: 'Tambah meta description minimal 120 karakter di setiap halaman'         },
            { icon: Globe,        tip: 'Buat file sitemap.xml dan daftarkan ke Google Search Console'           },
            { icon: Eye,          tip: 'Tambahkan alt text deskriptif di semua gambar produk'                   },
            { icon: Zap,          tip: 'Kompres gambar di bawah 100KB untuk mempercepat loading'                },
            { icon: Link2,        tip: 'Dapatkan backlink dari marketplace (Shopee, Tokopedia) ke website kamu' },
            { icon: Star,         tip: 'Minta pelanggan untuk review di Google Business Profile'                },
          ].map(({ icon: Icon, tip }, idx) => (
            <div key={idx} className="seo-tip-item">
              <div className="seo-tip-icon"><Icon size={14} /></div>
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
