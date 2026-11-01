const foundationItems = [
  "Next.js, React and TypeScript",
  "Tailwind CSS and responsive layout",
  "Supabase Auth-ready database migration",
  "Row-level security from day one",
];

export default function Home() {
  return (
    <div className="relative flex flex-1 overflow-hidden bg-[#07150f] text-[#f3f7f4]">
      <div
        aria-hidden="true"
        className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl"
      />
      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              aria-hidden="true"
              className="h-10 w-10 text-emerald-400"
              viewBox="0 0 40 40"
              fill="none"
            >
              <rect
                x="3.5"
                y="3.5"
                width="33"
                height="33"
                rx="9"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M20 4v32M4 20h32"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity=".45"
              />
              <circle
                cx="20"
                cy="20"
                r="5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span className="text-lg font-semibold tracking-tight">
              Turf Manager
            </span>
          </div>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
            Phase 0
          </span>
        </header>

        <section className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1.15fr_.85fr] lg:py-20">
          <div>
            <p className="mb-5 text-sm font-semibold tracking-[0.2em] text-emerald-300 uppercase">
              Football, organized
            </p>
            <h1 className="max-w-2xl text-5xl font-semibold tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
              More football.
              <span className="block text-emerald-300">Less organizing.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              One home for your teams, match RSVPs, turf bookings and
              tournaments. Built for you and your friends.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                className="rounded-full bg-emerald-300 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-200"
                href="/api/health"
              >
                Check app status
              </a>
              <span className="text-sm text-slate-400">
                Vercel + Supabase ready
              </span>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
            <p className="text-sm font-medium text-slate-400">THE FOUNDATION</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Ready for Phase 1
            </h2>
            <ul className="mt-6 space-y-4">
              {foundationItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-200">
                  <span
                    aria-hidden="true"
                    className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-300/15 text-xs text-emerald-300"
                  >
                    ✓
                  </span>
                  <span className="text-sm leading-6">{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <footer className="border-t border-white/10 py-6 text-sm text-slate-500">
          Turf Manager · Your next match starts here.
        </footer>
      </main>
    </div>
  );
}
