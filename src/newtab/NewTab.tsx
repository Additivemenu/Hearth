import { Flame } from 'lucide-react'
import { TabsList } from './TabsList'

export function NewTab() {
  return (
    <div className="relative min-h-full">
      <main className="relative mx-auto flex max-w-3xl flex-col gap-8 px-6 py-14">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-rose-400 text-brand-fg shadow-brand-glow">
              <Flame className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-fg">
              Hearth
            </h1>
          </div>
          <p className="text-sm italic text-fg-muted">
            Make yourself at home.
          </p>
        </header>

        <section className="rounded-3xl border border-line/70 bg-surface/75 p-6 shadow-card backdrop-blur-md">
          <TabsList />
        </section>
      </main>
    </div>
  )
}
