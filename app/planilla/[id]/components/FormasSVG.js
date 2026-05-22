'use client'

export function FormaCuadrado({ ancho, alto, color, colorBorde, children }) {
    const w = ancho ||  100
    const h = alto || 100
    const c = color || '#f4ead5'
    const b = colorBorde || '#2c1810'
    const corner = 12

return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="sombra-cuadrado" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor={b} floodOpacity="0.4"/>
                </filter>
            </defs>

            {/* Fondo */}
            <rect x="4" y="4" width={w-8} height={h-8} rx="4" ry="4" fill={c} filter="url(#sombra-cuadrado)" />

            {/* Borde exterior */}
            <rect x="4" y="4" width={w-8} height={h-8} rx="4" ry="4" fill="none" stroke={b} strokeWidth="2"/>

            {/* Borde interior decorativo */}
            <rect x="8" y="8" width={w-16} height={h-16} rx="2" ry="2" fill="none" stroke={b} strokeWidth="0.5" strokeOpacity="0.4"/>

            {/* Ornamentos en esquinas */}
            {[
                [8, 8], [w-8, 8], [8, h-8], [w-8, h-8]
            ].map(([cx, cy], i) => (
                <g key={i}>
                    <circle cx={cx} cy={cy} r="2.5" fill={b} fillOpacity="0.6"/>
                </g>
            ))}

            {/* Lineas decorativas en bordes */}
            <line x1={w/2 - corner} y1="4" x2={w/2 + corner} y2="4" stroke={b} strokeWidth="1.5" strokeOpacity="0.5"/>
            <line x1={w/2 - corner} y1={h-4} x2={w/2 + corner} y2={h-4} stroke={b} strokeWidth="1.5" strokeOpacity="0.5"/>
            <line x1="4" y1={h/2 - corner} x2="4" y2={h/2 + corner} stroke={b} strokeWidth="1.5" strokeOpacity="0.5"/>
            <line x1={w-4} y1={h/2 - corner} x2={w-4} y2={h/2 + corner} stroke={b} strokeWidth="1.5" strokeOpacity="0.5"/>

            {/* Contenido */}
            <foreignObject x="8" y="8" width={w-16} height={h-16}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {children}
                </div>
            </foreignObject>
        </svg>
    )
}

export function FormaCirculo({ ancho, alto, color, colorBorde, children }) {
    const w = ancho || 100
    const h = alto || 100
    const c = color || '#f4ead5'
    const b = colorBorde || '#2c1810'
    const cx = w / 2
    const cy = h / 2
    const r = Math.min(w, h) / 2 - 6

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="sombra-circulo" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor={b} floodOpacity="0.4"/>
                </filter>
                <clipPath id={`clip-circulo-${w}-${h}`}>
                    <circle cx={cx} cy={cy} r={r}/>
                </clipPath>
            </defs>

            {/* Fondo */}
            <circle cx={cx} cy={cy} r={r} fill={c} filter="url(#sombra-circulo)"/>

            {/* Borde exterior */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={b} strokeWidth="2"/>

            {/* Borde interior decorativo */}
            <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke={b} strokeWidth="0.5" strokeOpacity="0.4"/>

            {/* Ornamentos en 4 puntos cardinales */}
            {[0, 90, 180, 270].map((deg, i) => {
                const rad = (deg * Math.PI) / 180
                const ox = cx + (r) * Math.sin(rad)
                const oy = cy - (r) * Math.cos(rad)
                return <circle key={i} cx={ox} cy={oy} r="2.5" fill={b} fillOpacity="0.6"/>
            })}

            {/* Contenido */}
            <foreignObject x={cx - r + 8} y={cy - r + 8} width={(r - 8) * 2} height={(r - 8) * 2}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {children}
                </div>
            </foreignObject>
        </svg>
    )
}

export function FormaEscudo({ ancho, alto, color, colorBorde, children }) {
    const w = ancho || 100
    const h = alto || 100
    const c = color || '#f4ead5'
    const b = colorBorde || '#2c1810'

    const path = `
        M ${w*0.5} ${h*0.97}
        C ${w*0.5} ${h*0.97} ${w*0.05} ${h*0.65} ${w*0.05} ${h*0.35}
        L ${w*0.05} ${h*0.08}
        Q ${w*0.05} ${h*0.03} ${w*0.12} ${h*0.03}
        L ${w*0.88} ${h*0.03}
        Q ${w*0.95} ${h*0.03} ${w*0.95} ${h*0.08}
        L ${w*0.95} ${h*0.35}
        C ${w*0.95} ${h*0.65} ${w*0.5} ${h*0.97} ${w*0.5} ${h*0.97}
        Z
    `

    const pathInner = `
        M ${w*0.5} ${h*0.91}
        C ${w*0.5} ${h*0.91} ${w*0.1} ${h*0.62} ${w*0.1} ${h*0.35}
        L ${w*0.1} ${h*0.1}
        Q ${w*0.1} ${h*0.07} ${w*0.15} ${h*0.07}
        L ${w*0.85} ${h*0.07}
        Q ${w*0.9} ${h*0.07} ${w*0.9} ${h*0.1}
        L ${w*0.9} ${h*0.35}
        C ${w*0.9} ${h*0.62} ${w*0.5} ${h*0.91} ${w*0.5} ${h*0.91}
        Z
    `

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="sombra-escudo" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor={b} floodOpacity="0.4"/>
                </filter>
                <clipPath id={`clip-escudo-${w}-${h}`}>
                    <path d={path}/>
                </clipPath>
            </defs>

            <path d={path} fill={c} filter="url(#sombra-escudo)"/>
            <path d={path} fill="none" stroke={b} strokeWidth="2"/>
            <path d={pathInner} fill="none" stroke={b} strokeWidth="0.5" strokeOpacity="0.4"/>

            {/* Línea central decorativa */}
            <line x1={w*0.5} y1={h*0.07} x2={w*0.5} y2={h*0.75} stroke={b} strokeWidth="0.5" strokeOpacity="0.3"/>
            <line x1={w*0.1} y1={h*0.35} x2={w*0.9} y2={h*0.35} stroke={b} strokeWidth="0.5" strokeOpacity="0.3"/>

            <foreignObject x={w*0.15} y={h*0.08} width={w*0.7} height={h*0.7}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {children}
                </div>
            </foreignObject>
        </svg>
    )
}

export function FormaCorazon({ ancho, alto, color, colorBorde, children }) {
    const w = ancho || 100
    const h = alto || 100
    const c = color || '#f4ead5'
    const b = colorBorde || '#2c1810'

    const path = `
        M ${w*0.5} ${h*0.88}
        C ${w*0.5} ${h*0.88} ${w*0.05} ${h*0.55} ${w*0.05} ${h*0.35}
        C ${w*0.05} ${h*0.15} ${w*0.2} ${h*0.06} ${w*0.35} ${h*0.06}
        C ${w*0.42} ${h*0.06} ${w*0.48} ${h*0.1} ${w*0.5} ${h*0.16}
        C ${w*0.52} ${h*0.1} ${w*0.58} ${h*0.06} ${w*0.65} ${h*0.06}
        C ${w*0.8} ${h*0.06} ${w*0.95} ${h*0.15} ${w*0.95} ${h*0.35}
        C ${w*0.95} ${h*0.55} ${w*0.5} ${h*0.88} ${w*0.5} ${h*0.88}
        Z
    `

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="sombra-corazon" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor={b} floodOpacity="0.4"/>
                </filter>
                <clipPath id={`clip-corazon-${w}-${h}`}>
                    <path d={path}/>
                </clipPath>
            </defs>

            <path d={path} fill={c} filter="url(#sombra-corazon)"/>
            <path d={path} fill="none" stroke={b} strokeWidth="2"/>

            {/* Brillo decorativo */}
            <path d={`M ${w*0.3} ${h*0.18} C ${w*0.28} ${h*0.14} ${w*0.22} ${h*0.13} ${w*0.2} ${h*0.18}`}
                fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round"/>

            <foreignObject x={w*0.15} y={h*0.16} width={w*0.7} height={h*0.7}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {children}
                </div>
            </foreignObject>
        </svg>
    )
}

export function FormaHexagono({ ancho, alto, color, colorBorde, children }) {
    const w = ancho || 100
    const h = alto || 110
    const c = color || '#f4ead5'
    const b = colorBorde || '#2c1810'
    const cx = w / 2
    const cy = h / 2
    const r = Math.min(w, h) / 2 - 6

    const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 180) * (60 * i - 30)
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
    }).join(' ')

    const pointsInner = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 180) * (60 * i - 30)
        return `${cx + (r-4) * Math.cos(angle)},${cy + (r-4) * Math.sin(angle)}`
    }).join(' ')

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="sombra-hex" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor={b} floodOpacity="0.4"/>
                </filter>
            </defs>

            <polygon points={points} fill={c} filter="url(#sombra-hex)"/>
            <polygon points={points} fill="none" stroke={b} strokeWidth="2"/>
            <polygon points={pointsInner} fill="none" stroke={b} strokeWidth="0.5" strokeOpacity="0.4"/>

            {/* Puntos en vértices */}
            {Array.from({ length: 6 }, (_, i) => {
                const angle = (Math.PI / 180) * (60 * i - 30)
                return <circle key={i} cx={cx + r * Math.cos(angle)} cy={cy + r * Math.sin(angle)} r="2" fill={b} fillOpacity="0.6"/>
            })}

            <foreignObject x={cx - r*0.6} y={cy - r*0.6} width={r*1.2} height={r*1.2}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {children}
                </div>
            </foreignObject>
        </svg>
    )
}

export function FormaRombo({ ancho, alto, color, colorBorde, children }) {
    const w = ancho || 100
    const h = alto || 100
    const c = color || '#f4ead5'
    const b = colorBorde || '#2c1810'

    const points = `${w*0.5},${h*0.04} ${w*0.96},${h*0.5} ${w*0.5},${h*0.96} ${w*0.04},${h*0.5}`
    const pointsInner = `${w*0.5},${h*0.1} ${w*0.9},${h*0.5} ${w*0.5},${h*0.9} ${w*0.1},${h*0.5}`

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="sombra-rombo" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor={b} floodOpacity="0.4"/>
                </filter>
            </defs>

            <polygon points={points} fill={c} filter="url(#sombra-rombo)"/>
            <polygon points={points} fill="none" stroke={b} strokeWidth="2"/>
            <polygon points={pointsInner} fill="none" stroke={b} strokeWidth="0.5" strokeOpacity="0.4"/>

            {/* Puntos en vértices */}
            {[
                [w*0.5, h*0.04], [w*0.96, h*0.5], [w*0.5, h*0.96], [w*0.04, h*0.5]
            ].map(([px, py], i) => (
                <circle key={i} cx={px} cy={py} r="2.5" fill={b} fillOpacity="0.6"/>
            ))}

            <foreignObject x={w*0.2} y={h*0.2} width={w*0.6} height={h*0.6}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {children}
                </div>
            </foreignObject>
        </svg>
    )
}

export function FormaPergamino({ ancho, alto, color, colorBorde, children }) {
    const w = ancho || 120
    const h = alto || 160
    const c = color || '#f4ead5'
    const b = colorBorde || '#2c1810'
    const roll = 16
    const cDark = '#d4c49a'
    const bite = 8 // profundidad de la mordida

    const bodyPath = `
        M 4 ${roll}
        Q ${8 + bite*0.6} ${h/2 - 16} ${8 + bite*0.6} ${h/2}
        Q ${8 + bite*0.6} ${h/2 + 16} 8 ${h - roll - 4}
        L ${w - 8} ${h - roll - 4}
        Q ${w - bite*0.6 - 8} ${h/2 + 16} ${w - bite*0.6 - 8} ${h/2}
        Q ${w - bite*0.6 - 8} ${h/2 - 16} ${w - 8} ${roll + 4}
    `

    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="sombra-pergamino" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor={b} floodOpacity="0.4"/>
                </filter>
                <clipPath id={`clip-perg-${w}-${h}`}>
                    <path d={bodyPath}/>
                </clipPath>
            </defs>

            {/* Cuerpo principal con mordidas */}
            <path d={bodyPath} fill={c} filter="url(#sombra-pergamino)"/>
            <path d={bodyPath} fill="none" stroke={b} strokeWidth="1.5"/>

            {/* Borde interior decorativo */}
            <path d={`
                M 8 ${roll + 4}
                Q ${8 - bite*0.6} ${h/2 - 16} ${8 - bite*0.6} ${h/2}
                Q ${8 - bite*0.6} ${h/2 + 16} 8 ${h - roll - 4}
                L ${w - 8} ${h - roll - 4}
                Q ${w + bite*0.6 - 8} ${h/2 + 16} ${w + bite*0.6 - 8} ${h/2}
                Q ${w + bite*0.6 - 8} ${h/2 - 16} ${w - 8} ${roll + 4}
                Z
            `} fill="none" stroke={b} strokeWidth="0.5" strokeOpacity="0.3"/>

            {/* Rollo superior */}
            <rect x="8" y="4" width={w-16} height={roll} fill={cDark} rx="3"/>
            <rect x="8" y="4" width={w-16} height={roll} fill="none" stroke={b} strokeWidth="1.2" rx="3"/>
            <line x1="10" y1={4 + roll*0.35} x2={w-10} y2={4 + roll*0.35} stroke={b} strokeWidth="0.6" strokeOpacity="0.35"/>
            <line x1="10" y1={4 + roll*0.65} x2={w-10} y2={4 + roll*0.65} stroke={b} strokeWidth="0.4" strokeOpacity="0.2"/>
            <ellipse cx="8" cy={4 + roll/2} rx="4" ry={roll/2 - 1} fill={c} stroke={b} strokeWidth="1"/>
            <ellipse cx={w-8} cy={4 + roll/2} rx="4" ry={roll/2 - 1} fill={c} stroke={b} strokeWidth="1"/>

            {/* Rollo inferior */}
            <rect x="8" y={h - roll - 4} width={w-16} height={roll} fill={cDark} rx="3"/>
            <rect x="8" y={h - roll - 4} width={w-16} height={roll} fill="none" stroke={b} strokeWidth="1.2" rx="3"/>
            <line x1="10" y1={h - roll - 4 + roll*0.35} x2={w-10} y2={h - roll - 4 + roll*0.35} stroke={b} strokeWidth="0.6" strokeOpacity="0.35"/>
            <line x1="10" y1={h - roll - 4 + roll*0.65} x2={w-10} y2={h - roll - 4 + roll*0.65} stroke={b} strokeWidth="0.4" strokeOpacity="0.2"/>
            <ellipse cx="8" cy={h - roll/2 - 4} rx="4" ry={roll/2 - 1} fill={c} stroke={b} strokeWidth="1"/>
            <ellipse cx={w-8} cy={h - roll/2 - 4} rx="4" ry={roll/2 - 1} fill={c} stroke={b} strokeWidth="1"/>

            {/* Contenido */}
            <foreignObject x="10" y={roll + 6} width={w-20} height={h - roll*2 - 12}>
                <div xmlns="http://www.w3.org/1999/xhtml" style={{
                    width: '100%', height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    {children}
                </div>
            </foreignObject>
        </svg>
    )
}


export const FORMAS = {
    cuadrado:      FormaCuadrado,
    circulo:       FormaCirculo,
    escudo:        FormaEscudo,
    corazon:       FormaCorazon,
    hexagono:      FormaHexagono,
    rombo:         FormaRombo,
    pergamino:     FormaPergamino,
}

export const LISTA_FORMAS = [
    { id: 'cuadrado',      label: 'Cuadrado'        },
    { id: 'circulo',       label: 'Círculo'          },
    { id: 'escudo',        label: 'Escudo'           },
    { id: 'corazon',       label: 'Corazón'          },
    { id: 'hexagono',      label: 'Hexágono'         },
    { id: 'rombo',         label: 'Rombo'            },
    { id: 'pergamino',     label: 'Pergamino'        },
    { id: 'yunque',        label: 'Yunque'           }
]