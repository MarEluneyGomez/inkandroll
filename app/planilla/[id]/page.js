'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'

import BloqueArrastrable from './components/BloqueArrastrable'
import BloqueHabilidades from './components/BloqueHabilidades'
import PanelPersonalizacion from './components/PanelPersonalizacion'
import DesplegableStat from './components/DesplegableStat'
import BloqueSalvacionMuerte from './components/BloqueSalvacionMuerte.js'
import BloquePuntosGolpeTemp from './components/BloquePuntosGolpeTemp'
import BloqueDadosGolpe from './components/BloqueDadosGolpe'
import BloqueContador from './components/BloqueContador'
import BloqueMonedas from './components/BloqueMonedas'
import DesplegableMonedas from './components/DesplegableMonedas'
import BloqueHP from './components/BloqueHP'
import DesplegableHP from './components/DesplegableHP'


const GRILLA = 20

const BLOQUES_STATS_INICIALES = (stats) => [
    { id: 'fuerza',       tipo: 'stat', label: 'Fuerza',   valor: stats?.fuerza || 10,       x: 60,  y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'destreza',     tipo: 'stat', label: 'Destreza', valor: stats?.destreza || 10,      x: 180, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'constitucion', tipo: 'stat', label: 'Constitucion',   valor: stats?.constitucion || 10,  x: 300, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'inteligencia', tipo: 'stat', label: 'Inteligencia',   valor: stats?.inteligencia || 10,  x: 420, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'sabiduria',    tipo: 'stat', label: 'Sabiduria',   valor: stats?.sabiduria || 10,     x: 540, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
    { id: 'carisma',      tipo: 'stat', label: 'Carisma',  valor: stats?.carisma || 10,       x: 660, y: 80, ancho: 100, alto: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' },
]

const TIPOS_BLOQUES = [
    { tipo: 'habilidades', label: 'Lista de habilidades' },
    { tipo: 'hp',          label: 'Puntos de golpe' },
    { tipo: 'ac',          label: 'Clase de armadura' },
    { tipo: 'proficiency', label: 'Bono de proficiencia' },
    { tipo: 'speed',       label: 'Velocidad' },
    { tipo: 'salvacion_muerte', label: 'Salvaciones de muerte' },
    { tipo: 'pg_temp',   label: 'PG Temporales' },
    { tipo: 'dados_golpe', label: 'Dados de golpe' },
    { tipo: 'contador',  label: 'Contador' },
    { tipo: 'monedas', label: 'Monedas' },
]

export default function EditarPlanilla() {
    const { id } = useParams()
    const router = useRouter()
    const supabase = createClient()

    const [planilla, setPlanilla] = useState(null)
    const [bloques, setBloques] = useState([])
    const [guardando, setGuardando] = useState(false)
    const [seleccionado, setSeleccionado] = useState(null)
    const [modoEdicion, setModoEdicion] = useState(false)
    const [mostrarMenuAgregar, setMostrarMenuAgregar] = useState(false)
    const [stats, setStats] = useState(null)
    const [desplegableBloque, setDesplegableBloque] = useState(null)
    const [desplegableRect, setDesplegableRect] = useState(null)
    const [desplegableReorganizar, setDesplegableReorganizar] = useState(null)

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 5 }
    }))

    const canvasRef = useRef(null)

    useEffect(() => {
        async function cargar() {
            const { data, error } = await supabase.from('planillas').select('*').eq('id', id).single()
            if (error || !data) { router.push('/dashboard'); return }
            setPlanilla(data)
            setStats(data.stats)
            setBloques(data.layout?.length > 0 ? data.layout : BLOQUES_STATS_INICIALES(data.stats))
        }
        cargar()
    }, [id])

    useEffect(() => {
    if (modoEdicion) return
    if (bloques.length === 0) return

    const timeout = setTimeout(async () => {
        await supabase.from('planillas').update({
            layout: bloques,
            stats: stats,
            competencies: planilla?.competencies,
            expertises: planilla?.expertises,
            saving_throws: planilla?.saving_throws
        }).eq('id', id)
    }, 1000)

    return () => clearTimeout(timeout)
}, [bloques, modoEdicion])

    function handleDragEnd(event) {
        const { active, delta } = event
        setBloques(prev => prev.map(b =>
            b.id === active.id
                ? { ...b, x: Math.round((b.x + delta.x) / GRILLA) * GRILLA, y: Math.round((b.y + delta.y) / GRILLA) * GRILLA }
                : b
        ))
    }
    
    function handleCambiarPlanilla(campo, valor) { setPlanilla(prev => ({ ...prev, [campo]: valor })) }
    function handleCambiarBloque(propiedad, valor) { setBloques(prev => prev.map(b => b.id === seleccionado ? { ...b, [propiedad]: valor } : b)) }
    function handleRedimensionar(id, ancho, alto, x, y) { setBloques(prev => prev.map(b => b.id === id ? { ...b, ancho, alto, x, y } : b)) }
    
    function handleEliminarBloque(id) {
        setBloques(prev => prev.filter(b => b.id !== id))
        if (seleccionado === id) setSeleccionado(null)
    }

    function handleCambiarValor(id, nuevoValor) {
        setBloques(prev => prev.map(b => b.id === id ? { ...b, valor: nuevoValor } : b))
        if (['fuerza', 'destreza', 'constitucion', 'inteligencia', 'sabiduria', 'carisma'].includes(id)) {
            setStats(prev => ({ ...prev, [id]: nuevoValor }))
        }
    }

    function agregarBloque(tipo) {
        const nuevoId = `${tipo}_${Date.now()}`
        const base = { id: nuevoId, tipo, x: 100, y: 100, color: '#f4ead5', colorTexto: '#2c1810', forma: 'cuadrado' }
        const extras = {
            habilidades: { ancho: 200, alto: 400, label: 'Habilidades' },
            hp: { ancho: 180, alto: 120, label: 'HP', actual: 10, maximo: 10 },
            ac:          { ancho: 100, alto: 100, label: 'CA', valor: 10 },
            proficiency: { ancho: 100, alto: 100, label: 'Prof.', valor: planilla?.proficiency || 2 },
            speed:       { ancho: 100, alto: 100, label: 'Vel.', valor: 30 },
            salvacion_muerte: { ancho: 180, alto: 100, label: 'Salvaciones de muerte', maxExitos: 3, maxFallos: 3, exitosMarcados: 0, fallosMarcados: 0 },
            pg_temp:     { ancho: 140, alto: 100, label: 'PG Temporales', valor: 0 },
            dados_golpe: { ancho: 200, alto: 110, label: 'Dados de golpe', tipoDado: 'd8', cantidad: 3, usados: 0 },
            contador:    { ancho: 140, alto: 120, titulo: 'Contador', valor: 0, maximo: null },
            monedas: { ancho: 160, alto: 100, pp: 0, po: 0, pe: 0, pa: 0, pc: 0, ocultas: ['pe'],
                        pc_a_pa: 10, pa_a_pe: 10, pe_a_po: 2, po_a_pp: 10 },
        }
        setBloques(prev => [...prev, { ...base, ...extras[tipo] }])
        setMostrarMenuAgregar(false)
    }

    function handleCambiarCampoBloque(id, campo, valor) {
        setBloques(prev => prev.map(b =>
            b.id === id ? {...b, [campo]: valor} : b
        ))
    }

    async function guardarLayout() {
        setGuardando(true)
        await supabase.from('planillas').update({ 
            layout: bloques, 
            stats: stats,
            competencies: planilla.competencies, 
            expertises: planilla.expertises,
            saving_throws: planilla.saving_throws
         }).eq('id', id)
        setGuardando(false)
    }

    if (!planilla) return <p style={{ padding: 40 }}>Cargando...</p>

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <style>{`
                .area-planilla::-webkit-scrollbar { width: 8px; height: 8px; }
                .area-planilla::-webkit-scrollbar-track { background: #1a0e04; }
                .area-planilla::-webkit-scrollbar-thumb { background: #c9a227; border-radius: 10px; border: 2px solid #1a0e04; }
                .area-planilla::-webkit-scrollbar-thumb:hover { background: #e5bc3d; }
            `}</style>

            {/* Header */}
            <div style={{ padding: '10px 20px', background: '#1a0e04', color: '#c9a227', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <button onClick={() => router.push('/dashboard')}
                    style={{ background: 'transparent', border: 'none', color: '#c9a227', cursor: 'pointer', fontSize: 18, padding: '0 8px', opacity: 0.7 }}
                    onMouseEnter={e => e.target.style.opacity = 1}
                    onMouseLeave={e => e.target.style.opacity = 0.7}
                >←</button>
                <span style={{ fontWeight: 'bold' }}>{planilla.nombre}</span>
                <div style={{ display: 'flex', gap: 10 }}>
                    {modoEdicion && (
                        <div style={{ position: 'relative' }}>
                            <button onClick={(e) => { e.stopPropagation(); setMostrarMenuAgregar(!mostrarMenuAgregar) }}
                                style={{ padding: '6px 16px', background: 'transparent', color: '#c9a227', border: '1px solid #c9a227', borderRadius: 4, cursor: 'pointer' }}>
                                + Agregar bloque
                            </button>
                            {mostrarMenuAgregar && (
                                <div style={{ position: 'absolute', top: 36, right: 0, background: '#2c1810', border: '1px solid #c9a227', borderRadius: 6, zIndex: 2000, minWidth: 200 }}>
                                    {TIPOS_BLOQUES.map(t => (
                                        <div key={t.tipo} onClick={() => agregarBloque(t.tipo)} style={{ padding: '10px 16px', cursor: 'pointer', color: '#f4ead5', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
                                            {t.label}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                    <button onClick={() => setModoEdicion(!modoEdicion)} style={{ padding: '6px 16px', background: modoEdicion ? '#c9a227' : 'transparent', color: modoEdicion ? '#1a0e04' : '#c9a227', border: '1px solid #c9a227', borderRadius: 4 }}>
                        {modoEdicion ? 'Modo: Editar' : 'Modo: Ver'}
                    </button>
                    <button onClick={guardarLayout} style={{ padding: '6px 16px', background: '#c9a227', border: 'none', borderRadius: 4, color: '#1a0e04' }}>
                        {guardando ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            </div>

            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div 
                    ref={canvasRef}
                    onClick={() => { 
                        setSeleccionado(null); 
                        setMostrarMenuAgregar(false);
                        setDesplegableBloque(null);
                        setDesplegableRect(null)
                    }}
                    className="area-planilla"
                    style={{ 
                        flex: 1, 
                        position: 'relative', 
                        backgroundColor: '#1a1008', 
                        overflow: 'auto', 
                        padding: '100px'
                    }}
                >
                    <div style={{ 
                        width: '3000px', 
                        height: '3000px', 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        pointerEvents: 'none',
                        visibility: 'hidden' 
                    }} />

                    {bloques.map(b => {
                        if (b.tipo === 'habilidades') {
                            return (
                                <BloqueHabilidades
                                    key={b.id} bloque={b} seleccionado={seleccionado === b.id}
                                    onSeleccionar={setSeleccionado} onRedimensionar={handleRedimensionar}
                                    modoEdicion={modoEdicion} stats={stats} proficiency={planilla.proficiency}
                                    competencies={planilla.competencies} expertises={planilla.expertises}
                                    onCambiarPlanilla={handleCambiarPlanilla} onEliminar={handleEliminarBloque}
                                />
                            )
                        }

                        if (b.tipo === 'salvacion_muerte') return (
                            <BloqueSalvacionMuerte
                                key={b.id} bloque={b} seleccionado={seleccionado === b.id}
                                onSeleccionar={(id) => setSeleccionado(prev => prev === id ? null : id)}
                                onRedimensionar={handleRedimensionar}
                                onCambiarBloque={handleCambiarCampoBloque}
                                modoEdicion={modoEdicion}
                                onEliminar={handleEliminarBloque}
                            />
                        )

                        if (b.tipo === 'pg_temp') return (
                            <BloquePuntosGolpeTemp
                                key={b.id} bloque={b} seleccionado={seleccionado === b.id}
                                onSeleccionar={(id) => setSeleccionado(prev => prev === id ? null : id)}
                                onRedimensionar={handleRedimensionar}
                                onCambiarBloque={handleCambiarCampoBloque}
                                modoEdicion={modoEdicion}
                                onEliminar={handleEliminarBloque}
                            />
                        )

                        if (b.tipo === 'dados_golpe') return (
                            <BloqueDadosGolpe
                                key={b.id} bloque={b} seleccionado={seleccionado === b.id}
                                onSeleccionar={(id) => setSeleccionado(prev => prev === id ? null : id)}
                                onRedimensionar={handleRedimensionar}
                                onCambiarBloque={handleCambiarCampoBloque}
                                modoEdicion={modoEdicion}
                                onEliminar={handleEliminarBloque}
                            />
                        )

                        if (b.tipo === 'contador') return (
                            <BloqueContador
                                key={b.id} bloque={b} seleccionado={seleccionado === b.id}
                                onSeleccionar={(id) => setSeleccionado(prev => prev === id ? null : id)}
                                onRedimensionar={handleRedimensionar}
                                onCambiarBloque={handleCambiarCampoBloque}
                                modoEdicion={modoEdicion}
                                onEliminar={handleEliminarBloque}
                            />
                        )

                        if (b.tipo === 'monedas') return (
                            <BloqueMonedas
                                key={b.id} bloque={b} seleccionado={seleccionado === b.id}
                                onSeleccionar={(id) => setSeleccionado(prev => prev === id ? null : id)}
                                onRedimensionar={handleRedimensionar}
                                onCambiarBloque={handleCambiarCampoBloque}
                                modoEdicion={modoEdicion}
                                onEliminar={handleEliminarBloque}
                                onVerDetalle={(bloque, rect, reorganizar) => {
                                    if (desplegableBloque?.id === bloque.id) {
                                        setDesplegableBloque(null)
                                        setDesplegableRect(null)
                                        setDesplegableReorganizar(null)
                                    } else {
                                        setDesplegableBloque(bloque)
                                        setDesplegableRect(rect)
                                        setDesplegableReorganizar({fn: reorganizar})
                                    }
                                }}
                                                            />
                        )

                        if (b.tipo === 'hp') return (
                            <BloqueHP
                                key={b.id} bloque={b} seleccionado={seleccionado === b.id}
                                onSeleccionar={(id) => setSeleccionado(prev => prev === id ? null : id)}
                                onRedimensionar={handleRedimensionar}
                                onCambiarBloque={handleCambiarCampoBloque}
                                modoEdicion={modoEdicion}
                                onEliminar={handleEliminarBloque}
                                onVerDetalle={(bloque, rect) => {
                                    if (desplegableBloque?.id === bloque.id) {
                                        setDesplegableBloque(null)
                                        setDesplegableRect(null)
                                    } else {
                                        setDesplegableBloque(bloque)
                                        setDesplegableRect(rect)
                                    }
                                }}
                            />
                        )
                        
                        if (b.tipo) {
                            return (
                                <BloqueArrastrable
                                    key={b.id} bloque={b} seleccionado={seleccionado === b.id}
                                    onSeleccionar={setSeleccionado} onRedimensionar={handleRedimensionar}
                                    onCambiarValor={handleCambiarValor} modoEdicion={modoEdicion}
                                    onEliminar={handleEliminarBloque}
                                    onVerDetalle={(bloque, rect) => {
                                        if (desplegableBloque?.id === bloque.id) {
                                            setDesplegableBloque(null)
                                            setDesplegableRect(null)
                                        } else {
                                            setDesplegableBloque(bloque)
                                            setDesplegableRect(rect)
                                        }
                                    }}
                                />
                            )
                        }

                        return null
                    })}
                </div>
            </DndContext>

            {!modoEdicion && desplegableBloque?.tipo === 'hp' && (
                <DesplegableHP
                    bloque={bloques.find(b => b.id === desplegableBloque.id)}
                    rect={desplegableRect}
                    onCambiarBloque={handleCambiarCampoBloque}
                    onCerrar={() => setDesplegableBloque(null)}
                />
            )}
                        
            {!modoEdicion && desplegableBloque && 
            desplegableBloque.tipo !== 'monedas' && 
            desplegableBloque.tipo !== 'hp' &&(
                <DesplegableStat
                    key={desplegableBloque.id}
                    bloque={desplegableBloque}
                    rect={desplegableRect}
                    stats={stats}
                    proficiency={planilla.proficiency}
                    competencies={planilla.competencies}
                    expertises={planilla.expertises}
                    savingThrows={planilla.saving_throws}
                    onCambiarPlanilla={handleCambiarPlanilla}
                    onCerrar={() => setDesplegableBloque(null)}
                />
            )}

            {!modoEdicion && desplegableBloque?.tipo === 'monedas' && (
                <DesplegableMonedas
                    bloque={bloques.find(b => b.id === desplegableBloque.id)}
                    rect={desplegableRect}
                    onCambiarBloque={handleCambiarCampoBloque}
                    onReorganizar={desplegableReorganizar}
                    onCerrar={() => setDesplegableBloque(null)}
                />
            )}

            {modoEdicion && seleccionado && (
                <PanelPersonalizacion bloque={bloques.find(b => b.id === seleccionado)} onCambiar={handleCambiarBloque} onCerrar={() => setSeleccionado(null)} />
            )}
        </div>
    )
}