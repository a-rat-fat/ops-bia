import prisma from '@/lib/prisma'

async function getStats() {
  const [agencies, offers, needs, shipments] = await Promise.all([
    prisma.agency.count(), prisma.offer.count(), prisma.need.count(), prisma.shipment.count()
  ])
  return { agencies, offers, needs, shipments }
}

export default async function Page() {
  const s = await getStats()
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <div className="card"><div className="text-sm text-[var(--muted)]">Agences</div><div className="text-3xl font-bold">{s.agencies}</div></div>
      <div className="card"><div className="text-sm text-[var(--muted)]">Offres</div><div className="text-3xl font-bold">{s.offers}</div></div>
      <div className="card"><div className="text-sm text-[var(--muted)]">Besoins</div><div className="text-3xl font-bold">{s.needs}</div></div>
      <div className="card"><div className="text-sm text-[var(--muted)]">Expéditions</div><div className="text-3xl font-bold">{s.shipments}</div></div>
      <div className="md:col-span-4 card">
        <h2 className="text-xl font-semibold mb-2">Bienvenue 👋</h2>
        <p className="text-[var(--muted)]">Gérez la bourse inter‑agence (capacités ↔ besoins), exportez en CSV et visualisez sur carte. Connectez PostgreSQL sur Railway via <code>DATABASE_URL</code>.</p>
      </div>
    </div>
  )
}
