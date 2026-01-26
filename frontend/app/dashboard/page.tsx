'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { BarChart3, LogOut, User } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, logout } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navigation */}
      <nav className="border-b border-dark-border bg-dark-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold text-white">financeVIZ</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-dark-muted" />
                <span className="text-white">{user.username}</span>
                <span className="bg-primary-600/20 text-primary-400 text-xs px-2 py-1 rounded-full">
                  {user.subscription_level}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center text-dark-muted hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.username}!</h1>
          <p className="text-dark-muted">
            Your financial dashboard is ready. Start tracking your finances today.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total Balance</h3>
            <p className="text-3xl font-bold text-primary-400">$0.00</p>
            <p className="text-sm text-dark-muted mt-2">Start adding transactions</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">This Month</h3>
            <p className="text-3xl font-bold text-white">$0.00</p>
            <p className="text-sm text-dark-muted mt-2">Income vs Expenses</p>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Subscription</h3>
            <p className="text-xl font-bold text-white capitalize">{user.subscription_level}</p>
            {user.subscription_level === 'free' && (
              <p className="text-sm text-primary-400 mt-2">Upgrade to Pro for AI insights</p>
            )}
          </div>
        </div>

        {/* Placeholder for charts */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <h2 className="text-xl font-semibold text-white mb-4">Financial Overview</h2>
          <div className="h-64 flex items-center justify-center text-dark-muted border-2 border-dashed border-dark-border rounded-lg">
            Charts and visualizations will appear here
          </div>
        </div>
      </main>
    </div>
  )
}
