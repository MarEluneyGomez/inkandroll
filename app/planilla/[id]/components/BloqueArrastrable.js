'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { calcularModificador, formatearBono } from './habilidades'
import { useState, useRef } from 'react'
import { FORMAS } from './FormasSVG'
import { GRILLA, EsquinasRedimensionar } from './BloqueUtils'


const esquinas = [
    { cursor: 'se-resize', dx: 1,  dy: 1  },
    { cursor: 'sw-resize', dx: -1, dy: 1  },
    { cursor: 'ne-resize', dx: 1,  dy: -1 },
    { cursor: 'nw-resize', dx: -1, dy: -1 },
]



export default function BloqueArrastrable({
    bloque,
    seleccionado,
    onSeleccionar,
    onRedimensionar,
    onCambiarValor,
    modoEdicion,
    onEliminar,
    onVerDetalle
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: bloque.id,
        disabled: !modoEdicion
    })

    const [editando, setEditando] = useState(false)
    const [valorTemp, setValorTemp] = useState('')

    const bloqueRef = useRef(null)
    const ancho = bloque.ancho || 100
    const alto = bloque.alto || 100
    const esCirculo = bloque.forma === 'circulo'
    const labelFontSize = Math.max(6, Math.min(9, (bloque.ancho || 100) / 12))

    function iniciarEdicion(e) {
        e.stopPropagation()
        setValorTemp(bloque.valor ?? 0)
        setEditando(true)
    }

    function confirmarEdicion(){
        const nuevo = parseInt(valorTemp)
        if (!isNaN(nuevo)) onCambiarValor(bloque.id, nuevo)
        setEditando(false)
    }

    const style = {
        position: 'absolute',
        left: bloque.x,
        top: bloque.y,
        transform: CSS.Translate.toString(transform),
        background: bloque.color || '#f4ead5',
        border: seleccionado ? '2px solid #c9a227' : '2px solid #2c1810',
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
        transition: 'border 0.15s, box-shadow 0.15s',
        zIndex: seleccionado ? 10 : 1
    }

    const FormaComponente = FORMAS[bloque.forma] || FORMAS.cuadrado

    return (
         <>
            <div
                ref={(node) => { setNodeRef(node); bloqueRef.current = node }}
                style={{
                    position: 'absolute',
                    left: bloque.x,
                    top: bloque.y,
                    transform: CSS.Translate.toString(transform),
                    cursor: modoEdicion && !editando ? 'grab' : 'default',
                    userSelect: 'none',
                    filter: seleccionado ? 'drop-shadow(0 0 6px rgba(201,162,39,0.8))' : 'none',
                    transition: 'filter 0.15s',
                }}
                {...(modoEdicion && !editando ? listeners : {})}
                {...(modoEdicion ? attributes : {})}
                onClick={(e) => {
                    e.stopPropagation()
                    if (!isDragging) {
                        if (modoEdicion) {
                            onSeleccionar(bloque.id)
                        } else if (bloque.tipo === 'stat' && onVerDetalle) {
                            const rect = bloqueRef.current?.getBoundingClientRect()
                            onVerDetalle(bloque, rect)
                        }
                    }
                }}
                onDoubleClick={modoEdicion ? iniciarEdicion : undefined}
            >
                <FormaComponente
                    ancho={bloque.ancho || 100}
                    alto={bloque.alto || 100}
                    color={bloque.color || '#f4ead5'}
                    colorBorde={bloque.colorTexto || '#2c1810'}
                >

                    <div style={{ fontSize: labelFontSize, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2, opacity: 0.7, color: bloque.colorTexto || '#2c1810' }}>
                        {bloque.label}
                    </div>

                    {editando ? (
                        <input
                            type="number"
                            value={valorTemp}
                            autoFocus
                            onChange={(e) => setValorTemp(e.target.value)}
                            onBlur={confirmarEdicion}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') confirmarEdicion()
                                if (e.key === 'Escape') setEditando(false)
                            }}
                            style={{
                                width: '70%', fontSize: 20, fontWeight: 900,
                                textAlign: 'center', border: 'none',
                                borderBottom: '2px solid #c9a227',
                                background: 'transparent',
                                color: bloque.colorTexto || '#2c1810', outline: 'none',
                            }}
                        />
                    ) : (
                        <>
                            <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1, color: bloque.colorTexto || '#2c1810' }}>
                                {bloque.valor}
                            </div>
                            {bloque.tipo === 'stat' && (
                                <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2, color: bloque.colorTexto || '#2c1810' }}>
                                    {formatearBono(calcularModificador(bloque.valor))}
                                </div>
                            )}
                        </>
                    )}
                </FormaComponente>
                {modoEdicion && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onEliminar(bloque.id) }}
                        style={{
                            position: 'absolute', top: 2, right: 2,
                            background: 'transparent', color: 'rgb(255, 0, 0)',
                            border: 'none', cursor: 'pointer', fontSize: 13,
                            fontWeight: 300, lineHeight: 1, padding: 0, zIndex: 30
                        }}
                        onMouseEnter={e => e.target.style.color = 'rgb(255, 0, 0)'}
                        onMouseLeave={e => e.target.style.color = 'rgb(255, 0, 0)'}
                    >×</button>
                )}
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
                        borderTop:     esquina.dy === -1 ? '2px solid #c9a227' : 'none',
                        borderBottom: esquina.dy === 1  ? '2px solid #c9a227' : 'none',
                        borderLeft:   esquina.dx === -1 ? '2px solid #c9a227' : 'none',
                        borderRight:  esquina.dx === 1  ? '2px solid #c9a227' : 'none',
                    }} />
                </div>
            ))}
        </>
    )
}