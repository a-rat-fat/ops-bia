import prisma from '@/lib/prisma'
import MapView from '@/components/MapView'

function findCity(cities: any[], name: string) {
  return cities.find(c => c.name.toLowerCase() === (name||'').toLowerCase())
}

export default async function MapPage() {
  const [shipments, offers, needs, cities] = await Promise.all([
    prisma.shipment.findMany({ orderBy: { id:'desc' } }),
    prisma.offer.findMany({ orderBy: { id:'desc' } }),
    prisma.need.findMany({ orderBy: { id:'desc' } }),
    prisma.city.findMany()
  ])

  const legs:any[] = []
  const markers:any[] = []

  // Shipments legs
  for (const s of shipments) {
    const o = findCity(cities, s.origin); const d = findCity(cities, s.destination)
    if (o && d) {
      legs.push({ from: { lat:o.lat, lon:o.lon }, to: { lat:d.lat, lon:d.lon }, label: `#${s.ref}` })
    }
  }
  // Offers/Needs markers
  for (const o of offers) {
    const oc = findCity(cities, o.origin); const dc = findCity(cities, o.destination)
    if (oc) markers.push({ point: { lat: oc.lat, lon: oc.lon }, label: `OFFRE #${o.id} ${o.origin} → ${o.destination}` })
    if (dc) markers.push({ point: { lat: dc.lat, lon: dc.lon }, label: `OFFRE #${o.id} ${o.origin} → ${o.destination}` })
  }
  for (const n of needs) {
    const oc = findCity(cities, n.origin); const dc = findCity(cities, n.destination)
    if (oc) markers.push({ point: { lat: oc.lat, lon: oc.lon }, label: `BESOIN #${n.id} ${n.origin} → ${n.destination}` })
    if (dc) markers.push({ point: { lat: dc.lat, lon: dc.lon }, label: `BESOIN #${n.id} ${n.origin} → ${n.destination}` })
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Cartes</h1>
      <MapView legs={legs} markers={markers} />
      <p className="text-[var(--muted)]">Les itinéraires affichent les expéditions existantes. Les points indiquent les origines/destinations des offres et besoins (si la ville est connue en base).</p>
    </div>
  )
}
