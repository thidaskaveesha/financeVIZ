'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import Papa from 'papaparse'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0]
    if (uploadedFile) {
      if (uploadedFile.type !== 'text/csv' && !uploadedFile.name.endsWith('.csv')) {
        setError('Please upload a valid CSV file.')
        setFile(null)
        return
      }
      setFile(uploadedFile)
      setError(null)
      setSuccess(false)
    }
  }

  const handleProcessCSV = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) throw new Error('Not authenticated')

          // Validate headers
          const expectedHeaders = ['date', 'time', 'type', 'description', 'category', 'amount']
          const headers = results.meta.fields.map(h => h.trim().toLowerCase())
          
          for (const header of expectedHeaders) {
            if (!headers.includes(header)) {
              throw new Error(`Missing required column: ${header}`)
            }
          }

          const { data: categories } = await supabase
            .from('categories')
            .select('*')
            .or(`user_id.eq.${user.id},is_default.eq.true`)

          const transactionsToInsert = []

          for (const row of results.data) {
            // Get data lowercase key or actual key regardless of case
            const getVal = (key) => {
              const actualKey = Object.keys(row).find(k => k.trim().toLowerCase() === key)
              return row[actualKey]?.trim()
            }

            const date = getVal('date')
            const time = getVal('time') || null
            const type = getVal('type')?.toLowerCase()
            const desc = getVal('description')
            const catName = getVal('category')
            const amount = parseFloat(getVal('amount'))

            if (!date) throw new Error('Row missing date: ' + JSON.stringify(row))
            if (type !== 'profit' && type !== 'loss') throw new Error('Invalid type: ' + type)
            if (isNaN(amount) || amount <= 0) throw new Error('Invalid amount: ' + getVal('amount'))

            let catId = null
            if (catName) {
              const matchedCat = categories.find(c => c.name.toLowerCase() === catName.toLowerCase())
              if (matchedCat) {
                catId = matchedCat.id
              } else {
                // If category doesn't exist, we should ideally create it. For now, assign null.
                const { data: newCat } = await supabase
                    .from('categories')
                    .insert({ name: catName, user_id: user.id })
                    .select()
                    .single()
                if (newCat) {
                   catId = newCat.id
                   categories.push(newCat)
                }
              }
            }

            transactionsToInsert.push({
              user_id: user.id,
              transaction_date: date,
              transaction_time: time,
              transaction_type: type,
              description: desc || 'Imported Transaction',
              category_id: catId,
              amount: amount
            })
          }

          const { error: insertError } = await supabase.from('transactions').insert(transactionsToInsert)
          if (insertError) throw insertError

          setSuccess(true)
          setFile(null)
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)

        } catch (err) {
          setError(err.message || 'Error processing file')
        } finally {
          setLoading(false)
        }
      },
      error: (err) => {
        setError(err.message)
        setLoading(false)
      }
    })
  }

  return (
    <>
      <header className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Upload Transactions
        </h1>
        <p className="text-neutral-400 mt-1">Import your financial records via CSV.</p>
      </header>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-2xl mx-auto mt-10 shadow-xl">
        {success ? (
          <div className="text-center py-10">
            <CheckCircle className="mx-auto text-emerald-400 mb-4" size={64} />
            <h2 className="text-2xl font-bold mb-2">Upload Successful!</h2>
            <p className="text-neutral-400">Your transactions have been imported.</p>
            <p className="text-sm text-neutral-500 mt-2">Redirecting to dashboard...</p>
          </div>
        ) : (
          <>
            <div className="border-2 border-dashed border-neutral-700 rounded-xl p-10 text-center hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors group cursor-pointer relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              <div className="text-neutral-400 group-hover:text-emerald-400 transition-colors flex flex-col items-center">
                {file ? (
                  <FileText size={48} className="mb-4" />
                ) : (
                  <Upload size={48} className="mb-4" />
                )}
                <h3 className="text-lg font-medium text-white mb-1">
                  {file ? file.name : 'Click or drag CSV file to upload'}
                </h3>
                <p className="text-sm">
                  {file ? `${(file.size / 1024).toFixed(2)} KB` : 'CSV format: date, time, type, description, category, amount'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start text-red-500">
                <AlertCircle size={20} className="mr-3 mt-0.5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleProcessCSV}
              disabled={!file || loading}
              className={`mt-6 w-full py-3 rounded-lg font-medium transition-colors ${
                !file || loading 
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              }`}
            >
              {loading ? 'Processing...' : 'Import Data'}
            </button>
            
            <div className="mt-8">
              <h4 className="font-medium text-neutral-300 mb-3">Expected CSV Example:</h4>
              <pre className="bg-neutral-950 p-4 rounded-lg text-sm text-neutral-400 overflow-x-auto border border-neutral-800 select-all font-mono">
date,time,type,description,category,amount{'\n'}
2026-03-01,10:20,profit,Salary,Salary,2500{'\n'}
2026-03-02,,loss,Groceries,Food,120{'\n'}
2026-03-03,18:10,loss,Restaurant,Food,45
              </pre>
            </div>
          </>
        )}
      </div>
    </>
  )
}
