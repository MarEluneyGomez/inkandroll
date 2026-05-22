'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit() {
    setLoading(true)
    setMessage('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else router.push('/dashboard')
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Revisá tu email para confirmar la cuenta.')
    }

    setLoading(false)
  }

  return (
       <div style={{
            minHeight: '100vh',
            background: '#1a1008',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div style={{
                width: 360,
                background: '#2c1810',
                border: '1px solid #c9a227',
                borderRadius: 8,
                padding: 32,
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            }}>
                {/* Logo/título */}
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#c9a227', letterSpacing: '0.05em' }}>
                        Ink & Roll
                    </div>
                    <div style={{ fontSize: 11, color: '#f4ead5', opacity: 0.5, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
                    </div>
                </div>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    style={{
                        display: 'block', width: '100%', marginBottom: 12, padding: '10px 12px',
                        background: '#1a0e04', border: '1px solid rgba(201,162,39,0.3)',
                        borderRadius: 4, color: '#f4ead5', fontSize: 13, outline: 'none',
                        boxSizing: 'border-box'
                    }}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    style={{
                        display: 'block', width: '100%', marginBottom: 20, padding: '10px 12px',
                        background: '#1a0e04', border: '1px solid rgba(201,162,39,0.3)',
                        borderRadius: 4, color: '#f4ead5', fontSize: 13, outline: 'none',
                        boxSizing: 'border-box'
                    }}
                />

                <button onClick={handleSubmit} disabled={loading}
                    style={{
                        width: '100%', padding: '10px 0', marginBottom: 10,
                        background: '#c9a227', border: 'none', borderRadius: 4,
                        color: '#1a0e04', fontWeight: 'bold', fontSize: 13,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}>
                    {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Registrarse'}
                </button>

                <button onClick={() => { setIsLogin(!isLogin); setMessage('') }}
                    style={{
                        width: '100%', padding: '8px 0',
                        background: 'transparent', border: '1px solid rgba(201,162,39,0.3)',
                        borderRadius: 4, color: '#c9a227', fontSize: 11,
                        cursor: 'pointer', letterSpacing: '0.05em'
                    }}>
                    {isLogin ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
                </button>

                <button onClick={() => router.push('/auth/recuperar')}
                    style={{
                        width: '100%', padding: '8px 0', marginTop: 6,
                        background: 'transparent', border: 'none',
                        color: '#f4ead5', fontSize: 11, opacity: 0.4,
                        cursor: 'pointer'
                    }}>
                    ¿Olvidaste tu contraseña?
                </button>

                {message && (
                    <div style={{
                        marginTop: 14, padding: '8px 12px', borderRadius: 4,
                        background: message.includes('email') ? 'rgba(201,162,39,0.1)' : 'rgba(180,0,0,0.15)',
                        border: `1px solid ${message.includes('email') ? 'rgba(201,162,39,0.4)' : 'rgba(180,0,0,0.4)'}`,
                        color: message.includes('email') ? '#c9a227' : '#ff6b6b',
                        fontSize: 11
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    )
}