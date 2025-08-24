import { PrismaClient, ShipmentStatus, BiaStatus } from '@prisma/client'
const prisma = new PrismaClient()

const cities = [
  ['Dijon', 47.3220, 5.0415], ['Mulhouse', 47.7508, 7.3359], ['Colmar', 48.0790, 7.3585],
  ['Vesoul', 47.6230, 6.1557], ['Paris', 48.8566, 2.3522], ['Poitiers', 46.5802, 0.3404],
  ['Lyon', 45.7640, 4.8357], ['Marseille', 43.2965, 5.3698], ['Nancy', 48.6921, 6.1844],
  ['Reims', 49.2583, 4.0317], ['Epinal', 48.1730, 6.4496], ['Nancy', 48.6921, 6.1846]
]

async function upsertCities() {
  for (const [name, lat, lon] of cities) {
    await prisma.city.upsert({ where: { name }, update: { lat: Number(lat), lon: Number(lon) }, create: { name, lat: Number(lat), lon: Number(lon) } })
  }
}

async function main() {
  await upsertCities()

  const a1 = await prisma.agency.create({ data: { name: 'Agency Dijon', city: 'Dijon', contact: 'MZ', phone: '06 12 34 56 78' } })
  const a2 = await prisma.agency.create({ data: { name: 'Agency Alsace', city: 'Mulhouse' } })
  const a3 = await prisma.agency.create({ data: { name: 'Agency Lorraine', city: 'Nancy' } })

  await prisma.offer.createMany({
    data: [
      { agencyId: a1.id, origin: 'Dijon', destination: 'Paris', meters: 6, status: BiaStatus.OPEN },
      { agencyId: a2.id, origin: 'Mulhouse', destination: 'Colmar', meters: 3, status: BiaStatus.OPEN },
    ]
  })

  await prisma.need.createMany({
    data: [
      { agencyId: a3.id, origin: 'Vesoul', destination: 'Nancy', meters: 1, status: BiaStatus.OPEN },
      { agencyId: a1.id, origin: 'Dijon', destination: 'Lyon', meters: 2, status: BiaStatus.OPEN },
    ]
  })

  await prisma.shipment.createMany({
    data: [
      { ref: 'SHIP-0001', origin: 'Dijon', destination: 'Paris', meters: 6, status: ShipmentStatus.IN_TRANSIT, distanceKm: 313 },
      { ref: 'SHIP-0002', origin: 'Mulhouse', destination: 'Colmar', meters: 3, status: ShipmentStatus.PLANNED, distanceKm: 41 }
    ]
  })
  console.log('Seed complete')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
