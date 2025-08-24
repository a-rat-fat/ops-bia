import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { toCsv } from '@/lib/csv'

export async function GET() {
  const rows = await prisma.offer.findMany({ include: { agency: true }, orderBy: { id:'desc' } })
  const csv = toCsv(rows.map(r => ({
    id: r.id, agency: r.agency?.name, origin: r.origin, destination: r.destination, meters: r.meters, status: r.status, createdAt: r.createdAt.toISOString()
  })))
  return new NextResponse(csv, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="offers.csv"' }
  })
}
