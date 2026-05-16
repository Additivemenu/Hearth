import { Flame } from 'lucide-react'
import { TabsList } from './TabsList'

export function NewTab() {
  return (
    <div className="relative min-h-full">
      <main className="relative mx-auto flex max-w-3xl flex-col gap-8 px-6 py-14">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-rose-400 text-white shadow-[0_6px_20px_-6px_rgba(251,146,60,0.55)]">
              <Flame className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </span>
            <h1 className="text-2xl font-semibold tracking-tight text-stone-800">
              Hearth
            </h1>
          </div>
          <p className="text-sm italic text-stone-500">
            Make yourself at home.
          </p>
        </header>

        <section className="rounded-3xl border border-stone-200/70 bg-white/75 p-6 shadow-[0_30px_80px_-40px_rgba(120,53,15,0.18)] backdrop-blur-md">
          <TabsList />
        </section>
      </main>
    </div>
  )
}
