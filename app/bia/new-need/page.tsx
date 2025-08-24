'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Agency = { id:number, name:string }

export default function NewNeed() {
  const r = useRouter()
  const [agencies,setAgencies] = useState<Agency[]>([])
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ agencyId:'', origin:'', destination:'', meters:'' })
  useEffect(() => { fetch('/api/agencies').then(r=>r.json()).then(setAgencies) }, [])
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const res = await fetch('/api/needs', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, meters: Number(form.meters||0), agencyId: Number(form.agencyId) }) })
    if (res.ok) r.push('/bia'); else setSaving(false)
  }
  return (
    <div className="card max-w-xl">
      <h1 className="text-xl font-semibold mb-3">Nouveau BESOIN</h1>
      <form className="grid gap-3" onSubmit={submit}>
        <select required value={form.agencyId} onChange={e=>setForm({...form, agencyId:e.target.value})}>
          <option value="">Agence *</option>
          {agencies.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
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
