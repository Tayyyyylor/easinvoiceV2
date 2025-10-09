import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'

export const LandingPage = () => {
    return (
        <>
            <main className="flex flex-col items-center justify-center h-screen">
                <Button asChild>
                    <Link href="/signup">Signup</Link>
                </Button>
                <Button asChild>
                    <Link href="/login">Login</Link>
                </Button>
            </main>
        </>
    )
}
