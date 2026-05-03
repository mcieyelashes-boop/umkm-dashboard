/**
 * UMKM Hub — Supabase data service
 * All DB calls go through this file. Each function takes userId + payload,
 * returns { data, error }.
 */
import { supabase } from './supabase.js'

/* ── helpers ─────────────────────────────────────────────────────── */
const handle = async (promise) => {
  const { data, error } = await promise
  return { data, error }
}

/* ══ PRODUCTS / INVENTORY ════════════════════════════════════════ */
export const getProducts = (userId) =>
  handle(supabase.from('products').select('*').eq('user_id', userId).order('created_at', { ascending: false }))

export const createProduct = (userId, payload) =>
  handle(supabase.from('products').insert({ ...payload, user_id: userId }).select().single())

export const updateProduct = (id, payload) =>
  handle(supabase.from('products').update(payload).eq('id', id).select().single())

export const deleteProduct = (id) =>
  handle(supabase.from('products').delete().eq('id', id))

export const adjustStock = (id, newStock) =>
  handle(supabase.from('products').update({ stock: newStock }).eq('id', id).select().single())

/* ══ ORDERS ══════════════════════════════════════════════════════ */
export const getOrders = (userId, { status, channel, limit } = {}) => {
  let q = supabase.from('orders').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  if (status && status !== 'all') q = q.eq('status', status)
  if (channel && channel !== 'all') q = q.eq('channel', channel)
  if (limit) q = q.limit(limit)
  return handle(q)
}

export const createOrder = (userId, payload) =>
  handle(supabase.from('orders').insert({ ...payload, user_id: userId }).select().single())

export const updateOrderStatus = (id, status, extra = {}) =>
  handle(supabase.from('orders').update({ status, ...extra }).eq('id', id).select().single())

export const deleteOrder = (id) =>
  handle(supabase.from('orders').delete().eq('id', id))

/* ── Order aggregates for dashboard ── */
export const getOrderStats = async (userId) => {
  const { data, error } = await supabase
    .from('orders')
    .select('total, status, created_at')
    .eq('user_id', userId)
  if (error) return { data: null, error }

  const today = new Date().toDateString()
  const todayOrders = (data || []).filter(o => new Date(o.created_at).toDateString() === today)

  return {
    data: {
      total:       data?.length ?? 0,
      today:       todayOrders.length,
      revenue:     data?.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0) ?? 0,
      todayRevenue:todayOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
      pending:     data?.filter(o => o.status === 'new' || o.status === 'processing').length ?? 0,
      shipped:     data?.filter(o => o.status === 'shipped').length ?? 0,
    },
    error: null,
  }
}

/* ── Revenue chart (last 7 days) ── */
export const getRevenueChart = async (userId) => {
  const since = new Date()
  since.setDate(since.getDate() - 6)
  since.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('orders')
    .select('total, status, created_at')
    .eq('user_id', userId)
    .gte('created_at', since.toISOString())

  if (error) return { data: null, error }

  const DAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  const chart = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dayStr = d.toDateString()
    const dayOrders = (data || []).filter(o => new Date(o.created_at).toDateString() === dayStr)
    chart.push({
      name: DAYS_ID[d.getDay()],
      revenue: dayOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
      orders:  dayOrders.length,
    })
  }
  return { data: chart, error: null }
}

/* ══ CRM CONTACTS ════════════════════════════════════════════════ */
export const getCRMContacts = (userId) =>
  handle(supabase.from('crm_contacts').select('*').eq('user_id', userId).order('created_at', { ascending: false }))

export const createContact = (userId, payload) =>
  handle(supabase.from('crm_contacts').insert({ ...payload, user_id: userId }).select().single())

export const updateContact = (id, payload) =>
  handle(supabase.from('crm_contacts').update(payload).eq('id', id).select().single())

export const deleteContact = (id) =>
  handle(supabase.from('crm_contacts').delete().eq('id', id))

/* ══ CRM DEALS ═══════════════════════════════════════════════════ */
export const getCRMDeals = (userId) =>
  handle(supabase.from('crm_deals').select('*').eq('user_id', userId).order('created_at', { ascending: false }))

export const createDeal = (userId, payload) =>
  handle(supabase.from('crm_deals').insert({ ...payload, user_id: userId }).select().single())

export const updateDeal = (id, payload) =>
  handle(supabase.from('crm_deals').update(payload).eq('id', id).select().single())

export const deleteDeal = (id) =>
  handle(supabase.from('crm_deals').delete().eq('id', id))

/* ══ WALLET ══════════════════════════════════════════════════════ */
export const getWalletTransactions = (userId) =>
  handle(supabase.from('wallet_transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }))

export const addWalletTransaction = async (userId, { type, description, amount }) => {
  // Use atomic Postgres RPC to prevent race conditions (TOCTOU).
  // The DB function locks the profile row with SELECT FOR UPDATE before deducting.
  const { data: result, error: rpcErr } = await supabase.rpc('wallet_transact', {
    p_user_id:    userId,
    p_type:       type,
    p_description: description,
    p_amount:     Math.abs(amount),
  })

  if (rpcErr) return { data: null, error: rpcErr }

  // The RPC returns { error, new_balance, transaction }
  if (result?.error) return { data: null, error: { message: result.error } }

  return {
    data:  { transaction: result.transaction, newBalance: result.new_balance },
    error: null,
  }
}

/* ══ PROFILE ═════════════════════════════════════════════════════ */
export const updateProfile = (userId, payload) =>
  handle(supabase.from('profiles').update(payload).eq('id', userId).select().single())
