import { createContext, useContext, useState, useEffect } from 'react'
import translations from '../i18n/translations.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('umkm-theme') || 'dark')
  const [lang, setLang] = useState(() => localStorage.getItem('umkm-lang') || 'id')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
    } else {
      root.classList.remove('light')
    }
    localStorage.setItem('umkm-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('umkm-lang', lang)
  }, [lang])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  const toggleLang = () => setLang(prev => prev === 'id' ? 'en' : 'id')

  const t = translations[lang]

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, toggleLang, t }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
