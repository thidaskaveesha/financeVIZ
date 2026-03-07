import { createClient } from '@/utils/supabase/server'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Transactions | FinanceVIZ',
}

export default async function TransactionsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*, categories(name)')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })

  return (
    <>
      <header className="flex justify-between items-center bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Transactions
          </h1>
          <p className="text-neutral-400 mt-1">Manage all your financial records.</p>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/upload" 
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2.5 rounded-lg flex items-center font-medium transition-colors"
          >
            Upload CSV
          </Link>
          <Link 
            href="/transactions/new" 
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg flex items-center font-medium transition-colors shadow-lg shadow-emerald-500/20"
          >
            <Plus size={18} className="mr-2" />
            Add Transaction
          </Link>
        </div>
      </header>

      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 shadow-xl overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-950/50 border-b border-neutral-800">
                <th className="py-4 px-6 text-neutral-400 font-medium whitespace-nowrap">Date</th>
                <th className="py-4 px-6 text-neutral-400 font-medium whitespace-nowrap">Description</th>
                <th className="py-4 px-6 text-neutral-400 font-medium whitespace-nowrap">Category</th>
                <th className="py-4 px-6 text-neutral-400 font-medium whitespace-nowrap text-right">Amount</th>
                <th className="py-4 px-6 text-neutral-400 font-medium whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions?.map((t) => (
                <tr key={t.id} className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors">
                  <td className="py-4 px-6 whitespace-nowrap">
                    {new Date(t.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap font-medium">
                    {t.description}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-xs">
                      {t.categories?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className={`py-4 px-6 whitespace-nowrap text-right font-bold ${
                    t.transaction_type === 'profit' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {t.transaction_type === 'profit' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                  </td>
                  <td className="py-4 px-6 whitespace-nowrap text-center">
                    <Link href={`/transactions/${t.id}`} className="text-neutral-400 hover:text-white mx-2 transition-colors">Edit</Link>
                    <button className="text-neutral-400 hover:text-red-400 mx-2 transition-colors">Delete</button>
                  </td>
                </tr>
              ))}
              {(!transactions || transactions.length === 0) && (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-neutral-500">
                    No transactions found. Add a transaction or upload a CSV.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
