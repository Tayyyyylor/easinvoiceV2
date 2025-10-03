/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { createContext, useContext } from 'react'
import type { User } from '@supabase/supabase-js'

type Profile = any // remplace par ton type si tu en as un
type AuthCtx = { user: User; profile: Profile | null }

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({
    user,
    profile,
    children,
}: {
    user: User
    profile: Profile | null
    children: React.ReactNode
}) {
    return <Ctx.Provider value={{ user, profile }}>{children}</Ctx.Provider>
}

export function useAuth() {
    const ctx = useContext(Ctx)
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
    return ctx
}
