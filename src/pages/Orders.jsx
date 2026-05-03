import { useState, useMemo } from 'react'
import {
  Search, Download, Printer, Truck, CheckCircle2,
  XCircle, Clock, AlertCircle, Plus, ChevronDown,
  Eye, Package, RefreshCw, ShoppingBag,
} from 'lucide-react'
import { useOrders, useOrderStats } from '../hooks/useOrders.js'
import { formatRupiah } from '../utils/currency.js'
import './shared.css'
import './Orders.css'

/* ── Channel config ── */
const CHANNEL = {
  shopee:    { label: 'Shopee',    color: '#f97316', bg: '#f9731615' },
  tokopedia: { label: 'Tokopedia', color: '#10b981', bg: '#10b98115' },
  tiktok:    { label: 'TikTok',    color: '#06b6d4', bg: '#06b6d415' },
  website:   { label: 'Website',   color: '#7c3aed', bg: '#7c3aed15' },
  whatsapp:  { label: 'WhatsApp',  color: '#25d366', bg: '#25d36615' },
  instagram: { label: 'Instagram', color: '#ec4899', bg: '#ec489915' },
}

const STATUS = {
  new:        { label: 'Baru',       color: '#6366f1', icon: AlertCircle },
  processing: { label: 'Diproses',   color: '#f59e0b', icon: Clock       },
  shipped:    { label: 'Dikirim',    color: '#06b6d4', icon: Truck        },
  done:       { label: 'Selesai',    color: '#10b981', icon: CheckCircle2 },
  cancelled:  { label: 'Dibatalkan', color: '#ef4444', icon: XCircle      },
}

const TABS = [
  { key: 'all',        label: 'Semua'     },
  { key: 'new',        label: 'Baru'      },
  { key: 'processing', label: 'Diproses'  },
  { key: 'shipped',    label: 'Dikirim'   },
  { key: 'done',       label: 'Selesai'   },
  { key: 'cancelled',  label: 'Dibatalkan'},
]

/* ── New Order Modal ── */
function NewOrderModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', items: '',
    total: '', channel: 'website', note: '',
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.customer_name || !form.items || !form.total) {
      setErr('Nama pelanggan, produk, dan total wajib diisi.')
      return
    }
    setSaving(true)
    const initials = form.customer_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const { error } = await onCreate({
      ...form,
      total: parseInt(form.total.replace(/\D/g, ''), 10) || 0,
      customer_avatar: initials,
    })
    setSaving(false)
    if (error) { setErr(error.message); return }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Order Manual Baru</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-field">
            <label>Nama Pelanggan *</label>
            <input value={form.customer_name} onChange={set('customer_name')} placeholder="Nama lengkap" required />
          </div>
          <div className="modal-field">
            <label>No. Telepon</label>
            <input value={form.customer_phone} onChange={set('customer_phone')} placeholder="08xx-xxxx-xxxx" />
          </div>
          <div className="modal-field">
            <label>Produk / Deskripsi *</label>
            <input value={form.items} onChange={set('items')} placeholder="Kemeja Batik Premium ×2" required />
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>Total (Rp) *</label>
              <input value={form.total} onChange={set('total')} placeholder="570000" required />
            </div>
            <div className="modal-field">
              <label>Channel</label>
              <select value={form.channel} onChange={set('channel')}>
                {Object.entries(CHANNEL).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="modal-field">
            <label>Catatan</label>
            <input value={form.note} onChange={set('note')} placeholder="Minta gift wrap, dll." />
          </div>
          {err && <div className="modal-error">{err}</div>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Menyimpan…' : 'Buat Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Orders() {
  const [tab,      setTab]      = useState('all')
  const [channel,  setChannel]  = useState('all')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState(new Set())
  const [showNew,  setShowNew]  = useState(false)

  const { orders, loading, error, refetch, createOrder, updateStatus } = useOrders()
  const { stats } = useOrderStats()

  const filtered = useMemo(() => orders.filter(o => {
    if (tab !== 'all' && o.status !== tab) return false
    if (channel !== 'all' && o.channel !== channel) return false
    if (search && !o.customer_name?.toLowerCase().includes(search.toLowerCase()) &&
        !o.order_number?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [orders, tab, channel, search])

  const counts = useMemo(() => {
    const c = { all: orders.length }
    TABS.slice(1).forEach(t => { c[t.key] = orders.filter(o => o.status === t.key).length })
    return c
  }, [orders])

  const toggleSelect = id => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  const toggleAll = () => setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(o => o.id)))

  if (error) return (
    <div className="page"><div className="empty-state"><AlertCircle size={28} /><strong>Gagal memuat pesanan</strong><p>{error}</p><button className="btn-primary" onClick={refetch}><RefreshCw size={14} /> Coba Lagi</button></div></div>
  )

  return (
    <div className="page">
      {showNew && <NewOrderModal onClose={() => setShowNew(false)} onCreate={createOrder} />}

      <div className="page-header-row">
        <div>
          <h1>Manajemen Pesanan</h1>
          <p>Kelola semua pesanan dari berbagai channel dalam satu tempat</p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary" onClick={refetch}><RefreshCw size={14} /></button>
          <button className="btn-secondary"><Printer size={14} /> Cetak Label</button>
          <button className="btn-primary" onClick={() => setShowNew(true)}><Plus size={14} /> Order Manual</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi glass">
          <div className="kpi-label">Pesanan Hari Ini</div>
          <div className="kpi-value">{loading ? '—' : (stats?.today ?? 0)}</div>
          <div className="kpi-meta">Total {stats?.total ?? 0} semua waktu</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Perlu Diproses</div>
          <div className="kpi-value" style={{ color: 'var(--accent-amber)' }}>{loading ? '—' : (stats?.pending ?? 0)}</div>
          <div className="kpi-meta">Segera tindak lanjuti</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Dalam Pengiriman</div>
          <div className="kpi-value" style={{ color: '#06b6d4' }}>{loading ? '—' : (stats?.shipped ?? 0)}</div>
          <div className="kpi-meta">Estimasi tiba 1–3 hari</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Total Pendapatan</div>
          <div className="kpi-value ord-rev">{loading ? '—' : formatRupiah(stats?.revenue ?? 0)}</div>
          <div className="kpi-meta">Semua waktu</div>
        </div>
      </div>

      <div className="section-card glass ord-card">
        {/* Channel filter */}
        <div className="ord-channel-row">
          {['all', 'shopee', 'tokopedia', 'tiktok', 'website', 'whatsapp', 'instagram'].map(ch => (
            <button
              key={ch}
              className={`ord-ch-pill ${channel === ch ? 'active' : ''}`}
              onClick={() => setChannel(ch)}
              style={channel === ch && ch !== 'all' ? { background: CHANNEL[ch]?.bg, color: CHANNEL[ch]?.color, borderColor: CHANNEL[ch]?.color + '50' } : {}}
            >
              {ch === 'all' ? 'Semua Channel' : CHANNEL[ch].label}
              <span className="ord-ch-count">
                {ch === 'all' ? orders.length : orders.filter(o => o.channel === ch).length}
              </span>
            </button>
          ))}
        </div>

        {/* Tabs + search */}
        <div className="ord-toolbar">
          <div className="ord-tabs">
            {TABS.map(t => (
              <button key={t.key} className={`ord-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                {t.label}<span className="ord-tab-count">{counts[t.key] ?? 0}</span>
              </button>
            ))}
          </div>
          <div className="ord-search">
            <Search size={14} />
            <input placeholder="Cari pesanan / pelanggan…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Bulk actions */}
        {selected.size > 0 && (
          <div className="ord-bulk">
            <span>{selected.size} pesanan dipilih</span>
            <button className="btn-secondary"><Truck size={13} /> Tandai Dikirim</button>
            <button className="btn-secondary"><Printer size={13} /> Cetak Label</button>
            <button className="btn-secondary ord-bulk-cancel"><XCircle size={13} /> Batalkan</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="empty-state" style={{ padding: '48px' }}>
            <div className="spinner" />
            <span>Memuat pesanan…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Package size={36} />
            <strong>{orders.length === 0 ? 'Belum ada pesanan' : 'Tidak ada hasil'}</strong>
            <p>{orders.length === 0 ? 'Buat order manual pertama atau hubungkan marketplace.' : 'Coba ubah filter atau kata kunci.'}</p>
            {orders.length === 0 && <button className="btn-primary" onClick={() => setShowNew(true)}><Plus size={14} /> Buat Order Manual</button>}
          </div>
        ) : (
          <div className="ord-table-wrap">
            <table className="ord-table">
              <thead>
                <tr>
                  <th><input type="checkbox" onChange={toggleAll} checked={selected.size === filtered.length && filtered.length > 0} /></th>
                  <th>ID Pesanan</th>
                  <th>Pelanggan</th>
                  <th>Produk</th>
                  <th>Channel</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Kurir</th>
                  <th>Tanggal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(o => {
                  const ch = CHANNEL[o.channel] || CHANNEL.website
                  const st = STATUS[o.status] || STATUS.new
                  const StIcon = st.icon
                  const date = new Date(o.created_at)
                  const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) + ', ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
                  return (
                    <tr key={o.id} className={selected.has(o.id) ? 'selected' : ''}>
                      <td><input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleSelect(o.id)} /></td>
                      <td className="ord-id">{o.order_number}</td>
                      <td>
                        <div className="ord-customer">
                          <div className="ord-avatar">{o.customer_avatar || o.customer_name?.[0] || '?'}</div>
                          <div>
                            <div className="ord-name">{o.customer_name}</div>
                            <div className="ord-phone">{o.customer_phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="ord-items">{o.items}</td>
                      <td>
                        <span className="ord-channel-badge" style={{ background: ch.bg, color: ch.color }}>{ch.label}</span>
                      </td>
                      <td className="ord-total">{formatRupiah(o.total)}</td>
                      <td>
                        <span className="ord-status-badge" style={{ color: st.color, background: st.color + '18' }}>
                          <StIcon size={11} /> {st.label}
                        </span>
                      </td>
                      <td className="ord-courier">
                        {o.courier ? <span className="ord-courier-tag">{o.courier}{o.tracking_no ? ` · ${o.tracking_no}` : ''}</span> : <span className="ord-courier-none">—</span>}
                      </td>
                      <td className="ord-date">{dateStr}</td>
                      <td>
                        <div className="ord-actions">
                          <button className="ord-action-btn" title="Detail"><Eye size={13} /></button>
                          <select
                            className="ord-status-select"
                            value={o.status}
                            onChange={e => updateStatus(o.id, e.target.value)}
                            title="Ubah status"
                          >
                            {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                          </select>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="ord-footer">
          <span>Menampilkan {filtered.length} dari {orders.length} pesanan</span>
          <div className="ord-pagination">
            <button className="ord-page-btn active">1</button>
          </div>
        </div>
      </div>
    </div>
  )
}
