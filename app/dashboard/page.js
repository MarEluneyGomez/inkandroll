'use client'

import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) router.push('/auth')
                else setUser(user)
        }
        getUser()
    }, [])

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/auth')
    }

    if (!user) return <p>Cargando...</p>

    return (
        <div style={{ maxWidth: 600, margin: '100px auto', padding: 24}}>
            <h1>Bienvenido</h1>
            <p>Sesión iniciada como: <b>{user.email}</b></p>
            <br/>
            <button onClick={handleLogout} style={{ padding: '8px 16px'}}>
                Cerrar sesión
            </button>
        </div>
    )
}