'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase'
import {
    DndContext,
    useDraggable,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

function BloqueArrastrable({ bloque }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: bloque.id
    })
    const style = {
        position: 'absolute',
        left: bloque.x,
        top: bloque.y,
        transform: CSS.Translate.toString(transform),
        background: bloque.color || '#f4ead5',
        border: '2px solid #2c1810',
        borderRadius: 6,
        padding: 12,
        minWidth: 80,
        textAlign: 'center',
        cursor: 'grab',
        userSelect: 'none',
        color: '#2c1810'
    }

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <div style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 }}>
                {bloque.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 900 }}>
                {bloque.valor}
            </div>
        </div>
    )
}

export default function EditarPlanilla() {
    const { id } = useParams()
    const router = useRouter()
    const supabase = createClient()
    const [planilla, setPlanilla] = useState(null)
    const [bloques, setBloques] = useState([])
    const [guardando, setGuardando] = useState(false)

    const sensors = useSensors(useSensor(PointerSensor))

    useEffect(() => {
        async function cargar() {
            const { data, error } = await supabase
                .from('planillas')
                .select('*')
                .eq('id', id)
                .single()
            console.log('data:', data, 'error:', error)
            if (error || !data) { router.push('/dashboard'); return }
            setPlanilla(data)

            if (data.layout && data.layout.length > 0) {
                setBloques(data.layout)
            } else {
                setBloques([
                    { id: 'fuerza',       label: 'Fuerza',       valor: data.stats.fuerza,        x: 60,  y: 80 },
                    { id: 'destreza',     label: 'Destreza',     valor: data.stats.destreza,      x: 180, y: 80 },
                    { id: 'constitucion', label: 'Const.',       valor: data.stats.constitucion,  x: 300, y: 80 },
                    { id: 'inteligencia', label: 'Intel.',       valor: data.stats.inteligencia,  x: 420, y: 80 },
                    { id: 'sabiduria',    label: 'Sabid.',       valor: data.stats.sabiduria,     x: 540, y: 80 },
                    { id: 'carisma',      label: 'Carisma',      valor: data.stats.carisma,       x: 660, y: 80 },
                ])
            }
        }
        cargar()
    }, [id])

    function handleDragEnd(event) {
        const { active, delta } = event
        setBloques(prev => prev.map(b =>
            b.id === active.id
                ? { ...b, x: b.x + delta.x, y: b.y + delta.y }
                : b
        ))
    }

    async function guardarLayout() {
        setGuardando(true)
        await supabase
            .from('planillas')
            .update({ layout: bloques })
            .eq('id', id)
        setGuardando(false)
    }

    if (!planilla) return <p style={{ padding: 40 }}>Cargando...</p>

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 20px', background: '#1a0e04', color: '#c9a227', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{planilla.nombre} — {planilla.raza} {planilla.clase}</span>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={guardarLayout} style={{ padding: '6px 16px', background: '#c9a227', border: 'none', borderRadius: 4, cursor: 'pointer', color: '#1a0e04' }}>
                        {guardando ? 'Guardando...' : 'Guardar layout'}
                    </button>
                    <button onClick={() => router.push('/dashboard')} style={{ padding: '6px 16px', background: 'transparent', color: '#c9a227', border: '1px solid #c9a227', borderRadius: 4, cursor: 'pointer' }}>
                        Volver
                    </button>
                </div>
            </div>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div style={{ flex: 1, position: 'relative', background: '#1a1008', overflow: 'hidden' }}>
                    {bloques.map(b => (
                        <BloqueArrastrable key={b.id} bloque={b} />
                    ))}
                </div>
            </DndContext>
        </div>
    )
}