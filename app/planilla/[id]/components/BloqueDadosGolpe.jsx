'use client'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { EsquinasRedimensionar } from './BloqueUtils'

const TIPOS_DADO = ['d4', 'd6', 'd8', 'd10', 'd12']

export default function BloqueDadosGolpe({ bloque, seleccionado, onSeleccionar, onRedimensionar, onCambiarBloque, modoEdicion, onEliminar }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: bloque.id, disabled: !modoEdicion })
    const [editandoCantidad, setEditandoCantidad] = useState(false)
    const [tempCantidad, setTempCantidad] = useState('')

    const ancho = bloque.ancho || 200
    const alto = bloque.alto || 140
    const colorTexto = bloque.colorTexto || '#2c1810'
    const tipoDado = bloque.tipoDado || 'd8'
    const cantidad = bloque.cantidad ?? 3
    const usados = bloque.usados ?? 0
    const escala = ancho / 200

    function toggleUsado(delta) {
        if (modoEdicion) return
        const nuevo = Math.min(cantidad, Math.max(0, usados + delta))
        onCambiarBloque(bloque.id, 'usados', nuevo)
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
                    overflow: 'hidden'
                }}
                {...(modoEdicion ? listeners : {})}
                {...(modoEdicion ? attributes : {})}
                onClick={(e) => { e.stopPropagation(); if (!isDragging) onSeleccionar(bloque.id) }}
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
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) scale(${escala})`,
                    width: 200,
                    height: 140,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    padding: '12px 10px'
                }}>
                    <div style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.05em', lineHeight: 1 }}>
                        Dados de golpe
                    </div>

                    {modoEdicion && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} onPointerDown={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
                            <span style={{ fontSize: 10, opacity: 0.6 }}>dado:</span>
                            <select 
                                value={tipoDado}
                                onChange={(e) => onCambiarBloque(bloque.id, 'tipoDado', e.target.value)}
                                style={{
                                    fontSize: 12,
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    border: `1.5px solid ${colorTexto}`,
                                    background: 'transparent',
                                    color: colorTexto,
                                    outline: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                {TIPOS_DADO.map(t => (
                                    <option key={t} value={t} style={{ background: bloque.color || '#f4ead5', color: colorTexto }}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {!modoEdicion && (
                            <button onClick={() => toggleUsado(1)}
                                style={{ width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${colorTexto}`, background: 'transparent', color: colorTexto, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: usados >= cantidad ? 0.2 : 0.7, lineHeight: 1 }}>
                                −
                            </button>
                        )}
                        <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, color: colorTexto, minWidth: 55, textAlign: 'center' }}>
                            {cantidad - usados}/{cantidad}
                        </div>
                        {!modoEdicion && (
                            <button onClick={() => toggleUsado(-1)}
                                style={{ width: 26, height: 26, borderRadius: '50%', border: `1.5px solid ${colorTexto}`, background: 'transparent', color: colorTexto, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: usados <= 0 ? 0.2 : 0.7, lineHeight: 1 }}>
                                +
                            </button>
                        )}
                    </div>

                    {!modoEdicion && (
                        <div style={{ fontSize: 11, fontWeight: '600', opacity: 0.7 }}>{tipoDado}</div>
                    )}

                    {modoEdicion && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} onPointerDown={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
                            <span style={{ fontSize: 10, opacity: 0.6 }}>cant:</span>
                            {editandoCantidad ? (
                                <input type="number" value={tempCantidad} autoFocus
                                    onChange={e => setTempCantidad(e.target.value)}
                                    onBlur={() => {
                                        const v = parseInt(tempCantidad)
                                        if (!isNaN(v) && v > 0) onCambiarBloque(bloque.id, 'cantidad', v)
                                        setEditandoCantidad(false)
                                    }}
                                    onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); if (e.key === 'Escape') setEditandoCantidad(false) }}
                                    style={{ width: 40, fontSize: 14, textAlign: 'center', border: 'none', borderBottom: '2px solid #c9a227', background: 'transparent', outline: 'none', padding: '1px 0', color: colorTexto, fontWeight: 'bold' }}
                                />
                            ) : (
                                <span onClick={(e) => { e.stopPropagation(); setTempCantidad(cantidad); setEditandoCantidad(true) }}
                                    style={{ fontSize: 14, opacity: 0.7, cursor: 'pointer', borderBottom: '1px dashed rgba(0,0,0,0.3)', color: colorTexto, fontWeight: 'bold' }}>
                                    {cantidad}
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