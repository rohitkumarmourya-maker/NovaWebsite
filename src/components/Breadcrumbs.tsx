import { Link } from 'react-router-dom'

export type Crumb = { name: string; path: string }

export default function Breadcrumbs({ items, dark = false }: { items: Crumb[]; dark?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={`text-small ${dark ? 'text-white/60' : 'text-ink-500'}`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className={dark ? 'text-white' : 'text-graphite-900'}>
                  {item.name}
                </span>
              ) : (
                <Link to={item.path} className={`transition-colors ${dark ? 'hover:text-white' : 'hover:text-graphite-900'}`}>
                  {item.name}
                </Link>
              )}
              {!last && (
                <span aria-hidden="true" className="opacity-50">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
