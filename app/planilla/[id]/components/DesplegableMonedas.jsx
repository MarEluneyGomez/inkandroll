'use client'

import { useState } from 'react'
import { MONEDAS } from './monedas'

export default function DesplegableMonedas({ bloque, rect, onCambiarBloque, onReorganizar, onCerrar }) {
    const ocultas = bloque.ocultas || []
    const [valores, setValores] = useState({
        pp: bloque.pp ?? 0,
        po: bloque.po ?? 0,
        pe: bloque.pe ?? 0,
        pa: bloque.pa ?? 0,
        pc: bloque.pc ?? 0,
    })

    function toggleOculta(id) {
        const nuevas = ocultas.includes(id)
            ? ocultas.filter(o => o !== id)
            : [...ocultas, id]
        onCambiarBloque(bloque.id, 'ocultas', nuevas)
    }

    function cambiarValor(id, valor) {
        setValores(prev => ({ ...prev, [id]: valor }))
    }

    function confirmarValor(id) {
        const v = parseInt(valores[id])
        const final = isNaN(v) || v < 0 ? 0 : v
        setValores(prev => ({ ...prev, [id]: final }))
        onCambiarBloque(bloque.id, id, final)
    }

    function sumar(id, delta) {
        const actual = parseInt(valores[id]) || 0
        const nuevo = Math.max(0, actual + delta)
        setValores(prev => ({ ...prev, [id]: nuevo }))
        onCambiarBloque(bloque.id, id, nuevo)
    }

    return (
        <>
            <style>{`
                @keyframes cajonSlide {
                    from { opacity: 0; max-height: 0; }
                    to   { opacity: 1; max-height: 400px; }
                }
                .monedas-input::-webkit-inner-spin-button,
                .monedas-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                .monedas-input { -moz-appearance: textfield; }
            `}</style>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'fixed',
                    left: rect ? rect.left : 100,
                    top: rect ? rect.bottom : 100,
                    width: rect ? rect.width : 200,
                    minWidth: 160,
                    background: '#2c1810',
                    borderLeft: '1px solid #c9a227',
                    borderRight: '1px solid #c9a227',
                    borderBottom: '1px solid #c9a227',
                    borderRadius: '0 0 8px 8px',
                    zIndex: 500,
                    color: '#f4ead5',
                    overflow: 'hidden',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                    animation: 'cajonSlide 0.25s ease',
                }}
            >
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', borderBottom: '1px solid rgba(201,162,39,0.3)',
                    background: 'rgba(201,162,39,0.1)'
                }}>
                    <span style={{ fontWeight: 'bold', fontSize: 10, textTransform: 'uppercase', color: '#c9a227' }}>
                        Monedas
                    </span>
                </div>

                {MONEDAS.map(m => {
                    const oculta = ocultas.includes(m.id)
                    return (
                        <div key={m.id} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '6px 12px', borderBottom: '1px solid rgba(201,162,39,0.15)',
                            opacity: oculta ? 0.35 : 1, transition: 'opacity 0.15s'
                        }}>
                            <div onClick={() => toggleOculta(m.id)} style={{ cursor: 'pointer', flexShrink: 0 }}>
                                <div style={{
                                    width: 10, height: 10, borderRadius: '50%',
                                    background: oculta ? 'transparent' : m.color,
                                    border: `1.5px solid ${m.color}`,
                                    transition: 'all 0.15s'
                                }} />
                            </div>

                            <span style={{ flex: 1, fontSize: 10 }}>{m.label}</span>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <button onClick={() => sumar(m.id, -1)}
                                    style={{ background: 'transparent', border: 'none', color: '#f4ead5', fontSize: 14, cursor: 'pointer', opacity: 0.6, padding: '0 2px', lineHeight: 1 }}>
                                    −
                                </button>
                                <input
                                    className="monedas-input"
                                    type="number"
                                    value={valores[m.id]}
                                    min={0}
                                    onChange={e => cambiarValor(m.id, e.target.value)}
                                    onBlur={() => confirmarValor(m.id)}
                                    onKeyDown={e => { if (e.key === 'Enter') confirmarValor(m.id) }}
                                    style={{
                                        width: 40, fontSize: 12, fontWeight: 'bold',
                                        textAlign: 'center', border: 'none',
                                        borderBottom: '1px solid rgba(201,162,39,0.4)',
                                        background: 'transparent', color: '#f4ead5',
                                        outline: 'none'
                                    }}
                                />
                                <button onClick={() => sumar(m.id, 1)}
                                    style={{ background: 'transparent', border: 'none', color: '#f4ead5', fontSize: 14, cursor: 'pointer', opacity: 0.6, padding: '0 2px', lineHeight: 1 }}>
                                    +
                                </button>
                            </div>
                        </div>
                    )
                })}

                <div style={{ padding: '8px 12px' }}>
                    <button onClick={onReorganizar}
                        style={{
                            width: '100%', padding: '6px 0', fontSize: 10, fontWeight: 'bold',
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            background: 'transparent', border: '1px solid #c9a227',
                            color: '#c9a227', borderRadius: 4, cursor: 'pointer'
                        }}
                        onMouseEnter={e => { e.target.style.background = '#c9a227'; e.target.style.color = '#1a0e04' }}
                        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#c9a227' }}
                    >
                        Reorganizar
                    </button>
                </div>

            </div>
        </>
    )
}