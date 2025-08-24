import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const rows = await prisma.agency.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(rows)
}
