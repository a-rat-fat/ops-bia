import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { haversineKm } from '@/lib/geo'

function autoRef(id: number) { return 'SHIP-' + id.toString().padStart(4,'0') }

export async function POST(req: Request) {
  const { offerId, needId } = await req.json()
  const offer = await prisma.offer.findUnique({ where: { id: offerId } })
  const need  = await prisma.need.findUnique({ where: { id: needId } })
  if (!offer || !need) return NextResponse.json({ error: 'Offer or Need not found' }, { status: 404 })
  // create shipment from matched pair (take min meters to be safe)
  const meters = Math.min(offer.meters, need.meters)
  const [oc, dc] = await Promise.all([
    prisma.city.findFirst({ where: { name: { equals: offer.origin, mode: 'insensitive' } } }),
    prisma.city.findFirst({ where: { name: { equals: offer.destination, mode: 'insensitive' } } }),
  ])
  const distanceKm = (oc && dc) ? haversineKm(oc.lat, oc.lon, dc.lat, dc.lon) : null

  const created = await prisma.shipment.create({
    data: { ref: 'TEMP', origin: offer.origin, destination: offer.destination, meters, distanceKm: distanceKm ?? undefined, status: 'PLANNED' }
  })
  const ref = autoRef(created.id)
  await prisma.shipment.update({ where: { id: created.id }, data: { ref } })
  await prisma.offer.update({ where: { id: offer.id }, data: { status: 'MATCHED' } })
  await prisma.need.update({ where: { id: need.id }, data: { status: 'MATCHED' } })
  return NextResponse.json({ ok: true, shipmentRef: ref }, { status: 201 })
}
