'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function NewTransactionPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  
  useEffect(() => {
    async function loadCategories() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('categories')
          .select('*')
          .or(`user_id.eq.${user.id},is_default.eq.true`)
        setCategories(data || [])
      }
    }
    loadCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.target)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const amt = parseFloat(formData.get('amount'))
      if (isNaN(amt) || amt <= 0) throw new Error('Invalid amount')

      const { error: insertError } = await supabase.from('transactions').insert({
        user_id: user.id,
        transaction_date: formData.get('date'),
        transaction_time: formData.get('time') || null,
        transaction_type: formData.get('type'),
        description: formData.get('description'),
        category_id: formData.get('category') || null,
        amount: amt
      })

      if (insertError) throw insertError
      
      router.push('/transactions')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <>
      <header className="mb-6">
        <Link href="/transactions" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-4 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          Back to Transactions
        </Link>
        <h1 className="text-3xl font-bold">Add Transaction</h1>
      </header>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-2xl shadow-xl">
        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Date <span className="text-red-400">*</span></label>
              <input 
                type="date" 
                name="date" 
                required 
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Time</label>
              <input 
                type="time" 
                name="time"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                defaultValue={new Date().toTimeString().split(' ')[0].substring(0,5)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Type <span className="text-red-400">*</span></label>
              <select 
                name="type" 
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="loss">Expense (Loss)</option>
                <option value="profit">Income (Profit)</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-400">Category <span className="text-red-400">*</span></label>
              <select 
                name="category" 
                required
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-400">Amount <span className="text-red-400">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">$</span>
              <input 
                type="number" 
                name="amount" 
                required 
                step="0.01"
                min="0.01"
                placeholder="0.00"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 pl-8 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-400">Description <span className="text-red-400">*</span></label>
            <input 
              type="text" 
              name="description" 
              required 
              placeholder="E.g., Grocery shopping"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-lg shadow-lg shadow-emerald-500/20 transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? 'Saving...' : (
              <>
                <CheckCircle size={18} className="mr-2" />
                Save Transaction
              </>
            )}
          </button>
        </form>
      </div>
    </>
  )
}
