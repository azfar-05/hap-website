'use client'

import { useState, useTransition } from 'react'
import { loginAction } from '../actions'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await loginAction(email, password)
      if (result?.error) {
        setError(result.error)
      }
    })
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-h1 text-hap-text tracking-wide">HAP</h1>
          <p className="font-body text-small text-muted mt-1 tracking-widest uppercase">
            Admin
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface rounded-card p-8 shadow-card-rest space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="block font-body text-small font-medium text-muted mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full font-body text-body text-hap-text bg-bg border border-border rounded-input px-4 py-3 outline-none focus:border-brand transition-colors placeholder:text-muted/50"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-body text-small font-medium text-muted mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full font-body text-body text-hap-text bg-bg border border-border rounded-input px-4 py-3 outline-none focus:border-brand transition-colors placeholder:text-muted/50"
            />
          </div>

          {error && (
            <p className="font-body text-small text-red-600 bg-red-50 border border-red-200 rounded-input px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full font-body font-semibold text-body text-white bg-brand rounded-btn px-4 py-3.5 hover:bg-accent transition-colors disabled:opacity-60"
          >
            {isPending ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  )
}
