import { TabsList } from './TabsList'

export function NewTab() {
  return (
    <div className="relative min-h-full overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.10),transparent_65%)]"
        aria-hidden
      />
      <main className="relative mx-auto flex max-w-3xl flex-col gap-8 px-6 py-14">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="inline-block h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_14px_rgba(251,191,36,0.55)]"
              aria-hidden
            />
            <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">
              Hearth
            </h1>
          </div>
          <p className="text-xs text-neutral-500">Your browser, on purpose.</p>
        </header>

        <section className="rounded-2xl border border-white/[0.06] bg-neutral-900/40 p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_20px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-sm">
          <TabsList />
        </section>
      </main>
    </div>
  )
}
