import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <main className="min-h-screen bg-brand-cream text-brand-charcoal">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-12">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand-clay">
          Ghost kitchen premium a New York
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
          African Restaurant Sofia
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-700">
          Une base technique propre pour construire la commande en ligne, le
          dashboard admin, la gestion des plats et les paiements.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="rounded-md bg-brand-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-charcoal"
            to="/"
          >
            Site client
          </Link>
          <Link
            className="rounded-md border border-brand-gold px-5 py-3 text-sm font-semibold text-brand-charcoal transition hover:bg-white"
            to="/"
          >
            Dashboard admin
          </Link>
        </div>
      </section>
    </main>
  )
}

