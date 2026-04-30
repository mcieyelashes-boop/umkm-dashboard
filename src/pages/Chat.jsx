import { useState } from 'react'
import {
  Search, Send, Paperclip, Smile, Phone, Video as VideoIcon,
  MoreVertical, Sparkles, Image as ImageIcon, Check, CheckCheck
} from 'lucide-react'
import { chatMessages, conversation } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import './shared.css'
import './Chat.css'

const platformColors = {
  WhatsApp: '#25d366',
  Instagram: '#ec4899',
  Facebook: '#3b82f6',
  Tokopedia: '#10b981',
  Shopee: '#f97316',
}

export default function Chat() {
  const [activeId, setActiveId] = useState(1)
  const [filter, setFilter] = useState('all')
  const [draft, setDraft] = useState('')
  const { t } = useApp()
  const c = t.chat

  const filtered = filter === 'all'
    ? chatMessages
    : filter === 'unread'
    ? chatMessages.filter(m => m.unread > 0)
    : chatMessages.filter(m => m.platform.toLowerCase() === filter)

  const active = chatMessages.find(m => m.id === activeId) || chatMessages[0]

  const getFilterLabel = (f) => {
    if (f === 'all') return c.all
    if (f === 'unread') return c.unread
    return f.charAt(0).toUpperCase() + f.slice(1)
  }

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>{c.title}</h1>
          <p>{c.subtitle}</p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary"><Sparkles size={14} /> {c.aiAutoReply}</button>
        </div>
      </div>

      <div className="chat-container glass">
        <div className="chat-sidebar">
          <div className="chat-search">
            <Search size={14} />
            <input placeholder={c.searchMsg} />
          </div>
          <div className="chat-filters">
            {['all', 'unread', 'whatsapp', 'instagram'].map((f) => (
              <button
                key={f}
                className={`chat-filter ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {getFilterLabel(f)}
              </button>
            ))}
          </div>
          <div className="chat-list">
            {filtered.map((msg) => (
              <button
                key={msg.id}
                className={`chat-item ${activeId === msg.id ? 'active' : ''}`}
                onClick={() => setActiveId(msg.id)}
              >
                <div className="chat-avatar-wrapper">
                  <div className="chat-avatar">{msg.avatar}</div>
                  {msg.online && <span className="online-dot" />}
                  <span
                    className="platform-mini"
                    style={{ background: platformColors[msg.platform] }}
                  />
                </div>
                <div className="chat-item-content">
                  <div className="chat-item-top">
                    <span className="chat-name">{msg.from}</span>
                    <span className="chat-time">{msg.time}</span>
                  </div>
                  <div className="chat-item-bottom">
                    <span className="chat-preview">{msg.preview}</span>
                    {msg.unread > 0 && <span className="unread-badge">{msg.unread}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="chat-main">
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar-wrapper">
                <div className="chat-avatar lg">{active.avatar}</div>
                {active.online && <span className="online-dot lg" />}
              </div>
              <div>
                <div className="chat-header-name">{active.from}</div>
                <div className="chat-header-meta">
                  <span
                    className="platform-tag"
                    style={{ background: platformColors[active.platform] + '20', color: platformColors[active.platform] }}
                  >
                    {active.platform}
                  </span>
                  <span className="chat-status">
                    {active.online ? `● ${c.online}` : 'Last active 2h ago'}
                  </span>
                </div>
              </div>
            </div>
            <div className="chat-header-actions">
              <button className="icon-btn"><Phone size={16} /></button>
              <button className="icon-btn"><VideoIcon size={16} /></button>
              <button className="icon-btn"><MoreVertical size={16} /></button>
            </div>
          </div>

          <div className="chat-messages">
            <div className="chat-day">Today</div>
            {conversation.map((msg) => (
              <div key={msg.id} className={`message ${msg.from === 'me' ? 'me' : 'them'}`}>
                <div className="message-bubble">
                  <p>{msg.text}</p>
                  <div className="message-time">
                    {msg.time}
                    {msg.from === 'me' && <CheckCheck size={11} />}
                  </div>
                </div>
              </div>
            ))}

            <div className="ai-suggest-bar">
              <Sparkles size={12} />
              <span>{c.aiSuggest}:</span>
              <button className="ai-quick-reply">Ya, masih ready 👍</button>
              <button className="ai-quick-reply">Cek stok dulu ya</button>
              <button className="ai-quick-reply">Kirim katalog</button>
            </div>
          </div>

          <div className="chat-input">
            <button className="icon-btn"><Paperclip size={16} /></button>
            <button className="icon-btn"><ImageIcon size={16} /></button>
            <input
              placeholder={c.typeMsg}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button className="icon-btn"><Smile size={16} /></button>
            <button className="send-btn">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
