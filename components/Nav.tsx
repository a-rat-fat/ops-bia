'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/shipments', label: 'Expéditions' },
  { href: '/bia', label: 'Bourse Inter‑Agence' },
  { href: '/map', label: 'Cartes' }
]

export default function Nav() {
  const pathname = usePathname()
  return (
    <nav className="sticky top-0 z-10 bg-[var(--bg)]/80 backdrop-blur border-b border-[#232a4a]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <div className="text-xl font-bold">🚚 Ops BIA</div>
        <div className="flex gap-2">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-3 py-1.5 rounded-xl hover:bg-[#141a2e] ${pathname === l.href ? 'bg-[#141a2e] text-white' : 'text-[var(--muted)]'}`}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="ml-auto text-sm text-[var(--muted)]">Railway • Postgres • Next.js • Prisma • Leaflet</div>
      </div>
    </nav>
  )
}
