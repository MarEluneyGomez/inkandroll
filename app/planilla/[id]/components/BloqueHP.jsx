'use client'

import { useRef, useEffect, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { EsquinasRedimensionar } from './BloqueUtils'

export default function BloqueHP({ bloque, seleccionado, onSeleccionar, onRedimensionar, onCambiarBloque, modoEdicion, onEliminar, onVerDetalle }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: bloque.id, disabled: !modoEdicion })
    const bloqueRef = useRef(null)

    const [editandoMax, setEditandoMax] = useState(false)
    const [tempMax, setTempMax] = useState('')

    const ancho = bloque.ancho || 180
    const alto = bloque.alto || 120
    const colorTexto = bloque.colorTexto || '#2c1810'
    const actual = bloque.actual ?? 10
    const maximo = bloque.maximo ?? 10
    const escala = Math.min(ancho / 180, alto / 120)

    function cambiarActual(delta) {
        if (modoEdicion) return
        const nuevo = Math.min(maximo, Math.max(0, actual + delta))
        onCambiarBloque(bloque.id, 'actual', nuevo)
    }

    return (
        <>
            <div
                ref={(node) => { setNodeRef(node); bloqueRef.current = node }}
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
                    overflow: 'hidden'
                }}
                {...(modoEdicion ? listeners : {})}
                {...(modoEdicion ? attributes : {})}
                onClick={(e) => {
                    e.stopPropagation()
                    if (!isDragging) {
                        if (modoEdicion) {
                            onSeleccionar(bloque.id)
                        } else if (onVerDetalle) {
                            const rect = bloqueRef.current?.getBoundingClientRect()
                            onVerDetalle(bloque, rect)
                        }
                    }
                }}
            >
                {modoEdicion && (
                    <button onClick={(e) => { e.stopPropagation(); onEliminar(bloque.id) }}
                        style={{ position: 'absolute', top: 4, right: 6, background: 'transparent', border: 'none', color: 'rgba(0,0,0,0.3)', fontSize: 14, cursor: 'pointer', padding: 0, zIndex: 10 }}
                        onMouseEnter={e => e.target.style.color = 'rgba(0,0,0,0.8)'}
                        onMouseLeave={e => e.target.style.color = 'rgba(0,0,0,0.3)'}
                    >×</button>
                )}

                <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: `translate(-50%, -50%) scale(${escala})`,
                    width: 180, height: 120,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
                    boxSizing: 'border-box', padding: '12px 10px'
                }}>
                    <div style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.05em', lineHeight: 1 }}>
                        Puntos de golpe
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {!modoEdicion && (
                            <button onClick={(e) => { e.stopPropagation(); cambiarActual(-1) }}
                                style={{ width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${colorTexto}`, background: 'transparent', color: colorTexto, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: actual <= 0 ? 0.2 : 0.7, lineHeight: 1 }}>
                                −
                            </button>
                        )}
                        <div style={{ fontSize: 38, fontWeight: 900, lineHeight: 1, color: colorTexto, minWidth: 70, textAlign: 'center' }}>
                            {actual}/{maximo}
                        </div>
                        {!modoEdicion && (
                            <button onClick={(e) => { e.stopPropagation(); cambiarActual(1) }}
                                style={{ width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${colorTexto}`, background: 'transparent', color: colorTexto, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: actual >= maximo ? 0.2 : 0.7, lineHeight: 1 }}>
                                +
                            </button>
                        )}
                    </div>

                    {modoEdicion && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                            onPointerDown={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
                            <span style={{ fontSize: 10, opacity: 0.6 }}>máx:</span>
                            {editandoMax ? (
                                <input type="number" value={tempMax} autoFocus
                                    onChange={e => setTempMax(e.target.value)}
                                    onBlur={() => {
                                        const v = parseInt(tempMax)
                                        if (!isNaN(v) && v > 0) onCambiarBloque(bloque.id, 'maximo', v)
                                        setEditandoMax(false)
                                    }}
                                    onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setEditandoMax(false) }}
                                    style={{ width: 40, fontSize: 14, textAlign: 'center', border: 'none', borderBottom: '2px solid #c9a227', background: 'transparent', outline: 'none', padding: '1px 0', color: colorTexto, fontWeight: 'bold' }}
                                />
                            ) : (
                                <span onClick={(e) => { e.stopPropagation(); setTempMax(maximo); setEditandoMax(true) }}
                                    style={{ fontSize: 14, opacity: 0.7, cursor: 'pointer', borderBottom: '1px dashed rgba(0,0,0,0.3)', color: colorTexto, fontWeight: 'bold' }}>
                                    {maximo}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {modoEdicion && seleccionado && (
                <EsquinasRedimensionar bloque={bloque} ancho={ancho} alto={alto} onRedimensionar={onRedimensionar} />
            )}
        </>
    )
}