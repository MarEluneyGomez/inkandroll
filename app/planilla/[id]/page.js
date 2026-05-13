'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '../../../lib/supabase'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import BloqueArrastrable from './components/BloqueArrastrable.js'
import BloqueHabilidades from './components/BloqueHabilidades.js'
import PanelPersonalizacion from './components/PanelPersonalizacion.js'

const GRILLA = 20

const BLOQUES_STATS_INICIALES = (stats) => [
    { id: 'fuerza',       tipo: 'stat', label: 'Fuerza',   valor: stats.fuerza,        x: 60,  y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'destreza',     tipo: 'stat', label: 'Destreza', valor: stats.destreza,      x: 180, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'constitucion', tipo: 'stat', label: 'Const.',   valor: stats.constitucion,  x: 300, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'inteligencia', tipo: 'stat', label: 'Intel.',   valor: stats.inteligencia,  x: 420, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'sabiduria',    tipo: 'stat', label: 'Sabid.',   valor: stats.sabiduria,     x: 540, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'carisma',      tipo: 'stat', label: 'Carisma',  valor: stats.carisma,       x: 660, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
]

const TIPOS_BLOQUES = [
    { tipo: 'habilidades', label: 'Lista de habilidades' },
    { tipo: 'hp',          label: 'Puntos de golpe' },
    { tipo: 'ac',          label: 'Clase de armadura' },
    { tipo: 'proficiency', label: 'Bono de proficiencia' },
    { tipo: 'speed',       label: 'Velocidades' },
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
    const [mostrarMenuAgregar, setMostrarMenuAgregar] = useState(false)
    const [stats, setStats] = useState(null)

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
            setStats(data.stats)
            setBloques(data.layout?.length > 0 ? data.layout : BLOQUES_STATS_INICIALES(data.stats))
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

    function handleCambiarValor(id, nuevoValor) {
        console.log('cambiando:', id, nuevoValor)
        setBloques(prev => prev.map(b =>
            b.id === id ? { ...b, valor: nuevoValor } : b
        ))
        if (['fuerza', 'destreza', 'constitucion', 'inteligencia', 'sabiduria', 'carisma'].includes(id)) {
            setStats(prev => ({ ...prev, [id]: nuevoValor }))
        }
    }

    function agregarBloque(tipo) {
        const nuevoId = `${tipo}_${Date.now()}`
        const base = { id: nuevoId, tipo, x: 100, y: 200, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' }

        const extras = {
            habilidades: { ancho: 200, alto: 400, label: 'Habilidades' },
            hp:          { ancho: 120, alto: 100, label: 'HP', valorActual: 0, valorMax: 0 },
            ac:          { ancho: 100, alto: 100, label: 'CA', valor: 0 },
            proficiency: { ancho: 100, alto: 100, label: 'Prof.', valor: planilla?.proficiency || 2 },
            speed:       { ancho: 180, alto: 160, label: 'Velocidad', terrestre: 30, vuelo: 0, nado: 0, escalada: 0 },
        }

        setBloques(prev => [...prev, { ...base, ...extras[tipo] }])
        setMostrarMenuAgregar(false)
    }

    async function guardarLayout() {
        setGuardando(true)
        await supabase.from('planillas').update({ 
            layout: bloques,
            stats: stats
         }).eq('id', id)
        setGuardando(false)
    }

    const bloqueSeleccionado = bloques.find(b => b.id === seleccionado)

    if (!planilla) return <p style={{ padding: 40 }}>Cargando...</p>

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '10px 20px', background: '#1a0e04', color: '#c9a227', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{planilla.nombre} — {planilla.raza} {planilla.clase}</span>
                <div style={{ display: 'flex', gap: 10 }}>
                    {modoEdicion && (
                        <>
                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setMostrarMenuAgregar(!mostrarMenuAgregar) }}
                                    style={{ padding: '6px 16px', background: 'transparent', color: '#c9a227', border: '1px solid #c9a227', borderRadius: 4, cursor: 'pointer' }}>
                                    + Agregar bloque
                                </button>
                                {mostrarMenuAgregar && (
                                    <div style={{
                                        position: 'absolute', top: 36, right: 0, background: '#2c1810',
                                        border: '1px solid #c9a227', borderRadius: 6, zIndex: 2000,
                                        minWidth: 200, overflow: 'hidden'
                                    }}>
                                        {TIPOS_BLOQUES.map(t => (
                                            <div key={t.tipo} onClick={() => agregarBloque(t.tipo)}
                                                style={{
                                                    padding: '10px 16px', cursor: 'pointer', fontSize: 13,
                                                    color: '#f4ead5', borderBottom: '1px solid rgba(201,162,39,0.2)'
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,162,39,0.1)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                {t.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setMostrarGrilla(!mostrarGrilla)}
                                style={{ padding: '6px 16px', background: mostrarGrilla ? '#c9a227' : 'transparent', color: mostrarGrilla ? '#1a0e04' : '#c9a227', border: '1px solid #c9a227', borderRadius: 4, cursor: 'pointer' }}>
                                {mostrarGrilla ? 'Ocultar grilla' : 'Mostrar grilla'}
                            </button>
                        </>
                    )}
                    <button onClick={() => setModoEdicion(!modoEdicion)}
                        style={{ padding: '6px 16px', background: modoEdicion ? '#c9a227' : 'transparent', color: modoEdicion ? '#1a0e04' : '#c9a227', border: '1px solid #c9a227', borderRadius: 4, cursor: 'pointer' }}>
                        {modoEdicion ? 'Modo: Editar' : 'Modo: Ver'}
                    </button>
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
                <div
                        onClick={() => { setSeleccionado(null); setMostrarMenuAgregar(false) }}
                        style={{
                            flex: 1,
                            position: 'relative',
                            backgroundColor: '#1a1008',
                            backgroundImage: modoEdicion && mostrarGrilla
                                ? `linear-gradient(rgba(201,162,39,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.05) 1px, transparent 1px)`
                                : 'none',
                            backgroundSize: modoEdicion && mostrarGrilla ? `${GRILLA}px ${GRILLA}px` : 'auto',
                            overflow: 'hidden',
                        }}
                    >
                                        {bloques.map(b => {
                        if (b.tipo === 'habilidades') return (
                            <BloqueHabilidades
                                key={b.id}
                                bloque={b}
                                seleccionado={seleccionado === b.id}
                                onSeleccionar={(id) => setSeleccionado(prev => prev === id ? null : id)}
                                onRedimensionar={handleRedimensionar}
                                modoEdicion={modoEdicion}
                                stats={stats}
                                proficiency={planilla.proficiency}
                                competencies={planilla.competencies}
                                expertises={planilla.expertises}
                            />
                        )
                        return (
                            <BloqueArrastrable
                                key={b.id}
                                bloque={b}
                                seleccionado={seleccionado === b.id}
                                onSeleccionar={(id) => setSeleccionado(prev => prev === id ? null : id)}
                                onRedimensionar={handleRedimensionar}
                                onCambiarValor={handleCambiarValor}
                                modoEdicion={modoEdicion}
                            />
                        )
                    })}
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