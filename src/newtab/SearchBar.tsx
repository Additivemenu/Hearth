import { Search, X } from 'lucide-react'
import { useTabsStore } from '../store/tabsStore'

export function SearchBar() {
  const query = useTabsStore((s) => s.filters.query)
  const setQuery = useTabsStore((s) => s.setQuery)

  return (
    <div className="group relative">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-orange-500"
        aria-hidden
      />
      <input
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tabs by title or URL…"
        className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-10 text-sm text-stone-800 placeholder:text-stone-400 focus:border-orange-300 focus:outline-none focus:ring-4 focus:ring-orange-200/50"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
