import { useState, useMemo } from 'react'
import {
  ClipboardList, Search, Filter, Download, Printer,
  Package, Truck, CheckCircle2, XCircle, Clock,
  AlertCircle, RefreshCw, Plus, ChevronDown, Eye,
  ShoppingBag,
} from 'lucide-react'
import { allOrders } from '../data/mockData.js'
import './shared.css'
import './Orders.css'

const formatRupiah = n => 'Rp ' + n.toLocaleString('id-ID')

/* ── Channel config ── */
const CHANNEL = {
  shopee:    { label: 'Shopee',     color: '#f97316', bg: '#f9731615' },
  tokopedia: { label: 'Tokopedia',  color: '#10b981', bg: '#10b98115' },
  tiktok:    { label: 'TikTok',     color: '#06b6d4', bg: '#06b6d415' },
  website:   { label: 'Website',    color: '#7c3aed', bg: '#7c3aed15' },
  whatsapp:  { label: 'WhatsApp',   color: '#25d366', bg: '#25d36615' },
  instagram: { label: 'Instagram',  color: '#ec4899', bg: '#ec489915' },
}

/* ── Status config ── */
const STATUS = {
  new:        { label: 'Baru',       color: '#6366f1', icon: AlertCircle },
  processing: { label: 'Diproses',   color: '#f59e0b', icon: Clock       },
  shipped:    { label: 'Dikirim',    color: '#06b6d4', icon: Truck        },
  done:       { label: 'Selesai',    color: '#10b981', icon: CheckCircle2 },
  cancelled:  { label: 'Dibatalkan', color: '#ef4444', icon: XCircle      },
}

const TABS = [
  { key: 'all',        label: 'Semua'    },
  { key: 'new',        label: 'Baru'     },
  { key: 'processing', label: 'Diproses' },
  { key: 'shipped',    label: 'Dikirim'  },
  { key: 'done',       label: 'Selesai'  },
  { key: 'cancelled',  label: 'Dibatalkan'},
]

export default function Orders() {
  const [tab,      setTab]      = useState('all')
  const [channel,  setChannel]  = useState('all')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState(new Set())

  const filtered = useMemo(() => {
    return allOrders.filter(o => {
      if (tab !== 'all' && o.status !== tab) return false
      if (channel !== 'all' && o.channel !== channel) return false
      if (search && !o.customer.toLowerCase().includes(search.toLowerCase()) &&
          !o.id.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [tab, channel, search])

  const counts = useMemo(() => {
    const c = {}
    TABS.forEach(t => { c[t.key] = t.key === 'all' ? allOrders.length : allOrders.filter(o => o.status === t.key).length })
    return c
  }, [])

  const todayRevenue = allOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)

  const toggleSelect = id => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  const toggleAll = () => {
    setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(o => o.id)))
  }

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>Manajemen Pesanan</h1>
          <p>Kelola semua pesanan dari berbagai channel dalam satu tempat</p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary"><Download size={14} /> Export</button>
          <button className="btn-secondary"><Printer size={14} /> Cetak Label</button>
          <button className="btn-primary"><Plus size={14} /> Order Manual</button>
        </div>
      </div>

      {/* KPI */}
      <div className="kpi-grid">
        <div className="kpi glass">
          <div className="kpi-label">Pesanan Hari Ini</div>
          <div className="kpi-value">{allOrders.length}</div>
          <div className="kpi-meta up">+18% vs kemarin</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Perlu Diproses</div>
          <div className="kpi-value" style={{ color: 'var(--accent-amber)' }}>
            {allOrders.filter(o => o.status === 'new' || o.status === 'processing').length}
          </div>
          <div className="kpi-meta">Segera tindak lanjuti</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Dalam Pengiriman</div>
          <div className="kpi-value" style={{ color: '#06b6d4' }}>
            {allOrders.filter(o => o.status === 'shipped').length}
          </div>
          <div className="kpi-meta">Estimasi tiba 1–3 hari</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Pendapatan Hari Ini</div>
          <div className="kpi-value ord-rev">{formatRupiah(todayRevenue)}</div>
          <div className="kpi-meta up">+22% vs kemarin</div>
        </div>
      </div>

      {/* Main card */}
      <div className="section-card glass ord-card">
        {/* Channel filter pills */}
        <div className="ord-channel-row">
          {['all', 'shopee', 'tokopedia', 'tiktok', 'website', 'whatsapp', 'instagram'].map(ch => (
            <button
              key={ch}
              className={`ord-ch-pill ${channel === ch ? 'active' : ''}`}
              onClick={() => setChannel(ch)}
              style={channel === ch && ch !== 'all' ? {
                background: CHANNEL[ch]?.bg,
                color: CHANNEL[ch]?.color,
                borderColor: CHANNEL[ch]?.color + '50',
              } : {}}
            >
              {ch === 'all' ? 'Semua Channel' : CHANNEL[ch].label}
              <span className="ord-ch-count">
                {ch === 'all' ? allOrders.length : allOrders.filter(o => o.channel === ch).length}
              </span>
            </button>
          ))}
        </div>

        {/* Status tabs + search */}
        <div className="ord-toolbar">
          <div className="ord-tabs">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`ord-tab ${tab === t.key ? 'active' : ''}`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
                <span className="ord-tab-count">{counts[t.key]}</span>
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

        {/* Table */}
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
                const ch = CHANNEL[o.channel]
                const st = STATUS[o.status]
                const StIcon = st.icon
                return (
                  <tr key={o.id} className={selected.has(o.id) ? 'selected' : ''}>
                    <td><input type="checkbox" checked={selected.has(o.id)} onChange={() => toggleSelect(o.id)} /></td>
                    <td className="ord-id">{o.id}</td>
                    <td>
                      <div className="ord-customer">
                        <div className="ord-avatar">{o.avatar}</div>
                        <div>
                          <div className="ord-name">{o.customer}</div>
                          <div className="ord-phone">{o.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="ord-items">{o.items}</td>
                    <td>
                      <span className="ord-channel-badge" style={{ background: ch.bg, color: ch.color }}>
                        {ch.label}
                      </span>
                    </td>
                    <td className="ord-total">{formatRupiah(o.total)}</td>
                    <td>
                      <span className="ord-status-badge" style={{ color: st.color, background: st.color + '18' }}>
                        <StIcon size={11} /> {st.label}
                      </span>
                    </td>
                    <td className="ord-courier">
                      {o.courier
                        ? <span className="ord-courier-tag">{o.courier}{o.tracking ? ` · ${o.tracking}` : ''}</span>
                        : <span className="ord-courier-none">—</span>
                      }
                    </td>
                    <td className="ord-date">{o.date}</td>
                    <td>
                      <div className="ord-actions">
                        <button className="ord-action-btn" title="Detail"><Eye size={13} /></button>
                        <button className="ord-action-btn" title="Update"><ChevronDown size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="ord-empty">Tidak ada pesanan ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="ord-footer">
          <span>Menampilkan {filtered.length} dari {allOrders.length} pesanan</span>
          <div className="ord-pagination">
            <button className="ord-page-btn active">1</button>
            <button className="ord-page-btn">2</button>
            <button className="ord-page-btn">3</button>
          </div>
        </div>
      </div>
    </div>
  )
}
