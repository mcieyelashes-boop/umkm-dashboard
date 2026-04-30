import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import translations from '../i18n/translations.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('umkm-theme') || 'dark')
  const [lang, setLang] = useState(() => localStorage.getItem('umkm-lang') || 'id')
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Theme
  useEffect(() => {
    const root = document.documentElement
    theme === 'light' ? root.classList.add('light') : root.classList.remove('light')
    localStorage.setItem('umkm-theme', theme)
  }, [theme])

  // Lang
  useEffect(() => {
    localStorage.setItem('umkm-lang', lang)
  }, [lang])

  // Auth listener — single source of truth, no double fetchProfile on startup
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setAuthLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // PGRST116 = "no rows returned" — expected for brand-new users
    if (error && error.code !== 'PGRST116') {
      console.error('[fetchProfile] error:', error.message)
    }

    setProfile(data ?? null)
    setAuthLoading(false)
  }

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  const toggleLang = () => setLang(prev => prev === 'id' ? 'en' : 'id')

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error('[signOut] error:', error.message)
    setUser(null)
    setProfile(null)
  }

  const t = translations[lang]

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      lang, toggleLang,
      t,
      user, profile, authLoading,
      fetchProfile,
      signOut,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
