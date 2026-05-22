'use client'

import { LISTA_FORMAS } from './FormasSVG'

export default function PanelPersonalizacion({ bloque, onCambiar, onCerrar }) {
    if (!bloque) return null

    return (
        <div style={{
            position: 'fixed',
            right: 20,
            top: 70,
            width: 200,
            background: '#2c1810',
            border: '1px solid #c9a227',
            borderRadius: 8,
            padding: 16,
            zIndex: 1000,
            color: '#f4ead5'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', color: '#c9a227' }}>
                    {bloque.label}
                </span>
                <span onClick={onCerrar} style={{ cursor: 'pointer', color: '#c9a227' }}>✕</span>
            </div>

            <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, marginBottom: 6, opacity: 0.7 }}>COLOR DE FONDO</div>
                <input type="color" value={bloque.color || '#f4ead5'}
                    onChange={(e) => onCambiar('color', e.target.value)}
                    style={{ width: '100%', height: 32, border: 'none', cursor: 'pointer', borderRadius: 4 }} />
            </div>

            <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, marginBottom: 6, opacity: 0.7 }}>COLOR DE TEXTO</div>
                <input type="color" value={bloque.colorTexto || '#2c1810'}
                    onChange={(e) => onCambiar('colorTexto', e.target.value)}
                    style={{ width: '100%', height: 32, border: 'none', cursor: 'pointer', borderRadius: 4 }} />
            </div>

            <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, opacity: 0.7 }}>
                    TAMAÑO: <span style={{ color: '#c9a227' }}>{bloque.ancho || 100} × {bloque.alto || 100}px</span>
                </div>
            </div>

            {bloque.tipo !== 'habilidades' && (
                <div>
                    <div style={{ fontSize: 10, marginBottom: 6, opacity: 0.7 }}>FORMA</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {LISTA_FORMAS.map(f => (
                            <button key={f.id} onClick={() => onCambiar('forma', f.id)}
                                style={{
                                    padding: '4px 8px', fontSize: 10,
                                    background: bloque.forma === f.id ? '#c9a227' : 'transparent',
                                    color: bloque.forma === f.id ? '#1a0e04' : '#f4ead5',
                                    border: '1px solid #c9a227', borderRadius: 4, cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}