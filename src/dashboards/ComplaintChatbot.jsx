import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function ComplaintChatbot() {
const navigate = useNavigate()

const [step, setStep] = useState(0)
const [messages, setMessages] = useState([
{ sender: 'bot', text: 'Hi! Welcome to ResolveX. 👋' },
{ sender: 'bot', text: 'Would you like to register a complaint?' },
])

const [complaint, setComplaint] = useState({
title: '',
description: '',
category: '',
priority: 'MEDIUM',
address: '',
landmark: '',
city: '',
pincode: '',
})

const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

const addMessage = (sender, text) => {
setMessages((previous) => [...previous, { sender, text }])
}

const selectOption = (value) => {
setError('')


if (step === 0) {
  addMessage('user', value)

  if (value === 'Yes') {
    addMessage('bot', 'Great! Please select the category of your problem.')
    setStep(1)
  } else {
    addMessage(
      'bot',
      'No problem! You can register a complaint whenever you need help.'
    )
    setStep(10)
  }

  return
}

if (step === 1) {
  setComplaint((previous) => ({
    ...previous,
    category: value,
  }))

  addMessage('user', value.replaceAll('_', ' '))
  addMessage('bot', 'Please describe the problem you are facing.')
  setStep(2)
  return
}

if (step === 3) {
  setComplaint((previous) => ({
    ...previous,
    priority: value,
  }))

  addMessage('user', value)
  addMessage(
    'bot',
    'Please enter the location where the complaint needs to be resolved.'
  )
  setStep(4)
}


}

const handleDescription = (event) => {
event.preventDefault()


const description = event.target.description.value.trim()

if (!description) {
  setError('Please describe your problem.')
  return
}

if (description.length > 2000) {
  setError('Description cannot exceed 2000 characters.')
  return
}

const title = description
  .replace(/\s+/g, ' ')
  .split(' ')
  .slice(0, 8)
  .join(' ')
  .slice(0, 100)

setComplaint((previous) => ({
  ...previous,
  title,
  description,
}))

addMessage('user', description)
addMessage('bot', 'How urgent is this problem?')

setError('')
setStep(3)


}

const handleAddress = (event) => {
event.preventDefault()


const formData = new FormData(event.currentTarget)

const address = formData.get('address').trim()
const landmark = formData.get('landmark').trim()
const city = formData.get('city').trim()
const pincode = formData.get('pincode').trim()

if (!/^\d{6}$/.test(pincode)) {
  setError('Please enter a valid 6-digit pincode.')
  return
}

setComplaint((previous) => ({
  ...previous,
  address,
  landmark,
  city,
  pincode,
}))

addMessage(
  'user',
  `Address: ${address}\nLandmark: ${landmark}\nCity: ${city}\nPincode: ${pincode}`
)

addMessage(
  'bot',
  'Great! Please review all your complaint details before submitting.'
)

setError('')
setStep(5)


}

const submitComplaint = async () => {
const token = localStorage.getItem('token')
const role = localStorage.getItem('role')


if (!token || role !== 'USER') {
  navigate('/login')
  return
}

setLoading(true)
setError('')

try {
  const response = await fetch(
    'http://localhost:8081/api/complaints',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(complaint),
    }
  )

  const data = await response.json().catch(() => null)

  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
    return
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        'Unable to register your complaint.'
    )
  }

  addMessage('user', 'Yes, confirm and register my complaint.')

  addMessage(
    'bot',
    `Your complaint has been registered successfully! Complaint ID: #${data.id}. You can track its progress from your dashboard. ✅`
  )

  setStep(6)
} catch (err) {
  setError(err.message || 'Unable to connect to the server.')
} finally {
  setLoading(false)
}


}

const restartChat = () => {
setComplaint({
title: '',
description: '',
category: '',
priority: 'MEDIUM',
address: '',
landmark: '',
city: '',
pincode: '',
})


setMessages([
  { sender: 'bot', text: 'Hi! Welcome to ResolveX. 👋' },
  { sender: 'bot', text: 'Would you like to register a complaint?' },
])

setError('')
setStep(0)


}

return ( <div className="min-h-screen bg-[#FAF7F0] text-[#252525]"> <nav className="flex items-center justify-between bg-[#252525] px-5 py-4 text-white md:px-10"> <Link to="/" className="text-2xl font-bold">
Resolve<span className="text-[#FF7939]">X</span> </Link>


    <Link
      to="/user-dashboard"
      className="rounded-lg border border-white/30 px-4 py-2 transition hover:bg-[#FF7939]"
    >
      Dashboard
    </Link>
  </nav>

  <main className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
    <div className="mb-6">
      <p className="mb-2 font-semibold text-[#FF7939]">
        RESOLVEX ASSISTANT
      </p>

      <h1 className="text-3xl font-bold md:text-4xl">
        How can we help you?
      </h1>

      <p className="mt-2 text-gray-600">
        Tell us about your problem and we will help you register it.
      </p>
    </div>

    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
      <div className="flex items-center gap-3 bg-[#252525] px-5 py-4 text-white">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF7939] text-xl">
          🤖
        </div>

        <div>
          <h2 className="font-semibold">ResolveX Chatbot</h2>
          <p className="text-xs text-green-300">● Ready to assist</p>
        </div>
      </div>

      <div className="max-h-[480px] min-h-[300px] space-y-4 overflow-y-auto bg-[#FCFAF6] p-4 md:p-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
                message.sender === 'user'
                  ? 'rounded-br-sm bg-[#FF7939] text-white'
                  : 'rounded-bl-sm border border-gray-200 bg-white text-[#252525]'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 bg-white p-4 md:p-6">
        {step === 0 && (
          <div className="flex gap-3">
            <button
              onClick={() => selectOption('Yes')}
              className="flex-1 rounded-xl bg-[#FF7939] px-5 py-3 font-semibold text-white transition hover:bg-[#ed6528]"
            >
              Yes, register
            </button>

            <button
              onClick={() => selectOption('No')}
              className="flex-1 rounded-xl border border-gray-300 px-5 py-3 font-semibold transition hover:bg-gray-100"
            >
              Not now
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              'PLUMBING',
              'ELECTRICAL',
              'CLEANING',
              'CARPENTRY',
              'APPLIANCE_REPAIR',
              'OTHER',
            ].map((category) => (
              <button
                key={category}
                onClick={() => selectOption(category)}
                className="rounded-xl border border-gray-200 px-3 py-3 text-sm font-medium transition hover:border-[#FF7939] hover:bg-orange-50"
              >
                {category.replaceAll('_', ' ')}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleDescription}>
            <textarea
              name="description"
              required
              maxLength={2000}
              rows={3}
              placeholder="Describe your problem..."
              className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#FF7939] focus:ring-2 focus:ring-[#FF7939]/20"
            />

            <button
              type="submit"
              className="mt-3 w-full rounded-xl bg-[#FF7939] px-5 py-3 font-semibold text-white transition hover:bg-[#ed6528]"
            >
              Continue
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="grid grid-cols-3 gap-3">
            {['LOW', 'MEDIUM', 'HIGH'].map((priority) => (
              <button
                key={priority}
                onClick={() => selectOption(priority)}
                className="rounded-xl border border-gray-200 px-3 py-3 font-semibold transition hover:border-[#FF7939] hover:bg-orange-50"
              >
                {priority}
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleAddress} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold">
                Full Address
              </label>
              <input
                name="address"
                required
                maxLength={300}
                defaultValue={complaint.address}
                placeholder="House/Flat No., Street, Colony"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#FF7939] focus:ring-2 focus:ring-[#FF7939]/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold">
                Landmark
              </label>
              <input
                name="landmark"
                required
                maxLength={200}
                defaultValue={complaint.landmark}
                placeholder="Near school, temple, market..."
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#FF7939] focus:ring-2 focus:ring-[#FF7939]/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold">
                  City
                </label>
                <input
                  name="city"
                  required
                  maxLength={100}
                  defaultValue={complaint.city}
                  placeholder="Enter city"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#FF7939] focus:ring-2 focus:ring-[#FF7939]/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold">
                  Pincode
                </label>
                <input
                  name="pincode"
                  required
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  minLength={6}
                  defaultValue={complaint.pincode}
                  placeholder="6-digit pincode"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#FF7939] focus:ring-2 focus:ring-[#FF7939]/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#FF7939] px-5 py-3 font-semibold text-white transition hover:bg-[#ed6528]"
            >
              Continue to Review
            </button>
          </form>
        )}

        {step === 5 && (
          <div>
            <div className="mb-4 space-y-3 rounded-xl bg-[#FAF7F0] p-4 text-sm">
              <p>
                <span className="font-semibold">Title:</span>{' '}
                {complaint.title}
              </p>

              <p>
                <span className="font-semibold">Description:</span>{' '}
                {complaint.description}
              </p>

              <p>
                <span className="font-semibold">Category:</span>{' '}
                {complaint.category.replaceAll('_', ' ')}
              </p>

              <p>
                <span className="font-semibold">Priority:</span>{' '}
                {complaint.priority}
              </p>

              <div className="border-t border-gray-200 pt-3">
                <p className="font-semibold">Service Location</p>
                <p className="mt-1">{complaint.address}</p>
                <p>Landmark: {complaint.landmark}</p>
                <p>City: {complaint.city}</p>
                <p>Pincode: {complaint.pincode}</p>
              </div>
            </div>

            <button
              onClick={submitComplaint}
              disabled={loading}
              className="w-full rounded-xl bg-[#FF7939] px-5 py-3 font-semibold text-white transition hover:bg-[#ed6528] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Registering complaint...'
                : 'Confirm & Register Complaint'}
            </button>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-3">
            <button
              onClick={() => navigate('/user-dashboard')}
              className="w-full rounded-xl bg-[#252525] px-5 py-3 font-semibold text-white transition hover:bg-[#FF7939]"
            >
              Go to Dashboard
            </button>

            <button
              onClick={restartChat}
              className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold transition hover:bg-gray-100"
            >
              Register Another Complaint
            </button>
          </div>
        )}

        {step === 10 && (
          <button
            onClick={() => navigate('/user-dashboard')}
            className="w-full rounded-xl bg-[#252525] px-5 py-3 font-semibold text-white transition hover:bg-[#FF7939]"
          >
            Back to Dashboard
          </button>
        )}

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </section>

    <p className="mt-5 text-center text-xs text-gray-500">
      ResolveX — Making complaint resolution simpler.
    </p>
  </main>
</div>


)
}

export default ComplaintChatbot
