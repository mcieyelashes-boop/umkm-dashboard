import { Search, Bell, Wallet as WalletIcon, Plus, Sun, Moon, LogOut, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { formatRupiah } from '../utils/currency.js'
import { getInitials } from '../utils/string.js'
import './TopBar.css'

export default function TopBar({ onMenuClick }) {
  const { theme, toggleTheme, lang, toggleLang, t, profile, signOut } = useApp()

  const walletBalance = profile?.wallet_balance ?? 0
  const avatarText = profile?.avatar || getInitials(profile?.owner_name || profile?.business_name || '')

  return (
    <header className="topbar">
      {/* Mobile hamburger */}
      <button className="topbar-hamburger" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={20} />
      </button>

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

        {/* Wallet balance */}
        <Link to="/wallet" className="topbar-wallet">
          <div className="wallet-icon">
            <WalletIcon size={16} />
          </div>
          <div className="wallet-info">
            <span className="wallet-label">{t.topbar.balance}</span>
            <span className="wallet-amount">{formatRupiah(walletBalance)}</span>
          </div>
          <button className="wallet-add" title="Top up" onClick={(e) => e.preventDefault()}>
            <Plus size={14} />
          </button>
        </Link>

        {/* Notifications */}
        <button className="topbar-icon-btn">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>

        {/* Profile + sign out */}
        <div className="topbar-profile-wrap">
          <div className="topbar-avatar">{avatarText}</div>
          <button className="topbar-icon-btn signout-btn" onClick={signOut} title={lang === 'id' ? 'Keluar' : 'Sign out'}>
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  )
}
