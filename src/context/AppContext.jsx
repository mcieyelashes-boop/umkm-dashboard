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

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setAuthLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
    setAuthLoading(false)
  }

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  const toggleLang = () => setLang(prev => prev === 'id' ? 'en' : 'id')

  const signOut = async () => {
    await supabase.auth.signOut()
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
