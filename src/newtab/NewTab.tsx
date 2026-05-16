import { TabsList } from './TabsList'

export function NewTab() {
  return (
    <main className="mx-auto flex min-h-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="flex items-baseline justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Hearth</h1>
        <p className="text-sm text-neutral-400">Your browser, on purpose.</p>
      </header>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-5">
        <h2 className="mb-3 text-lg font-medium">Open tabs</h2>
        <TabsList />
      </section>
    </main>
  )
}
