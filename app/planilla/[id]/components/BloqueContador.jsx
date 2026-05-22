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

export default function BloqueContador({ bloque, seleccionado, onSeleccionar, onRedimensionar, onCambiarBloque, modoEdicion, onEliminar }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: bloque.id, disabled: !modoEdicion })
    const [editandoTitulo, setEditandoTitulo] = useState(false)
    const [tempTitulo, setTempTitulo] = useState('')
    const [editandoMax, setEditandoMax] = useState(false)
    const [tempMax, setTempMax] = useState('')
    const [editandoValor, setEditandoValor] = useState(false)
    const [tempValor, setTempValor] = useState('')

    const ancho = bloque.ancho || 140
    const alto = bloque.alto || 120
    const colorTexto = bloque.colorTexto || '#2c1810'
    const titulo = bloque.titulo || 'Contador'
    const valor = bloque.valor ?? 0
    const maximo = bloque.maximo ?? null  // null = sin límite

    function cambiarValor(delta) {
        if (modoEdicion) return
        const nuevo = valor + delta
        if (nuevo < 0) return
        if (maximo !== null && nuevo > maximo) return
        onCambiarBloque(bloque.id, 'valor', nuevo)
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
            >
                {modoEdicion && (
                    <button onClick={(e) => { e.stopPropagation(); onEliminar(bloque.id) }}
                        style={{ position: 'absolute', top: 2, right: 4, background: 'transparent', border: 'none', color: 'rgba(0,0,0,0.3)', fontSize: 13, cursor: 'pointer', padding: 0 }}
                        onMouseEnter={e => e.target.style.color = 'rgba(0,0,0,0.8)'}
                        onMouseLeave={e => e.target.style.color = 'rgba(0,0,0,0.3)'}
                    >×</button>
                )}

                {/* Título editable */}
                {modoEdicion && editandoTitulo ? (
                    <input value={tempTitulo} autoFocus
                        onChange={e => setTempTitulo(e.target.value)}
                        onBlur={() => { onCambiarBloque(bloque.id, 'titulo', tempTitulo || titulo); setEditandoTitulo(false) }}
                        onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setEditandoTitulo(false) }}
                        style={{ fontSize: 9, fontWeight: 'bold', textAlign: 'center', border: 'none', borderBottom: '1px solid #c9a227', background: 'transparent', outline: 'none', width: '80%', textTransform: 'uppercase', color: colorTexto, marginBottom: 6, letterSpacing: '0.1em' }}
                    />
                ) : (
                    <div
                        onDoubleClick={() => { if (modoEdicion) { setTempTitulo(titulo); setEditandoTitulo(true) } }}
                        style={{ fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6, letterSpacing: '0.1em', cursor: modoEdicion ? 'text' : 'default' }}
                    >
                        {titulo}
                    </div>
                )}

                {/* Valor */}
                {editandoValor ? (
                    <input type="number" value={tempValor} autoFocus
                        onChange={e => setTempValor(e.target.value)}
                        onBlur={() => {
                            const v = parseInt(tempValor)
                            if (!isNaN(v) && v >= 0) onCambiarBloque(bloque.id, 'valor', v)
                            setEditandoValor(false)
                        }}
                        onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setEditandoValor(false) }}
                        style={{ width: 60, fontSize: 28, fontWeight: 900, textAlign: 'center', border: 'none', borderBottom: '2px solid #c9a227', background: 'transparent', color: colorTexto, outline: 'none' }}
                    />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {!modoEdicion && (
                            <button onClick={() => cambiarValor(-1)}
                                style={{ width: 24, height: 24, borderRadius: '50%', border: `1px solid ${colorTexto}`, background: 'transparent', color: colorTexto, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: valor <= 0 ? 0.2 : 0.7, lineHeight: 1 }}>
                                −
                            </button>
                        )}
                        <div
                            onDoubleClick={() => { if (!modoEdicion) { setTempValor(valor); setEditandoValor(true) } }}
                            style={{ fontSize: 32, fontWeight: 900, lineHeight: 1, color: colorTexto, cursor: modoEdicion ? 'default' : 'pointer', minWidth: 40, textAlign: 'center' }}
                        >
                            {maximo !== null ? `${valor}/${maximo}` : valor}
                        </div>
                        {!modoEdicion && (
                            <button onClick={() => cambiarValor(1)}
                                style={{ width: 24, height: 24, borderRadius: '50%', border: `1px solid ${colorTexto}`, background: 'transparent', color: colorTexto, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (maximo !== null && valor >= maximo) ? 0.2 : 0.7, lineHeight: 1 }}>
                                +
                            </button>
                        )}
                    </div>
                )}

                {/* Máximo configurable en modo edición */}
                {modoEdicion && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                        <span style={{ fontSize: 9, opacity: 0.5 }}>máx:</span>
                        {editandoMax ? (
                            <input type="number" value={tempMax} autoFocus
                                onChange={e => setTempMax(e.target.value)}
                                onBlur={() => {
                                    const v = parseInt(tempMax)
                                    onCambiarBloque(bloque.id, 'maximo', isNaN(v) || v <= 0 ? null : v)
                                    setEditandoMax(false)
                                }}
                                onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setEditandoMax(false) }}
                                style={{ width: 40, fontSize: 14, textAlign: 'center', border: 'none', borderBottom: '2px solid #c9a227', background: 'transparent', outline: 'none', padding: '2px 0', color: colorTexto }}
                            />
                        ) : (
                            <span onDoubleClick={() => { setTempMax(maximo ?? ''); setEditandoMax(true) }}
                                style={{ fontSize: 13, opacity: 0.5, cursor: 'pointer', borderBottom: '1px dashed rgba(0,0,0,0.2)', color: colorTexto }}>
                                {maximo ?? '∞'}
                            </span>
                        )}
                    </div>
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