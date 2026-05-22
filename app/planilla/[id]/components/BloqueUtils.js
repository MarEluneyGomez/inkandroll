export const GRILLA = 20

const esquinas = [
    { cursor: 'se-resize', dx: 1,  dy: 1  },
    { cursor: 'sw-resize', dx: -1, dy: 1  },
    { cursor: 'ne-resize', dx: 1,  dy: -1 },
    { cursor: 'nw-resize', dx: -1, dy: -1 },
]

export function EsquinasRedimensionar({ bloque, ancho, alto, onRedimensionar }) {
    return esquinas.map((esquina, i) => (
        <div key={i}
            onClick={e => e.stopPropagation()}
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
                top:  esquina.dy === 1 ? bloque.y + alto - 7  : bloque.y - 7,
                width: 14, height: 14, cursor: esquina.cursor, zIndex: 1000,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
        >
            <div style={{
                width: 10, height: 10,
                borderTop:    esquina.dy === -1 ? '2px solid #c9a227' : 'none',
                borderBottom: esquina.dy === 1  ? '2px solid #c9a227' : 'none',
                borderLeft:   esquina.dx === -1 ? '2px solid #c9a227' : 'none',
                borderRight:  esquina.dx === 1  ? '2px solid #c9a227' : 'none',
            }} />
        </div>
    ))
}