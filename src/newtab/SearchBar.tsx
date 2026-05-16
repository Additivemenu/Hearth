import { Search, X } from 'lucide-react'
import { useTabsStore } from '../store/tabsStore'

export function SearchBar() {
  const query = useTabsStore((s) => s.filters.query)
  const setQuery = useTabsStore((s) => s.setQuery)

  return (
    <div className="group relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-amber-300"
        aria-hidden
      />
      <input
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tabs by title or URL…"
        className="w-full rounded-xl border border-white/5 bg-neutral-900/60 py-2.5 pl-10 pr-10 text-sm text-neutral-100 shadow-inner placeholder:text-neutral-500 focus:border-amber-400/40 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-200"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
