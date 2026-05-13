'use client'

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { HABILIDADES, calcularBono, formatearBono } from "./habilidades"

const GRILLA = 20

const esquinas = [
    { cursor: 'se-resize', dx: 1,  dy: 1  },
    { cursor: 'sw-resize', dx: -1, dy: 1  },
    { cursor: 'ne-resize', dx: 1,  dy: -1 },
    { cursor: 'nw-resize', dx: -1, dy: -1 },
]

export default function BloqueHabilidades({
    bloque,
    seleccionado,
    onSeleccionar,
    onRedimensionar,
    modoEdicion,
    stats,
    proficiency,
    competencies,
    expertises
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: bloque.id,
        disabled: !modoEdicion
    })

    const ancho = bloque.ancho || 200
    const alto = bloque.alto || 400

    return (
        <>
            <div
                ref={setNodeRef}
                style={{
                    position: 'absolute',
                    left: bloque.x,
                    top: bloque.y,
                    transform: CSS.Translate.toString(transform),
                    width: ancho,
                    height: alto,
                    background: bloque.color || '#f4ead5',
                    border: seleccionado ? '2px solid #c9a227' : '2px solid #2c1810',
                    borderRadius: 6,
                    color: bloque.colorTexto || '#2c1810',
                    cursor: modoEdicion ? 'grab' : 'default',
                    userSelect: 'none',
                    boxShadow: seleccionado ? '0 0 0 3px rgba(201,162,39,0.5)' : '2px 3px 8px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}
                {...(modoEdicion ? listeners : {})}
                {...(modoEdicion ? attributes : {})}
                onClick={(e) => {
                    e.stopPropagation()
                    if (!isDragging) onSeleccionar(bloque.id)
                }}
            >
                <div style={{
                    fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase',
                    padding: '6px 10px', borderBottom: '1px solid #2c1810',
                    opacity: 0.7, flexShrink: 0
                }}>
                    Habilidades
                </div>

                <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
                    {HABILIDADES.map(h => {
                        const bono = calcularBono(h.stat, h.id, stats, proficiency, competencies, expertises)
                        const esCompetente = competencies?.includes(h.id)
                        const esMaestria = expertises?.includes(h.id)

                        return (
                            <div key={h.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '2px 10px',
                                gap: 6,
                                fontSize: 11,
                            }}>
                                <div style={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    border: '1.5px solid #2c1810',
                                    background: esMaestria ? '#c9a227' : esCompetente ? '#2c1810' : 'transparent',
                                    flexShrink: 0
                                }} />
                                <span style={{ flex: 1 }}>{h.label}</span>
                                <span style={{ fontWeight: 'bold' }}>{formatearBono(bono)}</span>
                            </div>
                        )
                    })}
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
                            const nuevoAncho = Math.round((startAncho + deltaX) / GRILLA) * GRILLA
                            const nuevoAlto = Math.round((startAlto + deltaY) / GRILLA) * GRILLA
                            const anchoFinal = Math.max(60, nuevoAncho)
                            const altoFinal = Math.max(60, nuevoAlto)
                            const nuevoPosX = esquina.dx === -1 ? startBloqueX - (anchoFinal - startAncho) : startBloqueX
                            const nuevoPosY = esquina.dy === -1 ? startBloqueY - (altoFinal - startAlto) : startBloqueY
                            onRedimensionar(bloque.id, anchoFinal, altoFinal, nuevoPosX, nuevoPosY)
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
                        left: esquina.dx === 1 ? bloque.x + ancho - 7 : bloque.x - 7,
                        top: esquina.dy === 1 ? bloque.y + alto - 7 : bloque.y - 7,
                        width: 14,
                        height: 14,
                        cursor: esquina.cursor,
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <div style={{
                        width: 10,
                        height: 10,
                        borderTop:    esquina.dy === -1 ? '2px solid #c9a227' : 'none',
                        borderBottom: esquina.dy === 1  ? '2px solid #c9a227' : 'none',
                        borderLeft:   esquina.dx === -1 ? '2px solid #c9a227' : 'none',
                        borderRight:  esquina.dx === 1  ? '2px solid #c9a227' : 'none',
                    }} />
                </div>
            ))}
        </>
    )
}