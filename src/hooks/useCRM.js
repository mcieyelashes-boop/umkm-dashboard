import { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext.jsx'
import * as db from '../lib/db.js'

export function useCRM() {
  const { user } = useApp()
  const [contacts, setContacts] = useState([])
  const [deals,    setDeals]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const [contactsRes, dealsRes] = await Promise.all([
      db.getCRMContacts(user.id),
      db.getCRMDeals(user.id),
    ])
    setContacts(contactsRes.data || [])
    setDeals(dealsRes.data || [])
    setError(contactsRes.error?.message || dealsRes.error?.message || null)
    setLoading(false)
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  /* Contacts */
  const createContact = async (payload) => {
    const { data, error } = await db.createContact(user.id, payload)
    if (!error) setContacts(prev => [data, ...prev])
    return { data, error }
  }
  const updateContact = async (id, payload) => {
    const { data, error } = await db.updateContact(id, payload)
    if (!error) setContacts(prev => prev.map(c => c.id === id ? data : c))
    return { data, error }
  }
  const deleteContact = async (id) => {
    const { error } = await db.deleteContact(id)
    if (!error) setContacts(prev => prev.filter(c => c.id !== id))
    return { error }
  }

  /* Deals */
  const createDeal = async (payload) => {
    const { data, error } = await db.createDeal(user.id, payload)
    if (!error) setDeals(prev => [data, ...prev])
    return { data, error }
  }
  const updateDeal = async (id, payload) => {
    const { data, error } = await db.updateDeal(id, payload)
    if (!error) setDeals(prev => prev.map(d => d.id === id ? data : d))
    return { data, error }
  }
  const deleteDeal = async (id) => {
    const { error } = await db.deleteDeal(id)
    if (!error) setDeals(prev => prev.filter(d => d.id !== id))
    return { error }
  }

  return {
    contacts, deals, loading, error, refetch: fetch,
    createContact, updateContact, deleteContact,
    createDeal, updateDeal, deleteDeal,
  }
}
