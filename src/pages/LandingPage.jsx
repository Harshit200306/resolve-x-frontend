import { useState } from 'react'
import { Link } from 'react-router-dom'

function LandingPage() {
const [menuOpen, setMenuOpen] = useState(false)

const closeMenu = () => setMenuOpen(false)

const features = [
{
icon: '💬',
title: 'Guided Chatbot',
description: 'Register your complaints through a simple guided conversation.',
color: 'bg-orange-100',
},
{
icon: '📝',
title: 'Easy Registration',
description: 'Describe your problem and submit your complaint in a few steps.',
color: 'bg-purple-100',
},
{
icon: '🛠️',
title: 'Worker Assignment',
description: 'Connect complaints with workers from the relevant category.',
color: 'bg-blue-100',
},
{
icon: '🔔',
title: 'Status Updates',
description: 'Keep track of your complaints as their status changes.',
color: 'bg-yellow-100',
},
{
icon: '📊',
title: 'Complaint Tracking',
description: 'View pending, accepted and resolved complaints in one place.',
color: 'bg-green-100',
},
{
icon: '🔐',
title: 'Secure Access',
description: 'Separate dashboard experiences for users and workers.',
color: 'bg-pink-100',
},
]

const steps = [
{
number: '01',
title: 'Report Your Problem',
description: 'Create an account and register your complaint.',
},
{
number: '02',
title: 'Connect With a Worker',
description: 'Get connected with a worker who can handle your complaint.',
},
{
number: '03',
title: 'Track Resolution',
description: 'Follow your complaint status through your dashboard.',
},
]

return ( <div className="min-h-screen bg-[#FAF7F0] text-[#252525]"> <nav className="relative z-20 bg-[#252525] text-white"> <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5"> <Link to="/" className="text-2xl font-extrabold">
Resolve<span className="text-[#FF7939]">X</span> </Link>


      <div className="hidden items-center gap-8 md:flex">
        <a href="#home" className="transition hover:text-[#FF7939]">Home</a>
        <a href="#features" className="transition hover:text-[#FF7939]">Features</a>
        <a href="#how-it-works" className="transition hover:text-[#FF7939]">How It Works</a>
        <a href="#about" className="transition hover:text-[#FF7939]">About</a>
      </div>

      <div className="hidden items-center gap-3 md:flex">
        <Link
          to="/login"
          className="rounded-xl px-4 py-2 transition hover:text-[#FF7939]"
        >
          Login
        </Link>

        <Link
          to="/signup"
          className="rounded-xl bg-[#FF7939] px-5 py-2.5 font-semibold text-white transition hover:bg-[#E96528]"
        >
          Get Started
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="text-2xl md:hidden"
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? '✕' : '☰'}
      </button>
    </div>

    {menuOpen && (
      <div className="flex flex-col gap-4 px-5 pb-5 md:hidden">
        <a href="#home" onClick={closeMenu}>Home</a>
        <a href="#features" onClick={closeMenu}>Features</a>
        <a href="#how-it-works" onClick={closeMenu}>How It Works</a>
        <a href="#about" onClick={closeMenu}>About</a>
        <Link to="/login" onClick={closeMenu}>Login</Link>
        <Link
          to="/signup"
          onClick={closeMenu}
          className="w-fit rounded-xl bg-[#FF7939] px-5 py-2.5 font-semibold"
        >
          Get Started
        </Link>
      </div>
    )}
  </nav>

  <section id="home" className="overflow-hidden bg-[#252525] text-white">
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:py-28 lg:grid-cols-2">
      <div>
        <span className="inline-block rounded-full border border-[#FF7939]/40 bg-[#FF7939]/10 px-4 py-2 text-sm text-[#FF7939]">
          Smart Complaint Management
        </span>

        <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
          Problems happen.
          <span className="block text-[#FF7939]">
            Resolution starts here.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
          Report problems, connect with the right workers, and track every
          step toward resolution — all in one simple platform.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            to="/signup"
            className="rounded-xl bg-[#FF7939] px-7 py-3.5 text-center font-bold text-white transition hover:bg-[#E96528]"
          >
            Get Started →
          </Link>

          <a
            href="#how-it-works"
            className="rounded-xl border border-white/20 px-7 py-3.5 text-center font-semibold transition hover:border-[#FF7939] hover:text-[#FF7939]"
          >
            How It Works
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-300">
          <span>✓ Easy Complaint Registration</span>
          <span>✓ Complaint Status Tracking</span>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-400">Dashboard Preview</p>
            <h2 className="mt-1 text-xl font-bold">Your Complaints</h2>
          </div>

          <span className="rounded-full bg-green-400/10 px-3 py-1.5 text-sm text-green-400">
            ● Status Tracking
          </span>
        </div>

        <div className="mt-7 space-y-4">
          <div className="rounded-2xl bg-white p-5 text-[#252525]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">Water Leakage</p>
                <p className="mt-1 text-sm text-gray-500">Complaint #RX-001</p>
              </div>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Pending
              </span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-1/4 rounded-full bg-[#FF7939]" />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 text-[#252525]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">Electrical Repair</p>
                <p className="mt-1 text-sm text-gray-500">Complaint #RX-002</p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Resolved
              </span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-full rounded-full bg-green-500" />
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          Illustrative dashboard preview
        </p>
      </div>
    </div>
  </section>

  <section id="features" className="px-5 py-20 sm:py-24">
    <div className="mx-auto max-w-7xl">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-semibold uppercase tracking-widest text-[#FF7939]">
          Features
        </span>

        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
          Everything you need, in one place
        </h2>

        <p className="mt-4 leading-7 text-gray-600">
          A simpler way to report issues, coordinate workers, and stay informed.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${feature.color}`}>
              {feature.icon}
            </div>

            <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>
            <p className="mt-3 leading-7 text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <section id="how-it-works" className="bg-white px-5 py-20 sm:py-24">
    <div className="mx-auto max-w-7xl">
      <div className="text-center">
        <span className="font-semibold uppercase tracking-widest text-[#FF7939]">
          How It Works
        </span>

        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
          Three simple steps
        </h2>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {steps.map((step) => (
          <div key={step.number} className="rounded-2xl bg-[#FAF7F0] p-8">
            <span className="text-4xl font-extrabold text-[#FF7939]">
              {step.number}
            </span>

            <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
            <p className="mt-3 leading-7 text-gray-600">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <section id="about" className="bg-[#252525] px-5 py-20 text-white sm:py-24">
    <div className="mx-auto max-w-4xl text-center">
      <span className="font-semibold uppercase tracking-widest text-[#FF7939]">
        About ResolveX
      </span>

      <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
        Less confusion. Better coordination.
      </h2>

      <p className="mt-6 text-lg leading-8 text-gray-300">
        ResolveX is a complaint management platform designed to make it
        easier for users to report everyday problems and for workers to
        manage their assigned tasks through a clear, organized workflow.
      </p>

      <Link
        to="/signup"
        className="mt-8 inline-block rounded-xl bg-[#FF7939] px-7 py-3.5 font-bold transition hover:bg-[#E96528]"
      >
        Join ResolveX →
      </Link>
    </div>
  </section>

  <footer className="bg-[#1D1D1D] px-5 py-7 text-center text-sm text-gray-400">
    <p>© {new Date().getFullYear()} ResolveX. Built to make problem resolution simpler.</p>
  </footer>
</div>


)
}

export default LandingPage
