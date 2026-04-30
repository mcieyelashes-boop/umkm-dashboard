import { useState } from 'react'
import {
  Sparkles, Video, Image as ImageIcon, PenLine, Mic, Palette, User,
  Play, Download, Wand2, Clock, Check, Zap, ChevronRight, Wallet as WalletIcon
} from 'lucide-react'
import { aiServices, recentVideos, businessProfile } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import './shared.css'
import './ContentStudio.css'

const formatRupiah = (n) => 'Rp ' + n.toLocaleString('id-ID')

const serviceIcons = {
  video: Video, image: ImageIcon, pen: PenLine,
  mic: Mic, palette: Palette, user: User,
}

const gradientMap = {
  primary: 'linear-gradient(135deg, #6366f1, #ec4899)',
  cyan: 'linear-gradient(135deg, #06b6d4, #6366f1)',
  emerald: 'linear-gradient(135deg, #10b981, #06b6d4)',
  amber: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  pink: 'linear-gradient(135deg, #ec4899, #a855f7)',
  violet: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
}

const videoGradients = [
  'linear-gradient(135deg, #6366f1, #ec4899)',
  'linear-gradient(135deg, #f59e0b, #ec4899)',
  'linear-gradient(135deg, #06b6d4, #6366f1)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
]

export default function ContentStudio() {
  const [prompt, setPrompt] = useState('')
  const [duration, setDuration] = useState(30)
  const [style, setStyle] = useState('modern')
  const { t } = useApp()
  const s = t.studio

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>
            {s.title}
            <span className="ai-tag"><Sparkles size={11} /> AI Powered</span>
          </h1>
          <p>{s.subtitle}</p>
        </div>
        <div className="page-actions">
          <div className="balance-pill">
            <WalletIcon size={12} />
            <span>{s.balanceLabel} {formatRupiah(businessProfile.walletBalance)}</span>
          </div>
        </div>
      </div>

      <div className="studio-hero glass">
        <div className="studio-hero-bg" />
        <div className="studio-hero-content">
          <div className="studio-tabs">
            <button className="studio-tab active">
              <Video size={14} /> {s.videoAI}
            </button>
            <button className="studio-tab">
              <ImageIcon size={14} /> {s.imageAI}
            </button>
            <button className="studio-tab">
              <PenLine size={14} /> {s.copywriting}
            </button>
            <button className="studio-tab">
              <Mic size={14} /> {s.voiceOver}
            </button>
          </div>

          <div className="studio-form">
            <div className="form-group">
              <label className="form-label">{s.videoDesc}</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={s.videoPlaceholder}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{s.duration}</label>
                <div className="pill-group">
                  {[15, 30, 60, 90].map((d) => (
                    <button
                      key={d}
                      className={`pill ${duration === d ? 'active' : ''}`}
                      onClick={() => setDuration(d)}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{s.style}</label>
                <div className="pill-group">
                  {['modern', 'elegan', 'cinematic', 'fun'].map((st) => (
                    <button
                      key={st}
                      className={`pill ${style === st ? 'active' : ''}`}
                      onClick={() => setStyle(st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">{s.aspectRatio}</label>
                <div className="pill-group">
                  <button className="pill active">9:16 Reels</button>
                  <button className="pill">16:9 YouTube</button>
                  <button className="pill">1:1 Square</button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{s.voiceOverLabel}</label>
                <div className="pill-group">
                  <button className="pill active">Female ID</button>
                  <button className="pill">Male ID</button>
                  <button className="pill">No VO</button>
                </div>
              </div>
            </div>

            <div className="studio-generate-bar">
              <div className="generate-cost">
                <div className="cost-label">{s.generateCost}</div>
                <div className="cost-value">{formatRupiah(35000)}</div>
                <div className="cost-meta">{s.poweredBy}</div>
              </div>
              <button className="generate-btn">
                <Wand2 size={16} />
                {s.generateBtn}
                <Sparkles size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="studio-preview">
          <div className="preview-frame">
            <div className="preview-glow" />
            <div className="preview-content">
              <Sparkles size={40} className="preview-sparkle" />
              <div className="preview-title">{s.previewTitle}</div>
              <p className="preview-subtitle">{s.previewSubtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="services-section">
        <div className="section-header" style={{ marginBottom: 14 }}>
          <div>
            <div className="section-title">{s.allServices}</div>
            <div className="section-subtitle">{s.servicesSub}</div>
          </div>
        </div>
        <div className="services-grid">
          {aiServices.map((svc) => {
            const Icon = serviceIcons[svc.icon] || Sparkles
            return (
              <div key={svc.id} className="service-card glass">
                {svc.popular && <span className="popular-tag"><Zap size={10} /> {s.popular}</span>}
                <div className="service-icon" style={{ background: gradientMap[svc.gradient] }}>
                  <Icon size={20} color="#fff" />
                </div>
                <div className="service-name">{svc.name}</div>
                <div className="service-provider">by {svc.provider}</div>
                <p className="service-desc">{svc.description}</p>
                <div className="service-bottom">
                  <span className="service-price">{svc.price}</span>
                  <button className="service-btn">
                    {s.try} <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="recent-section">
        <div className="section-header" style={{ marginBottom: 14 }}>
          <div>
            <div className="section-title">{s.recentContent}</div>
            <div className="section-subtitle">{s.recentSub}</div>
          </div>
          <button className="btn-ghost">{s.viewAll}</button>
        </div>
        <div className="recent-grid">
          {recentVideos.map((v, idx) => (
            <div key={v.id} className="recent-card glass">
              <div className="recent-thumb" style={{ background: videoGradients[idx % videoGradients.length] }}>
                {v.status === 'processing' ? (
                  <div className="processing">
                    <div className="spinner" />
                    <span>Generating...</span>
                  </div>
                ) : (
                  <>
                    <button className="play-btn">
                      <Play size={20} fill="white" />
                    </button>
                    <span className="duration">{v.duration}</span>
                  </>
                )}
              </div>
              <div className="recent-content">
                <div className="recent-title">{v.title}</div>
                <div className="recent-meta">
                  <span><Clock size={11} /> {v.date}</span>
                  <span className="recent-cost">{formatRupiah(v.cost)}</span>
                </div>
                {v.status === 'completed' && (
                  <div className="recent-actions">
                    <button className="btn-ghost" style={{ padding: '6px 10px', fontSize: 11 }}>
                      <Download size={11} /> {s.download}
                    </button>
                    <button className="btn-ghost" style={{ padding: '6px 10px', fontSize: 11 }}>
                      {s.share}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
