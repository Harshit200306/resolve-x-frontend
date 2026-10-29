import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API = 'http://localhost:8081/api'

const STATUS_STYLES = {
  PENDING: 'bg-amber-100 text-amber-800',
  ACCEPTED: 'bg-blue-100 text-blue-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const TABS = ['All Complaints', 'Pending', 'Accepted', 'Resolved']

function UserDashboard() {
  const [activeTab, setActiveTab] = useState('All Complaints')
  const [complaints, setComplaints] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    window.location.replace('/login')
  }

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || role !== 'USER') {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('name')
      window.location.replace('/login')
      return
    }

    try {
      const response = await fetch(`${API}/auth/me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('name')
        window.location.replace('/login')
        return
      }

      if (!response.ok) {
        throw new Error('Unable to load user profile')
      }

      const data = await response.json()

      setUser(data)

      if (data.name) {
        localStorage.setItem('name', data.name)
      }
    } catch (err) {
      console.error('User profile error:', err)
    }
  }, [])

  const fetchComplaints = useCallback(async () => {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (!token || role !== 'USER') {
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('name')
      window.location.replace('/login')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API}/complaints/my`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      if (response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('name')
        window.location.replace('/login')
        return
      }

      if (!response.ok) {
        const message = await response.text()
        throw new Error(
          message || `Unable to load complaints (${response.status})`
        )
      }

      const data = await response.json()
      setComplaints(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Cannot connect to the server. Please ensure the backend is running.'
          : err.message || 'Unable to load complaints.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
    fetchComplaints()
  }, [fetchUser, fetchComplaints])

  const pendingCount = complaints.filter(
    (item) => item.status === 'PENDING'
  ).length

  const acceptedCount = complaints.filter(
    (item) => item.status === 'ACCEPTED'
  ).length

  const resolvedCount = complaints.filter(
    (item) => item.status === 'RESOLVED'
  ).length

  const filteredComplaints =
    activeTab === 'All Complaints'
      ? complaints
      : complaints.filter(
          (item) => item.status === activeTab.toUpperCase()
        )

  const formatDate = (date) => {
    if (!date) return 'Not available'

    const parsedDate = new Date(date)

    return Number.isNaN(parsedDate.getTime())
      ? 'Not available'
      : parsedDate.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#252525]">
      <header className="bg-[#252525] text-white shadow-lg">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link to="/" className="text-2xl font-extrabold">
            Resolve<span className="text-[#FF7939]">X</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-300 sm:block">
              User Portal
            </span>

            <button
              onClick={logout}
              className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold transition hover:border-[#FF7939] hover:text-[#FF7939]"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#FF7939]">
              User Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Welcome{user?.name ? `, ${user.name}` : ' Back'}!
            </h1>

            <p className="mt-2 text-gray-600">
              Register complaints and track their progress.
            </p>
          </div>

          <Link
            to="/complaint-chatbot"
            className="inline-flex items-center justify-center rounded-xl bg-[#FF7939] px-6 py-3 font-bold text-white shadow-sm transition hover:bg-[#E96528]"
          >
            + New Complaint
          </Link>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: 'Total Complaints',
              value: complaints.length,
              icon: '📋',
              color: 'text-[#252525]',
            },
            {
              title: 'Pending',
              value: pendingCount,
              icon: '⏳',
              color: 'text-amber-600',
            },
            {
              title: 'Accepted',
              value: acceptedCount,
              icon: '🛠️',
              color: 'text-blue-600',
            },
            {
              title: 'Resolved',
              value: resolvedCount,
              icon: '✅',
              color: 'text-green-600',
            },
          ].map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <span className="text-2xl">{stat.icon}</span>
              </div>

              <p className={`mt-4 text-3xl font-extrabold ${stat.color}`}>
                {loading ? '—' : stat.value}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-9 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-extrabold">My Complaints</h2>
              <p className="mt-1 text-sm text-gray-500">
                Track the status of your registered complaints.
              </p>
            </div>

            <button
              onClick={fetchComplaints}
              disabled={loading}
              className="w-fit rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold transition hover:border-[#FF7939] disabled:opacity-50"
            >
              ↻ Refresh
            </button>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  activeTab === tab
                    ? 'bg-[#252525] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF7939]" />
              <p className="mt-4 text-sm text-gray-500">
                Loading complaints...
              </p>
            </div>
          ) : error ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="font-semibold text-red-700">{error}</p>

              <button
                onClick={fetchComplaints}
                className="mt-4 rounded-xl bg-[#252525] px-5 py-2.5 font-semibold text-white hover:bg-[#FF7939]"
              >
                Try Again
              </button>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="mt-5 rounded-2xl border-2 border-dashed border-gray-200 px-5 py-14 text-center">
              <div className="text-4xl">📋</div>

              <h3 className="mt-4 text-xl font-bold">
                No complaints found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                {activeTab === 'All Complaints'
                  ? 'Your registered complaints will appear here.'
                  : `You do not have any ${activeTab.toLowerCase()} complaints.`}
              </p>

              {activeTab === 'All Complaints' && (
                <Link
                  to="/complaint-chatbot"
                  className="mt-5 inline-flex rounded-xl bg-[#FF7939] px-5 py-3 font-semibold text-white hover:bg-[#E96528]"
                >
                  Register Complaint
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {filteredComplaints.map((complaint) => (
                <article
                  key={complaint.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 transition hover:border-orange-300 hover:shadow-md"
                >
                  <div className="h-1.5 bg-[#FF7939]" />

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                          Complaint #{complaint.id}
                        </p>

                        <h3 className="mt-2 break-words text-xl font-bold">
                          {complaint.title || 'Untitled complaint'}
                        </h3>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                          STATUS_STYLES[complaint.status] ||
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {complaint.status || 'UNKNOWN'}
                      </span>
                    </div>

                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                      {complaint.description || 'No description provided.'}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="rounded-xl bg-[#FAF7F0] p-3">
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="mt-1 break-words text-sm font-bold">
                          {complaint.category || 'N/A'}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#FAF7F0] p-3">
                        <p className="text-xs text-gray-500">Priority</p>
                        <p className="mt-1 text-sm font-bold">
                          {complaint.priority || 'N/A'}
                        </p>
                      </div>

                      <div className="col-span-2 rounded-xl bg-[#FAF7F0] p-3 sm:col-span-1">
                        <p className="text-xs text-gray-500">
                          Assigned Worker
                        </p>
                        <p className="mt-1 break-words text-sm font-bold">
                          {complaint.workerName || 'Not assigned yet'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-gray-100 pt-4 text-xs leading-5 text-gray-500">
                      <p>Created: {formatDate(complaint.createdAt)}</p>

                      {complaint.resolvedAt && (
                        <p className="mt-1 font-medium text-green-700">
                          Resolved: {formatDate(complaint.resolvedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer className="py-8 text-center text-sm text-gray-500">
          ResolveX · Making complaint resolution simpler.
        </footer>
      </main>
    </div>
  )
}

export default UserDashboard

