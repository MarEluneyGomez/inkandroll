'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import BloqueArrastrable from './components/BloqueArrastrable'
import PanelPersonalizacion from './components/PanelPersonalizacion'

const GRILLA = 20

const BLOQUES_INICIALES = (stats) => [
    { id: 'fuerza',       label: 'Fuerza',   valor: stats.fuerza,        x: 60,  y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'destreza',     label: 'Destreza', valor: stats.destreza,      x: 180, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'constitucion', label: 'Constitucion',   valor: stats.constitucion,  x: 300, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'inteligencia', label: 'Inteligencia',   valor: stats.inteligencia,  x: 420, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'sabiduria',    label: 'Sabiduria',   valor: stats.sabiduria,     x: 540, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'carisma',      label: 'Carisma',  valor: stats.carisma,       x: 660, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
]

export default function EditarPlanilla() {
    const { id } = useParams()
    const router = useRouter()
    const supabase = createClient()

    const [planilla, setPlanilla] = useState(null)
    const [bloques, setBloques] = useState([])
    const [guardando, setGuardando] = useState(false)
    const [seleccionado, setSeleccionado] = useState(null)
    const [modoEdicion, setModoEdicion] = useState(true)
    const [mostrarGrilla, setMostrarGrilla] = useState(true)

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 5 }
    }))

    useEffect(() => {
        async function cargar() {
            const { data, error } = await supabase
                .from('planillas')
                .select('*')
                .eq('id', id)
                .single()
            if (error || !data) { router.push('/dashboard'); return }
            setPlanilla(data)
            setBloques(data.layout?.length > 0 ? data.layout : BLOQUES_INICIALES(data.stats))
        }
        cargar()
    }, [id])

    function handleDragEnd(event) {
        const { active, delta } = event
        setBloques(prev => prev.map(b =>
            b.id === active.id
                ? { ...b, x: Math.round((b.x + delta.x) / GRILLA) * GRILLA, y: Math.round((b.y + delta.y) / GRILLA) * GRILLA }
                : b
        ))
    }

    function handleCambiarBloque(propiedad, valor) {
        setBloques(prev => prev.map(b =>
            b.id === seleccionado ? { ...b, [propiedad]: valor } : b
        ))
    }

    function handleRedimensionar(id, ancho, alto, x, y) {
        setBloques(prev => prev.map(b =>
            b.id === id ? { ...b, ancho, alto, x, y } : b
        ))
    }

    async function guardarLayout() {
        setGuardando(true)
        await supabase.from('planillas').update({ layout: bloques }).eq('id', id)
        setGuardando(false)
    }

    const bloqueSeleccionado = bloques.find(b => b.id === seleccionado)

    if (!planilla) return <p style={{ padding: 40 }}>Cargando...</p>

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 20px', background: '#1a0e04', color: '#c9a227', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{planilla.nombre} — {planilla.raza} {planilla.clase}</span>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => setModoEdicion(!modoEdicion)}
                        style={{ padding: '6px 16px', background: modoEdicion ? '#c9a227' : 'transparent', color: modoEdicion ? '#1a0e04' : '#c9a227', border: '1px solid #c9a227', borderRadius: 4, cursor: 'pointer' }}>
                        {modoEdicion ? 'Modo: Editar' : 'Modo: Ver'}
                    </button>
                    {modoEdicion && (
                        <button onClick={() => setMostrarGrilla(!mostrarGrilla)}
                            style={{ padding: '6px 16px', background: mostrarGrilla ? '#c9a227' : 'transparent', color: mostrarGrilla ? '#1a0e04' : '#c9a227', border: '1px solid #c9a227', borderRadius: 4, cursor: 'pointer' }}>
                            {mostrarGrilla ? 'Ocultar Grilla' : 'Mostrar Grilla'}
                        </button>
                    )}
                    <button onClick={guardarLayout}
                        style={{ padding: '6px 16px', background: '#c9a227', border: 'none', borderRadius: 4, cursor: 'pointer', color: '#1a0e04' }}>
                        {guardando ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button onClick={() => router.push('/dashboard')}
                        style={{ padding: '6px 16px', background: 'transparent', color: '#c9a227', border: '1px solid #c9a227', borderRadius: 4, cursor: 'pointer' }}>
                        Volver
                    </button>
                </div>
            </div>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div style={{
                    flex: 1, position: 'relative', background: '#1a1008', overflow: 'hidden',
                    ...(modoEdicion && mostrarGrilla ? {
                        backgroundImage: `linear-gradient(rgba(201,162,39,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.05) 1px, transparent 1px)`,
                        backgroundSize: `${GRILLA}px ${GRILLA}px`
                    } : {})
                }}>
                    {bloques.map(b => (
                        <BloqueArrastrable
                            key={b.id}
                            bloque={b}
                            seleccionado={seleccionado === b.id}
                            onSeleccionar={(id) => setSeleccionado(prev => prev === id ? null : id)}
                            onRedimensionar={handleRedimensionar}
                            modoEdicion={modoEdicion}
                        />
                    ))}
                </div>
            </DndContext>

            {modoEdicion && seleccionado && (
                <PanelPersonalizacion
                    bloque={bloqueSeleccionado}
                    onCambiar={handleCambiarBloque}
                    onCerrar={() => setSeleccionado(null)}
                />
            )}
        </div>
    )
}