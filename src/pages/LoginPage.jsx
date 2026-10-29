import { useState } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'

function LoginPage() {
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [showPassword, setShowPassword] = useState(false)
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const handleSubmit = async (e) => {
e.preventDefault()
setLoading(true)
setError('')


try {
  const response = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/plain',
    },
    body: JSON.stringify({ email, password }),
  })

  const token = (await response.text()).trim()

  if (!response.ok) {
    throw new Error(token || 'Invalid email or password.')
  }

  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('The server did not return a valid JWT token.')
  }

  const base64 = parts[1]
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const payload = JSON.parse(
    decodeURIComponent(
      atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
        .split('')
        .map((character) =>
          `%${character.charCodeAt(0).toString(16).padStart(2, '0')}`
        )
        .join('')
    )
  )

  const role = payload.role

  if (role !== 'USER' && role !== 'WORKER') {
    throw new Error('The JWT does not contain a valid USER or WORKER role.')
  }

  localStorage.setItem('token', token)
  localStorage.setItem('role', role)

  window.location.replace(
    role === 'USER' ? '/user-dashboard' : '/worker-dashboard'
  )
} catch (err) {
  setError(
    err instanceof TypeError
      ? 'Cannot connect to the backend. Make sure Spring Boot is running on port 8081.'
      : err.message || 'Login failed. Please try again.'
  )
} finally {
  setLoading(false)
}


}

return ( <main className="flex min-h-screen items-center justify-center bg-[#FAF7F0] px-4 py-10"> <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2"> <div className="flex flex-col justify-center bg-[#252525] p-8 text-white sm:p-12"> <Link to="/" className="text-3xl font-extrabold">
Resolve<span className="text-[#FF7939]">X</span> </Link>


      <span className="mt-12 w-fit rounded-full border border-[#FF7939]/40 bg-[#FF7939]/10 px-4 py-2 text-sm text-[#FF7939]">
        Welcome Back
      </span>

      <h1 className="mt-6 text-4xl font-extrabold leading-tight">
        Your problems deserve
        <span className="block text-[#FF7939]">a resolution.</span>
      </h1>

      <p className="mt-5 leading-7 text-gray-300">
        Sign in to manage complaints, track progress, and stay connected
        with your assigned workers.
      </p>

      <div className="mt-8 space-y-4 text-sm text-gray-300">
        <p>✓ Track your complaints</p>
        <p>✓ Manage your work</p>
        <p>✓ Follow complaint progress</p>
      </div>
    </div>

    <div className="flex flex-col justify-center p-7 sm:p-12">
      <h2 className="text-3xl font-extrabold text-[#252525]">
        Login to ResolveX
      </h2>

      <p className="mt-2 text-gray-500">
        Enter your credentials to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-semibold">
            Email Address
          </label>

          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#FF7939] focus:ring-2 focus:ring-[#FF7939]/20"
          />
        </div>

        <div>
          <label htmlFor="login-password" className="mb-2 block text-sm font-semibold">
            Password
          </label>

          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-20 outline-none transition focus:border-[#FF7939] focus:ring-2 focus:ring-[#FF7939]/20"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#FF7939]"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#FF7939] py-3.5 font-bold text-white transition hover:bg-[#E96528] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Login →'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="font-bold text-[#FF7939] hover:text-[#E96528]">
          Sign Up
        </Link>
      </p>

      <Link to="/" className="mt-5 text-center text-sm text-gray-500 hover:text-[#FF7939]">
        ← Back to Home
      </Link>
    </div>
  </div>
</main>


)
}

export default LoginPage
