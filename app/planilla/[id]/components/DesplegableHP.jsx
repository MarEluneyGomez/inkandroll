'use client'

import { useState } from 'react'

export default function DesplegableHP({ bloque, rect, onCambiarBloque, onCerrar }) {
    const [cantidad, setCantidad] = useState('')

    const actual = bloque.actual ?? 10
    const maximo = bloque.maximo ?? 10

    function aplicar(delta) {
        const v = parseInt(cantidad)
        if (isNaN(v) || v <= 0) return
        const nuevo = Math.min(maximo, Math.max(0, actual + delta * v))
        onCambiarBloque(bloque.id, 'actual', nuevo)
        setCantidad('')
    }

    return (
        <>
            <style>{`
                @keyframes cajonSlide {
                    from { opacity: 0; max-height: 0; }
                    to   { opacity: 1; max-height: 300px; }
                }
                .hp-input::-webkit-inner-spin-button,
                .hp-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                .hp-input { -moz-appearance: textfield; }
            `}</style>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'fixed',
                    left: rect ? rect.left : 100,
                    top: rect ? rect.bottom : 100,
                    width: rect ? rect.width : 180,
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
                    <span style={{ fontWeight: 'bold', fontSize: 9, textTransform: 'uppercase', color: '#c9a227', whiteSpace: 'nowrap' }}>
                        PG
                    </span>
                    <span style={{ fontSize: 12, color: '#c9a227', fontWeight: 900 }}>
                        {actual}/{maximo}
                    </span>
                </div>

                <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: 9, opacity: 0.5, textTransform: 'uppercase', marginBottom: 8, textAlign: 'center' }}>
                        Sumar / Restar
                    </div>
                    <input
                        className="hp-input"
                        type="number"
                        value={cantidad}
                        min={1}
                        placeholder="0"
                        onChange={e => setCantidad(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') aplicar(1) }}
                        style={{
                            display: 'block', width: '100%', fontSize: 16, fontWeight: 'bold',
                            textAlign: 'center', border: 'none',
                            borderBottom: '1px solid rgba(201,162,39,0.4)',
                            background: 'transparent', color: '#f4ead5',
                            outline: 'none', marginBottom: 10, boxSizing: 'border-box'
                        }}
                    />
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', alignItems: 'center'}}>
                        <button onClick={() => aplicar(-1)}
                            style={{
                                flex: 1, aspectRatio: '1 / 1', borderRadius: '50%', padding: 0,
                                background: 'rgba(180,0,0,0.2)',
                                border: '1px solid rgba(180,0,0,0.4)',
                                color: '#ff6b6b', fontSize: 20, fontWeight: 'bold', cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0, gap: 0, lineHeight: 1
                            }}>
                            <span>−</span>
                            <span style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>Daño</span>
                        </button>
                        <button onClick={() => aplicar(1)}
                            style={{
                                flex: 1, aspectRatio: '1 / 1', borderRadius: '50%', padding: 0,
                                background: 'rgba(0,150,0,0.2)',
                                border: '1px solid rgba(0,150,0,0.4)',
                                color: '#6bff6b', fontSize: 20, fontWeight: 'bold', cursor: 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0, gap: 0, lineHeight: 1
                            }}>
                            <span>+</span>
                            <span style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1 }}>Cura</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}