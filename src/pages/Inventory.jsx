import { useState, useMemo } from 'react'
import {
  Search, Plus, AlertTriangle, RefreshCw,
  Edit, ShoppingCart, Package2, Boxes,
} from 'lucide-react'
import { Shirt, ShoppingBasket, Coffee, Footprints, Crown, Droplet } from 'lucide-react'
import { useInventory } from '../hooks/useInventory.js'
import { formatRupiah } from '../utils/currency.js'
import './shared.css'
import './Inventory.css'

const productIcon = { shirt: Shirt, bag: ShoppingBasket, coffee: Coffee, shoe: Footprints, scarf: Crown, honey: Droplet }
const productGradient = {
  shirt: 'linear-gradient(135deg,#6366f1,#8b5cf6)', bag: 'linear-gradient(135deg,#f59e0b,#ec4899)',
  coffee:'linear-gradient(135deg,#92400e,#f59e0b)', shoe: 'linear-gradient(135deg,#1f2937,#6366f1)',
  scarf: 'linear-gradient(135deg,#ec4899,#a855f7)', honey: 'linear-gradient(135deg,#f59e0b,#10b981)',
  package:'linear-gradient(135deg,#6366f1,#4338ca)',
}
const CHANNEL_DOT = { website:'#7c3aed', tokopedia:'#10b981', shopee:'#f97316', tiktok:'#06b6d4' }
const STATUS = {
  active:{ label:'Normal',      color:'#10b981', bg:'#10b98118' },
  low:   { label:'Stok Rendah', color:'#f59e0b', bg:'#f59e0b18' },
  out:   { label:'Habis',       color:'#ef4444', bg:'#ef444418' },
}
const TABS = [
  { key:'all',    label:'Semua' },
  { key:'active', label:'Normal' },
  { key:'low',    label:'Stok Rendah' },
  { key:'out',    label:'Habis' },
]
const CATEGORIES = ['Fashion','F&B','Aksesoris','Elektronik','Kesehatan','Lainnya']

/* ── Add / Edit Product Modal ── */
function ProductModal({ product, onClose, onSave }) {
  const isEdit = Boolean(product)
  const [form, setForm] = useState(product ? {
    sku: product.sku, name: product.name, category: product.category,
    image: product.image, stock: product.stock, min_stock: product.min_stock,
    max_stock: product.max_stock || 100, buy_price: product.buy_price,
    sell_price: product.sell_price, supplier: product.supplier,
    channels: product.channels || [],
  } : {
    sku:'', name:'', category:'Fashion', image:'package', stock:0,
    min_stock:10, max_stock:100, buy_price:0, sell_price:0, supplier:'', channels:['website'],
  })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }))
  const toggleCh = ch => setForm(f => ({
    ...f, channels: f.channels.includes(ch) ? f.channels.filter(c => c !== ch) : [...f.channels, ch]
  }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name) { setErr('Nama produk wajib diisi.'); return }
    setSaving(true)
    const { error } = await onSave(form)
    setSaving(false)
    if (error) { setErr(error.message); return }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-wide" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-row">
            <div className="modal-field">
              <label>Nama Produk *</label>
              <input value={form.name} onChange={set('name')} placeholder="Kemeja Batik Premium" required />
            </div>
            <div className="modal-field">
              <label>SKU</label>
              <input value={form.sku} onChange={set('sku')} placeholder="BTK-001" />
            </div>
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>Kategori</label>
              <select value={form.category} onChange={set('category')}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="modal-field">
              <label>Supplier</label>
              <input value={form.supplier} onChange={set('supplier')} placeholder="PT Batik Nusantara" />
            </div>
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>Stok Awal</label>
              <input type="number" min="0" value={form.stock} onChange={set('stock')} />
            </div>
            <div className="modal-field">
              <label>Stok Minimum</label>
              <input type="number" min="0" value={form.min_stock} onChange={set('min_stock')} />
            </div>
          </div>
          <div className="modal-row">
            <div className="modal-field">
              <label>Harga Beli (Rp)</label>
              <input type="number" min="0" value={form.buy_price} onChange={set('buy_price')} />
            </div>
            <div className="modal-field">
              <label>Harga Jual (Rp)</label>
              <input type="number" min="0" value={form.sell_price} onChange={set('sell_price')} />
            </div>
          </div>
          <div className="modal-field">
            <label>Channel Penjualan</label>
            <div className="modal-channels">
              {Object.entries(CHANNEL_DOT).map(([ch, color]) => (
                <button
                  key={ch} type="button"
                  className={`modal-ch-btn ${form.channels.includes(ch) ? 'active' : ''}`}
                  style={form.channels.includes(ch) ? { borderColor: color, background: color + '18', color } : {}}
                  onClick={() => toggleCh(ch)}
                >{ch}</button>
              ))}
            </div>
          </div>
          {err && <div className="modal-error">{err}</div>}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Menyimpan…' : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── Stock Adjust Modal ── */
function StockModal({ product, onClose, onAdjust }) {
  const [newStock, setNewStock] = useState(product.stock)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    await onAdjust(product.id, Number(newStock))
    setSaving(false)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Adjust Stok</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{product.name}</p>
          <div className="modal-field">
            <label>Stok Baru</label>
            <input type="number" min="0" value={newStock} onChange={e => setNewStock(e.target.value)} autoFocus />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Menyimpan…' : 'Update Stok'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Inventory() {
  const [tab,         setTab]         = useState('all')
  const [search,      setSearch]      = useState('')
  const [sort,        setSort]        = useState('name')
  const [showAdd,     setShowAdd]     = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [stockAdj,    setStockAdj]    = useState(null)

  const { products, loading, error, refetch, createProduct, updateProduct, adjustStock } = useInventory()

  const filtered = useMemo(() => {
    let items = products.filter(item => {
      if (tab !== 'all' && item.status !== tab) return false
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.sku.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    if (sort === 'stock') items = [...items].sort((a, b) => a.stock - b.stock)
    if (sort === 'value') items = [...items].sort((a, b) => (b.stock * b.sell_price) - (a.stock * a.sell_price))
    return items
  }, [products, tab, search, sort])

  const totalValue = products.reduce((s, i) => s + i.stock * i.buy_price, 0)
  const lowCount   = products.filter(i => i.status === 'low').length
  const outCount   = products.filter(i => i.status === 'out').length

  return (
    <div className="page">
      {showAdd && <ProductModal onClose={() => setShowAdd(false)} onSave={p => createProduct(p)} />}
      {editProduct && <ProductModal product={editProduct} onClose={() => setEditProduct(null)} onSave={p => updateProduct(editProduct.id, p)} />}
      {stockAdj && <StockModal product={stockAdj} onClose={() => setStockAdj(null)} onAdjust={adjustStock} />}

      <div className="page-header-row">
        <div>
          <h1>Manajemen Inventori</h1>
          <p>Pantau stok, nilai inventori, dan supplier semua produk</p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary" onClick={refetch}><RefreshCw size={14} /></button>
          <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Tambah Produk</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi glass">
          <div className="kpi-label">Total SKU</div>
          <div className="kpi-value">{loading ? '—' : products.length}</div>
          <div className="kpi-meta">{products.filter(i => i.status === 'active').length} produk normal</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Stok Rendah</div>
          <div className="kpi-value" style={{ color:'var(--accent-amber)' }}>{loading ? '—' : lowCount}</div>
          <div className="kpi-meta">Segera restock</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Stok Habis</div>
          <div className="kpi-value" style={{ color:'#ef4444' }}>{loading ? '—' : outCount}</div>
          <div className="kpi-meta">Perlu purchase order</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">Nilai Inventori</div>
          <div className="kpi-value" style={{ fontSize:18 }}>{loading ? '—' : formatRupiah(totalValue)}</div>
          <div className="kpi-meta">Harga beli</div>
        </div>
      </div>

      {(lowCount + outCount) > 0 && (
        <div className="inv-alert-banner">
          <AlertTriangle size={15} />
          <span><strong>{lowCount + outCount} produk</strong> memerlukan perhatian:{lowCount > 0 && <> {lowCount} stok rendah</>}{outCount > 0 && <>, {outCount} habis</>}</span>
          <button className="btn-secondary" style={{ marginLeft:'auto', padding:'4px 12px', fontSize:'12px' }}>Buat Purchase Order</button>
        </div>
      )}

      <div className="section-card glass">
        <div className="ord-toolbar">
          <div className="ord-tabs">
            {TABS.map(t => (
              <button key={t.key} className={`ord-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
                {t.label}<span className="ord-tab-count">{t.key==='all' ? products.length : products.filter(i=>i.status===t.key).length}</span>
              </button>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <div className="ord-search">
              <Search size={14} />
              <input placeholder="Cari produk / SKU…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="inv-sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="name">Nama</option>
              <option value="stock">Stok</option>
              <option value="value">Nilai</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="empty-state"><div className="spinner" /><span>Memuat produk…</span></div>
        ) : filtered.length === 0 && products.length === 0 ? (
          <div className="empty-state">
            <Boxes size={36} />
            <strong>Belum ada produk</strong>
            <p>Tambahkan produk pertama untuk mulai mengelola inventori.</p>
            <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus size={14} /> Tambah Produk</button>
          </div>
        ) : (
          <div className="ord-table-wrap">
            <table className="ord-table inv-table">
              <thead>
                <tr>
                  <th>Produk</th><th>SKU</th><th>Kategori</th><th>Stok</th>
                  <th>Min</th><th>Harga Jual</th><th>Nilai Stok</th>
                  <th>Channel</th><th>Supplier</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const Icon = productIcon[item.image]
                  const st   = STATUS[item.status] || STATUS.active
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="inv-product-cell">
                          <div className="inv-prod-img" style={{ background: productGradient[item.image] || productGradient.package }}>
                            {Icon && <Icon size={14} color="white" />}
                          </div>
                          <span className="inv-prod-name">{item.name}</span>
                        </div>
                      </td>
                      <td className="inv-sku">{item.sku || '—'}</td>
                      <td className="inv-cat">{item.category}</td>
                      <td>
                        <div className="inv-stock-cell">
                          <span className={`inv-stock-num ${item.status}`}>{item.stock}</span>
                          <div className="inv-stock-bar-wrap">
                            <div className="inv-stock-bar" style={{
                              width: `${Math.min(100,(item.stock/(item.max_stock||100))*100)}%`,
                              background: item.status==='out'?'#ef4444':item.status==='low'?'#f59e0b':'#10b981',
                            }}/>
                          </div>
                        </div>
                      </td>
                      <td className="inv-min">{item.min_stock}</td>
                      <td className="inv-price">{formatRupiah(item.sell_price)}</td>
                      <td className="inv-val">{item.stock > 0 ? formatRupiah(item.stock * item.sell_price) : '—'}</td>
                      <td>
                        <div className="inv-channels">
                          {(item.channels || []).map(ch => (
                            <span key={ch} className="inv-ch-dot" style={{ background: CHANNEL_DOT[ch] || '#94a3b8' }} title={ch} />
                          ))}
                        </div>
                      </td>
                      <td className="inv-supplier">{item.supplier || '—'}</td>
                      <td><span className="ord-status-badge" style={{ color:st.color, background:st.bg }}>{st.label}</span></td>
                      <td>
                        <div className="ord-actions">
                          <button className="ord-action-btn" title="Edit" onClick={() => setEditProduct(item)}><Edit size={13} /></button>
                          <button className="ord-action-btn" title="Adjust stok" onClick={() => setStockAdj(item)}><ShoppingCart size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="ord-footer"><span>Menampilkan {filtered.length} dari {products.length} produk</span></div>
      </div>
    </div>
  )
}
