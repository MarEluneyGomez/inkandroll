'use client'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

const GRILLA = 20
const esquinas = [
    { cursor: 'se-resize', dx: 1,  dy: 1  },
    { cursor: 'sw-resize', dx: -1, dy: 1  },
    { cursor: 'ne-resize', dx: 1,  dy: -1 },
    { cursor: 'nw-resize', dx: -1, dy: -1 },
]

export default function BloquePuntosGolpeTemp({ bloque, seleccionado, onSeleccionar, onRedimensionar, onCambiarBloque, modoEdicion, onEliminar }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: bloque.id, disabled: !modoEdicion })
    const [editando, setEditando] = useState(false)
    const [temp, setTemp] = useState('')

    const ancho = bloque.ancho || 140
    const alto = bloque.alto || 100
    const valor = bloque.valor ?? 0
    const colorTexto = bloque.colorTexto || '#2c1810'

    function confirmar() {
        const v = parseInt(temp)
        if (!isNaN(v) && v >= 0) onCambiarBloque(bloque.id, 'valor', v)
        setEditando(false)
    }

    return (
        <>
            <div
                ref={setNodeRef}
                style={{
                    position: 'absolute', left: bloque.x, top: bloque.y,
                    transform: CSS.Translate.toString(transform),
                    width: ancho, height: alto,
                    background: bloque.color || '#f4ead5',
                    border: seleccionado ? '2px solid #c9a227' : '2px solid #2c1810',
                    borderRadius: 6, color: colorTexto,
                    cursor: modoEdicion ? 'grab' : 'default',
                    userSelect: 'none',
                    boxShadow: seleccionado ? '0 0 0 3px rgba(201,162,39,0.5)' : '2px 3px 8px rgba(0,0,0,0.4)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: '8px 12px', overflow: 'hidden'
                }}
                {...(modoEdicion ? listeners : {})}
                {...(modoEdicion ? attributes : {})}
                onClick={(e) => { e.stopPropagation(); if (!isDragging) onSeleccionar(bloque.id) }}
                onDoubleClick={() => { if (!modoEdicion) { setTemp(valor); setEditando(true) } }}
            >
                {modoEdicion && (
                    <button onClick={(e) => { e.stopPropagation(); onEliminar(bloque.id) }}
                        style={{ position: 'absolute', top: 2, right: 4, background: 'transparent', border: 'none', color: 'rgba(0,0,0,0.3)', fontSize: 13, cursor: 'pointer', padding: 0 }}
                        onMouseEnter={e => e.target.style.color = 'rgba(0,0,0,0.8)'}
                        onMouseLeave={e => e.target.style.color = 'rgba(0,0,0,0.3)'}
                    >×</button>
                )}
                <div style={{ fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6, letterSpacing: '0.1em' }}>
                    PG Temporales
                </div>
                {editando ? (
                    <input type="number" value={temp} autoFocus
                        onChange={e => setTemp(e.target.value)}
                        onBlur={confirmar}
                        onKeyDown={e => { if (e.key === 'Enter') confirmar(); if (e.key === 'Escape') setEditando(false) }}
                        style={{ width: 70, fontSize: 28, fontWeight: 900, textAlign: 'center', border: 'none', borderBottom: '2px solid #c9a227', background: 'transparent', color: colorTexto, outline: 'none' }}
                    />
                ) : (
                    <div style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, color: colorTexto, cursor: modoEdicion ? 'default' : 'pointer' }}>
                        {valor}
                    </div>
                )}
                {!editando && !modoEdicion && (
                    <div style={{ fontSize: 9, opacity: 0.4, marginTop: 4 }}>doble clic para editar</div>
                )}
            </div>

            {modoEdicion && seleccionado && esquinas.map((esquina, i) => (
                <div key={i}
                    onMouseDown={(e) => {
                        e.stopPropagation(); e.preventDefault()
                        const startX = e.clientX, startY = e.clientY
                        const startAncho = ancho, startAlto = alto
                        const startBloqueX = bloque.x, startBloqueY = bloque.y
                        function onMouseMove(e) {
                            const anchoFinal = Math.max(60, Math.round((startAncho + (e.clientX - startX) * esquina.dx) / GRILLA) * GRILLA)
                            const altoFinal  = Math.max(60, Math.round((startAlto  + (e.clientY - startY) * esquina.dy) / GRILLA) * GRILLA)
                            const nuevoPosX = esquina.dx === -1 ? startBloqueX - (anchoFinal - startAncho) : startBloqueX
                            const nuevoPosY = esquina.dy === -1 ? startBloqueY - (altoFinal  - startAlto)  : startBloqueY
                            onRedimensionar(bloque.id, anchoFinal, altoFinal, nuevoPosX, nuevoPosY)
                        }
                        function onMouseUp() { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); document.body.style.cursor = '' }
                        document.body.style.cursor = esquina.cursor
                        document.addEventListener('mousemove', onMouseMove)
                        document.addEventListener('mouseup', onMouseUp)
                    }}
                    style={{ position: 'absolute', left: esquina.dx === 1 ? bloque.x + ancho - 7 : bloque.x - 7, top: esquina.dy === 1 ? bloque.y + alto - 7 : bloque.y - 7, width: 14, height: 14, cursor: esquina.cursor, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <div style={{ width: 10, height: 10, borderTop: esquina.dy === -1 ? '2px solid #c9a227' : 'none', borderBottom: esquina.dy === 1 ? '2px solid #c9a227' : 'none', borderLeft: esquina.dx === -1 ? '2px solid #c9a227' : 'none', borderRight: esquina.dx === 1 ? '2px solid #c9a227' : 'none' }} />
                </div>
            ))}
        </>
    )
}
