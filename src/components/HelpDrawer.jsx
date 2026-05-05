import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  X, LayoutDashboard, ClipboardList, Package2, Users,
  Wallet, Globe, SearchCheck, Share2, Sparkles,
  MessageSquare, CreditCard, Settings, ChevronRight,
  CheckCircle2, Circle, ArrowRight,
} from 'lucide-react'
import './HelpDrawer.css'

const SECTIONS = [
  {
    key: 'dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/',
    color: '#6366f1',
    desc: 'Ringkasan bisnis kamu secara real-time',
    steps: [
      { title: 'Lihat ringkasan bisnis', desc: 'Bagian atas menampilkan total pendapatan, jumlah pesanan, dan saldo dompet dari data nyata.' },
      { title: 'Pantau grafik 7 hari', desc: 'Grafik revenue menunjukkan tren penjualan dalam 7 hari terakhir. Hover untuk lihat detail per hari.' },
      { title: 'Cek pesanan terbaru', desc: 'Bagian bawah menampilkan 5 pesanan terakhir. Klik "Lihat semua" untuk ke halaman Pesanan.' },
      { title: 'Top up saldo', desc: 'Klik angka saldo di pojok kanan atas untuk langsung ke halaman Dompet.' },
    ],
  },
  {
    key: 'orders',
    icon: ClipboardList,
    label: 'Pesanan',
    path: '/orders',
    color: '#f59e0b',
    desc: 'Kelola pesanan dari semua marketplace',
    steps: [
      { title: 'Lihat semua pesanan', desc: 'Semua pesanan dari Shopee, Tokopedia, TikTok, WhatsApp, dll. tampil di satu tabel.' },
      { title: 'Filter berdasarkan channel & status', desc: 'Klik tombol channel (Shopee, Tokopedia, dll.) di atas untuk filter per platform. Klik tab status (Baru, Diproses, dll.) untuk filter per status.' },
      { title: 'Ubah status pesanan', desc: 'Di kolom paling kanan, klik dropdown status untuk update: Baru → Diproses → Dikirim → Selesai.' },
      { title: 'Buat order manual', desc: 'Klik tombol "Order Manual" di kanan atas untuk tambah pesanan dari WhatsApp atau offline.' },
      { title: 'Pilih banyak sekaligus', desc: 'Centang checkbox di kiri untuk pilih beberapa pesanan, lalu klik aksi masal (cetak label, ubah status).' },
    ],
  },
  {
    key: 'inventory',
    icon: Package2,
    label: 'Inventori',
    path: '/inventory',
    color: '#10b981',
    desc: 'Stok produk & manajemen inventori',
    steps: [
      { title: 'Tambah produk baru', desc: 'Klik "Tambah Produk" di kanan atas. Isi nama, SKU, kategori, harga beli/jual, dan stok awal.' },
      { title: 'Pantau stok rendah', desc: 'Banner kuning muncul otomatis jika ada produk dengan stok di bawah batas minimum. Klik untuk langsung update.' },
      { title: 'Adjust stok cepat', desc: 'Klik ikon "±" di kolom stok untuk tambah atau kurangi stok tanpa buka form lengkap.' },
      { title: 'Edit produk', desc: 'Klik ikon pensil di kolom aksi untuk edit detail produk (harga, nama, channel, dll.).' },
      { title: 'Filter & sort', desc: 'Gunakan dropdown sort di kanan atas untuk urutkan berdasarkan nama, stok, atau nilai inventori.' },
    ],
  },
  {
    key: 'crm',
    icon: Users,
    label: 'CRM & Pipeline',
    path: '/crm',
    color: '#a855f7',
    desc: 'Kontak pelanggan & pipeline penjualan',
    steps: [
      { title: 'Gunakan Pipeline Kanban', desc: 'Tab "Pipeline" menampilkan deal di 5 stage: Lead → Prospek → Negosiasi → Closing → Menang. Klik "+ Tambah deal" di tiap kolom.' },
      { title: 'Kelola kontak', desc: 'Klik tab "Kontak" untuk lihat semua pelanggan. Klik kartu kontak untuk lihat riwayat order dan deal terkait.' },
      { title: 'Tambah kontak baru', desc: 'Klik "Tambah Kontak" di kanan atas. Isi nama, nomor HP, sumber (Shopee, Instagram, dll.), dan stage.' },
      { title: 'Pantau win rate', desc: 'KPI "Win Rate" dihitung otomatis dari jumlah deal yang "Menang" dibagi total deal.' },
    ],
  },
  {
    key: 'wallet',
    icon: Wallet,
    label: 'Dompet',
    path: '/wallet',
    color: '#06b6d4',
    desc: 'Saldo & riwayat transaksi bisnis',
    steps: [
      { title: 'Lihat saldo aktif', desc: 'Saldo dompet ditampilkan di kartu utama dan juga di TopBar kanan atas.' },
      { title: 'Top up saldo', desc: 'Pilih nominal di bagian kiri, lalu pilih metode pembayaran (QRIS, Bank Transfer, GoPay, dll.). Klik tombol Top Up.' },
      { title: 'Lihat riwayat transaksi', desc: 'Scroll ke bawah untuk lihat semua transaksi. Filter berdasarkan Semua / Top Up / Pengeluaran.' },
      { title: 'Cek paket berlangganan', desc: 'Kartu kanan menampilkan paket aktif, tanggal tagihan berikutnya, dan fitur yang tersedia.' },
    ],
  },
  {
    key: 'website',
    icon: Globe,
    label: 'Website',
    path: '/website',
    color: '#7c3aed',
    desc: 'Kelola & hubungkan website bisnis',
    steps: [
      { title: 'Hubungkan website kamu', desc: 'Di bagian atas halaman, masukkan URL website kamu (contoh: https://mci-eyelashes.site) lalu klik "Hubungkan".' },
      { title: 'Pantau performa website', desc: 'Lihat statistik pengunjung, bounce rate, dan konversi dari website yang sudah terhubung.' },
      { title: 'Kelola halaman', desc: 'Tabel di bawah menampilkan daftar halaman website beserta status, pengunjung, dan skor SEO per halaman.' },
      { title: 'Buat landing page baru', desc: 'Klik "Halaman Baru" untuk membuat halaman produk atau promo baru dengan editor bawaan.' },
    ],
  },
  {
    key: 'seo',
    icon: SearchCheck,
    label: 'SEO Manager',
    path: '/seo',
    color: '#ec4899',
    desc: 'Optimalkan ranking pencarian Google',
    steps: [
      { title: 'Masukkan URL website', desc: 'Pastikan URL website kamu sudah terisi di bar paling atas halaman SEO.' },
      { title: 'Cek 4 skor utama', desc: 'Lihat skor SEO, Performa, Aksesibilitas, dan Best Practices. Skor di bawah 80 perlu perhatian.' },
      { title: 'Perbaiki isu teknis', desc: 'Tab "Isu & Perbaikan" menampilkan checklist lengkap — dari meta description, alt text gambar, hingga sitemap.' },
      { title: 'Lacak kata kunci', desc: 'Tab "Kata Kunci" menampilkan posisi ranking di Google beserta volume pencarian dan perubahan posisi.' },
      { title: 'Ikuti tips SEO cepat', desc: 'Scroll ke bawah untuk lihat 6 tips SEO yang bisa langsung diterapkan untuk bisnis kamu.' },
    ],
  },
  {
    key: 'social',
    icon: Share2,
    label: 'Sosial Media',
    path: '/social',
    color: '#f97316',
    desc: 'Jadwalkan & pantau konten sosmed',
    steps: [
      { title: 'Hubungkan akun sosmed', desc: 'Klik "Hubungkan" di samping platform (Instagram, TikTok, Facebook) untuk connect akun bisnis kamu.' },
      { title: 'Jadwalkan konten', desc: 'Klik "+ Posting Baru" untuk buat konten dan atur jadwal posting otomatis.' },
      { title: 'Pantau performa', desc: 'Lihat total followers, engagement rate, dan reach dari semua platform dalam satu dashboard.' },
    ],
  },
  {
    key: 'chat',
    icon: MessageSquare,
    label: 'Chat',
    path: '/chat',
    color: '#25d366',
    desc: 'Semua pesan pelanggan di satu tempat',
    steps: [
      { title: 'Lihat semua pesan masuk', desc: 'Semua pesan dari WhatsApp, Instagram DM, dan marketplace tampil di kolom kiri.' },
      { title: 'Balas pesan', desc: 'Klik percakapan di kiri untuk buka, lalu ketik balasan di bagian bawah.' },
      { title: 'Filter per channel', desc: 'Gunakan filter di atas untuk tampilkan hanya pesan dari WhatsApp atau Instagram.' },
    ],
  },
  {
    key: 'settings',
    icon: Settings,
    label: 'Pengaturan',
    path: '/settings',
    color: '#64748b',
    desc: 'Profil bisnis & konfigurasi akun',
    steps: [
      { title: 'Update profil bisnis', desc: 'Klik "Edit Profil" untuk ubah nama bisnis, nama pemilik, foto, dan info kontak.' },
      { title: 'Ganti bahasa', desc: 'Toggle 🇮🇩/🇬🇧 di TopBar untuk ganti antarmuka ke Bahasa Indonesia atau English.' },
      { title: 'Ganti tema', desc: 'Klik ikon ☀️/🌙 di TopBar untuk ganti antara mode gelap dan terang.' },
      { title: 'Kelola notifikasi', desc: 'Di menu Notifikasi, atur mana notifikasi yang ingin kamu terima (pesanan baru, stok rendah, dll.).' },
      { title: 'Upgrade paket', desc: 'Buka menu Langganan untuk lihat fitur Pro dan upgrade dari paket Starter.' },
    ],
  },
]

export default function HelpDrawer({ open, onClose }) {
  const [active, setActive] = useState('dashboard')
  const section = SECTIONS.find(s => s.key === active) || SECTIONS[0]

  if (!open) return null

  return (
    <>
      <div className="help-overlay" onClick={onClose} />
      <aside className="help-drawer">
        {/* Header */}
        <div className="help-header">
          <div className="help-header-title">
            <span className="help-badge">Panduan</span>
            <span>Cara Pakai UMKM Hub</span>
          </div>
          <button className="help-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="help-body">
          {/* Left: section nav */}
          <nav className="help-nav">
            <div className="help-nav-label">MENU</div>
            {SECTIONS.map(s => (
              <button
                key={s.key}
                className={`help-nav-item ${active === s.key ? 'active' : ''}`}
                onClick={() => setActive(s.key)}
                style={active === s.key ? { '--sec-color': s.color } : {}}
              >
                <div className="help-nav-icon" style={{ background: active === s.key ? s.color + '20' : undefined, color: active === s.key ? s.color : undefined }}>
                  <s.icon size={14} />
                </div>
                <span>{s.label}</span>
                {active === s.key && <ChevronRight size={12} className="help-nav-chevron" />}
              </button>
            ))}
          </nav>

          {/* Right: steps */}
          <div className="help-content">
            <div className="help-content-header">
              <div className="help-content-icon" style={{ background: section.color + '20', color: section.color }}>
                <section.icon size={20} />
              </div>
              <div>
                <div className="help-content-title">{section.label}</div>
                <div className="help-content-desc">{section.desc}</div>
              </div>
            </div>

            <div className="help-steps">
              {section.steps.map((step, i) => (
                <div key={i} className="help-step">
                  <div className="help-step-num" style={{ background: section.color + '18', color: section.color }}>
                    {i + 1}
                  </div>
                  <div className="help-step-body">
                    <div className="help-step-title">{step.title}</div>
                    <div className="help-step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link to={section.path} className="help-goto-btn" onClick={onClose}
              style={{ background: section.color + '15', color: section.color, borderColor: section.color + '40' }}>
              Buka halaman {section.label} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
