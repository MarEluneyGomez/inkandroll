export const HABILIDADES = [
    {id:'athletics',        label:'Atletismo',          stat:'fuerza'},
    {id:'acrobatics',       label:'Acrobacias',         stat:'destreza'},
    {id:'sleightOfHand',    label:'Juego de manos',     stat:'destreza'},
    {id:'stealth',          label:'Sigilo',             stat:'destreza'},
    {id:'arcana',           label:'Arcano',             stat:'inteligencia'},
    {id:'history',          label:'Historia',           stat:'inteligencia'},
    {id:'investigation',    label:'Investigacion',      stat:'inteligencia'},
    {id:'nature',           label:'Naturaleza',         stat:'inteligencia'},
    {id:'religion',         label:'Religion',           stat:'inteligencia'},
    {id:'animalHandling',   label:'Trato con animales', stat:'sabiduria'},
    {id:'insight',          label:'Perspicacia',        stat:'sabiduria'},
    {id:'medicine',         label:'Medicina',           stat:'sabiduria'},
    {id:'perception',       label:'Percepcion',         stat:'sabiduria'},
    {id:'survival',         label:'Supervivencia',      stat:'sabiduria'},
    {id:'deception',        label:'Engaño',             stat:'carisma'},
    {id:'intimidation',     label:'Intimidación',       stat:'carisma'},
    {id:'performance',      label:'Actuación',          stat:'carisma'},
    {id:'persuasion',       label:'Persuación',         stat:'carisma'},
]

export const HABILIDADES_POR_STAT = {
    fuerza:         HABILIDADES.filter(h => h.stat = 'fuerza'),
    destreza:       HABILIDADES.filter(h => h.stat = 'destreza'),
    constitucion:   [],
    inteligencia:   HABILIDADES.filter(h => h.stat = 'inteligencia'),
    sabiduria:      HABILIDADES.filter(h => h.stat = 'sabiduria'),
    carisma:        HABILIDADES.filter(h => h.stat = 'carisma')
}

export function calcularModificador(valor) {
    return Math.floor((valor - 10) / 2)
}

export function calcularBono(stat, habilidadId, stats, proficiency, competencies, expertises) {
    const mod = calcularModificador(stats[stat])
    const esCompetente = competencies?.includes(habilidadId)
    const esMaestria = expertises?.includes(habilidadId)

    if (esMaestria) return mod + (proficiency * 2)
    if (esCompetente) return mod + proficiency
    return mod
}

export function formatearBono(bono) {
    return bono >= 0 ? `+${bono}` : `${bono}`
}