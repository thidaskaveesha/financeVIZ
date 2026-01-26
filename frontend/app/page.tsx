'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { BarChart3, Zap, Shield, Sparkles, Code, ArrowRight, Check } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Navigation */}
      <nav className="border-b border-dark-border bg-dark-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-primary-400" />
              <span className="ml-2 text-xl font-bold text-white">financeVIZ</span>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-dark-muted hover:text-white px-4 py-2 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Visualize Your Money.
            <br />
            <span className="text-primary-400">Decide Your Future.</span>
          </h1>
          <p className="text-xl text-dark-muted mb-8 max-w-2xl mx-auto">
            financeVIZ helps you track, visualize, and understand your financial state in real time.
            Make better financial decisions with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="#pricing"
              className="bg-dark-card hover:bg-dark-surface border border-dark-border text-white px-8 py-4 rounded-lg font-medium transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything You Need to Master Your Finances
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Real-time Dashboards"
              description="Visualize your financial data with interactive charts and graphs"
            />
            <FeatureCard
              icon={<Code className="w-8 h-8" />}
              title="API Integration"
              description="Plug-and-play API integration for any application"
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8" />}
              title="AI-Powered Insights"
              description="Get investment suggestions and spending insights (Pro only)"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure & Private"
              description="Bank-level security with privacy-first architecture"
            />
          </div>
        </div>
      </section>

      {/* API Integration Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Developer-Friendly API Integration
              </h2>
              <p className="text-dark-muted mb-6">
                Generate your API key and start pushing financial data from any application.
                Your data automatically appears in your financeVIZ dashboard.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-primary-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-white">RESTful API with comprehensive documentation</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-primary-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Automatic data synchronization</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-primary-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-white">Webhook support for real-time updates</span>
                </li>
              </ul>
            </div>
            <div className="bg-dark-card border border-dark-border rounded-lg p-8">
              <div className="bg-dark-surface rounded p-4 font-mono text-sm text-dark-muted">
                <div className="text-primary-400">POST</div>
                <div className="mt-2">https://api.financeviz.com/v1/transactions</div>
                <div className="mt-4 text-white">
                  {'{'}
                  <br />
                  {'  "amount": 150.00,'}
                  <br />
                  {'  "category": "groceries",'}
                  <br />
                  {'  "date": "2024-01-15"'}
                  <br />
                  {'}'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Insights Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dark-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-primary-600/20 text-primary-400 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Pro Feature</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              AI-Powered Financial Insights
            </h2>
            <p className="text-dark-muted max-w-2xl mx-auto">
              Get personalized recommendations powered by advanced AI analysis of your financial history
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <InsightCard
              title="Spending Behavior Analysis"
              description="Understand your spending patterns and identify areas for optimization"
            />
            <InsightCard
              title="Investment Suggestions"
              description="Receive personalized investment plan recommendations based on your goals"
            />
            <InsightCard
              title="Success Milestones"
              description="Track your financial progress with AI-identified milestones"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h2>
            <p className="text-dark-muted">Start free, upgrade when you're ready</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              name="Free"
              price="$0"
              period="forever"
              features={[
                'Basic financial dashboard',
                'Manual data visualization',
                'Limited charts',
                'No AI insights',
              ]}
              cta="Get Started"
              href="/signup"
              highlight={false}
            />
            <PricingCard
              name="Pro"
              price="$9.99"
              period="month"
              features={[
                'Full dashboard access',
                'API integrations',
                'AI-powered insights',
                'Spending success tracking',
                'Priority feature updates',
              ]}
              cta="Upgrade to Pro"
              href="/signup"
              highlight={true}
            />
            <PricingCard
              name="Pro Annual"
              price="$99.99"
              period="year"
              features={[
                'Everything in Pro',
                'Save 17% annually',
                'Priority support',
                'Early access to features',
                'Custom integrations',
              ]}
              cta="Get Annual Plan"
              href="/signup"
              highlight={false}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-border bg-dark-card py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <BarChart3 className="w-6 h-6 text-primary-400" />
              <span className="ml-2 text-lg font-bold text-white">financeVIZ</span>
            </div>
            <p className="text-dark-muted text-sm">
              © 2024 financeVIZ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-primary-500/50 transition-colors">
      <div className="text-primary-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-dark-muted">{description}</p>
    </div>
  )
}

function InsightCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg p-6">
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-dark-muted">{description}</p>
    </div>
  )
}

function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  href,
  highlight,
}: {
  name: string
  price: string
  period: string
  features: string[]
  cta: string
  href: string
  highlight: boolean
}) {
  return (
    <div
      className={`bg-dark-card border rounded-lg p-8 ${
        highlight
          ? 'border-primary-500 shadow-lg shadow-primary-500/20 scale-105'
          : 'border-dark-border'
      }`}
    >
      {highlight && (
        <div className="bg-primary-600/20 text-primary-400 text-xs font-medium px-3 py-1 rounded-full inline-block mb-4">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-white">{price}</span>
        <span className="text-dark-muted ml-2">/{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-white">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-colors ${
          highlight
            ? 'bg-primary-600 hover:bg-primary-700 text-white'
            : 'bg-dark-surface hover:bg-dark-border border border-dark-border text-white'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}
