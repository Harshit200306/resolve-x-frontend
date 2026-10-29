import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8081/api'

const STATUS_STYLES = {
PENDING: 'bg-amber-100 text-amber-800',
ACCEPTED: 'bg-blue-100 text-blue-800',
RESOLVED: 'bg-green-100 text-green-800',
CANCELLED: 'bg-red-100 text-red-800',
}

const PRIORITY_STYLES = {
HIGH: 'bg-red-100 text-red-700',
MEDIUM: 'bg-amber-100 text-amber-700',
LOW: 'bg-green-100 text-green-700',
}

function formatLabel(value) {
if (!value) return 'Not specified'
return value.charAt(0) + value.slice(1).toLowerCase()
}

function StatCard({ label, value, icon, color }) {
return ( <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"> <div className="flex items-center justify-between"> <p className="text-sm font-medium text-gray-500">{label}</p> <span className="text-2xl">{icon}</span> </div>
<p className={`mt-4 text-3xl font-extrabold ${color}`}>{value}</p> </div>
)
}

function ComplaintCard({
complaint,
showAcceptButton = false,
acceptingComplaintId,
onAccept,
onCancel,
workerAvailable,
customerDetails,
detailsVisible,
loadingDetails,
onToggleDetails,
resolvingComplaintId,
cancellingComplaintId,
onResolve,
}) {
const formatDate = (date) => {
if (!date) return 'Not available'


const parsedDate = new Date(date)

return Number.isNaN(parsedDate.getTime())
  ? 'Not available'
  : parsedDate.toLocaleString()


}

return ( <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"> <div className="h-1.5 bg-[#FF7939]" />


  <div className="p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Complaint #{complaint.id}
        </p>

        <h3 className="mt-2 break-words text-xl font-bold">
          {complaint.title || 'Untitled complaint'}
        </h3>
      </div>

      <span
        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
          STATUS_STYLES[complaint.status] || 'bg-gray-100 text-gray-700'
        }`}
      >
        {formatLabel(complaint.status)}
      </span>
    </div>

    <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
      {complaint.description || 'No description provided.'}
    </p>

    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-[#FAF7F0] p-3">
        <p className="text-xs text-gray-500">Category</p>
        <p className="mt-1 font-semibold">
          {formatLabel(complaint.category)}
        </p>
      </div>

      <div className="rounded-xl bg-[#FAF7F0] p-3">
        <p className="text-xs text-gray-500">Priority</p>
        <span
          className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
            PRIORITY_STYLES[complaint.priority] ||
            'bg-gray-100 text-gray-700'
          }`}
        >
          {formatLabel(complaint.priority)}
        </span>
      </div>
    </div>

    <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50 p-4">
      <p className="mb-2 text-sm font-bold text-[#252525]">
        📍 Service Location
      </p>
      <p className="break-words text-sm text-gray-700">
        {complaint.address || 'Address not available'}
      </p>
      <p className="mt-1 text-sm text-gray-600">
        Landmark: {complaint.landmark || 'Not specified'}
      </p>
      <p className="mt-1 text-sm text-gray-600">
        City: {complaint.city || 'Not specified'}
      </p>
      <p className="mt-1 text-sm text-gray-600">
        Pincode: {complaint.pincode || 'Not specified'}
      </p>
    </div>

    <div className="mt-5 border-t border-gray-100 pt-4 text-xs leading-5 text-gray-500">
      <p>Created: {formatDate(complaint.createdAt)}</p>

      {complaint.resolvedAt && (
        <p className="mt-1 font-medium text-green-700">
          Resolved: {formatDate(complaint.resolvedAt)}
        </p>
      )}
    </div>

    {showAcceptButton && (
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onAccept(complaint.id)}
          disabled={
            !workerAvailable ||
            acceptingComplaintId !== null ||
            cancellingComplaintId !== null
          }
          className="w-full rounded-xl bg-[#FF7939] px-4 py-3 font-bold text-white transition hover:bg-[#e9662b] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {acceptingComplaintId === complaint.id
            ? 'Accepting...'
            : 'Accept Complaint'}
        </button>

        <button
          type="button"
          onClick={() => onCancel(complaint.id)}
          disabled={
            acceptingComplaintId !== null ||
            cancellingComplaintId !== null
          }
          className="w-full rounded-xl border border-red-300 bg-white px-4 py-3 font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cancellingComplaintId === complaint.id
            ? 'Cancelling...'
            : 'Cancel Complaint'}
        </button>
      </div>
    )}

    {!showAcceptButton && complaint.status === 'ACCEPTED' && (
      <div className="mt-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onToggleDetails(complaint.id)}
            disabled={loadingDetails === complaint.id}
            className="w-full rounded-xl bg-[#252525] px-4 py-3 font-semibold text-white transition hover:bg-[#FF7939] disabled:opacity-60"
          >
            {loadingDetails === complaint.id
              ? 'Loading Customer Details...'
              : detailsVisible
                ? 'Hide Customer Details'
                : 'View Customer Details'}
          </button>

          <button
            type="button"
            onClick={() => onResolve(complaint.id)}
            disabled={resolvingComplaintId !== null}
            className="w-full rounded-xl bg-green-600 px-4 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {resolvingComplaintId === complaint.id
              ? 'Resolving...'
              : 'Resolve Complaint'}
          </button>
        </div>

        {detailsVisible && customerDetails && (
          <div className="space-y-3 rounded-xl border border-gray-200 bg-[#FCFAF6] p-4">
            <h4 className="font-bold text-[#252525]">
              Customer Information
            </h4>

            <div>
              <p className="text-xs text-gray-500">Customer Name</p>
              <p className="mt-1 break-words font-semibold">
                {customerDetails.customerName || 'Not available'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Phone Number</p>
              <p className="mt-1 break-words font-semibold">
                {customerDetails.customerPhone || 'Not available'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Full Address</p>
              <p className="mt-1 break-words font-semibold">
                {customerDetails.address || 'Not available'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Landmark</p>
              <p className="mt-1 break-words">
                {customerDetails.landmark || 'Not specified'}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">City & Pincode</p>
              <p className="mt-1 break-words">
                {[customerDetails.city, customerDetails.pincode]
                  .filter(Boolean)
                  .join(' ') || 'Not specified'}
              </p>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
</article>


)
}

function WorkerDashboard() {
const [worker, setWorker] = useState(null)
const [complaints, setComplaints] = useState([])
const [availableComplaints, setAvailableComplaints] = useState([])
const [customerDetails, setCustomerDetails] = useState({})
const [visibleDetails, setVisibleDetails] = useState({})
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [updatingAvailability, setUpdatingAvailability] = useState(false)
const [acceptingComplaintId, setAcceptingComplaintId] = useState(null)
const [cancellingComplaintId, setCancellingComplaintId] = useState(null)
const [resolvingComplaintId, setResolvingComplaintId] = useState(null)
const [loadingDetails, setLoadingDetails] = useState(null)

const logout = () => {
localStorage.removeItem('token')
localStorage.removeItem('role')
window.location.replace('/login')
}

const request = useCallback(async (path, options = {}) => {
const token = localStorage.getItem('token')
const role = localStorage.getItem('role')


if (!token || role !== 'WORKER') {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  window.location.replace('/login')
  throw new Error('Please log in using your worker account.')
}

let response

try {
  response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })
} catch {
  throw new Error(
    'Cannot connect to the backend. Check whether the server is running.'
  )
}

if (response.status === 401) {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  window.location.replace('/login')
  throw new Error('Your session expired. Please log in again.')
}

const responseText = response.status === 204 ? '' : await response.text()

if (!response.ok) {
  let message = responseText

  try {
    const body = JSON.parse(responseText)
    message = body.message || body.error || body.detail || responseText
  } catch {
    message = responseText
  }

  throw new Error(
    message || `Request failed with status ${response.status}.`
  )
}

if (!responseText) return null

try {
  return JSON.parse(responseText)
} catch {
  return responseText
}


}, [])

const loadDashboard = useCallback(async () => {
setLoading(true)
setError('')


try {
  const [profile, assigned, available] = await Promise.all([
    request('/workers/me'),
    request('/workers/my-complaints'),
    request('/workers/available-complaints'),
  ])

  setWorker(profile)
  setComplaints(Array.isArray(assigned) ? assigned : [])
  setAvailableComplaints(Array.isArray(available) ? available : [])
} catch (err) {
  setError(err.message || 'Unable to load the worker dashboard.')
} finally {
  setLoading(false)
}


}, [request])

useEffect(() => {
loadDashboard()
}, [loadDashboard])

const toggleAvailability = async () => {
if (!worker || updatingAvailability) return


setUpdatingAvailability(true)
setError('')

try {
  const updatedWorker = await request('/workers/availability', {
    method: 'PUT',
    body: JSON.stringify({
      available: !worker.available,
    }),
  })

  setWorker(updatedWorker)
  await loadDashboard()
} catch (err) {
  setError(err.message || 'Unable to update availability.')
} finally {
  setUpdatingAvailability(false)
}


}

const acceptComplaint = async (complaintId) => {
if (acceptingComplaintId !== null || cancellingComplaintId !== null) {
return
}


setAcceptingComplaintId(complaintId)
setError('')

try {
  await request(`/complaints/${complaintId}/accept`, {
    method: 'PUT',
  })

  await loadDashboard()
} catch (err) {
  setError(err.message || 'Unable to accept this complaint.')
  await loadDashboard()
} finally {
  setAcceptingComplaintId(null)
}


}

const cancelComplaint = async (complaintId) => {
if (cancellingComplaintId !== null || acceptingComplaintId !== null) {
return
}


setCancellingComplaintId(complaintId)
setError('')

try {
  await request(`/complaints/${complaintId}/cancel`, {
    method: 'PUT',
  })

  await loadDashboard()
} catch (err) {
  setError(err.message || 'Unable to cancel this complaint.')
  await loadDashboard()
} finally {
  setCancellingComplaintId(null)
}


}

const resolveComplaint = async (complaintId) => {
if (resolvingComplaintId !== null) return


setResolvingComplaintId(complaintId)
setError('')

try {
  await request(`/complaints/${complaintId}/resolve`, {
    method: 'PUT',
  })

  await loadDashboard()
} catch (err) {
  setError(err.message || 'Unable to resolve this complaint.')
  await loadDashboard()
} finally {
  setResolvingComplaintId(null)
}


}

const toggleCustomerDetails = async (complaintId) => {
if (visibleDetails[complaintId]) {
setVisibleDetails((previous) => ({
...previous,
[complaintId]: false,
}))
return
}


if (customerDetails[complaintId]) {
  setVisibleDetails((previous) => ({
    ...previous,
    [complaintId]: true,
  }))
  return
}

setLoadingDetails(complaintId)
setError('')

try {
  const details = await request(
    `/complaints/${complaintId}/customer-details`
  )

  setCustomerDetails((previous) => ({
    ...previous,
    [complaintId]: details,
  }))

  setVisibleDetails((previous) => ({
    ...previous,
    [complaintId]: true,
  }))
} catch (err) {
  setError(err.message || 'Unable to load customer details.')
} finally {
  setLoadingDetails(null)
}


}

const pending = complaints.filter(
(complaint) => complaint.status === 'PENDING'
).length

const accepted = complaints.filter(
(complaint) => complaint.status === 'ACCEPTED'
).length

const resolved = complaints.filter(
(complaint) => complaint.status === 'RESOLVED'
).length

if (loading) {
return ( <div className="flex min-h-screen items-center justify-center bg-[#FAF7F0] px-5"> <div className="text-center"> <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#FF7939]" /> <p className="mt-4 font-semibold text-[#252525]">
Loading your dashboard... </p> </div> </div>
)
}

return ( <div className="min-h-screen bg-[#FAF7F0] text-[#252525]"> <header className="bg-[#252525] text-white shadow-lg"> <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8"> <Link to="/" className="text-2xl font-extrabold">
Resolve<span className="text-[#FF7939]">X</span> </Link>


      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-gray-300 sm:block">
          Worker Portal
        </span>

        <button
          onClick={logout}
          className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold transition hover:border-[#FF7939] hover:text-[#FF7939]"
        >
          Logout
        </button>
      </div>
    </div>
  </header>

  <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    {error && (
      <div
        role="alert"
        className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
      >
        <p className="font-semibold">{error}</p>
        <button
          onClick={loadDashboard}
          className="mt-3 rounded-lg border border-red-300 px-4 py-2 font-semibold transition hover:bg-red-100"
        >
          Retry Loading
        </button>
      </div>
    )}

    <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-[#FF7939]">
          Worker Dashboard
        </p>

        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          Welcome{worker?.name ? `, ${worker.name}` : ' Back'}!
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your availability and complaints.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <span
          className={`h-3 w-3 rounded-full ${
            worker?.available ? 'bg-green-500' : 'bg-gray-400'
          }`}
        />

        <div>
          <p className="font-bold">
            {worker?.available ? 'Available' : 'Unavailable'}
          </p>
          <p className="text-xs text-gray-500">
            {worker?.available
              ? 'Ready for new work'
              : 'Not accepting new work'}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleAvailability}
          disabled={!worker || updatingAvailability}
          aria-label="Toggle availability"
          aria-pressed={Boolean(worker?.available)}
          className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
            worker?.available ? 'bg-[#FF7939]' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
              worker?.available ? 'left-6' : 'left-1'
            }`}
          />
        </button>
      </div>
    </section>

    {worker && (
      <section className="mt-7 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Worker Name</p>
          <p className="mt-2 text-lg font-bold">{worker.name || 'Worker'}</p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Category</p>
          <p className="mt-2 text-lg font-bold">
            {formatLabel(worker.category)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Experience</p>
          <p className="mt-2 text-lg font-bold">
            {worker.experience ?? 0} years
          </p>
        </div>
      </section>
    )}

    <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Assigned"
        value={complaints.length}
        icon="📋"
        color="text-[#252525]"
      />
      <StatCard
        label="Pending"
        value={pending}
        icon="⏳"
        color="text-amber-600"
      />
      <StatCard
        label="Accepted"
        value={accepted}
        icon="🛠️"
        color="text-blue-600"
      />
      <StatCard
        label="Resolved"
        value={resolved}
        icon="✅"
        color="text-green-600"
      />
    </section>

    <section className="mt-10">
      <div>
        <h2 className="text-2xl font-extrabold">Available Complaints</h2>
        <p className="mt-1 text-sm text-gray-500">
          Accept pending complaints matching your work category.
        </p>
      </div>

      {!worker?.available && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          You are currently unavailable. Turn on your availability to
          accept new complaints.
        </div>
      )}

      {worker?.available && availableComplaints.length === 0 && (
        <div className="mt-5 rounded-3xl border-2 border-dashed border-gray-300 bg-white px-5 py-10 text-center">
          <div className="text-3xl">🔎</div>
          <h3 className="mt-3 text-xl font-bold">
            No available complaints
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            New matching complaints will appear here when available.
          </p>
          <button
            onClick={loadDashboard}
            className="mt-4 rounded-xl bg-[#252525] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3d3d3d]"
          >
            ↻ Refresh
          </button>
        </div>
      )}

      {worker?.available && availableComplaints.length > 0 && (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {availableComplaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              showAcceptButton
              acceptingComplaintId={acceptingComplaintId}
              onAccept={acceptComplaint}
              onCancel={cancelComplaint}
              cancellingComplaintId={cancellingComplaintId}
              workerAvailable={worker.available}
            />
          ))}
        </div>
      )}
    </section>

    <section className="mt-10">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold">
            Assigned Complaints
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review complaints assigned to your account.
          </p>
        </div>

        <button
          onClick={loadDashboard}
          className="w-fit rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold transition hover:border-[#FF7939]"
        >
          ↻ Refresh
        </button>
      </div>

      {complaints.length === 0 ? (
        <div className="mt-5 rounded-3xl border-2 border-dashed border-gray-300 bg-white px-5 py-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
            📭
          </div>
          <h3 className="mt-5 text-xl font-bold">
            No assigned complaints yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Complaints accepted by you will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {complaints.map((complaint) => (
            <ComplaintCard
              key={complaint.id}
              complaint={complaint}
              customerDetails={customerDetails[complaint.id]}
              detailsVisible={Boolean(visibleDetails[complaint.id])}
              loadingDetails={loadingDetails}
              onToggleDetails={toggleCustomerDetails}
              resolvingComplaintId={resolvingComplaintId}
              onResolve={resolveComplaint}
            />
          ))}
        </div>
      )}
    </section>

    <footer className="mt-12 border-t border-gray-200 py-6 text-center text-sm text-gray-500">
      ResolveX Worker Portal · Manage your work in one place
    </footer>
  </main>
</div>


)
}

export default WorkerDashboard
