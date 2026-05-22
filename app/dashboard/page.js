// dashboard/page.js
'use client'

import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const [planillas, setPlanillas] = useState([])
    const [nombre, setNombre] = useState('')
    const [raza, setRaza] = useState('')
    const [clase, setClase] = useState('')
    const [loading, setLoading] = useState(false)
    const [mostrarForm, setMostrarForm] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/auth'); return }
            setUser(user)
            cargarPlanillas(user.id)
        }
        init()
    }, [])

    async function cargarPlanillas(userId) {
        const { data, error } = await supabase
            .from('planillas').select('*').eq('user_id', userId)
            .order('created_at', { ascending: false })
        if (!error) setPlanillas(data)
    }

    async function crearPlanilla() {
        if (!nombre) return
        setLoading(true)
        const { error } = await supabase.from('planillas').insert({
            user_id: user.id, nombre, raza, clase, nivel: 1,
            stats: { fuerza: 10, destreza: 10, constitucion: 10, inteligencia: 10, sabiduria: 10, carisma: 10 },
            proficiency: 2, competencies: [], layout: [], saving_throws: []
        })
        if (!error) {
            setNombre(''); setRaza(''); setClase('')
            setMostrarForm(false)
            cargarPlanillas(user.id)
        }
        setLoading(false)
    }

    async function eliminarPlanilla(planillaId) {
        const { error } = await supabase.from('planillas').delete().eq('id', planillaId)
        if (!error) cargarPlanillas(user.id)
    }

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/auth')
    }

    if (!user) return (
        <div style={{ minHeight: '100vh', background: '#1a1008', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ color: '#c9a227' }}>Cargando...</div>
        </div>
    )

    return (
        <div style={{ minHeight: '100vh', background: '#1a1008', color: '#f4ead5' }}>
            <style>{`
                .planilla-card:hover { border-color: #c9a227 !important; }
                .planilla-card { transition: border-color 0.15s; }
            `}</style>

            {/* Header */}
            <div style={{
                padding: '14px 32px', background: '#1a0e04',
                borderBottom: '1px solid rgba(201,162,39,0.3)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#c9a227', letterSpacing: '0.05em' }}>
                    Ink & Roll
                </div>
                <button onClick={handleLogout}
                    style={{
                        padding: '6px 16px', background: 'transparent',
                        border: '1px solid rgba(201,162,39,0.4)', borderRadius: 4,
                        color: '#c9a227', fontSize: 11, cursor: 'pointer'
                    }}>
                    Cerrar sesión
                </button>
            </div>

            <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 24px' }}>

                {/* Título + botón nuevo */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 'bold', color: '#c9a227' }}>Mis personajes</div>
                        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>{user.email}</div>
                    </div>
                    <button onClick={() => setMostrarForm(!mostrarForm)}
                        style={{
                            padding: '8px 18px', background: mostrarForm ? 'transparent' : '#c9a227',
                            border: '1px solid #c9a227', borderRadius: 4,
                            color: mostrarForm ? '#c9a227' : '#1a0e04',
                            fontWeight: 'bold', fontSize: 12, cursor: 'pointer'
                        }}>
                        {mostrarForm ? 'Cancelar' : '+ Nuevo personaje'}
                    </button>
                </div>

                {/* Formulario nuevo personaje */}
                {mostrarForm && (
                    <div style={{
                        background: '#2c1810', border: '1px solid rgba(201,162,39,0.3)',
                        borderRadius: 8, padding: 20, marginBottom: 24
                    }}>
                        <div style={{ fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', color: '#c9a227', marginBottom: 14, letterSpacing: '0.1em' }}>
                            Nuevo personaje
                        </div>
                        {[
                            { placeholder: 'Nombre del personaje *', value: nombre, onChange: setNombre },
                            { placeholder: 'Raza', value: raza, onChange: setRaza },
                            { placeholder: 'Clase', value: clase, onChange: setClase },
                        ].map((f, i) => (
                            <input key={i} placeholder={f.placeholder} value={f.value}
                                onChange={e => f.onChange(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && crearPlanilla()}
                                style={{
                                    display: 'block', width: '100%', marginBottom: 10, padding: '9px 12px',
                                    background: '#1a0e04', border: '1px solid rgba(201,162,39,0.3)',
                                    borderRadius: 4, color: '#f4ead5', fontSize: 13, outline: 'none',
                                    boxSizing: 'border-box'
                                }}
                            />
                        ))}
                        <button onClick={crearPlanilla} disabled={loading || !nombre}
                            style={{
                                width: '100%', padding: '9px 0', marginTop: 4,
                                background: !nombre ? 'rgba(201,162,39,0.3)' : '#c9a227',
                                border: 'none', borderRadius: 4,
                                color: '#1a0e04', fontWeight: 'bold', fontSize: 13,
                                cursor: !nombre ? 'not-allowed' : 'pointer'
                            }}>
                            {loading ? 'Creando...' : 'Crear personaje'}
                        </button>
                    </div>
                )}

                {/* Lista de personajes */}
                {planillas.length === 0 && !mostrarForm && (
                    <div style={{
                        textAlign: 'center', padding: '60px 0',
                        opacity: 0.4, fontSize: 13
                    }}>
                        Todavía no tenés personajes. ¡Creá uno!
                    </div>
                )}

                {planillas.map(p => (
                    <div key={p.id} className="planilla-card"
                        onClick={() => router.push(`/planilla/${p.id}`)}
                        style={{
                            background: '#2c1810', border: '1px solid rgba(201,162,39,0.2)',
                            borderRadius: 8, padding: '16px 20px', marginBottom: 12,
                            cursor: 'pointer', position: 'relative',
                            display: 'flex', alignItems: 'center', gap: 16
                        }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: '#1a0e04', border: '1px solid rgba(201,162,39,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 18, flexShrink: 0
                        }}>
                            ⚔️
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', fontSize: 15, color: '#f4ead5' }}>{p.nombre}</div>
                            <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>
                                {[p.raza, p.clase, `Nivel ${p.nivel}`].filter(Boolean).join(' · ')}
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); if (confirm(`¿Eliminar a ${p.nombre}?`)) eliminarPlanilla(p.id) }}
                            style={{
                                background: 'transparent', border: 'none',
                                color: 'rgba(255,255,255,0.2)', fontSize: 20, cursor: 'pointer', padding: '0 4px'
                            }}
                            onMouseEnter={e => e.target.style.color = '#cc0000'}
                            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.2)'}
                        >×</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
