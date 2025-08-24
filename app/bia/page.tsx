import Link from 'next/link'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getData() {
  const [offers, needs, agencies] = await Promise.all([
    prisma.offer.findMany({ include: { agency: true }, orderBy: { id: 'desc' } }),
    prisma.need.findMany({ include: { agency: true }, orderBy: { id: 'desc' } }),
    prisma.agency.findMany({ orderBy: { name: 'asc' } })
  ])
  return { offers, needs, agencies }
}

export default async function BIA() {
  const { offers, needs, agencies } = await getData()
  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Bourse inter‑agence</h1>
        <Link href="/bia/new-offer"><button>Nouvelle OFFRE</button></Link>
        <Link href="/bia/new-need"><button>Nouveau BESOIN</button></Link>
        <a href="/api/export/offers"><button>Export OFFRES CSV</button></a>
        <a href="/api/export/needs"><button>Export BESOINS CSV</button></a>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card overflow-x-auto">
          <h2 className="text-lg font-semibold mb-2">Offres (capacités)</h2>
          <table className="table w-full">
            <thead><tr><th>ID</th><th>Agence</th><th>Origine</th><th>Destination</th><th>m</th><th>Statut</th><th></th></tr></thead>
            <tbody>
              {offers.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.agency?.name}</td>
                  <td>{o.origin}</td>
                  <td>{o.destination}</td>
                  <td>{o.meters}</td>
                  <td>{o.status}</td>
                  <td><Link href={`/bia/match?offer=${o.id}`}><button>Matcher</button></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card overflow-x-auto">
          <h2 className="text-lg font-semibold mb-2">Besoins (demandes)</h2>
          <table className="table w-full">
            <thead><tr><th>ID</th><th>Agence</th><th>Origine</th><th>Destination</th><th>m</th><th>Statut</th></tr></thead>
            <tbody>
              {needs.map(n => (
                <tr key={n.id}>
                  <td>{n.id}</td>
                  <td>{n.agency?.name}</td>
                  <td>{n.origin}</td>
                  <td>{n.destination}</td>
                  <td>{n.meters}</td>
                  <td>{n.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
