'use client'

import { useState } from 'react'
import { createClient } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function NuevaPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmar, setConfirmar] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    async function handleActualizar() {
        if (!password || password !== confirmar) {
            setMessage('Las contraseñas no coinciden.')
            return
        }
        setLoading(true)
        setMessage('')
        const { error } = await supabase.auth.updateUser({ password })
        if (error) setMessage(error.message)
        else {
            setMessage('Contraseña actualizada correctamente.')
            setTimeout(() => router.push('/dashboard'), 2000)
        }
        setLoading(false)
    }

    return (
        <div style={{
            minHeight: '100vh', background: '#1a1008',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{
                width: 360, background: '#2c1810',
                border: '1px solid #c9a227', borderRadius: 8,
                padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#c9a227', letterSpacing: '0.05em' }}>
                        Ink & Roll
                    </div>
                    <div style={{ fontSize: 11, color: '#f4ead5', opacity: 0.5, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        Nueva contraseña
                    </div>
                </div>

                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                        display: 'block', width: '100%', marginBottom: 12, padding: '10px 12px',
                        background: '#1a0e04', border: '1px solid rgba(201,162,39,0.3)',
                        borderRadius: 4, color: '#f4ead5', fontSize: 13, outline: 'none',
                        boxSizing: 'border-box'
                    }}
                />
                <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    value={confirmar}
                    onChange={e => setConfirmar(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleActualizar()}
                    style={{
                        display: 'block', width: '100%', marginBottom: 20, padding: '10px 12px',
                        background: '#1a0e04', border: '1px solid rgba(201,162,39,0.3)',
                        borderRadius: 4, color: '#f4ead5', fontSize: 13, outline: 'none',
                        boxSizing: 'border-box'
                    }}
                />

                <button onClick={handleActualizar} disabled={loading || !password || !confirmar}
                    style={{
                        width: '100%', padding: '10px 0',
                        background: !password || !confirmar ? 'rgba(201,162,39,0.3)' : '#c9a227',
                        border: 'none', borderRadius: 4,
                        color: '#1a0e04', fontWeight: 'bold', fontSize: 13,
                        cursor: !password || !confirmar || loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}>
                    {loading ? 'Actualizando...' : 'Actualizar contraseña'}
                </button>

                {message && (
                    <div style={{
                        marginTop: 14, padding: '8px 12px', borderRadius: 4,
                        background: message.includes('correctamente') ? 'rgba(201,162,39,0.1)' : 'rgba(180,0,0,0.15)',
                        border: `1px solid ${message.includes('correctamente') ? 'rgba(201,162,39,0.4)' : 'rgba(180,0,0,0.4)'}`,
                        color: message.includes('correctamente') ? '#c9a227' : '#ff6b6b',
                        fontSize: 11
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
}