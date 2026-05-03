import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext.jsx'
import * as db from '../lib/db.js'

export function useOrders(filters = {}) {
  const { user } = useApp()
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await db.getOrders(user.id, filters)
    setOrders(data || [])
    setError(error?.message || null)
    setLoading(false)
  }, [user, filters.status, filters.channel])

  useEffect(() => { fetch() }, [fetch])

  const createOrder = async (payload) => {
    const { data, error } = await db.createOrder(user.id, payload)
    if (!error) setOrders(prev => [data, ...prev])
    return { data, error }
  }

  const updateStatus = async (id, status, extra = {}) => {
    const { data, error } = await db.updateOrderStatus(id, status, extra)
    if (!error) setOrders(prev => prev.map(o => o.id === id ? data : o))
    return { data, error }
  }

  const deleteOrder = async (id) => {
    const { error } = await db.deleteOrder(id)
    if (!error) setOrders(prev => prev.filter(o => o.id !== id))
    return { error }
  }

  return { orders, loading, error, refetch: fetch, createOrder, updateStatus, deleteOrder }
}

export function useOrderStats() {
  const { user } = useApp()
  const [stats,   setStats]   = useState(null)
  const [chart,   setChart]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    Promise.all([
      db.getOrderStats(user.id),
      db.getRevenueChart(user.id),
    ]).then(([statsRes, chartRes]) => {
      setStats(statsRes.data)
      setChart(chartRes.data || [])
      setLoading(false)
    })
  }, [user])

  return { stats, chart, loading }
}
