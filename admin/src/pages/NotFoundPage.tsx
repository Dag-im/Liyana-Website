import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link className="text-sm text-blue-600 hover:underline" to="/">
        Back to home
      </Link>
    </section>
  )
}
