import { useState } from 'react'
import { X, Mail, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function AuthModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState('signup') // signup or login
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })
        if (signUpError) throw signUpError
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email,
            name,
          })
          setMessage('Account created! Check your email to confirm.')
          if (onSuccess) onSuccess(data.user)
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        if (onSuccess) onSuccess(data.user)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl ring-1 ring-black/5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#0A0F1E] hover:bg-gray-100 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-[#0A0F1E] mb-1">
            {mode === 'signup' ? 'Save Your Results' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500 text-sm">
            {mode === 'signup'
              ? 'Create an account to save and track your progress over time.'
              : 'Sign in to access your dashboard.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-[#0A0F1E] mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] outline-none transition-all text-sm"
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-[#0A0F1E] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] outline-none transition-all text-sm"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0A0F1E] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00AEEF]/20 focus:border-[#00AEEF] outline-none transition-all text-sm"
              placeholder="Min 6 characters"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {message && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5">
              <p className="text-emerald-600 text-sm">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00AEEF] text-white py-3 rounded-xl font-semibold hover:bg-[#0097D0] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm hover:shadow-md"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Mail size={18} />
            )}
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-[#00AEEF] font-semibold hover:underline">
                Sign in
              </button>
            </>
          ) : (
            <>
              Need an account?{' '}
              <button onClick={() => setMode('signup')} className="text-[#00AEEF] font-semibold hover:underline">
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
