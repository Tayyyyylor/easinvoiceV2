'use server'

import { redirect } from 'next/navigation'

type AuthState = { error?: string } | null

export async function login(
    _prevState: AuthState,
    _formData: FormData
): Promise<AuthState> {
    void _prevState
    void _formData
    redirect('/dashboard')
}

export async function signup(
    _prevState: AuthState,
    _formData: FormData
): Promise<AuthState> {
    void _prevState
    void _formData
    redirect('/dashboard')
}
