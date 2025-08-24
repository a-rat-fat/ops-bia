'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Offer = { id:number; origin:string; destination:string; meters:number }
type Need = { id:number; origin:string; destination:string; meters:number }

export default function MatchPage() {
  const r = useRouter()
  const sp = useSearchParams()
  const offerId = sp.get('offer') || ''
  const [offers, setOffers] = useState<Offer[]>([])
  const [needs, setNeeds] = useState<Need[]>([])
  const [sel, setSel] = useState({ offerId, needId:'' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([fetch('/api/offers').then(r=>r.json()), fetch('/api/needs').then(r=>r.json())]).then(([o,n]) => {
      setOffers(o.filter((x:any)=>x.status==='OPEN')); setNeeds(n.filter((x:any)=>x.status==='OPEN'))
    })
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const res = await fetch('/api/bia/match', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ offerId: Number(sel.offerId), needId: Number(sel.needId) }) })
    if (res.ok) r.push('/shipments'); else setSaving(false)
  }

  return (
    <div className="card max-w-2xl">
      <h1 className="text-xl font-semibold mb-3">Créer une expédition depuis OFFRE ↔ BESOIN</h1>
      <form className="grid gap-3" onSubmit={submit}>
        <select required value={sel.offerId} onChange={e=>setSel({...sel, offerId:e.target.value})}>
          <option value="">Sélectionner une OFFRE *</option>
          {offers.map(o => <option key={o.id} value={o.id}>#{o.id} {o.origin} → {o.destination} • {o.meters} m</option>)}
        </select>
        <select required value={sel.needId} onChange={e=>setSel({...sel, needId:e.target.value})}>
          <option value="">Sélectionner un BESOIN *</option>
          {needs.map(n => <option key={n.id} value={n.id}>#{n.id} {n.origin} → {n.destination} • {n.meters} m</option>)}
        </select>
        <button disabled={saving}>{saving ? 'Création…' : 'Créer l'expédition & matcher'}</button>
      </form>
    </div>
  )
}
