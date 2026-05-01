import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight, ArrowLeft, Check, Sparkles, Zap, Globe,
  ShoppingBag, Utensils, Briefcase, Palette, Heart, Package,
  Star, Crown, Rocket, CheckCircle2, X,
} from 'lucide-react'
import { useApp } from '../context/AppContext.jsx'
import { supabase } from '../lib/supabase.js'
import './Onboarding.css'

/* ─── 3D Particle Canvas ────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef(null)
  const mouseRef  = useRef({ x: 0, y: 0 })
  const animRef   = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouse)

    /* Generate particles in 3D space */
    const N = 70
    const pts = Array.from({ length: N }, () => ({
      ox: (Math.random() - 0.5) * 800,
      oy: (Math.random() - 0.5) * 600,
      oz: (Math.random() - 0.5) * 600,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      vz: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 1.8 + 0.6,
    }))

    let angle = 0

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      angle += 0.0018

      const mx = (mouseRef.current.x / canvas.width  - 0.5) * 0.4
      const my = (mouseRef.current.y / canvas.height - 0.5) * 0.4

      /* Compute screen-space projected points */
      const fov = 500
      const cx  = canvas.width  / 2
      const cy  = canvas.height / 2

      const projected = pts.map(p => {
        /* Move particle */
        p.ox += p.vx
        p.oy += p.vy
        p.oz += p.vz

        /* Soft walls */
        if (Math.abs(p.ox) > 420) p.vx *= -1
        if (Math.abs(p.oy) > 350) p.vy *= -1
        if (Math.abs(p.oz) > 350) p.vz *= -1

        /* Auto-rotate Y + mouse parallax */
        const cosA = Math.cos(angle + mx)
        const sinA = Math.sin(angle + mx)
        const cosB = Math.cos(my)
        const sinB = Math.sin(my)

        const rx =  p.ox * cosA + p.oz * sinA
        const rz = -p.ox * sinA + p.oz * cosA
        const ry =  p.oy * cosB - rz  * sinB
        const rz2=  p.oy * sinB + rz  * cosB

        const z    = rz2 + 700
        const sc   = fov / z
        const sx   = cx + rx * sc
        const sy   = cy + ry * sc
        const alpha = Math.min(0.75, Math.max(0.08, (700 - rz2) / 700))

        return { sx, sy, sc, alpha, z }
      })

      /* Draw edges between nearby points */
      const MAX_DIST = 130
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = projected[i]
          const b = projected[j]
          const d = Math.hypot(a.sx - b.sx, a.sy - b.sy)
          if (d < MAX_DIST) {
            const t = 1 - d / MAX_DIST
            ctx.beginPath()
            ctx.moveTo(a.sx, a.sy)
            ctx.lineTo(b.sx, b.sy)
            ctx.strokeStyle = `rgba(124,58,237,${t * 0.22})`
            ctx.lineWidth   = t * 0.8
            ctx.stroke()
          }
        }
      }

      /* Draw nodes */
      projected.forEach(({ sx, sy, sc, alpha }) => {
        const r = Math.max(0.5, sc * 2.2)
        const grd = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 2)
        grd.addColorStop(0, `rgba(167,139,250,${alpha})`)
        grd.addColorStop(1, `rgba(99,102,241,0)`)
        ctx.beginPath()
        ctx.arc(sx, sy, r * 2, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()
      })

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return <canvas ref={canvasRef} className="ob-canvas" />
}

/* ─── 3D Tilt Card wrapper ──────────────────────────────────────── */
function TiltCard({ children, className = '', selected, onClick, disabled }) {
  const ref = useRef(null)

  const onMove = useCallback((e) => {
    const el   = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x    = e.clientX - rect.left
    const y    = e.clientY - rect.top
    const cx   = rect.width  / 2
    const cy   = rect.height / 2
    const rx   = ((y - cy) / cy) * -10
    const ry   = ((x - cx) / cx) *  10
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`

    /* Shine */
    const shine = el.querySelector('.ob-shine')
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12) 0%, transparent 60%)`
    }
  }, [])

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    const shine = el.querySelector('.ob-shine')
    if (shine) shine.style.background = 'none'
  }, [])

  return (
    <div
      ref={ref}
      className={`ob-tilt ${className} ${selected ? 'ob-selected' : ''} ${disabled ? 'ob-disabled' : ''}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={disabled ? undefined : onClick}
    >
      <div className="ob-shine" />
      {children}
    </div>
  )
}

/* ─── Step 1: Business goal ─────────────────────────────────────── */
const GOALS = [
  { id: 'retail',    icon: ShoppingBag, label: 'Toko & Retail',        sub: 'Jualan produk fisik' },
  { id: 'culinary',  icon: Utensils,    label: 'Kuliner & F&B',         sub: 'Makanan, minuman, catering' },
  { id: 'service',   icon: Briefcase,   label: 'Jasa & Konsultasi',     sub: 'Freelance, jasa profesional' },
  { id: 'creative',  icon: Palette,     label: 'Kreatif & Digital',     sub: 'Desainer, konten kreator' },
  { id: 'health',    icon: Heart,       label: 'Kesehatan & Kecantikan',sub: 'Salon, klinik, wellness' },
  { id: 'other',     icon: Package,     label: 'Bisnis Lainnya',         sub: 'Kategori lain' },
]

function Step1({ value, onChange }) {
  return (
    <div className="ob-step ob-step-goals">
      <div className="ob-step-header">
        <div className="ob-step-badge"><Sparkles size={13} /> Langkah 1 dari 3</div>
        <h2 className="ob-step-title">Bisnis kamu bergerak di bidang apa? <span>🚀</span></h2>
        <p className="ob-step-sub">Pilih kategori yang paling sesuai dengan bisnis kamu</p>
      </div>

      <div className="ob-goals-grid">
        {GOALS.map(({ id, icon: Icon, label, sub }) => (
          <TiltCard
            key={id}
            selected={value === id}
            onClick={() => onChange(id)}
          >
            <div className="ob-goal-icon">
              <Icon size={22} />
            </div>
            <div className="ob-goal-label">{label}</div>
            <div className="ob-goal-sub">{sub}</div>
            {value === id && <div className="ob-goal-check"><Check size={12} /></div>}
          </TiltCard>
        ))}
      </div>
    </div>
  )
}

/* ─── Step 2: Plan selection ────────────────────────────────────── */
const FREE_FEATURES = [
  'Landing page bisnis',
  'Dashboard & analytics dasar',
  'Chat customer (100 pesan/bln)',
  '1 toko online (10 produk)',
  'Subdomain gratis',
]

const PRO_FEATURES = [
  'Semua fitur Free',
  'AI Content Studio',
  'Integrasi Tokopedia & Shopee',
  'WhatsApp Business',
  'Analytics lengkap & export',
  'Custom domain',
  'Chat unlimited',
  'Support prioritas',
]

function Step2({ value, onChange }) {
  return (
    <div className="ob-step ob-step-plans">
      <div className="ob-step-header">
        <div className="ob-step-badge"><Zap size={13} /> Langkah 2 dari 3</div>
        <h2 className="ob-step-title">Pilih paket yang cocok <span>✨</span></h2>
        <p className="ob-step-sub">Mulai gratis, upgrade kapan saja</p>
      </div>

      <div className="ob-plans-grid">
        {/* Free Plan */}
        <TiltCard selected={value === 'free'} onClick={() => onChange('free')}>
          <div className="ob-plan-head">
            <div className="ob-plan-icon-wrap ob-plan-icon-free"><Star size={18} /></div>
            <div>
              <div className="ob-plan-name">Free</div>
              <div className="ob-plan-price">Gratis selamanya</div>
            </div>
            {value === 'free' && <div className="ob-plan-check"><Check size={12} /></div>}
          </div>
          <div className="ob-plan-features">
            {FREE_FEATURES.map(f => (
              <div key={f} className="ob-plan-feat">
                <CheckCircle2 size={13} className="ob-feat-ok" />
                <span>{f}</span>
              </div>
            ))}
          </div>
          <div className="ob-plan-footer">Cocok untuk memulai</div>
        </TiltCard>

        {/* Pro Plan */}
        <TiltCard selected={value === 'pro'} onClick={() => onChange('pro')} className="ob-tilt-pro">
          <div className="ob-plan-badge-top">Populer</div>
          <div className="ob-plan-head">
            <div className="ob-plan-icon-wrap ob-plan-icon-pro"><Crown size={18} /></div>
            <div>
              <div className="ob-plan-name">Pro</div>
              <div className="ob-plan-price">Rp&thinsp;149.000<span>/bln</span></div>
            </div>
            {value === 'pro' && <div className="ob-plan-check"><Check size={12} /></div>}
          </div>
          <div className="ob-plan-features">
            {PRO_FEATURES.map(f => (
              <div key={f} className="ob-plan-feat">
                <CheckCircle2 size={13} className="ob-feat-ok ob-feat-pro" />
                <span>{f}</span>
              </div>
            ))}
          </div>
          <div className="ob-plan-footer ob-plan-footer-pro">Untuk bisnis yang serius berkembang</div>
        </TiltCard>
      </div>

      <p className="ob-plans-note">Kamu akan mulai dengan paket Free. Upgrade ke Pro bisa dilakukan kapan saja dari menu Pengaturan.</p>
    </div>
  )
}

/* ─── Step 3: Details ───────────────────────────────────────────── */
function Step3({ profile, tagline, setTagline, wantsWebsite, setWantsWebsite }) {
  return (
    <div className="ob-step ob-step-details">
      <div className="ob-step-header">
        <div className="ob-step-badge"><Globe size={13} /> Langkah 3 dari 3</div>
        <h2 className="ob-step-title">Lengkapi profil bisnis <span>📝</span></h2>
        <p className="ob-step-sub">Informasi ini akan ditampilkan di halaman bisnismu</p>
      </div>

      <div className="ob-details-card glass">
        {/* Business name — read-only */}
        <div className="ob-field">
          <label>Nama Bisnis</label>
          <div className="ob-readonly">
            <Sparkles size={14} />
            <span>{profile?.business_name || '—'}</span>
            <CheckCircle2 size={14} className="ob-readonly-check" />
          </div>
        </div>

        {/* Tagline */}
        <div className="ob-field">
          <label>Tagline / Deskripsi Singkat</label>
          <input
            type="text"
            className="ob-input"
            placeholder="Contoh: Produk batik premium pilihan keluarga Indonesia"
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            maxLength={80}
          />
          <span className="ob-char">{tagline.length}/80</span>
        </div>

        {/* Landing page toggle */}
        <div className="ob-field">
          <label>Landing Page</label>
          <div className="ob-toggle-group">
            <button
              className={`ob-toggle-btn ${wantsWebsite ? 'ob-toggle-on' : ''}`}
              onClick={() => setWantsWebsite(true)}
            >
              <Globe size={14} />
              Ya, buat sekarang
            </button>
            <button
              className={`ob-toggle-btn ${!wantsWebsite ? 'ob-toggle-on' : ''}`}
              onClick={() => setWantsWebsite(false)}
            >
              <X size={14} />
              Lewati dulu
            </button>
          </div>
          <p className="ob-toggle-hint">
            {wantsWebsite
              ? 'Landing page akan disiapkan otomatis — bisa diedit kapan saja.'
              : 'Kamu bisa membuat landing page nanti dari menu Website.'}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Step 4: Success ───────────────────────────────────────────── */
function Step4({ onDone, businessGoal, plan }) {
  const goal = GOALS.find(g => g.id === businessGoal)

  return (
    <div className="ob-step ob-step-done">
      <div className="ob-done-icon">
        <Rocket size={36} />
        <div className="ob-done-ring ob-ring1" />
        <div className="ob-done-ring ob-ring2" />
        <div className="ob-done-ring ob-ring3" />
      </div>
      <h2 className="ob-step-title ob-done-title">Bisnis kamu siap! 🎉</h2>
      <p className="ob-step-sub">Selamat datang di UMKM Hub. Dashboard kamu sudah siap digunakan.</p>

      <div className="ob-done-summary">
        <div className="ob-done-item">
          {goal && <goal.icon size={16} />}
          <span>{goal?.label || 'Bisnis'}</span>
        </div>
        <div className="ob-done-sep" />
        <div className="ob-done-item">
          {plan === 'pro' ? <Crown size={16} /> : <Star size={16} />}
          <span>Paket {plan === 'pro' ? 'Pro' : 'Free'}</span>
        </div>
      </div>

      <button className="ob-cta-btn" onClick={onDone}>
        Mulai Gunakan Dashboard
        <ArrowRight size={16} />
      </button>
    </div>
  )
}

/* ─── Main Onboarding ────────────────────────────────────────────── */
export default function Onboarding() {
  const { profile, fetchProfile, user } = useApp()
  const navigate = useNavigate()

  const [step,         setStep]         = useState(1)
  const [businessGoal, setBusinessGoal] = useState('')
  const [plan,         setPlan]         = useState('free')
  const [tagline,      setTagline]      = useState('')
  const [wantsWebsite, setWantsWebsite] = useState(true)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [animKey,      setAnimKey]      = useState(0)

  /* Trigger slide-in animation on step change */
  const goStep = (n) => {
    setAnimKey(k => k + 1)
    setStep(n)
  }

  const canNext = () => {
    if (step === 1) return businessGoal !== ''
    if (step === 2) return plan !== ''
    return true
  }

  const handleFinish = async () => {
    setLoading(true)
    setError('')
    try {
      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          onboarded:     true,
          business_goal: businessGoal,
          selected_plan: plan,
          tagline,
          wants_website: wantsWebsite,
        })
        .eq('id', user.id)

      if (dbError) {
        setError('Gagal menyimpan. Coba lagi.')
        setLoading(false)
        return
      }

      await fetchProfile(user.id)
      goStep(4)
    } catch {
      setError('Terjadi kesalahan. Coba lagi.')
      setLoading(false)
    }
  }

  const handleDone = () => navigate('/')

  const TOTAL = 3

  return (
    <div className="ob-root">
      <ParticleField />

      {/* Orb accents */}
      <div className="ob-orb ob-orb1" />
      <div className="ob-orb ob-orb2" />
      <div className="ob-orb ob-orb3" />

      <div className="ob-shell">
        {/* Brand */}
        <div className="ob-brand">
          <div className="ob-brand-logo"><Zap size={18} fill="white" /></div>
          <span className="ob-brand-name">UMKM Hub</span>
        </div>

        {/* Progress bar (steps 1-3 only) */}
        {step <= TOTAL && (
          <div className="ob-progress">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <div
                key={i}
                className={`ob-progress-seg ${i + 1 <= step ? 'ob-progress-done' : ''}`}
              />
            ))}
          </div>
        )}

        {/* Step content */}
        <div className="ob-content" key={animKey}>
          {step === 1 && <Step1 value={businessGoal} onChange={setBusinessGoal} />}
          {step === 2 && <Step2 value={plan} onChange={setPlan} />}
          {step === 3 && (
            <Step3
              profile={profile}
              tagline={tagline} setTagline={setTagline}
              wantsWebsite={wantsWebsite} setWantsWebsite={setWantsWebsite}
            />
          )}
          {step === 4 && <Step4 onDone={handleDone} businessGoal={businessGoal} plan={plan} />}
        </div>

        {/* Error */}
        {error && (
          <div className="ob-error">{error}</div>
        )}

        {/* Navigation buttons */}
        {step <= TOTAL && (
          <div className="ob-nav">
            {step > 1 ? (
              <button className="ob-back-btn" onClick={() => goStep(step - 1)}>
                <ArrowLeft size={15} /> Kembali
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL ? (
              <button
                className={`ob-next-btn ${!canNext() ? 'ob-next-disabled' : ''}`}
                onClick={() => canNext() && goStep(step + 1)}
                disabled={!canNext()}
              >
                Lanjut <ArrowRight size={15} />
              </button>
            ) : (
              <button
                className="ob-next-btn"
                onClick={handleFinish}
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Selesai & Mulai'}
                {!loading && <ArrowRight size={15} />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
