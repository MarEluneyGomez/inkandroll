'use client'

import { useRef, useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { EsquinasRedimensionar } from './BloqueUtils'
import { MONEDAS } from './monedas'

export default function BloqueMonedas({ bloque, seleccionado, onSeleccionar, onRedimensionar, onCambiarBloque, modoEdicion, onEliminar, onVerDetalle }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: bloque.id, disabled: !modoEdicion })
    const bloqueRef = useRef(null)

    const ancho = bloque.ancho || 160
    const alto = bloque.alto || 100
    const colorTexto = bloque.colorTexto || '#2c1810'
    const ocultas = bloque.ocultas || []

    const monedasVisibles = MONEDAS.filter(m => !ocultas.includes(m.id))
    const escala = Math.min(ancho / 160, alto / 100)

    function reorganizar() {
    const pc_a_pa = bloque.pc_a_pa ?? 10
    const pa_a_pe = bloque.pa_a_pe ?? 10
    const pe_a_po = bloque.pe_a_po ?? 2
    const po_a_pp = bloque.po_a_pp ?? 10

    let total_pc = (bloque.pc || 0)
        + (bloque.pa || 0) * pc_a_pa
        + (bloque.pe || 0) * pc_a_pa * pa_a_pe
        + (bloque.po || 0) * pc_a_pa * pa_a_pe * pe_a_po
        + (bloque.pp || 0) * pc_a_pa * pa_a_pe * pe_a_po * po_a_pp

    const pp = Math.floor(total_pc / (pc_a_pa * pa_a_pe * pe_a_po * po_a_pp))
    total_pc -= pp * (pc_a_pa * pa_a_pe * pe_a_po * po_a_pp)
    const po = Math.floor(total_pc / (pc_a_pa * pa_a_pe * pe_a_po))
    total_pc -= po * (pc_a_pa * pa_a_pe * pe_a_po)
    const pe = Math.floor(total_pc / (pc_a_pa * pa_a_pe))
    total_pc -= pe * (pc_a_pa * pa_a_pe)
    const pa = Math.floor(total_pc / pc_a_pa)
    total_pc -= pa * pc_a_pa
    const pc = total_pc

    const nuevos = { pp, po, pe, pa, pc }
    Object.entries(nuevos).forEach(([id, val]) => onCambiarBloque(bloque.id, id, val))
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
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    padding: 0, overflow: 'hidden'
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
                            onVerDetalle(bloque, rect, reorganizar)
                        }
                    }
                }}
            >
                {modoEdicion && (
                    <button onClick={(e) => { e.stopPropagation(); onEliminar(bloque.id) }}
                        style={{ position: 'absolute', top: 2, right: 4, background: 'transparent', border: 'none', color: 'rgba(0,0,0,0.3)', fontSize: 13, cursor: 'pointer', padding: 0, zIndex: 10 }}
                        onMouseEnter={e => e.target.style.color = 'rgba(0,0,0,0.8)'}
                        onMouseLeave={e => e.target.style.color = 'rgba(0,0,0,0.3)'}
                    >×</button>
                )}

                <div style={{
                    transform: `scale(${escala})`,
                    transformOrigin: 'center center',
                    width: 160,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 4, padding: '8px 12px'
                }}>
                    <div style={{ fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.6, letterSpacing: '0.1em' }}>
                        Monedas
                    </div>

                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {monedasVisibles.map(m => (
                            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.color, border: '1px solid rgba(0,0,0,0.2)' }} />
                                <div style={{ fontSize: 11, fontWeight: 900, color: colorTexto }}>
                                    {bloque[m.id] ?? 0}
                                </div>
                                <div style={{ fontSize: 7, opacity: 0.5, textTransform: 'uppercase' }}>{m.id}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {modoEdicion && seleccionado && (
                <EsquinasRedimensionar bloque={bloque} ancho={ancho} alto={alto} onRedimensionar={onRedimensionar} />
            )}
        </>
    )
}