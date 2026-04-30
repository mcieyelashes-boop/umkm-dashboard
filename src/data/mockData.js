export const businessProfile = {
  name: 'Toko Berkah Jaya',
  owner: 'Andi Pratama',
  avatar: 'AP',
  plan: 'Business Pro',
  walletBalance: 4850000,
  registeredAt: '2024-08-12',
}

export const overviewStats = [
  { label: 'Total Pendapatan', value: 'Rp 142.8M', change: '+18.2%', positive: true, icon: 'wallet' },
  { label: 'Pesanan', value: '2,847', change: '+12.5%', positive: true, icon: 'shopping' },
  { label: 'Pengunjung Web', value: '38.4K', change: '+24.1%', positive: true, icon: 'globe' },
  { label: 'Engagement Sosmed', value: '12.6K', change: '+8.7%', positive: true, icon: 'heart' },
]

export const revenueChart = [
  { name: 'Sen', revenue: 12400000, orders: 142 },
  { name: 'Sel', revenue: 15800000, orders: 178 },
  { name: 'Rab', revenue: 13200000, orders: 156 },
  { name: 'Kam', revenue: 19600000, orders: 218 },
  { name: 'Jum', revenue: 22400000, orders: 245 },
  { name: 'Sab', revenue: 28900000, orders: 312 },
  { name: 'Min', revenue: 24600000, orders: 268 },
]

export const channelDistribution = [
  { name: 'Website', value: 35, color: '#6366f1' },
  { name: 'Tokopedia', value: 28, color: '#10b981' },
  { name: 'Shopee', value: 22, color: '#f59e0b' },
  { name: 'Instagram', value: 10, color: '#ec4899' },
  { name: 'WhatsApp', value: 5, color: '#06b6d4' },
]

export const products = [
  { id: 1, name: 'Kemeja Batik Premium', sku: 'BTK-001', price: 285000, stock: 142, sold: 856, category: 'Fashion', image: 'shirt', status: 'active' },
  { id: 2, name: 'Tas Kulit Asli Handmade', sku: 'TAS-014', price: 450000, stock: 38, sold: 312, category: 'Aksesoris', image: 'bag', status: 'active' },
  { id: 3, name: 'Kopi Arabika Gayo 500g', sku: 'KPI-008', price: 125000, stock: 256, sold: 1240, category: 'F&B', image: 'coffee', status: 'active' },
  { id: 4, name: 'Hijab Premium Voal', sku: 'HJB-022', price: 89000, stock: 8, sold: 642, category: 'Fashion', image: 'scarf', status: 'low' },
  { id: 5, name: 'Madu Hutan Murni 250ml', sku: 'MDU-003', price: 165000, stock: 0, sold: 428, category: 'F&B', image: 'honey', status: 'out' },
  { id: 6, name: 'Sepatu Kulit Casual', sku: 'SPT-019', price: 520000, stock: 64, sold: 198, category: 'Fashion', image: 'shoe', status: 'active' },
]

export const recentOrders = [
  { id: 'INV-2847', customer: 'Siti Nurhaliza', product: 'Kemeja Batik Premium', amount: 285000, status: 'paid', channel: 'Website', date: '14:32' },
  { id: 'INV-2846', customer: 'Budi Santoso', product: 'Kopi Arabika Gayo', amount: 250000, status: 'shipped', channel: 'Tokopedia', date: '14:18' },
  { id: 'INV-2845', customer: 'Maya Wijaya', product: 'Tas Kulit Handmade', amount: 450000, status: 'processing', channel: 'Instagram', date: '13:45' },
  { id: 'INV-2844', customer: 'Rudi Hermawan', product: 'Hijab Premium', amount: 178000, status: 'paid', channel: 'Shopee', date: '13:20' },
  { id: 'INV-2843', customer: 'Lina Marlina', product: 'Sepatu Kulit Casual', amount: 520000, status: 'pending', channel: 'WhatsApp', date: '12:58' },
  { id: 'INV-2842', customer: 'Doni Kusuma', product: 'Madu Hutan 250ml', amount: 330000, status: 'delivered', channel: 'Website', date: '12:10' },
]

export const socialAccounts = [
  { platform: 'Instagram', handle: '@tokoberkahjaya', followers: 24800, engagement: 4.8, posts: 312, color: '#ec4899', icon: 'instagram' },
  { platform: 'TikTok', handle: '@berkahjaya.id', followers: 18400, engagement: 7.2, posts: 89, color: '#06b6d4', icon: 'tiktok' },
  { platform: 'Facebook', handle: 'Toko Berkah Jaya', followers: 12600, engagement: 2.4, posts: 248, color: '#6366f1', icon: 'facebook' },
  { platform: 'YouTube', handle: 'Berkah Jaya Channel', followers: 4200, engagement: 5.6, posts: 42, color: '#ef4444', icon: 'youtube' },
]

export const scheduledPosts = [
  { id: 1, content: 'Promo flash sale akhir bulan! Diskon hingga 40% untuk semua produk batik', platforms: ['instagram', 'facebook', 'tiktok'], scheduledAt: 'Besok, 10:00', status: 'scheduled' },
  { id: 2, content: 'Tutorial styling hijab voal premium untuk acara formal', platforms: ['instagram', 'tiktok'], scheduledAt: 'Senin, 14:30', status: 'scheduled' },
  { id: 3, content: 'Behind the scene proses pembuatan tas kulit handmade', platforms: ['youtube', 'instagram'], scheduledAt: 'Selasa, 16:00', status: 'draft' },
]

export const chatMessages = [
  { id: 1, from: 'Siti Nurhaliza', platform: 'WhatsApp', preview: 'Halo, masih ready stock kemeja batik size L?', time: '2 mnt', unread: 2, avatar: 'SN', online: true },
  { id: 2, from: 'Budi Santoso', platform: 'Instagram', preview: 'Mau order 3 pcs kopi arabica, bisa dapat diskon?', time: '15 mnt', unread: 1, avatar: 'BS', online: true },
  { id: 3, from: 'Maya Wijaya', platform: 'Tokopedia', preview: 'Pesanan saya sudah dikirim belum ya?', time: '32 mnt', unread: 0, avatar: 'MW', online: false },
  { id: 4, from: 'Rudi Hermawan', platform: 'Shopee', preview: 'Terima kasih, barang sudah sampai dengan baik', time: '1 jam', unread: 0, avatar: 'RH', online: false },
  { id: 5, from: 'Lina Marlina', platform: 'WhatsApp', preview: 'Bisa cod di area Jakarta Selatan?', time: '2 jam', unread: 3, avatar: 'LM', online: true },
  { id: 6, from: 'Doni Kusuma', platform: 'Facebook', preview: 'Apakah madu hutan sudah BPOM?', time: '3 jam', unread: 0, avatar: 'DK', online: false },
]

export const conversation = [
  { id: 1, from: 'them', text: 'Halo kak, masih ready stock kemeja batik premium size L?', time: '14:25' },
  { id: 2, from: 'me', text: 'Halo kak Siti, untuk size L masih ready ya. Mau ambil warna apa?', time: '14:26' },
  { id: 3, from: 'them', text: 'Yang motif parang biru ada kak?', time: '14:28' },
  { id: 4, from: 'me', text: 'Ada kak, stoknya 8 pcs. Harga Rp 285.000', time: '14:29' },
  { id: 5, from: 'them', text: 'Boleh kak, saya order 1. Bisa COD?', time: '14:30' },
  { id: 6, from: 'me', text: 'Bisa kak. Lokasinya di mana ya?', time: '14:31' },
  { id: 7, from: 'them', text: 'Halo, masih ready stock kemeja batik size L?', time: '14:32' },
]

export const paymentMethods = [
  { name: 'QRIS', icon: 'qr', volume: 856, amount: 48200000, fee: 0.7, status: 'active' },
  { name: 'GoPay', icon: 'wallet', volume: 412, amount: 26800000, fee: 1.5, status: 'active' },
  { name: 'OVO', icon: 'wallet', volume: 318, amount: 19400000, fee: 1.5, status: 'active' },
  { name: 'DANA', icon: 'wallet', volume: 286, amount: 17200000, fee: 1.5, status: 'active' },
  { name: 'Bank Transfer', icon: 'building', volume: 624, amount: 84600000, fee: 0, status: 'active' },
  { name: 'Kartu Kredit', icon: 'card', volume: 142, amount: 18800000, fee: 2.9, status: 'active' },
]

export const transactions = [
  { id: 'TRX-9821', method: 'QRIS', amount: 285000, fee: 1995, customer: 'Siti N.', status: 'success', time: '14:32' },
  { id: 'TRX-9820', method: 'GoPay', amount: 450000, fee: 6750, customer: 'Maya W.', status: 'success', time: '13:45' },
  { id: 'TRX-9819', method: 'Bank Transfer', amount: 178000, fee: 0, customer: 'Rudi H.', status: 'success', time: '13:20' },
  { id: 'TRX-9818', method: 'OVO', amount: 520000, fee: 7800, customer: 'Lina M.', status: 'pending', time: '12:58' },
  { id: 'TRX-9817', method: 'DANA', amount: 125000, fee: 1875, customer: 'Andi K.', status: 'success', time: '12:30' },
  { id: 'TRX-9816', method: 'Kartu Kredit', amount: 1240000, fee: 35960, customer: 'Sari D.', status: 'failed', time: '12:15' },
]

export const walletTransactions = [
  { id: 1, type: 'topup', description: 'Top up via Bank Transfer', amount: 2000000, balance: 4850000, date: 'Hari ini, 09:15', status: 'success' },
  { id: 2, type: 'spend', description: 'Generate video AI - Kie.ai', amount: -350000, balance: 2850000, date: 'Kemarin, 15:42', status: 'success' },
  { id: 3, type: 'spend', description: 'Langganan Business Pro - April', amount: -499000, balance: 3200000, date: '3 hari lalu', status: 'success' },
  { id: 4, type: 'topup', description: 'Top up via QRIS', amount: 1500000, balance: 3699000, date: '5 hari lalu', status: 'success' },
  { id: 5, type: 'spend', description: 'Boost iklan Instagram Ads', amount: -750000, balance: 2199000, date: '1 minggu lalu', status: 'success' },
  { id: 6, type: 'spend', description: 'Generate copywriting AI x10', amount: -125000, balance: 2949000, date: '1 minggu lalu', status: 'success' },
]

export const subscriptionPlan = {
  current: 'Business Pro',
  price: 499000,
  billingCycle: 'bulanan',
  nextBilling: '2026-05-12',
  features: [
    'Unlimited produk & order',
    'Integrasi 5+ marketplace',
    'AI Content Studio',
    'Analytics advanced',
    'Priority support 24/7',
  ],
}

export const aiServices = [
  { id: 1, name: 'Video Generator AI', provider: 'Kie.ai', description: 'Buat video promosi otomatis dengan AI dari teks atau foto produk', price: 'Mulai Rp 35.000', icon: 'video', gradient: 'primary', popular: true },
  { id: 2, name: 'Image Generator', provider: 'Stable Diffusion', description: 'Generate foto produk profesional, mockup, dan ilustrasi marketing', price: 'Mulai Rp 5.000', icon: 'image', gradient: 'cyan' },
  { id: 3, name: 'Copywriting AI', provider: 'Claude AI', description: 'Caption, deskripsi produk, dan konten marketing yang menjual', price: 'Mulai Rp 2.500', icon: 'pen', gradient: 'emerald' },
  { id: 4, name: 'Voice Over AI', provider: 'ElevenLabs', description: 'Voice over berkualitas studio untuk video iklan dan TikTok', price: 'Mulai Rp 15.000', icon: 'mic', gradient: 'amber' },
  { id: 5, name: 'Logo & Brand Kit', provider: 'AI Designer', description: 'Logo, color palette, dan brand identity lengkap dalam menit', price: 'Mulai Rp 75.000', icon: 'palette', gradient: 'pink' },
  { id: 6, name: 'Avatar AI Influencer', provider: 'Synthesia', description: 'Buat avatar AI yang bisa jadi brand ambassador virtual', price: 'Mulai Rp 125.000', icon: 'user', gradient: 'violet' },
]

export const recentVideos = [
  { id: 1, title: 'Promo Batik Premium', duration: '0:30', thumbnail: 'video1', date: 'Hari ini', cost: 35000, status: 'completed' },
  { id: 2, title: 'Unboxing Tas Kulit', duration: '0:45', thumbnail: 'video2', date: 'Kemarin', cost: 50000, status: 'completed' },
  { id: 3, title: 'Tutorial Hijab Voal', duration: '1:00', thumbnail: 'video3', date: '2 hari lalu', cost: 65000, status: 'completed' },
  { id: 4, title: 'Story Brand Kopi Gayo', duration: '0:30', thumbnail: 'video4', date: 'Generating...', cost: 35000, status: 'processing' },
]

export const websitePages = [
  { id: 1, title: 'Beranda', slug: '/', visits: 12400, conversionRate: 4.8, status: 'published' },
  { id: 2, title: 'Katalog Produk', slug: '/produk', visits: 8200, conversionRate: 7.2, status: 'published' },
  { id: 3, title: 'Tentang Kami', slug: '/tentang', visits: 2400, conversionRate: 1.2, status: 'published' },
  { id: 4, title: 'Blog & Tips', slug: '/blog', visits: 5600, conversionRate: 2.8, status: 'published' },
  { id: 5, title: 'Kontak', slug: '/kontak', visits: 1800, conversionRate: 8.4, status: 'published' },
  { id: 6, title: 'Promo Akhir Tahun', slug: '/promo-2025', visits: 0, conversionRate: 0, status: 'draft' },
]

export const websiteAnalytics = [
  { name: '00:00', visitors: 124 },
  { name: '04:00', visitors: 86 },
  { name: '08:00', visitors: 312 },
  { name: '12:00', visitors: 524 },
  { name: '16:00', visitors: 642 },
  { name: '20:00', visitors: 458 },
]

export const integrations = [
  { name: 'Tokopedia', status: 'connected', orders: 856, lastSync: '5 mnt lalu', logo: 'T' },
  { name: 'Shopee', status: 'connected', orders: 642, lastSync: '8 mnt lalu', logo: 'S' },
  { name: 'TikTok Shop', status: 'connected', orders: 312, lastSync: '12 mnt lalu', logo: 'TT' },
  { name: 'Lazada', status: 'disconnected', orders: 0, lastSync: '-', logo: 'L' },
  { name: 'Bukalapak', status: 'pending', orders: 0, lastSync: '-', logo: 'B' },
  { name: 'Blibli', status: 'disconnected', orders: 0, lastSync: '-', logo: 'BL' },
]
