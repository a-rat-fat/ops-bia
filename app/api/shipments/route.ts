import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { haversineKm } from '@/lib/geo'

function autoRef(id: number) { return 'SHIP-' + id.toString().padStart(4,'0') }

async function computeDistance(origin:string, destination:string) {
  const [o, d] = await Promise.all([
    prisma.city.findFirst({ where: { name: { equals: origin, mode: 'insensitive' } } }),
    prisma.city.findFirst({ where: { name: { equals: destination, mode: 'insensitive' } } }),
  ])
  if (!o || !d) return null
  return haversineKm(o.lat, o.lon, d.lat, d.lon)
}

export async function GET() {
  const rows = await prisma.shipment.findMany({ orderBy: { id: 'desc' } })
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const data = await req.json()
  const dist = await computeDistance(data.origin, data.destination)
  const created = await prisma.shipment.create({
    data: {
      ref: data.ref ?? 'TEMP',
      origin: data.origin, destination: data.destination,
      meters: data.meters ?? 0,
      distanceKm: dist ?? undefined,
      status: data.status ?? 'PLANNED'
    }
  })
  if (!data.ref) {
    const ref = autoRef(created.id)
    await prisma.shipment.update({ where: { id: created.id }, data: { ref } })
    return NextResponse.json({ ...created, ref }, { status: 201 })
  }
  return NextResponse.json(created, { status: 201 })
}
