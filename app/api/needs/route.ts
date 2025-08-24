import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const rows = await prisma.need.findMany({ include: { agency: true }, orderBy: { id: 'desc' } })
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const data = await req.json()
  const created = await prisma.need.create({ data: { agencyId: data.agencyId, origin: data.origin, destination: data.destination, meters: data.meters } })
  return NextResponse.json(created, { status: 201 })
}
