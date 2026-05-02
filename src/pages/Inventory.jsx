import { useState, useMemo } from 'react'
import {
  Package2, Search, Plus, AlertTriangle, RefreshCw,
  TrendingDown, Boxes, Filter, Download, Edit,
  BarChart2, ShoppingCart, Truck, CheckCircle2,
} from 'lucide-react'
import {
  Shirt, ShoppingBasket, Coffee, Footprints, Crown, Droplet,
} from 'lucide-react'
import { inventoryItems } from '../data/mockData.js'
import './shared.css'
import './Inventory.css'

const formatRupiah = n => 'Rp ' + n.toLocaleString('id-ID')

const productIcon = {
  shirt: Shirt, bag: ShoppingBasket, coffee: Coffee,
  shoe: Footprints, scarf: Crown, honey: Droplet,
}
const productGradient = {
  shirt: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  bag:   'linear-gradient(135deg, #f59e0b, #ec4899)',
  coffee:'linear-gradient(135deg, #92400e, #f59e0b)',
  shoe:  'linear-gradient(135deg, #1f2937, #6366f1)',
  scarf: 'linear-gradient(135deg, #ec4899, #a855f7)',
  honey: 'linear-gradient(135deg, #f59e0b, #10b981)',
}

const CHANNEL_DOT = {
  website:   '#7c3aed',
  tokopedia: '#10b981',
  shopee:    '#f97316',
  tiktok:    '#06b6d4',
}

const STATUS = {
  active: { label: 'Normal',      color: '#10b981', bg: '#10b98118' },
  low:    { label: 'Stok Rendah', color: '#f59e0b', bg: '#f59e0b18' },
  out:    { label: 'Habis',       color: '#ef4444', bg: '#ef444418' },
}

const TABS = [
  { key: 'all',    label: 'Semua' },
  { key: 'active', label: 'Normal' },
  { key: 'low',    label: 'Stok Rendah' },
  { key: 'out',    label: 'Habis' },
]

export default function Inventory() {
  const [tab,    setTab]    = useState('all')
  const [search, setSearch] = useState('')
  const [sort,   setSort]   = useState('name') // name | stock | value

  const filtered = useMemo(() => {
    let items = inventoryItems.filter(item => {
      if (tab !== 'all' && item.status !== tab) return false
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()) &&
          !item.sku.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    if (sort === 'stock') items = [...items].sort((a, b) => a.stock - b.stock)
    if (sort === 'value') items = [...items].sort((a, b) => (b.stock * b.sellPrice) - (a.stock * a.sellPrice))
    return items
  }, [tab, search, sort])

  const totalValue = inventoryItems.reduce((s, i) => s + i.stock * i.buyPrice, 0)
  const lowCount   = inventoryItems.filter(i => i.status === 'low').length
  const outCount   = inventoryItems.filter(i => i.status === 'out').length

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>Manajemen Inventori</h1>
          <p>Pantau stok, nilai inventori, dan supplier semua produk</p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary"><Download size={14} /> Export</button>
          <button className="btn-secondary"><RefreshCw size={14} /> Sinkronisasi</button>
          <button className="btn-primary"><Plus size={14} /> Tambah Produk</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi glass">
          <div className="kpi-label">Total SKU</div>
          <div className="kpi-value">{inventoryItems.length}</div>
          <div className="kpi-meta">{inventoryItems.filter(i => i.status === 'active').length} produk normal</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Stok Rendah</div>
          <div className="kpi-value" style={{ color: 'var(--accent-amber)' }}>{lowCount}</div>
          <div className="kpi-meta">Segera restock</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Stok Habis</div>
          <div className="kpi-value" style={{ color: '#ef4444' }}>{outCount}</div>
          <div className="kpi-meta">Perlu purchase order</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Nilai Inventori</div>
          <div className="kpi-value inv-val">{formatRupiah(totalValue)}</div>
          <div className="kpi-meta">Harga beli</div>
        </div>
      </div>

      {/* Alert banner */}
      {(lowCount + outCount) > 0 && (
        <div className="inv-alert-banner">
          <AlertTriangle size={15} />
          <span>
            <strong>{lowCount + outCount} produk</strong> memerlukan perhatian:
            {lowCount > 0 && <> {lowCount} stok rendah</>}
            {lowCount > 0 && outCount > 0 && ','}
            {outCount > 0 && <> {outCount} stok habis</>}
          </span>
          <button className="btn-secondary" style={{ marginLeft: 'auto', padding: '4px 12px', fontSize: '12px' }}>
            Buat Purchase Order
          </button>
        </div>
      )}

      {/* Main card */}
      <div className="section-card glass">
        {/* Toolbar */}
        <div className="ord-toolbar">
          <div className="ord-tabs">
            {TABS.map(t => (
              <button key={t.key} className={`ord-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                {t.label}
                <span className="ord-tab-count">
                  {t.key === 'all' ? inventoryItems.length : inventoryItems.filter(i => i.status === t.key).length}
                </span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="ord-search">
              <Search size={14} />
              <input placeholder="Cari produk / SKU…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select
              className="inv-sort-select"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="name">Urutkan: Nama</option>
              <option value="stock">Urutkan: Stok</option>
              <option value="value">Urutkan: Nilai</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="ord-table-wrap">
          <table className="ord-table inv-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>SKU</th>
                <th>Kategori</th>
                <th>Stok</th>
                <th>Min. Stok</th>
                <th>Harga Jual</th>
                <th>Nilai Stok</th>
                <th>Channel</th>
                <th>Supplier</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const Icon = productIcon[item.image]
                const st   = STATUS[item.status]
                const stockValue = item.stock * item.sellPrice
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="inv-product-cell">
                        <div className="inv-prod-img" style={{ background: productGradient[item.image] }}>
                          {Icon && <Icon size={14} color="white" />}
                        </div>
                        <span className="inv-prod-name">{item.name}</span>
                      </div>
                    </td>
                    <td className="inv-sku">{item.sku}</td>
                    <td className="inv-cat">{item.category}</td>
                    <td>
                      <div className="inv-stock-cell">
                        <span className={`inv-stock-num ${item.status === 'out' ? 'out' : item.status === 'low' ? 'low' : ''}`}>
                          {item.stock}
                        </span>
                        <div className="inv-stock-bar-wrap">
                          <div
                            className="inv-stock-bar"
                            style={{
                              width: `${Math.min(100, (item.stock / item.maxStock) * 100)}%`,
                              background: item.status === 'out' ? '#ef4444' : item.status === 'low' ? '#f59e0b' : '#10b981',
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="inv-min">{item.minStock}</td>
                    <td className="inv-price">{formatRupiah(item.sellPrice)}</td>
                    <td className="inv-val">{item.stock > 0 ? formatRupiah(stockValue) : '—'}</td>
                    <td>
                      <div className="inv-channels">
                        {item.channels.map(ch => (
                          <span key={ch} className="inv-ch-dot" style={{ background: CHANNEL_DOT[ch] }} title={ch} />
                        ))}
                      </div>
                    </td>
                    <td className="inv-supplier">{item.supplier}</td>
                    <td>
                      <span className="ord-status-badge" style={{ color: st.color, background: st.bg }}>
                        {st.label}
                      </span>
                    </td>
                    <td>
                      <div className="ord-actions">
                        <button className="ord-action-btn" title="Edit stok"><Edit size={13} /></button>
                        <button className="ord-action-btn" title="Purchase order"><ShoppingCart size={13} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="ord-footer">
          <span>Menampilkan {filtered.length} dari {inventoryItems.length} produk</span>
        </div>
      </div>
    </div>
  )
}
