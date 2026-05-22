'use client'

import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GRILLA, EsquinasRedimensionar } from './BloqueUtils'

const esquinas = [
    { cursor: 'se-resize', dx: 1,  dy: 1  },
    { cursor: 'sw-resize', dx: -1, dy: 1  },
    { cursor: 'ne-resize', dx: 1,  dy: -1 },
    { cursor: 'nw-resize', dx: -1, dy: -1 },
]

function IconoCalavera({ color = '#2c1810', size = 17, activo = false }) {
    return (
        <svg
            fill={color}
            viewBox="0 0 256 256"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: size, height: size, flexShrink: 0 }}
        >
            <g>
                <path d="M173.7,171.4c-2.1,0.8-3.7,2.9-3.7,5.2l-0.2,2.3c-1,10.6-19.1,18.5-41.8,18.5s-40.8-7.9-41.8-18.5l-0.2-2.1 c-0.2-2.3-1.5-4.4-3.9-5.2c0,0,0,0-0.2,0c-4.4-1.7-9.1,1.5-8.7,6.2l1.3,19.3c0.8,10,19.3,25.6,53.4,25.6 c33.1,0,52.6-15.6,53.4-25.6l1.3-19.5C182.9,173,178.3,169.7,173.7,171.4C174,171.4,174,171.4,173.7,171.4z"/>
                <path d="M191.2,56.4c-10.6-16.2-30.2-27-61.8-27c-0.6,0-1,0-1.3,0c-0.6,0-0.8,0-1.3,0c-31.6,0-51.2,10.8-61.8,27 c-9.4,14.6-11.6,33.3-8.7,52.8c4,26.4,4,47.2,33.7,55.7l1,10.2c0.6,5.2,13.3,12.9,35.6,12.9c0.6,0,1.3,0,1.7,0c0.6,0,1,0,1.7,0 c22.2,0,35.3-7.7,35.6-12.9l1-10.2c29.1-8.5,29.1-29.3,33.1-55.7C202.9,90,200.6,71.1,191.2,56.4z M117,125.6 c0,8.3-6.7,14.8-14.8,14.8H89.1c-5.4,0-10-4.4-10-10v-9.8c0-10,8.3-18.3,18.3-18.3h9.8c5.4,0,10,4.4,10,10v13.3 C117.2,125.6,117,125.6,117,125.6z M134.2,161.2h-12.5c-3.3,0-6-3.1-4.6-6.2l6.2-14.1c1.5-3.7,7.5-3.7,9.1,0l6.2,14.1 C140.1,158,137.8,161.2,134.2,161.2z M177.1,130.6c0,5.4-4.4,10-10,10H154c-8.3,0-14.8-6.7-14.8-14.8v-13.3c0-5.4,4.4-10,10-10h9.8 c10,0,18.3,8.3,18.3,18.3v9.8H177.1z"/>
                <path d="M197.5,43.7c1.5,2.1,3.1,3.9,4.4,6c3.7,5.4,6.2,11.4,8.3,17.5l19.5-19.5c5.6,5.6,15.4,4.8,19.8-2.3 c2.5-3.9,2.5-9.2,0-13.1c-4.4-7.1-14.1-7.9-19.8-2.3c5.6-5.6,4.8-15.4-2.3-19.8c-3.9-2.5-9.2-2.5-13.1,0 c-7.1,4.4-7.9,14.1-2.3,19.8L197.5,43.7z"/>
                <path d="M229.7,208.2L195,173.8c0.2,1.5,0.6,3.1,0.2,4.8l-1.3,19.5c-0.2,2.9-1,5.4-2.3,8.3l20,20 c-4.8,4.8-4.8,13.1,0,17.9c4.8,4.8,13.1,4.8,17.9,0c4.8-4.8,4.8-13.1,0-17.9c4.8,4.8,13.1,4.8,17.9,0c4.8-4.8,4.8-13.1,0-17.9 C242.4,203.2,234.5,203.2,229.7,208.2z"/>
                <path d="M58.5,43.7c-1.5,2.1-3.1,3.9-4.4,6c-3.7,5.4-6.2,11.4-8.3,17.5L26.3,47.8c-5.6,5.6-15.4,4.8-19.8-2.3 C4,41.6,4,36.3,6.5,32.4c4.4-7.1,14.1-7.9,19.8-2.3c-5.6-5.6-4.8-15.4,2.3-19.8c3.9-2.5,9.2-2.5,13.1,0c7.1,4.4,7.9,14.1,2.3,19.8 L58.5,43.7z"/>
                <path d="M26.3,208.2L61,173.6c-0.2,1.5-0.6,3.1-0.2,4.8l1.3,19.5c0.2,2.9,1,5.4,2.3,8.3l-20,20 c4.8,4.8,4.8,13.1,0,17.9c-4.8,4.8-13.1,4.8-17.9,0s-4.8-13.1,0-17.9c-4.8,4.8-13.1,4.8-17.9,0s-4.8-13.1,0-17.9 C13.6,203.2,21.5,203.2,26.3,208.2z"/>
            </g>
        </svg>
    )
}

export default function BloqueSalvacionMuerte({
    bloque,
    seleccionado,
    onSeleccionar,
    onRedimensionar,
    onCambiarBloque,
    modoEdicion,
    onEliminar
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: bloque.id,
        disabled: !modoEdicion
    })

    const [editandoExitos, setEditandoExitos] = useState(false)
    const [editandoFallos, setEditandoFallos] = useState(false)
    const [tempExitos, setTempExitos] = useState('')
    const [tempFallos, setTempFallos] = useState('')

    const ancho = bloque.ancho || 180
    const alto = bloque.alto || 100

    const maxExitos = bloque.maxExitos ?? 3
    const maxFallos = bloque.maxFallos ?? 3
    const exitosMarcados = bloque.exitosMarcados ?? 0
    const fallosMarcados = bloque.fallosMarcados ?? 0

    function toggleExito(i) {
        if (modoEdicion) return
        const nuevo = exitosMarcados === i + 1 ? i : i + 1
        onCambiarBloque(bloque.id, 'exitosMarcados', nuevo)
    }

    function toggleFallo(i) {
        if (modoEdicion) return
        const nuevo = fallosMarcados === i + 1 ? i : i + 1
        onCambiarBloque(bloque.id, 'fallosMarcados', nuevo)
    }

    const colorTexto = bloque.colorTexto || '#2c1810'

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
                    color: colorTexto,
                    cursor: modoEdicion ? 'grab' : 'default',
                    userSelect: 'none',
                    boxShadow: seleccionado ? '0 0 0 3px rgba(201,162,39,0.5)' : '2px 3px 8px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 12px',
                    overflow: 'hidden'
                }}
                {...(modoEdicion ? listeners : {})}
                {...(modoEdicion ? attributes : {})}
                onClick={(e) => {
                    e.stopPropagation()
                    if (!isDragging) onSeleccionar(bloque.id)
                }}
            >
                {modoEdicion && (
                    <button onClick={(e) => { e.stopPropagation(); onEliminar(bloque.id) }}
                        style={{ position: 'absolute', top: 2, right: 4, background: 'transparent', border: 'none', color: 'rgba(0,0,0,0.3)', fontSize: 13, cursor: 'pointer', padding: 0 }}
                        onMouseEnter={e => e.target.style.color = 'rgba(0,0,0,0.8)'}
                        onMouseLeave={e => e.target.style.color = 'rgba(0,0,0,0.3)'}
                    >×</button>
                )}

                <div style={{ fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6, letterSpacing: '0.1em' }}>
                    Salvaciones de muerte
                </div>

                {/* Éxitos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {Array.from({ length: maxExitos }).map((_, i) => (
                            <div key={i} onClick={() => toggleExito(i)}
                                style={{
                                    fontSize: i < exitosMarcados ? 16 : 14,
                                    cursor: modoEdicion ? 'default' : 'pointer',
                                    filter: i < exitosMarcados ? 'none' : 'grayscale(1) opacity(0.3)',
                                    transition: 'all 0.15s',
                                    userSelect: 'none'
                                }}
                            >
                                ❤️
                            </div>
                        ))}
                    </div>
                    {modoEdicion && (
                        editandoExitos ? (
                            <input type="number" value={tempExitos} autoFocus
                                onChange={e => setTempExitos(e.target.value)}
                                onBlur={() => {
                                    const v = parseInt(tempExitos)
                                    if (!isNaN(v) && v > 0) onCambiarBloque(bloque.id, 'maxExitos', v)
                                    setEditandoExitos(false)
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') e.target.blur()
                                    if (e.key === 'Escape') setEditandoExitos(false)
                                }}
                                style={{ width: 40, fontSize: 14, textAlign: 'center', border: 'none', borderBottom: '2px solid #c9a227', background: 'transparent', outline: 'none', padding: '2px 0' }}
                            />
                        ) : (
                            <span onDoubleClick={() => { setTempExitos(maxExitos); setEditandoExitos(true) }}
                                style={{ fontSize: 13, opacity: 0.5, cursor: 'pointer', borderBottom: '1px dashed rgba(0,0,0,0.2)' }}>
                                {maxExitos}
                            </span>
                        )
                    )}
                </div>

                {/* Fallos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                        {Array.from({ length: maxFallos }).map((_, i) => (
                            <div key={i} onClick={() => toggleFallo(i)}
                                style={{
                                    cursor: modoEdicion ? 'default' : 'pointer',
                                    opacity: i < fallosMarcados ? 1 : 0.25,
                                    transition: 'all 0.15s',
                                    userSelect: 'none',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <IconoCalavera
                                    color={colorTexto}
                                    size={i < fallosMarcados ? 20 : 17}
                                    activo={i < fallosMarcados}
                                />
                            </div>
                        ))}
                    </div>
                    {modoEdicion && (
                        editandoFallos ? (
                            <input type="number" value={tempFallos} autoFocus
                                onChange={e => setTempFallos(e.target.value)}
                                onBlur={() => {
                                    const v = parseInt(tempFallos)
                                    if (!isNaN(v) && v > 0) onCambiarBloque(bloque.id, 'maxFallos', v)
                                    setEditandoFallos(false)
                                }}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') e.target.blur()
                                    if (e.key === 'Escape') setEditandoFallos(false)
                                }}
                                style={{ width: 40, fontSize: 14, textAlign: 'center', border: 'none', borderBottom: '2px solid #c9a227', background: 'transparent', outline: 'none', padding: '2px 0' }}
                            />
                        ) : (
                            <span onDoubleClick={() => { setTempFallos(maxFallos); setEditandoFallos(true) }}
                                style={{ fontSize: 13, opacity: 0.5, cursor: 'pointer', borderBottom: '1px dashed rgba(0,0,0,0.2)' }}>
                                {maxFallos}
                            </span>
                        )
                    )}
                </div>
            </div>

            {modoEdicion && seleccionado && (
                <EsquinasRedimensionar
                    bloque={bloque} ancho={ancho} alto={alto}
                    onRedimensionar={onRedimensionar}
                />
            )}
        </>
    )
}