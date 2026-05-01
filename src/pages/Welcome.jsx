import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, ArrowRight, Globe, ShoppingBag, MessageSquare, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import LogoMark from '../components/LogoMark.jsx'
import './Welcome.css'

const PERKS = [
  { icon: Globe,         color: '#7c3aed', text: 'Landing page bisnis siap dalam menit' },
  { icon: ShoppingBag,   color: '#2563eb', text: 'Toko online dengan ribuan produk' },
  { icon: MessageSquare, color: '#10b981', text: 'Semua chat customer di satu tempat' },
  { icon: Sparkles,      color: '#ec4899', text: 'AI Content Studio untuk konten viral' },
]

export default function Welcome() {
  const navigate   = useNavigate()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [dots,   setDots]   = useState('')

  /* Animate dots while loading */
  useEffect(() => {
    if (status !== 'loading') return
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 420)
    return () => clearInterval(id)
  }, [status])

  /* Exchange PKCE code → session, or check existing session */
  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search)
      const code   = params.get('code')

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) { setStatus('error'); return }
      } else {
        /* Legacy hash flow — Supabase handles it automatically, just check session */
        const { data } = await supabase.auth.getSession()
        if (!data.session) { setStatus('error'); return }
      }

      /* Small pause for animation effect */
      setTimeout(() => setStatus('success'), 600)
    }
    run()
  }, [])

  const handleContinue = () => navigate('/')

  /* ── Loading state ── */
  if (status === 'loading') {
    return (
      <div className="wlc-root">
        <div className="wlc-bg">
          <div className="wlc-orb wlc-orb1" />
          <div className="wlc-orb wlc-orb2" />
        </div>
        <div className="wlc-card">
          <LogoMark size={44} animate />
          <p className="wlc-loading-text">Memverifikasi email{dots}</p>
        </div>
      </div>
    )
  }

  /* ── Error state ── */
  if (status === 'error') {
    return (
      <div className="wlc-root">
        <div className="wlc-bg">
          <div className="wlc-orb wlc-orb1" />
          <div className="wlc-orb wlc-orb2" />
        </div>
        <div className="wlc-card">
          <LogoMark size={44} />
          <h2 className="wlc-title" style={{ color: '#f87171' }}>Link tidak valid</h2>
          <p className="wlc-sub">Link verifikasi sudah kadaluarsa atau sudah digunakan. Silakan login dan minta email verifikasi baru.</p>
          <button className="wlc-btn" onClick={() => navigate('/auth')}>
            Kembali ke Login <ArrowRight size={15} />
          </button>
        </div>
      </div>
    )
  }

  /* ── Success state ── */
  return (
    <div className="wlc-root">
      <div className="wlc-bg">
        <div className="wlc-orb wlc-orb1" />
        <div className="wlc-orb wlc-orb2" />
        <div className="wlc-orb wlc-orb3" />
      </div>

      <div className="wlc-card wlc-card-success">
        {/* Check ring */}
        <div className="wlc-check-wrap">
          <div className="wlc-ring wlc-ring1" />
          <div className="wlc-ring wlc-ring2" />
          <div className="wlc-check-icon">
            <CheckCircle2 size={36} />
          </div>
        </div>

        <LogoMark size={36} className="wlc-logo" />
        <h1 className="wlc-title">Email Terverifikasi! 🎉</h1>
        <p className="wlc-sub">
          Selamat! Akun UMKM Hub kamu sudah aktif.<br />
          Saatnya mulai membangun bisnis digital yang profesional.
        </p>

        {/* Perks */}
        <div className="wlc-perks">
          {PERKS.map(({ icon: Icon, color, text }) => (
            <div key={text} className="wlc-perk">
              <div className="wlc-perk-icon" style={{ background: `${color}18`, color }}>
                <Icon size={15} />
              </div>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <button className="wlc-btn" onClick={handleContinue}>
          <Sparkles size={15} />
          Mulai Gunakan UMKM Hub
          <ArrowRight size={15} />
        </button>

        <p className="wlc-footer">
          © 2026 UMKM Hub · Platform bisnis untuk UMKM Indonesia
        </p>
      </div>
    </div>
  )
}
