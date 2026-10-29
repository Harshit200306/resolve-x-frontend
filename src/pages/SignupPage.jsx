import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API = 'http://localhost:8081/api'

function SignupPage() {
const navigate = useNavigate()

const [name, setName] = useState('')
const [email, setEmail] = useState('')
const [phone, setPhone] = useState('')
const [password, setPassword] = useState('')
const [role, setRole] = useState('USER')
const [category, setCategory] = useState('PLUMBING')
const [experience, setExperience] = useState('')
const [showPassword, setShowPassword] = useState(false)
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [success, setSuccess] = useState('')

const handleSubmit = async (e) => {
e.preventDefault()
setLoading(true)
setError('')
setSuccess('')

const requestData = {
  name: name.trim(),
  email: email.trim(),
  password,
  phone: phone.trim(),
  role,
  category: role === 'WORKER' ? category : null,
  experience: role === 'WORKER' ? Number(experience) : null,
}

try {
  const response = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/plain',
    },
    body: JSON.stringify(requestData),
  })

  const message = (await response.text()).trim()

  if (!response.ok) {
    throw new Error(message || `Registration failed (${response.status}).`)
  }

  setSuccess(message || 'Registration successful! You can now log in.')

  setTimeout(() => {
    navigate('/login')
  }, 1200)
} catch (err) {
  setError(
    err instanceof TypeError
      ? 'Cannot connect to the backend. Make sure Spring Boot is running on port 8081.'
      : err.message || 'Registration failed. Please try again.'
  )
} finally {
  setLoading(false)
}


}

return ( <main className="flex min-h-screen items-center justify-center bg-[#FAF7F0] px-4 py-10"> <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2"> <div className="flex flex-col justify-center bg-[#252525] p-8 text-white sm:p-12"> <Link to="/" className="text-3xl font-extrabold">
Resolve<span className="text-[#FF7939]">X</span> </Link>


      <span className="mt-12 w-fit rounded-full border border-[#FF7939]/40 bg-[#FF7939]/10 px-4 py-2 text-sm text-[#FF7939]">
        Join Our Community
      </span>

      <h1 className="mt-6 text-4xl font-extrabold leading-tight">
        One platform.
        <span className="block text-[#FF7939]">Better resolutions.</span>
      </h1>

      <p className="mt-5 leading-7 text-gray-300">
        Create an account to report complaints, connect with workers,
        and manage your work through ResolveX.
      </p>

      <div className="mt-8 space-y-4 text-sm text-gray-300">
        <p>✓ Simple complaint registration</p>
        <p>✓ Dedicated user and worker accounts</p>
        <p>✓ Complaint status tracking</p>
      </div>
    </div>

    <div className="p-7 sm:p-12">
      <h2 className="text-3xl font-extrabold text-[#252525]">
        Create Account
      </h2>

      <p className="mt-2 text-gray-500">
        Enter your details to get started.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
        <div>
          <label htmlFor="signup-name" className="mb-2 block text-sm font-semibold">
            Full Name
          </label>

          <input
            id="signup-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            autoComplete="name"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#FF7939] focus:ring-2 focus:ring-[#FF7939]/20"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-2 block text-sm font-semibold">
            Email Address
          </label>

          <input
            id="signup-email"
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
          <label htmlFor="signup-phone" className="mb-2 block text-sm font-semibold">
            Phone Number
          </label>

          <input
            id="signup-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            autoComplete="tel"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#FF7939] focus:ring-2 focus:ring-[#FF7939]/20"
          />
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-2 block text-sm font-semibold">
            Password
          </label>

          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
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

        <div>
          <label htmlFor="signup-role" className="mb-2 block text-sm font-semibold">
            Register As
          </label>

          <select
            id="signup-role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#FF7939] focus:ring-2 focus:ring-[#FF7939]/20"
          >
            <option value="USER">User</option>
            <option value="WORKER">Worker</option>
          </select>
        </div>

        {role === 'WORKER' && (
          <>
            <div>
              <label htmlFor="worker-category" className="mb-2 block text-sm font-semibold">
                Work Category
              </label>

              <select
                id="worker-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#FF7939] focus:ring-2 focus:ring-[#FF7939]/20"
              >
                <option value="PLUMBING">Plumbing</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="CARPENTRY">Carpentry</option>
                <option value="CLEANING">Cleaning</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="worker-experience" className="mb-2 block text-sm font-semibold">
                Experience (Years)
              </label>

              <input
                id="worker-experience"
                type="number"
                min="0"
                step="1"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="Enter experience in years"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#FF7939] focus:ring-2 focus:ring-[#FF7939]/20"
              />
            </div>
          </>
        )}

        {error && (
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#FF7939] py-3.5 font-bold text-white transition hover:bg-[#E96528] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Creating Account...' : 'Create Account →'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-[#FF7939] hover:text-[#E96528]">
          Login
        </Link>
      </p>

      <Link to="/" className="mt-5 block text-center text-sm text-gray-500 hover:text-[#FF7939]">
        ← Back to Home
      </Link>
    </div>
  </div>
</main>


)
}

export default SignupPage
