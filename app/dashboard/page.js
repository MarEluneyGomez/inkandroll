'use client'

import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'


export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [planillas, setPlanillas] = useState([])
  const [nombre, setNombre] = useState('')
  const [raza, setRaza] = useState('')
  const [clase, setClase] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
      cargarPlanillas(user.id)
    }
    init()
  }, [])

  async function cargarPlanillas(userId) {
    const { data, error } = await supabase
      .from('planillas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (!error) setPlanillas(data)
  }

  async function crearPlanilla() {
    if (!nombre) return
    setLoading(true)
    const { error } = await supabase.from('planillas').insert({
      user_id: user.id,
      nombre,
      raza,
      clase,
      nivel: 1,
      stats: { fuerza: 10, destreza: 10, constitucion: 10, inteligencia: 10, sabiduria: 10, carisma: 10 },
      proficiency: 2,
      competencies: [],
      layout: [],
      saving_throws: []
    })
    if (!error) {
      setNombre('')
      setRaza('')
      setClase('')
      cargarPlanillas(user.id)
    }
    setLoading(false)
  }

  async function eliminarPlanilla(planillaId) {
    const { error } = await supabase.from('planillas').delete().eq('id', planillaId)
    if (!error) cargarPlanillas(user.id)
}

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (!user) return <p>Cargando...</p>

  return (
    <div style={{ maxWidth: 600, margin: '60px auto', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Mis Planillas</h1>
        <button onClick={handleLogout} style={{ padding: '6px 12px' }}>Cerrar sesión</button>
      </div>
      <hr style={{ margin: '16px 0' }} />

      <h2>Nueva planilla</h2>
      <input placeholder="Nombre del personaje" value={nombre}
        onChange={e => setNombre(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input placeholder="Raza" value={raza}
        onChange={e => setRaza(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 8, padding: 8 }} />
      <input placeholder="Clase" value={clase}
        onChange={e => setClase(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 16, padding: 8 }} />
      <button onClick={crearPlanilla} disabled={loading || !nombre}
        style={{ padding: '8px 20px', marginBottom: 32 }}>
        {loading ? 'Creando...' : 'Crear personaje'}
      </button>

      <h2>Tus personajes</h2>
      {planillas.length === 0 && <p style={{ color: '#888' }}>Todavía no tenés personajes.</p>}
      {planillas.map(p => (
        <div key={p.id} onClick={() => router.push(`/planilla/${p.id}`)} 
            style={{ border: '1px solid #ccc', borderRadius: 6, padding: 16, marginBottom: 12, position: 'relative', cursor: 'pointer' }}>
          <h3>{p.nombre}</h3>
          <p style={{ color: '#666' }}>{p.raza} · {p.clase} · Nivel {p.nivel}</p>
           <button
              onClick={(e) => {
                  e.stopPropagation()
                  if (confirm(`¿Eliminar a ${p.nombre}?`)) eliminarPlanilla(p.id)
              }}
              style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'transparent', border: 'none',
                  color: '#999', fontSize: 18, cursor: 'pointer'
              }}
              onMouseEnter={e => e.target.style.color = '#cc0000'}
              onMouseLeave={e => e.target.style.color = '#999'}
          >
              ×
          </button>
        </div>
      ))}
    </div>
  )
}
