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

const GRILLA = 20

function BloqueArrastrable({
    bloque,
    seleccionado,
    onSeleccionar,
    onRedimensionar,
    modoEdicion
}) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: bloque.id,
        disabled: !modoEdicion
    })

    const ancho = bloque.ancho || 100
    const alto = bloque.alto || 100
    const esCirculo = bloque.forma === 'circulo'

    const style = {
        position: 'absolute',
        left: bloque.x,
        top: bloque.y,
        transform: CSS.Translate.toString(transform),
        background: bloque.color || '#f4ead5',
        border: seleccionado
            ? '2px solid #c9a227'
            : '2px solid #2c1810',
        borderRadius: esCirculo ? '50%' : 6,
        width: ancho,
        height: alto,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: modoEdicion ? 'grab' : 'default',
        userSelect: 'none',
        color: bloque.colorTexto || '#2c1810',
        boxShadow: seleccionado
            ? '0 0 0 3px rgba(201,162,39,0.5)'
            : '2px 3px 8px rgba(0,0,0,0.4)',
        transition: 'border 0.15s, box-shadow 0.15s'
    }

    const esquinas = [
        { cursor: 'se-resize', dx: 1, dy: 1 },
        { cursor: 'sw-resize', dx: -1, dy: 1 },
        { cursor: 'ne-resize', dx: 1, dy: -1 },
        { cursor: 'nw-resize', dx: -1, dy: -1 },
    ]

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...(modoEdicion ? listeners : {})}
                {...(modoEdicion ? attributes : {})}
                onMouseUp={(e) => {
                    e.stopPropagation()
                    onSeleccionar(bloque.id)
                }}
            >
                <div style={{
                    fontSize: 9,
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    marginBottom: 2,
                    opacity: 0.7
                }}>
                    {bloque.label}
                </div>

                <div style={{
                    fontSize: esCirculo ? 22 : 26,
                    fontWeight: 900,
                    lineHeight: 1
                }}>
                    {bloque.valor}
                </div>
            </div>

            {modoEdicion && seleccionado && esquinas.map((esquina, i) => (
                <div
                    key={i}
                    onMouseDown={(e) => {
                        e.stopPropagation()
                        e.preventDefault()

                        const startX = e.clientX
                        const startY = e.clientY
                        const startAncho = ancho
                        const startAlto = alto
                        const startBloqueX = bloque.x
                        const startBloqueY = bloque.y

                        function onMouseMove(e) {
                            const deltaX = (e.clientX - startX) * esquina.dx
                            const deltaY = (e.clientY - startY) * esquina.dy

                            const nuevoAncho =
                                Math.round((startAncho + deltaX) / GRILLA) * GRILLA

                            const nuevoAlto =
                                Math.round((startAlto + deltaY) / GRILLA) * GRILLA

                            const anchoFinal = Math.max(60, nuevoAncho)
                            const altoFinal = Math.max(60, nuevoAlto)

                            const nuevoPosX =
                                esquina.dx === -1
                                    ? startBloqueX - (anchoFinal - startAncho)
                                    : startBloqueX

                            const nuevoPosY =
                                esquina.dy === -1
                                    ? startBloqueY - (altoFinal - startAlto)
                                    : startBloqueY

                            onRedimensionar(
                                bloque.id,
                                anchoFinal,
                                altoFinal,
                                nuevoPosX,
                                nuevoPosY
                            )
                        }

                        function onMouseUp() {
                            document.removeEventListener('mousemove', onMouseMove)
                            document.removeEventListener('mouseup', onMouseUp)
                            document.body.style.cursor = ''
                        }

                        document.body.style.cursor = esquina.cursor

                        document.addEventListener('mousemove', onMouseMove)
                        document.addEventListener('mouseup', onMouseUp)
                    }}
                    style={{
                        position: 'absolute',

                        left:
                            esquina.dx === 1
                                ? bloque.x + ancho - 7
                                : bloque.x - 7,

                        top:
                            esquina.dy === 1
                                ? bloque.y + alto - 7
                                : bloque.y - 7,

                        width: 14,
                        height: 14,

                        cursor: esquina.cursor,

                        zIndex: 1000,

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div
                        style={{
                            width: 10,
                            height: 10,

                            borderTop:
                                esquina.dy === -1
                                    ? '2px solid #c9a227'
                                    : 'none',

                            borderBottom:
                                esquina.dy === 1
                                    ? '2px solid #c9a227'
                                    : 'none',

                            borderLeft:
                                esquina.dx === -1
                                    ? '2px solid #c9a227'
                                    : 'none',

                            borderRight:
                                esquina.dx === 1
                                    ? '2px solid #c9a227'
                                    : 'none'
                        }}
                    />
                </div>
            ))}
        </>
    )
}

function PanelPersonalizacion({ bloque, onCambiar, onCerrar }) {
    if (!bloque) return null

    return (
        <div style={{
            position: 'fixed',
            right: 20,
            top: 70,
            width: 200,
            background: '#2c1810',
            border: '1px solid #c9a227',
            borderRadius: 8,
            padding: 16,
            zIndex: 1000,
            color: '#f4ead5'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 12
            }}>
                <span style={{
                    fontWeight: 'bold',
                    fontSize: 12,
                    textTransform: 'uppercase',
                    color: '#c9a227'
                }}>
                    {bloque.label}
                </span>

                <span
                    onClick={onCerrar}
                    style={{
                        cursor: 'pointer',
                        color: '#c9a227'
                    }}
                >
                    ✕
                </span>
            </div>

            <div style={{ marginBottom: 12 }}>
                <div style={{
                    fontSize: 10,
                    marginBottom: 6,
                    opacity: 0.7
                }}>
                    COLOR DE FONDO
                </div>

                <input
                    type="color"
                    value={bloque.color || '#f4ead5'}
                    onChange={(e) =>
                        onCambiar('color', e.target.value)
                    }
                    style={{
                        width: '100%',
                        height: 32,
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 4
                    }}
                />
            </div>

            <div style={{ marginBottom: 12 }}>
                <div style={{
                    fontSize: 10,
                    marginBottom: 6,
                    opacity: 0.7
                }}>
                    COLOR DE TEXTO
                </div>

                <input
                    type="color"
                    value={bloque.colorTexto || '#2c1810'}
                    onChange={(e) =>
                        onCambiar('colorTexto', e.target.value)
                    }
                    style={{
                        width: '100%',
                        height: 32,
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: 4
                    }}
                />
            </div>

            <div style={{ marginBottom: 12 }}>
                <div style={{
                    fontSize: 10,
                    opacity: 0.7
                }}>
                    TAMAÑO:
                    <span style={{ color: '#c9a227' }}>
                        {' '}
                        {bloque.ancho || 100} × {bloque.alto || 100}px
                    </span>
                </div>
            </div>

            <div>
                <div style={{
                    fontSize: 10,
                    marginBottom: 6,
                    opacity: 0.7
                }}>
                    FORMA
                </div>

                <div style={{
                    display: 'flex',
                    gap: 6
                }}>
                    {['cuadrado', 'circulo'].map(f => (
                        <button
                            key={f}
                            onClick={() => onCambiar('forma', f)}
                            style={{
                                flex: 1,
                                padding: '4px 0',
                                fontSize: 10,
                                background:
                                    bloque.forma === f
                                        ? '#c9a227'
                                        : 'transparent',
                                color:
                                    bloque.forma === f
                                        ? '#1a0e04'
                                        : '#f4ead5',
                                border: '1px solid #c9a227',
                                borderRadius: 4,
                                cursor: 'pointer'
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
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
    const [seleccionado, setSeleccionado] = useState(null)
    const [modoEdicion, setModoEdicion] = useState(true)
    const [mostrarGrilla, setMostrarGrilla] = useState(true)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5
            }
        })
    )

    useEffect(() => {
        async function cargar() {
            const { data, error } = await supabase
                .from('planillas')
                .select('*')
                .eq('id', id)
                .single()

            if (error || !data) {
                router.push('/dashboard')
                return
            }

            setPlanilla(data)

            if (data.layout && data.layout.length > 0) {
                setBloques(data.layout)
            } else {
                setBloques([
                    {
                        id: 'fuerza',
                        label: 'Fuerza',
                        valor: data.stats.fuerza,
                        x: 60,
                        y: 80,
                        ancho: 100,
                        alto: 100,
                        color: '#f4ead5',
                        colorTexto: '#2c1810',
                        forma: 'cuadrado'
                    },
                    {
                        id: 'destreza',
                        label: 'Destreza',
                        valor: data.stats.destreza,
                        x: 180,
                        y: 80,
                        ancho: 100,
                        alto: 100,
                        color: '#f4ead5',
                        colorTexto: '#2c1810',
                        forma: 'cuadrado'
                    },
                    {
                        id: 'constitucion',
                        label: 'Const.',
                        valor: data.stats.constitucion,
                        x: 300,
                        y: 80,
                        ancho: 100,
                        alto: 100,
                        color: '#f4ead5',
                        colorTexto: '#2c1810',
                        forma: 'cuadrado'
                    },
                    {
                        id: 'inteligencia',
                        label: 'Intel.',
                        valor: data.stats.inteligencia,
                        x: 420,
                        y: 80,
                        ancho: 100,
                        alto: 100,
                        color: '#f4ead5',
                        colorTexto: '#2c1810',
                        forma: 'cuadrado'
                    },
                    {
                        id: 'sabiduria',
                        label: 'Sabid.',
                        valor: data.stats.sabiduria,
                        x: 540,
                        y: 80,
                        ancho: 100,
                        alto: 100,
                        color: '#f4ead5',
                        colorTexto: '#2c1810',
                        forma: 'cuadrado'
                    },
                    {
                        id: 'carisma',
                        label: 'Carisma',
                        valor: data.stats.carisma,
                        x: 660,
                        y: 80,
                        ancho: 100,
                        alto: 100,
                        color: '#f4ead5',
                        colorTexto: '#2c1810',
                        forma: 'cuadrado'
                    }
                ])
            }
        }

        cargar()
    }, [id])

    function handleDragEnd(event) {
        const { active, delta } = event

        setBloques(prev =>
            prev.map(b =>
                b.id === active.id
                    ? {
                        ...b,
                        x: Math.round((b.x + delta.x) / GRILLA) * GRILLA,
                        y: Math.round((b.y + delta.y) / GRILLA) * GRILLA
                    }
                    : b
            )
        )
    }

    function handleCambiarBloque(propiedad, valor) {
        setBloques(prev =>
            prev.map(b =>
                b.id === seleccionado
                    ? { ...b, [propiedad]: valor }
                    : b
            )
        )
    }

    function handleRedimensionar(id, ancho, alto, x, y) {
        setBloques(prev =>
            prev.map(b =>
                b.id === id
                    ? {
                        ...b,
                        ancho,
                        alto,
                        x,
                        y
                    }
                    : b
            )
        )
    }

    async function guardarLayout() {
        setGuardando(true)

        await supabase
            .from('planillas')
            .update({ layout: bloques })
            .eq('id', id)

        setGuardando(false)
    }

    const bloqueSeleccionado =
        bloques.find(b => b.id === seleccionado)

    if (!planilla) {
        return (
            <p style={{ padding: 40 }}>
                Cargando...
            </p>
        )
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                padding: '10px 20px',
                background: '#1a0e04',
                color: '#c9a227',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <span style={{ fontWeight: 'bold' }}>
                    {planilla.nombre} — {planilla.raza} {planilla.clase}
                </span>

                <div style={{
                    display: 'flex',
                    gap: 10
                }}>
                    <button
                        onClick={() =>
                            setModoEdicion(!modoEdicion)
                        }
                        style={{
                            padding: '6px 16px',
                            background:
                                modoEdicion
                                    ? '#c9a227'
                                    : 'transparent',
                            color:
                                modoEdicion
                                    ? '#1a0e04'
                                    : '#c9a227',
                            border: '1px solid #c9a227',
                            borderRadius: 4,
                            cursor: 'pointer'
                        }}
                    >
                        {modoEdicion
                            ? 'Modo: Editar'
                            : 'Modo: Ver'}
                    </button>

                    {modoEdicion && (
                        <button
                            onClick={() =>
                                setMostrarGrilla(!mostrarGrilla)
                            }
                            style={{
                                padding: '6px 16px',
                                background:
                                    mostrarGrilla
                                        ? '#c9a227'
                                        : 'transparent',
                                color:
                                    mostrarGrilla
                                        ? '#1a0e04'
                                        : '#c9a227',
                                border: '1px solid #c9a227',
                                borderRadius: 4,
                                cursor: 'pointer'
                            }}
                        >
                            {mostrarGrilla
                                ? 'Ocultar Grilla'
                                : 'Mostrar Grilla'}
                        </button>
                    )}

                    <button
                        onClick={guardarLayout}
                        style={{
                            padding: '6px 16px',
                            background: '#c9a227',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            color: '#1a0e04'
                        }}
                    >
                        {guardando
                            ? 'Guardando...'
                            : 'Guardar'}
                    </button>

                    <button
                        onClick={() =>
                            router.push('/dashboard')
                        }
                        style={{
                            padding: '6px 16px',
                            background: 'transparent',
                            color: '#c9a227',
                            border: '1px solid #c9a227',
                            borderRadius: 4,
                            cursor: 'pointer'
                        }}
                    >
                        Volver
                    </button>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
            >
                <div
                    style={{
                        flex: 1,
                        position: 'relative',
                        background: '#1a1008',
                        overflow: 'hidden',

                        ...(modoEdicion && mostrarGrilla
                            ? {
                                backgroundImage: `
                                    linear-gradient(rgba(201,162,39,0.05) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(201,162,39,0.05) 1px, transparent 1px)
                                `,
                                backgroundSize: `${GRILLA}px ${GRILLA}px`
                            }
                            : {})
                    }}
                >
                    {bloques.map(b => (
                        <BloqueArrastrable
                            key={b.id}
                            bloque={b}
                            seleccionado={seleccionado === b.id}
                            onSeleccionar={(id) => {
                                setSeleccionado(prev =>
                                    prev === id ? null : id
                                )
                            }}
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
                    onCerrar={() =>
                        setSeleccionado(null)
                    }
                />
            )}
        </div>
    )
}