'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function Home() {
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                router.push('/dashboard')
            } else {
                router.push('/auth')
            }
        }
        init()
    }, [])

    return null
}