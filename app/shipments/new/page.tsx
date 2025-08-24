'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewShipment() {
  const r = useRouter()
  const [form, setForm] = useState({ ref:'', origin:'', destination:'', meters:'', status:'PLANNED' })
  const [saving, setSaving] = useState(false)
  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, meters: Number(form.meters || 0) }
    const res = await fetch('/api/shipments', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    if (res.ok) r.push('/shipments'); else setSaving(false)
  }
  return (
    <div className="card max-w-2xl">
      <h1 className="text-xl font-semibold mb-3">Nouvelle expédition</h1>
      <form className="grid gap-3" onSubmit={submit}>
        <div className="grid md:grid-cols-2 gap-3">
          <input placeholder="Référence (auto si vide)" value={form.ref} onChange={e=>setForm({...form, ref:e.target.value.toUpperCase()})}/>
          <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
            {['PLANNED','IN_TRANSIT','DELIVERED','CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <input required placeholder="Origine *" value={form.origin} onChange={e=>setForm({...form, origin:e.target.value})}/>
          <input required placeholder="Destination *" value={form.destination} onChange={e=>setForm({...form, destination:e.target.value})}/>
        </div>
        <input type="number" step="0.1" placeholder="m linéaire" value={form.meters} onChange={e=>setForm({...form, meters:e.target.value})}/>
        <button disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
      </form>
    </div>
  )
}
