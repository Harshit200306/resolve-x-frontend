import { Link } from 'react-router-dom'

function NotFoundPage() {
return ( <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAF7F0] px-5 text-center"> <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#FF7939]">
ResolveX </p>

```
  <h1 className="mt-4 text-7xl font-extrabold text-[#FF7939] sm:text-8xl">
    404
  </h1>

  <h2 className="mt-5 text-2xl font-bold text-[#252525]">
    Page not found
  </h2>

  <p className="mt-3 max-w-md leading-7 text-gray-600">
    The page you are looking for does not exist or may have been moved.
  </p>

  <Link
    to="/"
    className="mt-7 rounded-xl bg-[#FF7939] px-6 py-3 font-semibold text-white transition hover:bg-[#E96528]"
  >
    Back to Home
  </Link>
</main>


)
}

export default NotFoundPage
