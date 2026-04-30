import { useState } from 'react'
import { Zap, Mail, Lock, User, Building2, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase.js'
import { useApp } from '../context/AppContext.jsx'
import './Auth.css'

export default function Auth() {
  const { lang, toggleLang, theme, toggleTheme } = useApp()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    email: '',
    password: '',
    owner_name: '',
    business_name: '',
  })

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (error) setError(error.message)
    } else {
      if (!form.business_name || !form.owner_name) {
        setError(lang === 'id' ? 'Nama bisnis dan pemilik wajib diisi' : 'Business name and owner name are required')
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            owner_name: form.owner_name,
            business_name: form.business_name,
          }
        }
      })
      if (error) setError(error.message)
      else setSuccess(lang === 'id'
        ? 'Akun berhasil dibuat! Cek email untuk verifikasi.'
        : 'Account created! Check your email to verify.'
      )
    }
    setLoading(false)
  }

  const isLogin = mode === 'login'

  return (
    <div className="auth-page">
      {/* Background */}
      <div className="auth-bg">
        <div className="auth-orb orb-1" />
        <div className="auth-orb orb-2" />
        <div className="auth-orb orb-3" />
      </div>

      {/* Top controls */}
      <div className="auth-topbar">
        <div className="auth-brand">
          <div className="auth-brand-logo"><Zap size={18} fill="white" /></div>
          <span className="auth-brand-name">UMKM Hub</span>
        </div>
        <div className="auth-top-actions">
          <button className="auth-toggle-btn" onClick={toggleLang}>
            <span className={lang === 'id' ? 'active' : ''}>🇮🇩</span>
            <span className="auth-divider">/</span>
            <span className={lang === 'en' ? 'active' : ''}>🇬🇧</span>
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="auth-card glass">
        <div className="auth-card-header">
          <div className="auth-card-icon">
            <Sparkles size={22} />
          </div>
          <h1 className="auth-title">
            {isLogin
              ? (lang === 'id' ? 'Selamat Datang' : 'Welcome Back')
              : (lang === 'id' ? 'Daftar Sekarang' : 'Create Account')
            }
          </h1>
          <p className="auth-subtitle">
            {isLogin
              ? (lang === 'id' ? 'Masuk ke dashboard bisnis Anda' : 'Sign in to your business dashboard')
              : (lang === 'id' ? 'Mulai kelola bisnis UMKM Anda' : 'Start managing your UMKM business')
            }
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="auth-field">
                <div className="auth-input-wrap">
                  <Building2 size={16} className="auth-input-icon" />
                  <input
                    type="text"
                    placeholder={lang === 'id' ? 'Nama Bisnis / Toko' : 'Business / Store Name'}
                    value={form.business_name}
                    onChange={set('business_name')}
                    required
                  />
                </div>
              </div>
              <div className="auth-field">
                <div className="auth-input-wrap">
                  <User size={16} className="auth-input-icon" />
                  <input
                    type="text"
                    placeholder={lang === 'id' ? 'Nama Pemilik' : 'Owner Name'}
                    value={form.owner_name}
                    onChange={set('owner_name')}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="auth-field">
            <div className="auth-input-wrap">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={set('email')}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-input-wrap">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder={lang === 'id' ? 'Password (min 6 karakter)' : 'Password (min 6 chars)'}
                value={form.password}
                onChange={set('password')}
                required
                minLength={6}
              />
              <button
                type="button"
                className="auth-pass-toggle"
                onClick={() => setShowPass(p => !p)}
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading
              ? (lang === 'id' ? 'Memuat...' : 'Loading...')
              : isLogin
                ? (lang === 'id' ? 'Masuk' : 'Sign In')
                : (lang === 'id' ? 'Buat Akun' : 'Create Account')
            }
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin
            ? (lang === 'id' ? 'Belum punya akun?' : "Don't have an account?")
            : (lang === 'id' ? 'Sudah punya akun?' : 'Already have an account?')
          }
          <button
            className="auth-switch-btn"
            onClick={() => { setMode(isLogin ? 'register' : 'login'); setError(''); setSuccess('') }}
          >
            {isLogin
              ? (lang === 'id' ? 'Daftar gratis' : 'Register free')
              : (lang === 'id' ? 'Masuk' : 'Sign In')
            }
          </button>
        </div>

        {!isLogin && (
          <p className="auth-terms">
            {lang === 'id'
              ? 'Dengan mendaftar, kamu setuju dengan Syarat & Ketentuan dan Kebijakan Privasi UMKM Hub.'
              : 'By registering, you agree to UMKM Hub\'s Terms of Service and Privacy Policy.'
            }
          </p>
        )}
      </div>

      <p className="auth-footer">
        © 2026 UMKM Hub · {lang === 'id' ? 'Platform bisnis untuk UMKM Indonesia' : 'Business platform for Indonesian SMBs'}
      </p>
    </div>
  )
}
