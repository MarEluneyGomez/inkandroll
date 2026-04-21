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

  console.log('loading:', loading, 'isLogin:', isLogin)
  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
      <h1>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
      <br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: 'block', width: '100%', marginBottom: 12, padding: 8 }}
      />
      <button onClick={handleSubmit} disabled={loading}
        style={{ width: '100%', padding: 10, marginBottom: 12 }}>
        {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Registrarse'}
      </button>
      <button onClick={() => setIsLogin(!isLogin)}
        style={{ width: '100%', padding: 8, background: 'transparent' }}>
        {isLogin ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
      </button>
      {message && <p style={{ marginTop: 12, color: 'red' }}>{message}</p>}
    </div>
  )
}