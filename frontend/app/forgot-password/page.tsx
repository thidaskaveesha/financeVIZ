'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '@/lib/api'
import Link from 'next/link'
import { ArrowLeft, Mail, User } from 'lucide-react'

const resetCodeSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
})

type ResetCodeFormData = z.infer<typeof resetCodeSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [code, setCode] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetCodeFormData>({
    resolver: zodResolver(resetCodeSchema),
  })

  const onRequestCode = async (data: ResetCodeFormData) => {
    setError('')
    setLoading(true)

    try {
      await authApi.resetCodeGenerate(data.usernameOrEmail)
      setUsernameOrEmail(data.usernameOrEmail)
      setStep('verify')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset code')
    } finally {
      setLoading(false)
    }
  }

  const onVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (code.length !== 8 || !/^\d+$/.test(code)) {
      setError('Please enter a valid 8-digit code')
      return
    }

    setLoading(true)

    try {
      await authApi.resetCodeVerify(usernameOrEmail, parseInt(code))
      // Code verified successfully - redirect to reset password page
      router.push(`/reset-password?usernameOrEmail=${encodeURIComponent(usernameOrEmail)}&code=${code}`)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid reset code')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4 py-12">
        <div className="max-w-md w-full">
          <Link
            href="/login"
            className="inline-flex items-center text-dark-muted hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>

          <div className="bg-dark-card border border-dark-border rounded-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Enter Reset Code</h1>
              <p className="text-dark-muted">
                We've sent an 8-digit reset code to the email associated with
              </p>
              <p className="text-white font-medium mt-1">{usernameOrEmail}</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={onVerifyCode} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-white mb-2">
                  Reset Code
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="00000000"
                  maxLength={8}
                  autoComplete="off"
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length !== 8}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setStep('request')
                  setCode('')
                  setError('')
                }}
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                Use different username/email
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4 py-12">
      <div className="max-w-md w-full">
        <Link
          href="/login"
          className="inline-flex items-center text-dark-muted hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </Link>

        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
          <p className="text-dark-muted mb-8">
            Enter your username or email and we'll send you a reset code
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onRequestCode)} className="space-y-6">
            <div>
              <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-white mb-2">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-muted" />
                <input
                  {...register('usernameOrEmail')}
                  type="text"
                  id="usernameOrEmail"
                  className="w-full bg-dark-surface border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white placeholder-dark-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="johndoe or john@example.com"
                />
              </div>
              {errors.usernameOrEmail && (
                <p className="mt-1 text-sm text-red-400">{errors.usernameOrEmail.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
