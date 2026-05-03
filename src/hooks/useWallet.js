import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext.jsx'
import * as db from '../lib/db.js'

export function useWallet() {
  const { user, fetchProfile } = useApp()
  const [transactions, setTransactions] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await db.getWalletTransactions(user.id)
    setTransactions(data || [])
    setError(error?.message || null)
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const addTransaction = async (payload) => {
    const { data, error } = await db.addWalletTransaction(user.id, payload)
    if (!error) {
      setTransactions(prev => [data.transaction, ...prev])
      await fetchProfile(user.id) // refresh wallet_balance in profile
    }
    return { data, error }
  }

  return { transactions, loading, error, refetch: fetch, addTransaction }
}
