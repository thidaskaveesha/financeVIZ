'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { BarChart3, Zap, Shield, Sparkles, Code, ArrowRight, Check, TrendingUp, Wallet, PieChart } from 'lucide-react'

export default function HomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-dark-bg text-white overflow-hidden selection:bg-primary-500/30">

      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 border-b border-white/5 bg-dark-bg/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-primary-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <BarChart3 className="w-8 h-8 text-primary-400 relative z-10" />
              </div>
              <span className="text-xl font-bold tracking-tight">finance<span className="text-primary-400">VIZ</span></span>
            </div>

            <div className="flex items-center gap-6">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-lg shadow-primary-900/20 hover:shadow-primary-600/30 hover:-translate-y-0.5"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-400 hover:text-white font-medium transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="relative group bg-white text-black hover:bg-gray-100 px-6 py-2.5 rounded-full font-medium transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] hover:-translate-y-0.5"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Sign Up Free
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in text-sm text-gray-300">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>New: AI-Powered Investment Insights are live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 animate-fade-in delay-100">
            Visualize Your Money.
            <br />
            <span className="text-gradient">Decide Your Future.</span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto dark:text-gray-400 animate-fade-in delay-200 leading-relaxed">
            Stop guessing with your finances. Get a clear, real-time view of your wealth, spending, and potential growth with our advanced visualization tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-300">
            <Link
              href="/signup"
              className="group bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg shadow-primary-900/20 hover:shadow-primary-600/40 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Start for Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#pricing"
              className="glass glass-hover text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:-translate-y-1"
            >
              View Pricing
            </Link>
          </div>

          {/* Hero Dashboard Preview (Abstract) */}
          <div className="mt-20 relative max-w-5xl mx-auto animate-fade-in delay-300">
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent z-10" />
            <div className="glass rounded-xl border border-white/10 p-2 shadow-2xl shadow-primary-900/20 rotate-x-12 transform-gpu perspective-1000">
              <div className="bg-dark-card rounded-lg overflow-hidden border border-white/5 aspect-[16/9] relative">
                {/* Abstract UI Representation */}
                <div className="absolute inset-0 grid grid-cols-12 gap-0 p-6">
                  {/* Sidebar */}
                  <div className="col-span-2 hidden md:flex flex-col gap-4 border-r border-white/5 pr-6">
                    <div className="h-8 w-24 bg-white/10 rounded mb-8" />
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-4 w-full bg-white/5 rounded" />)}
                  </div>

                  {/* Main Content */}
                  <div className="col-span-12 md:col-span-10 flex flex-col gap-6 pl-0 md:pl-6">
                    <div className="flex justify-between">
                      <div className="h-8 w-32 bg-white/10 rounded" />
                      <div className="flex gap-2">
                        <div className="h-8 w-8 rounded-full bg-white/10" />
                        <div className="h-8 w-8 rounded-full bg-primary-500/20" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-32 rounded-xl bg-white/5 border border-white/5 p-4">
                          <div className="h-4 w-12 bg-white/10 rounded mb-4" />
                          <div className="h-8 w-24 bg-white/20 rounded" />
                        </div>
                      ))}
                    </div>

                    <div className="flex-1 rounded-xl bg-gradient-to-tr from-white/5 to-transparent border border-white/5 relative overflow-hidden">
                      {/* Simple Chart Line */}
                      <svg className="absolute bottom-0 left-0 w-full h-1/2 text-primary-500/30 fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 L0 50 L20 60 L40 40 L60 55 L80 30 L100 80 L100 100 Z" />
                      </svg>
                      <svg className="absolute bottom-0 left-0 w-full h-1/2 text-primary-400 stroke-current fill-none" strokeWidth="2" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 50 L20 60 L40 40 L60 55 L80 30 L100 80" vectorEffect="non-scaling-stroke" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow under the image */}
            <div className="absolute -inset-4 bg-primary-600/20 blur-3xl -z-10 rounded-[2rem]" />
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything You Need to <span className="text-primary-400">Master Your Finances</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Powerful features wrapped in a beautiful interface designed for clarity.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Real-time Dashboards"
              description="Visualize your financial data with interactive charts and real-time updates."
            />
            <FeatureCard
              icon={<Code className="w-6 h-6" />}
              title="API Integration"
              description="Plug-and-play API designed for developers to push data from any source."
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="AI Insights"
              description="Get personalized investment suggestions and spending analysis."
              isPro
            />
            <FeatureCard
              icon={<Shield className="w-6 h-6" />}
              title="Bank-Level Security"
              description="Your data is encrypted and protected with industry-leading protocols."
            />
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-32 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-white/5 skew-y-3 transform origin-top-left scale-110 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="bg-primary-500/10 text-primary-400 inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary-500/20">
                For Developers
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for Integration</h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Connect your financial streams effortlessly. Our REST API is documented, typed, and ready to ingest data from your custom sources.
              </p>

              <div className="space-y-4">
                {[
                  'Simple RESTful endpoints',
                  'Instant data synchronization',
                  'Secure apiKey authentication',
                  'Webhooks for real-time events'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-1 rounded bg-green-500/20">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Link href="/docs" className="text-primary-400 hover:text-primary-300 font-medium flex items-center gap-2 group">
                  Read Documentation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="bg-[#0D1117] rounded-xl border border-white/10 p-6 shadow-2xl relative">
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-xs text-gray-500 font-mono ml-2">bash</div>
                </div>
                <div className="font-mono text-sm space-y-2">
                  <div className="flex gap-2 text-gray-400">
                    <span className="text-purple-400">$</span>
                    <span>curl -X POST https://api.financeviz.com/v1/tx \</span>
                  </div>
                  <div className="pl-4 text-gray-300">
                    -H <span className="text-green-400">&quot;Authorization: Bearer sk_live_...&quot;</span> \
                  </div>
                  <div className="pl-4 text-gray-300">
                    -d <span className="text-yellow-300">&apos;{'{'}&apos;</span>
                  </div>
                  <div className="pl-8 text-blue-300">&quot;amount&quot;: 1500.00,</div>
                  <div className="pl-8 text-blue-300">&quot;category&quot;: &quot;investment&quot;,</div>
                  <div className="pl-8 text-blue-300">&quot;description&quot;: &quot;SNP500 ETF&quot;</div>
                  <div className="pl-4 text-yellow-300">&apos;{'}'}&apos;&apos;</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 text-lg">Choose the perfect plan for your financial journey.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Starter"
              price="$0"
              period="forever"
              description="Essential tools for personal tracking."
              features={[
                'Basic dashboard access',
                'Manual data entry',
                '7-day history',
                'Community support'
              ]}
              cta="Get Started Free"
              href="/signup"
            />
            <PricingCard
              name="Pro"
              price="$9.99"
              period="month"
              description="For serious wealth builders."
              features={[
                'Full dashboard access',
                'Unlimited API Requests',
                'AI-Powered Insights',
                'Goal Tracking',
                'Priority Support'
              ]}
              cta="Upgrade to Pro"
              href="/signup"
              highlight
            />
            <PricingCard
              name="Annual"
              price="$99"
              period="year"
              description="Best value for long-term planning."
              features={[
                'Everything in Pro',
                '2 Months Free',
                'Early access to beta features',
                'Personalized Onboarding',
                'Custom integrations'
              ]}
              cta="Go Annual"
              href="/signup"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-dark-bg py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-6 h-6 text-primary-400" />
                <span className="text-lg font-bold">financeVIZ</span>
              </div>
              <p className="text-gray-400 max-w-sm">
                Empowering individuals to take control of their financial future through visualization and AI intelligence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-primary-400 transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-primary-400 transition-colors">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-primary-400 transition-colors">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-primary-400 transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} financeVIZ. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, isPro }: { icon: React.ReactNode; title: string; description: string; isPro?: boolean }) {
  return (
    <div className="glass glass-hover p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
      {isPro && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-lg shadow-amber-900/20">
          Pro
        </div>
      )}
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-primary-400 mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  href,
  highlight = false,
}: {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  cta: string
  href: string
  highlight?: boolean
}) {
  return (
    <div
      className={`relative p-8 rounded-3xl border transition-all duration-300 ${highlight
          ? 'bg-gradient-to-b from-primary-900/20 to-dark-bg border-primary-500/30 ring-1 ring-primary-500/30'
          : 'bg-dark-card/50 border-white/5 hover:border-white/10'
        }`}
    >
      {highlight && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/20">
          MOST POPULAR
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-300 mb-2">{name}</h3>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-4xl font-bold text-white">{price}</span>
          <span className="text-gray-500">/{period}</span>
        </div>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-primary-400 shrink-0" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={`block w-full text-center py-3.5 px-4 rounded-xl font-semibold transition-all shadow-lg ${highlight
            ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-900/20 hover:shadow-primary-600/30 hover:-translate-y-0.5'
            : 'bg-white/5 hover:bg-white/10 text-white hover:text-white border border-white/10 hover:border-white/20'
          }`}
      >
        {cta}
      </Link>
    </div>
  )
}
