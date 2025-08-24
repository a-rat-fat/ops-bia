'use client'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

// Fix default icon paths
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl })

const RL = {
  MapContainer: dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false }),
  TileLayer: dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false }),
  Marker: dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false }),
  Polyline: dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false }),
  Popup: dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false }),
}

type Point = { lat:number, lon:number }
type Leg = { from: Point, to: Point, label: string }

export default function MapView({ legs, markers }: { legs: Leg[], markers: { point: Point, label: string }[] }) {
  const center = { lat: 47.0, lon: 2.0 }
  return (
    <div className="card p-0 overflow-hidden">
      <RL.MapContainer style={{ height: 520, width: '100%' }} center={[center.lat, center.lon]} zoom={6}>
        <RL.TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
        {markers.map((m, i) => (
          <RL.Marker key={'m'+i} position={[m.point.lat, m.point.lon]}>
            <RL.Popup>{m.label}</RL.Popup>
          </RL.Marker>
        ))}
        {legs.map((l, i) => (
          <RL.Polyline key={'l'+i} positions={[[l.from.lat, l.from.lon], [l.to.lat, l.to.lon]]} />
        ))}
      </RL.MapContainer>
    </div>
  )
}
