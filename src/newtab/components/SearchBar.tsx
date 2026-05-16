import { Search, X } from 'lucide-react'
import { useTabsStore } from '../../store/tabsStore'

export function SearchBar() {
  const query = useTabsStore((s) => s.filters.query)
  const setQuery = useTabsStore((s) => s.setQuery)

  return (
    <div className="group relative">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle transition-colors group-focus-within:text-brand"
        aria-hidden
      />
      <input
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tabs by title or URL…"
        className="w-full rounded-xl border border-line bg-surface py-2.5 pl-10 pr-10 text-sm text-fg placeholder:text-fg-subtle focus:border-brand-border focus:outline-none focus:ring-4 focus:ring-ring/40"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-fg-subtle transition-colors hover:bg-muted hover:text-fg"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
