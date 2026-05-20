'use client'

import { HABILIDADES_POR_STAT, SALVACIONES, calcularBono, calcularModificador, formatearBono } from './habilidades'

export default function DesplegableStat({
    bloque,
    rect,
    stats,
    proficiency,
    competencies,
    expertises,
    savingThrows,
    onCambiarPlanilla,
    onCerrar
}) {
    const stat = bloque.id
    const valorStat = stats?.[stat] || 10
    const modificador = calcularModificador(valorStat)
    const habilidadesDelStat = HABILIDADES_POR_STAT[stat] || []
    const salvacion = SALVACIONES.find(s => s.stat === stat)
    const esSalvacionCompetente = savingThrows?.includes(salvacion?.id)
    const bonusSalvacion = modificador + (esSalvacionCompetente ? proficiency : 0)

    function toggleSavingThrow() {
        if (esSalvacionCompetente) {
            onCambiarPlanilla('saving_throws', (savingThrows || []).filter(s => s !== salvacion.id))
        } else {
            onCambiarPlanilla('saving_throws', [...(savingThrows || []), salvacion.id])
        }
    }

    function toggleCompetencia(habilidadId) {
        const currentComp = competencies || []
        const currentExpe = expertises || []
        const esComp = currentComp.includes(habilidadId)
        const esMaes = currentExpe.includes(habilidadId)

        if (esMaes) {
            onCambiarPlanilla('expertises', currentExpe.filter(id => id !== habilidadId))
            onCambiarPlanilla('competencies', currentComp.filter(id => id !== habilidadId))
        } else if (esComp) {
            onCambiarPlanilla('expertises', [...currentExpe, habilidadId])
        } else {
            onCambiarPlanilla('competencies', [...currentComp, habilidadId])
        }
    }

    const textoMasLargo = Math.max(
        bloque.label.length,
        ...habilidadesDelStat.map(h => h.label.length),
        'Tirada de salvación'.length
    )
    const fontSize = textoMasLargo > 16 ? 8 : textoMasLargo > 12 ? 9 : 11

    return (
        <>
            <style>{`
                @keyframes cajonSlide {
                    from { opacity: 0; max-height: 0; }
                    to   { opacity: 1; max-height: 300px; }
                }
            `}</style>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'fixed',
                    left: rect ? rect.left : 100,
                    top: rect ? rect.bottom : 100,
                    width: rect ? rect.width : 220,
                    background: '#2c1810',
                    borderLeft: '1px solid #c9a227',
                    borderRight: '1px solid #c9a227',
                    borderBottom: '1px solid #c9a227',
                    borderRadius: '0 0 8px 8px',
                    zIndex: 500,
                    color: '#f4ead5',
                    overflow: 'hidden',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.6)',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    animation: 'cajonSlide 0.25s ease',
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 12px', borderBottom: '1px solid rgba(201,162,39,0.3)',
                    background: 'rgba(201,162,39,0.1)'
                }}>
                    <span style={{ fontWeight: 'bold', fontSize, textTransform: 'uppercase', color: '#c9a227' }}>
                        {bloque.label}
                    </span>
                </div>

                {/* Tirada de salvación */}
                <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
                    <div style={{ fontSize: fontSize * 0.85, opacity: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>
                        Tirada de salvación
                    </div>
                    <div
                        onClick={toggleSavingThrow}
                        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '2px 0' }}
                    >
                        <div style={{
                            width: 8, height: 8, borderRadius: '50%',
                            border: '1.5px solid #c9a227',
                            background: esSalvacionCompetente ? '#c9a227' : 'transparent',
                            flexShrink: 0
                        }} />
                        <span style={{ flex: 1, fontSize }}>{bloque.label}</span>
                        <span style={{ fontSize, fontWeight: 'bold', color: '#c9a227' }}>
                            {formatearBono(bonusSalvacion)}
                        </span>
                    </div>
                </div>

                {/* Habilidades del stat */}
                {habilidadesDelStat.length > 0 && (
                    <div style={{ padding: '8px 12px' }}>
                        <div style={{ fontSize: fontSize * 0.85, opacity: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>
                            Habilidades
                        </div>
                        {habilidadesDelStat.map(h => {
                            const bono = calcularBono(h.stat, h.id, stats, proficiency, competencies, expertises)
                            const esComp = (competencies || []).includes(h.id)
                            const esMaes = (expertises || []).includes(h.id)

                            return (
                                <div
                                    key={h.id}
                                    onClick={() => toggleCompetencia(h.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        cursor: 'pointer', padding: '2px 0'
                                    }}
                                >
                                    <div style={{
                                        width: 8, height: 8, borderRadius: '50%',
                                        border: '1.5px solid #f4ead5',
                                        background: esMaes ? '#c9a227' : esComp ? '#f4ead5' : 'transparent',
                                        flexShrink: 0
                                    }} />
                                    <span style={{ flex: 1, fontSize }}>{h.label}</span>
                                    <span style={{ fontSize, fontWeight: 'bold' }}>{formatearBono(bono)}</span>
                                </div>
                            )
                        })}
                    </div>
                )}

                {habilidadesDelStat.length === 0 && (
                    <div style={{ padding: '8px 12px', fontSize, opacity: 0.5, fontStyle: 'italic' }}>
                        Sin habilidades asociadas
                    </div>
                )}
            </div>
        </>
    )
}