import {
  ShoppingBag, Package, Plus, Search, Filter,
  Shirt, ShoppingBasket, Coffee, Footprints, Crown, Droplet,
  CheckCircle2, RefreshCw, AlertCircle
} from 'lucide-react'
import { products, recentOrders, integrations } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import './shared.css'
import './Ecommerce.css'

const formatRupiah = (n) => 'Rp ' + n.toLocaleString('id-ID')

const productIcon = {
  shirt: Shirt, bag: ShoppingBasket, coffee: Coffee,
  shoe: Footprints, scarf: Crown, honey: Droplet,
}

const productGradient = {
  shirt: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  bag: 'linear-gradient(135deg, #f59e0b, #ec4899)',
  coffee: 'linear-gradient(135deg, #92400e, #f59e0b)',
  shoe: 'linear-gradient(135deg, #1f2937, #6366f1)',
  scarf: 'linear-gradient(135deg, #ec4899, #a855f7)',
  honey: 'linear-gradient(135deg, #f59e0b, #10b981)',
}

export default function Ecommerce() {
  const { t } = useApp()
  const e = t.ecommerce

  return (
    <div className="page">
      <div className="page-header-row">
        <div>
          <h1>{e.title}</h1>
          <p>{e.subtitle}</p>
        </div>
        <div className="page-actions">
          <button className="btn-secondary"><Filter size={14} /> {e.filter}</button>
          <button className="btn-primary"><Plus size={14} /> {e.newProduct}</button>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi glass">
          <div className="kpi-label">{e.totalProducts}</div>
          <div className="kpi-value">128</div>
          <div className="kpi-meta">94 {e.active} • 32 {e.draft}</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">{e.todayOrders}</div>
          <div className="kpi-value">42</div>
          <div className="kpi-meta up">{e.fromYesterday}</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">{e.lowStock}</div>
          <div className="kpi-value" style={{ color: 'var(--accent-amber)' }}>8</div>
          <div className="kpi-meta">{e.needRestock}</div>
        </div>
        <div className="kpi glass">
          <div className="kpi-label">{e.aov}</div>
          <div className="kpi-value">Rp 312K</div>
          <div className="kpi-meta up">+8.4%</div>
        </div>
      </div>

      <div className="ec-grid">
        <div className="section-card glass">
          <div className="section-header">
            <div>
              <div className="section-title">{e.topProducts}</div>
              <div className="section-subtitle">{e.top6Month}</div>
            </div>
            <div className="search-input">
              <Search size={14} />
              <input placeholder={e.searchProduct} />
            </div>
          </div>
          <div className="products-grid">
            {products.map((p) => {
              const Icon = productIcon[p.image] || ShoppingBag
              return (
                <div key={p.id} className="product-card">
                  <div className="product-image" style={{ background: productGradient[p.image] }}>
                    <Icon size={32} color="#fff" strokeWidth={1.5} />
                    {p.status === 'low' && <span className="product-tag warn">Low Stock</span>}
                    {p.status === 'out' && <span className="product-tag danger">{e.outOfStock}</span>}
                  </div>
                  <div className="product-body">
                    <div className="product-cat">{p.category}</div>
                    <div className="product-name">{p.name}</div>
                    <div className="product-sku">SKU: {p.sku}</div>
                    <div className="product-bottom">
                      <span className="product-price">{formatRupiah(p.price)}</span>
                      <span className="product-stock">
                        <Package size={11} /> {p.stock}
                      </span>
                    </div>
                    <div className="product-bar">
                      <div className="product-bar-fill" style={{ width: `${Math.min(100, (p.sold / 1500) * 100)}%` }} />
                    </div>
                    <div className="product-sold">{p.sold} {e.sold}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="section-card glass">
          <div className="section-header">
            <div>
              <div className="section-title">Marketplace</div>
              <div className="section-subtitle">{e.integSub}</div>
            </div>
            <button className="btn-ghost"><Plus size={14} /></button>
          </div>
          <div className="integrations-list">
            {integrations.map((int) => (
              <div key={int.name} className="integration-item">
                <div className="integration-logo">{int.logo}</div>
                <div className="integration-info">
                  <div className="integration-name">{int.name}</div>
                  <div className="integration-meta">
                    {int.status === 'connected' && (
                      <>
                        <CheckCircle2 size={11} color="#10b981" />
                        <span>{int.orders} order • sync {int.lastSync}</span>
                      </>
                    )}
                    {int.status === 'pending' && (
                      <>
                        <RefreshCw size={11} color="#f59e0b" />
                        <span>{e.syncing}</span>
                      </>
                    )}
                    {int.status === 'disconnected' && (
                      <>
                        <AlertCircle size={11} color="#94a3b8" />
                        <span>—</span>
                      </>
                    )}
                  </div>
                </div>
                <button className={`integration-btn ${int.status}`}>
                  {int.status === 'connected' ? e.connected : int.status === 'pending' ? 'Review' : e.connect}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-card glass">
        <div className="section-header">
          <div>
            <div className="section-title">{e.recentOrders}</div>
            <div className="section-subtitle">
              {recentOrders.length} {e.todayOrdersSub}
            </div>
          </div>
          <div className="tabs">
            <button className="tab active">{t.common.viewAll}</button>
            <button className="tab">Pending</button>
            <button className="tab">Processing</button>
            <button className="tab">Done</button>
          </div>
        </div>
        <div className="orders-table">
          <div className="orders-thead">
            <span>Invoice</span>
            <span>{e.customer}</span>
            <span>{e.product}</span>
            <span>{e.channel}</span>
            <span>{e.amount}</span>
            <span>Status</span>
            <span>Time</span>
          </div>
          {recentOrders.map((o) => (
            <div key={o.id} className="orders-trow">
              <span className="order-id">{o.id}</span>
              <span>{o.customer}</span>
              <span className="order-prod">{o.product}</span>
              <span>
                <span className="badge badge-primary">{o.channel}</span>
              </span>
              <span className="order-tot">{formatRupiah(o.amount)}</span>
              <span>
                <span className={`badge status-${o.status}`}>{o.status}</span>
              </span>
              <span className="order-time">{o.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
