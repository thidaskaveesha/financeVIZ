import { createClient } from '@/utils/supabase/server'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard | FinanceVIZ',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch quick stats
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })

  const income = transactions
    ?.filter(t => t.transaction_type === 'profit')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0

  const expenses = transactions
    ?.filter(t => t.transaction_type === 'loss')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0) || 0

  const balance = income - expenses

  return (
    <>
      <header className="flex justify-between items-center bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-neutral-400 mt-1">Welcome back, here's your financial overview.</p>
        </div>
        <Link 
          href="/transactions" 
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg flex items-center font-medium transition-colors shadow-lg shadow-emerald-500/20"
        >
          <Plus size={18} className="mr-2" />
          Add Transaction
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl">
          <p className="text-neutral-400 text-sm font-medium mb-1">Total Income</p>
          <p className="text-3xl font-bold text-emerald-400">${income.toFixed(2)}</p>
        </div>
        
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl">
          <p className="text-neutral-400 text-sm font-medium mb-1">Total Expenses</p>
          <p className="text-3xl font-bold text-red-400">${expenses.toFixed(2)}</p>
        </div>

        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl">
          <p className="text-neutral-400 text-sm font-medium mb-1">Net Balance</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl min-h-[400px]">
          <h2 className="text-xl font-bold mb-6">Income vs Expenses</h2>
          {/* Chart placeholder - in next step we will add Recharts */}
          <div className="text-neutral-500 flex items-center justify-center h-full pb-10">
            Charts will be visualized here
          </div>
        </div>

        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-800 shadow-xl overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Activity</h2>
            <Link href="/transactions" className="text-sm text-emerald-400 hover:text-emerald-300">
              View all
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {transactions?.slice(0, 5).map((t) => (
              <div key={t.id} className="flex justify-between items-center p-3 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 transition-colors">
                <div>
                  <p className="font-medium">{t.description}</p>
                  <p className="text-xs text-neutral-400">{new Date(t.transaction_date).toLocaleDateString()}</p>
                </div>
                <div className={`font-bold ${t.transaction_type === 'profit' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {t.transaction_type === 'profit' ? '+' : '-'}${parseFloat(t.amount).toFixed(2)}
                </div>
              </div>
            ))}
            {(!transactions || transactions.length === 0) && (
              <p className="text-neutral-500 text-center py-6">No recent transactions</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
