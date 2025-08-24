import Link from 'next/link'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Shipments() {
  const list = await prisma.shipment.findMany({ orderBy: { id: 'desc' } })
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">Expéditions</h1>
        <Link href="/shipments/new"><button>Nouvelle expédition</button></Link>
        <a href="/api/export/shipments"><button>Exporter CSV</button></a>
      </div>
      <div className="card overflow-x-auto">
        <table className="table w-full">
          <thead><tr><th>ID</th><th>Réf</th><th>Origine</th><th>Destination</th><th>m linéaire</th><th>Distance (km)</th><th>Statut</th></tr></thead>
          <tbody>
            {list.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td className="font-mono">{s.ref}</td>
                <td>{s.origin}</td>
                <td>{s.destination}</td>
                <td>{s.meters}</td>
                <td>{s.distanceKm ?? '-'}</td>
                <td>{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
