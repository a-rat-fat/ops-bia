import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const now = await prisma.$queryRaw`SELECT NOW()`
    return NextResponse.json({ ok: true, db: 'connected', now })
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || 'db error' }, { status: 500 })
  }
}
