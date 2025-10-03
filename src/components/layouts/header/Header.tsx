import React from 'react'
import { Navbar } from '../navbar/Navbar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    return (
        <header className="p-1 flex items-center sticky top-0 left-0 w-full z-1000 justify-between bg-white border-b">
            <h1>EasInvoice</h1>
            <div className="flex items-center gap-2">
                <Navbar />
            </div>
            {!isLoggedIn ? (
                <div className="flex items-center gap-2">
                    <Button variant="default" asChild>
                        <Link href="/signup">Signup</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <form action="/auth/signout" method="post">
                        <Button variant="outline" type="submit">
                            Logout
                        </Button>
                    </form>
                </div>
            )}
        </header>
    )
}
