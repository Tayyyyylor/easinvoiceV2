'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import useMobile from '@/hooks/useMobile'

const dataNav = [
    {
        label: 'Connexion',
        href: '/login',
    },

    {
        label: 'Créer un compte',
        href: '/signup',
    },
]

export const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    const router = useRouter()
    const isMobile = useMobile()
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const handleProfileClick = () => {
        setIsProfileOpen(!isProfileOpen)
    }
    return (
        <header className="p-2 flex items-center sticky top-0 left-0 w-full z-1000 justify-between bg-white border-b">
            <Link href="/">
                <h1>
                    <Image
                        src="/logo_black.png"
                        alt="Logo"
                        width={100}
                        height={100}
                    />
                </h1>
            </Link>
            {!isLoggedIn && (
                <div className="flex items-center gap-2">
                    {!isMobile ? (
                        <nav className="flex gap-2 items-center">
                            {dataNav.map((item, index) => (
                                <div key={index}>
                                    <Link href={item.href} className="">
                                        {item.label}
                                    </Link>
                                </div>
                            ))}
                        </nav>
                    ) : (
                        <button onClick={() => router.push(dataNav[0]?.href)}>
                            {dataNav[0]?.label}
                        </button>
                    )}
                </div>
            )}

            {isLoggedIn && (
                <div className="flex items-center gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="outline" onClick={handleProfileClick}>
                        <Image
                            src="/user-default.png"
                            alt="Profile"
                            width={20}
                            height={20}
                        />
                    </Button>
                </div>
            )}
            {isProfileOpen && (
                <div className="absolute top-10 right-0 w-48 bg-white rounded-lg shadow-lg flex flex-col gap-2">
                    <button onClick={() => router.push('/profile')}>
                        Modifier Profil
                    </button>
                    <button>Paramètres</button>
                    <form action="/auth/signout" method="post">
                        <button type="submit">Déconnexion</button>
                    </form>
                </div>
            )}
        </header>
    )
}
