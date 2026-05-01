import { useState, useEffect, useRef } from 'react'
import {
  Zap, Mail, Lock, User, Building2, Eye, EyeOff,
  Sparkles, ArrowRight, Bot, Globe, ShoppingBag,
  Share2, MessageSquare, CreditCard, BarChart3,
  Send, RefreshCw,
} from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import { useApp } from '../context/AppContext.jsx'
import './Auth.css'

/* ── AI feature data ─────────────────────────────────────────────── */
const FEATURES = {
  website: {
    icon: Globe, color: '#7c3aed',
    label: 'Landing Page',
    desc: 'Website profesional yang tampil di Google & bisa dikunjungi siapa saja',
  },
  ecom: {
    icon: ShoppingBag, color: '#2563eb',
    label: 'Toko Online',
    desc: 'Terima pesanan 24/7, kelola produk & stok dari satu dashboard',
  },
  social: {
    icon: Share2, color: '#06b6d4',
    label: 'Social Media',
    desc: 'Jadwalkan konten IG, TikTok, Facebook & analisa performa',
  },
  chat: {
    icon: MessageSquare, color: '#10b981',
    label: 'Chat Customer',
    desc: 'Semua pesan WhatsApp, IG DM & chat website di satu tempat',
  },
  payment: {
    icon: CreditCard, color: '#f59e0b',
    label: 'Payment Gateway',
    desc: 'Terima bayar via QRIS, transfer bank & e-wallet tanpa ribet',
  },
  studio: {
    icon: Sparkles, color: '#ec4899',
    label: 'AI Content Studio',
    desc: 'AI buatkan caption, copywriting & ide konten untuk bisnismu',
  },
  analytics: {
    icon: BarChart3, color: '#6366f1',
    label: 'Analytics',
    desc: 'Pantau traffic, penjualan & performa bisnis secara real-time',
  },
}

/* Keyword → feature mapping */
const KW_MAP = {
  kuliner:    ['ecom','chat','social','payment'],
  makanan:    ['ecom','chat','payment','website'],
  minuman:    ['ecom','social','payment','chat'],
  restoran:   ['website','chat','social','payment'],
  cafe:       ['website','social','studio','chat'],
  warung:     ['ecom','chat','payment','website'],
  catering:   ['website','chat','payment','social'],
  fashion:    ['ecom','social','studio','website'],
  baju:       ['ecom','social','studio','payment'],
  pakaian:    ['ecom','social','studio','payment'],
  batik:      ['ecom','social','studio','website'],
  sepatu:     ['ecom','social','payment','studio'],
  hijab:      ['ecom','social','studio','payment'],
  kecantikan: ['website','social','chat','studio'],
  salon:      ['website','social','chat','payment'],
  skincare:   ['ecom','social','studio','payment'],
  beauty:     ['ecom','social','studio','chat'],
  kosmetik:   ['ecom','social','studio','payment'],
  jasa:       ['website','chat','payment','studio'],
  freelance:  ['website','chat','payment','studio'],
  konsultan:  ['website','chat','analytics','payment'],
  desain:     ['website','social','studio','payment'],
  foto:       ['website','social','studio','payment'],
  fotografer: ['website','social','studio','payment'],
  konten:     ['social','studio','analytics','website'],
  kreator:    ['social','studio','analytics','website'],
  kesehatan:  ['website','chat','payment','social'],
  apotek:     ['ecom','chat','payment','website'],
  klinik:     ['website','chat','payment','social'],
  elektronik: ['ecom','payment','chat','analytics'],
  gadget:     ['ecom','payment','chat','studio'],
  pertanian:  ['ecom','website','chat','analytics'],
  peternakan: ['ecom','website','chat','analytics'],
  properti:   ['website','chat','analytics','social'],
  pendidikan: ['website','chat','payment','studio'],
  kursus:     ['website','chat','payment','studio'],
  otomotif:   ['website','chat','payment','social'],
  travel:     ['website','social','chat','payment'],
  ekspedisi:  ['website','chat','payment','analytics'],
  toko:       ['ecom','payment','chat','website'],
  jualan:     ['ecom','payment','social','chat'],
  online:     ['ecom','website','social','payment'],
  bisnis:     ['website','ecom','chat','analytics'],
}

function analyzeText(text) {
  const lower = text.toLowerCase()
  const matched = new Set()
  let topic = ''

  for (const [kw, feats] of Object.entries(KW_MAP)) {
    if (lower.includes(kw)) {
      feats.forEach(f => matched.add(f))
      if (!topic) topic = kw
    }
  }

  if (matched.size === 0) {
    ['website', 'ecom', 'chat', 'studio'].forEach(f => matched.add(f))
    topic = 'bisnis'
  }

  return {
    topic,
    features: [...matched].slice(0, 4).map(id => ({ id, ...FEATURES[id] })),
  }
}

/* ── Typewriter hook ─────────────────────────────────────────────── */
function useTypewriter(text, speed = 22) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return displayed
}

/* ── AI Advisor (left panel) ─────────────────────────────────────── */
function AIAdvisor({ onSignUp }) {
  const [input,    setInput]    = useState('')
  const [phase,    setPhase]    = useState('idle')   // idle | typing | done
  const [result,   setResult]   = useState(null)
  const textareaRef = useRef(null)

  const intro = result
    ? `Untuk bisnis "${result.topic}" kamu, ada ${result.features.length} fitur UMKM Hub yang bisa langsung membantu scale up:`
    : ''
  const typedIntro = useTypewriter(phase === 'done' ? intro : '', 18)

  const handleAnalyze = () => {
    if (!input.trim() || phase === 'typing') return
    setPhase('typing')
    setResult(null)
    setTimeout(() => {
      setResult(analyzeText(input))
      setPhase('done')
    }, 1800)
  }

  const handleReset = () => {
    setPhase('idle')
    setResult(null)
    setInput('')
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  return (
    <div className="ai-advisor">
      {/* AI box header */}
      <div className="ai-header">
        <div className="ai-avatar">
          <Bot size={16} />
          <span className="ai-pulse" />
        </div>
        <div>
          <div className="ai-name">UMKM Hub AI</div>
          <div className="ai-status">
            {phase === 'typing' ? 'Menganalisa bisnis kamu...' : 'Siap membantu'}
          </div>
        </div>
        {phase !== 'idle' && (
          <button className="ai-reset" onClick={handleReset} title="Coba lagi">
            <RefreshCw size={13} />
          </button>
        )}
      </div>

      {/* Idle / input phase */}
      {phase === 'idle' && (
        <div className="ai-input-area">
          <p className="ai-prompt-text">
            Ceritakan bisnis kamu — AI kami akan tunjukkan fitur apa yang paling cocok untuk scale up 🚀
          </p>
          <textarea
            ref={textareaRef}
            className="ai-textarea"
            placeholder="Contoh: Saya punya usaha kuliner bakso dengan 2 cabang di Bandung, ingin bisa terima order online..."
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={4}
            maxLength={300}
          />
          <div className="ai-input-footer">
            <span className="ai-char">{input.length}/300</span>
            <button
              className={`ai-analyze-btn ${!input.trim() ? 'ai-btn-disabled' : ''}`}
              onClick={handleAnalyze}
              disabled={!input.trim()}
            >
              <Sparkles size={14} />
              Analisa dengan AI
            </button>
          </div>
        </div>
      )}

      {/* Typing animation */}
      {phase === 'typing' && (
        <div className="ai-thinking">
          <div className="ai-dots">
            <span /><span /><span />
          </div>
          <p className="ai-thinking-text">AI sedang menganalisa bisnis kamu...</p>
        </div>
      )}

      {/* Results */}
      {phase === 'done' && result && (
        <div className="ai-result">
          <p className="ai-intro-text">{typedIntro}</p>

          <div className="ai-features-grid">
            {result.features.map(({ id, icon: Icon, color, label, desc }) => (
              <div key={id} className="ai-feat-card">
                <div className="ai-feat-icon" style={{ background: `${color}18`, color }}>
                  <Icon size={16} />
                </div>
                <div className="ai-feat-body">
                  <div className="ai-feat-label">{label}</div>
                  <div className="ai-feat-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="ai-cta-btn" onClick={onSignUp}>
            <Sparkles size={14} />
            Daftar Gratis & Coba Sekarang
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Right panel — Auth form ─────────────────────────────────────── */
function AuthForm({ initMode, lang }) {
  const [mode,     setMode]     = useState(initMode)
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  const [form, setForm] = useState({ email: '', password: '', owner_name: '', business_name: '' })
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  // Sync when parent changes initMode
  useEffect(() => { setMode(initMode); setError(''); setSuccess('') }, [initMode])

  const isLogin = mode === 'login'
  const id = lang === 'id'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email, password: form.password,
        })
        if (error) setError(error.message)
      } else {
        if (!form.business_name || !form.owner_name) {
          setError(id ? 'Nama bisnis dan pemilik wajib diisi' : 'Business name and owner name are required')
          setLoading(false)
          return
        }
        const { error } = await supabase.auth.signUp({
          email: form.email, password: form.password,
          options: { data: { owner_name: form.owner_name, business_name: form.business_name } },
        })
        if (error) setError(error.message)
        else setSuccess(id
          ? 'Akun berhasil dibuat! Cek email untuk verifikasi.'
          : 'Account created! Check your email to verify.')
      }
    } catch {
      setError(id ? 'Terjadi kesalahan. Coba lagi.' : 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-wrap">
      <div className="auth-form-header">
        <div className="auth-form-icon">
          <Zap size={18} fill="white" />
        </div>
        <h2 className="auth-form-title">
          {isLogin
            ? (id ? 'Selamat Datang' : 'Welcome Back')
            : (id ? 'Buat Akun Gratis' : 'Create Free Account')}
        </h2>
        <p className="auth-form-sub">
          {isLogin
            ? (id ? 'Masuk ke dashboard bisnis kamu' : 'Sign in to your business dashboard')
            : (id ? 'Mulai kelola bisnis UMKM kamu hari ini' : 'Start managing your business today')}
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="auth-field">
              <div className="auth-input-wrap">
                <Building2 size={15} className="auth-input-icon" />
                <input type="text"
                  placeholder={id ? 'Nama Bisnis / Toko' : 'Business / Store Name'}
                  value={form.business_name} onChange={set('business_name')} required />
              </div>
            </div>
            <div className="auth-field">
              <div className="auth-input-wrap">
                <User size={15} className="auth-input-icon" />
                <input type="text"
                  placeholder={id ? 'Nama Pemilik' : 'Owner Name'}
                  value={form.owner_name} onChange={set('owner_name')} required />
              </div>
            </div>
          </>
        )}

        <div className="auth-field">
          <div className="auth-input-wrap">
            <Mail size={15} className="auth-input-icon" />
            <input type="email" placeholder="Email"
              value={form.email} onChange={set('email')} required />
          </div>
        </div>

        <div className="auth-field">
          <div className="auth-input-wrap">
            <Lock size={15} className="auth-input-icon" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder={id ? 'Password (min 6 karakter)' : 'Password (min 6 chars)'}
              value={form.password} onChange={set('password')} required minLength={6}
            />
            <button type="button" className="auth-pass-toggle" onClick={() => setShowPass(p => !p)}>
              {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>

        {error   && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading
            ? (id ? 'Memuat...' : 'Loading...')
            : isLogin ? (id ? 'Masuk' : 'Sign In') : (id ? 'Buat Akun' : 'Create Account')}
          {!loading && <ArrowRight size={15} />}
        </button>
      </form>

      <div className="auth-switch">
        {isLogin
          ? (id ? 'Belum punya akun?' : "Don't have an account?")
          : (id ? 'Sudah punya akun?' : 'Already have an account?')}
        <button className="auth-switch-btn"
          onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(''); setSuccess('') }}>
          {isLogin ? (id ? 'Daftar gratis' : 'Register free') : (id ? 'Masuk' : 'Sign In')}
        </button>
      </div>

      {!isLogin && (
        <p className="auth-terms">
          {id
            ? 'Dengan mendaftar, kamu setuju dengan Syarat & Ketentuan UMKM Hub.'
            : "By registering, you agree to UMKM Hub's Terms of Service."}
        </p>
      )}
    </div>
  )
}

/* ── Main Auth page ──────────────────────────────────────────────── */
export default function Auth() {
  const { lang, toggleLang } = useApp()
  const [rightMode, setRightMode] = useState('login')

  /* When user clicks "Daftar Gratis" on AI result, switch right to register */
  const handleSignUpCta = () => setRightMode('register')

  return (
    <div className="auth-split">
      {/* ── Background shared orbs ── */}
      <div className="auth-bg">
        <div className="auth-orb orb-1" />
        <div className="auth-orb orb-2" />
        <div className="auth-orb orb-3" />
      </div>

      {/* ── Top controls ── */}
      <div className="auth-topbar">
        <div className="auth-brand">
          <div className="auth-brand-logo"><Zap size={16} fill="white" /></div>
          <span className="auth-brand-name">UMKM Hub</span>
        </div>
        <button className="auth-toggle-btn" onClick={toggleLang}>
          <span className={lang === 'id' ? 'active' : ''}>🇮🇩</span>
          <span className="auth-divider">/</span>
          <span className={lang === 'en' ? 'active' : ''}>🇬🇧</span>
        </button>
      </div>

      {/* ══ LEFT — new users ══ */}
      <div className="auth-left">
        <div className="auth-left-inner">
          <div className="auth-left-headline">
            <h1>
              {lang === 'id'
                ? <>Tanya AI, tau persis<br />cara scale up bisnismu <span className="auth-hl">🚀</span></>
                : <>Ask AI, know exactly<br />how to scale your business <span className="auth-hl">🚀</span></>
              }
            </h1>
            <p>
              {lang === 'id'
                ? 'Ceritakan bisnis kamu — AI kami langsung tunjukkan fitur UMKM Hub yang paling relevan untukmu.'
                : 'Tell us about your business — our AI instantly shows you the most relevant UMKM Hub features.'}
            </p>
          </div>

          <AIAdvisor onSignUp={handleSignUpCta} />

          <div className="auth-left-stats">
            <div className="auth-stat"><span className="auth-stat-num">12K+</span><span>Bisnis aktif</span></div>
            <div className="auth-stat-sep" />
            <div className="auth-stat"><span className="auth-stat-num">8</span><span>Fitur terintegrasi</span></div>
            <div className="auth-stat-sep" />
            <div className="auth-stat"><span className="auth-stat-num">Gratis</span><span>Mulai sekarang</span></div>
          </div>
        </div>
      </div>

      {/* ══ RIGHT — registered users ══ */}
      <div className="auth-right">
        <div className="auth-right-inner">
          <AuthForm initMode={rightMode} lang={lang} />
        </div>
      </div>

      <p className="auth-footer">
        © 2026 UMKM Hub · {lang === 'id' ? 'Platform bisnis untuk UMKM Indonesia' : 'Business platform for Indonesian SMBs'}
      </p>
    </div>
  )
}
