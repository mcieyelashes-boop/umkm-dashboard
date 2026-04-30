import { Search, Bell, Wallet as WalletIcon, Plus, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { businessProfile } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import './TopBar.css'

const formatRupiah = (n) => 'Rp ' + n.toLocaleString('id-ID')

export default function TopBar() {
  const { theme, toggleTheme, lang, toggleLang, t } = useApp()

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={16} />
        <input placeholder={t.topbar.search} />
        <kbd>⌘K</kbd>
      </div>

      <div className="topbar-actions">
        {/* Language toggle */}
        <button className="topbar-toggle-btn" onClick={toggleLang} title="Toggle language">
          <span className={`lang-flag ${lang === 'id' ? 'active' : ''}`}>🇮🇩</span>
          <span className="lang-divider">/</span>
          <span className={`lang-flag ${lang === 'en' ? 'active' : ''}`}>🇬🇧</span>
        </button>

        {/* Theme toggle */}
        <button className="topbar-icon-btn theme-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <Link to="/wallet" className="topbar-wallet">
          <div className="wallet-icon">
            <WalletIcon size={16} />
          </div>
          <div className="wallet-info">
            <span className="wallet-label">{t.topbar.balance}</span>
            <span className="wallet-amount">{formatRupiah(businessProfile.walletBalance)}</span>
          </div>
          <button className="wallet-add" title="Top up">
            <Plus size={14} />
          </button>
        </Link>

        <button className="topbar-icon-btn">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>

        <div className="topbar-profile">
          <div className="topbar-avatar">{businessProfile.avatar}</div>
        </div>
      </div>
    </header>
  )
}
