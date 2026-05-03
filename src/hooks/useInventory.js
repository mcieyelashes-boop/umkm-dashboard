import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext.jsx'
import * as db from '../lib/db.js'

export function useInventory() {
  const { user } = useApp()
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await db.getProducts(user.id)
    setProducts(data || [])
    setError(error?.message || null)
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const createProduct = async (payload) => {
    const { data, error } = await db.createProduct(user.id, payload)
    if (!error) setProducts(prev => [data, ...prev])
    return { data, error }
  }

  const updateProduct = async (id, payload) => {
    const { data, error } = await db.updateProduct(id, payload)
    if (!error) setProducts(prev => prev.map(p => p.id === id ? data : p))
    return { data, error }
  }

  const adjustStock = async (id, newStock) => {
    const { data, error } = await db.adjustStock(id, newStock)
    if (!error) setProducts(prev => prev.map(p => p.id === id ? data : p))
    return { data, error }
  }

  const deleteProduct = async (id) => {
    const { error } = await db.deleteProduct(id)
    if (!error) setProducts(prev => prev.filter(p => p.id !== id))
    return { error }
  }

  return { products, loading, error, refetch: fetch, createProduct, updateProduct, adjustStock, deleteProduct }
}
