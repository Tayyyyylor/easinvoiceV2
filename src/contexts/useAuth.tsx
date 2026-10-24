'use client'
import { createContext, useContext } from 'react'

type AuthCtx = { profile: Profile }

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({
    profile,
    children,
}: {
    profile: Profile
    children: React.ReactNode
}) {
    return <Ctx.Provider value={{ profile }}>{children}</Ctx.Provider>
}

export function useAuth() {
    const ctx = useContext(Ctx)
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
    return ctx
}
