import {
  Instagram, Music2, Facebook, Youtube, Heart, MessageCircle,
  Share2, Plus, Calendar, Sparkles, Image as ImageIcon, Video, TrendingUp
} from 'lucide-react'
import { socialAccounts, scheduledPosts } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import './shared.css'
import './Social.css'

const platformIcon = {
  instagram: Instagram,
  tiktok: Music2,
  facebook: Facebook,
  youtube: Youtube,
}

const formatNumber = (n) => {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toString()
}

export default function Social() {
  const { t } = useApp()
  const s = t.social

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>{s.title}</h1>
          <p>{s.subtitle}</p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary"><Calendar size={14} /> {s.calendar}</button>
          <button className="btn-primary"><Plus size={14} /> {s.createContent}</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi glass">
          <div className="kpi-label">{s.totalFollowers}</div>
          <div className="kpi-value">60.0K</div>
          <div className="kpi-meta up">{s.weeklyGain}</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">{s.avgEngagement}</div>
          <div className="kpi-value">5.0%</div>
          <div className="kpi-meta up">{s.aboveAvg}</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">{s.postsMonth}</div>
          <div className="kpi-value">42</div>
          <div className="kpi-meta">12 {s.scheduled}</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">{s.reach}</div>
          <div className="kpi-value">128K</div>
          <div className="kpi-meta up">+32%</div>
        </div>
      </div>

      <div className="social-accounts">
        {socialAccounts.map((acc) => {
          const Icon = platformIcon[acc.icon] || Instagram
          return (
            <div key={acc.platform} className="social-card glass">
              <div className="social-card-top">
                <div className="social-icon" style={{ background: acc.color }}>
                  <Icon size={20} color="#fff" />
                </div>
                <button className="social-toggle">
                  <span className="dot-active" /> Active
                </button>
              </div>
              <div className="social-platform">{acc.platform}</div>
              <div className="social-handle">{acc.handle}</div>
              <div className="social-stats">
                <div className="social-stat">
                  <div className="ss-label">{s.followers}</div>
                  <div className="ss-value">{formatNumber(acc.followers)}</div>
                </div>
                <div className="social-stat">
                  <div className="ss-label">{s.engagement}</div>
                  <div className="ss-value">{acc.engagement}%</div>
                </div>
                <div className="social-stat">
                  <div className="ss-label">{s.posts}</div>
                  <div className="ss-value">{acc.posts}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="social-grid">
        <div className="section-card glass">
          <div className="section-header">
            <div>
              <div className="section-title">{s.schedule}</div>
              <div className="section-subtitle">{scheduledPosts.length} {s.scheduleSub}</div>
            </div>
            <button className="btn-ghost"><Calendar size={14} /></button>
          </div>
          <div className="scheduled-list">
            {scheduledPosts.map((post) => (
              <div key={post.id} className="scheduled-item">
                <div className="scheduled-thumb">
                  <ImageIcon size={20} color="#94a3b8" />
                </div>
                <div className="scheduled-info">
                  <p className="scheduled-content">{post.content}</p>
                  <div className="scheduled-meta">
                    <span className="scheduled-time">
                      <Calendar size={11} /> {post.scheduledAt}
                    </span>
                    <div className="scheduled-platforms">
                      {post.platforms.map((p) => {
                        const PIcon = platformIcon[p] || Instagram
                        return (
                          <span key={p} className="platform-badge">
                            <PIcon size={10} />
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <span className={`badge ${post.status === 'scheduled' ? 'badge-primary' : 'badge-neutral'}`}>
                  {post.status === 'scheduled' ? s.scheduledFor : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="section-card glass">
          <div className="section-header">
            <div>
              <div className="section-title">AI Content Suggester</div>
              <div className="section-subtitle">Berbasis trend hari ini</div>
            </div>
            <Sparkles size={16} className="sparkle-icon" />
          </div>
          <div className="ai-suggestions">
            <div className="ai-suggest-card">
              <div className="suggest-label">
                <TrendingUp size={11} /> Trending
              </div>
              <p className="suggest-text">
                "Gen Z lagi suka konten 'Day in Life UMKM Owner'. Coba buat reel behind the scene proses produksi batik dengan music trending."
              </p>
              <div className="suggest-actions">
                <button className="btn-primary" style={{ padding: '6px 12px', fontSize: 11 }}>
                  <Video size={11} /> Generate Video
                </button>
                <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: 11 }}>Caption</button>
              </div>
            </div>
            <div className="ai-suggest-card alt">
              <div className="suggest-label">
                <Sparkles size={11} /> Best Time
              </div>
              <p className="suggest-text">
                Audience kamu paling aktif jam 19:30-21:00. Posting di window ini bisa boost engagement +42%.
              </p>
            </div>
            <div className="ai-suggest-card alt2">
              <div className="suggest-label">
                <Heart size={11} /> Format
              </div>
              <p className="suggest-text">
                Carousel 5-7 slides dengan hook pertanyaan + storytelling perform 3x lebih baik dari single image minggu ini.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-card glass">
        <div className="section-header">
          <div>
            <div className="section-title">Top Performing Posts</div>
            <div className="section-subtitle">Engagement tertinggi 30 hari terakhir</div>
          </div>
          <div className="tabs">
            <button className="tab active">{t.common.viewAll}</button>
            <button className="tab">Instagram</button>
            <button className="tab">TikTok</button>
          </div>
        </div>
        <div className="posts-grid">
          {[
            { gradient: 'linear-gradient(135deg, #ec4899, #f59e0b)', likes: 4200, comments: 248, shares: 156, platform: 'instagram', cap: 'Promo flash sale akhir bulan! 40% off batik premium' },
            { gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', likes: 3800, comments: 142, shares: 89, platform: 'tiktok', cap: 'Tutorial styling hijab voal premium ✨' },
            { gradient: 'linear-gradient(135deg, #06b6d4, #10b981)', likes: 2400, comments: 98, shares: 56, platform: 'instagram', cap: 'Behind the scene proses produksi tas kulit handmade' },
            { gradient: 'linear-gradient(135deg, #f59e0b, #ec4899)', likes: 1800, comments: 64, shares: 42, platform: 'facebook', cap: 'Story brand: dari home industry sampai 60K followers' },
          ].map((post, i) => {
            const PIcon = platformIcon[post.platform] || Instagram
            return (
              <div key={i} className="post-card">
                <div className="post-thumb" style={{ background: post.gradient }}>
                  <PIcon size={24} color="#fff" style={{ opacity: 0.4 }} />
                </div>
                <div className="post-content">
                  <p className="post-cap">{post.cap}</p>
                  <div className="post-stats">
                    <span><Heart size={11} /> {formatNumber(post.likes)}</span>
                    <span><MessageCircle size={11} /> {post.comments}</span>
                    <span><Share2 size={11} /> {post.shares}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
