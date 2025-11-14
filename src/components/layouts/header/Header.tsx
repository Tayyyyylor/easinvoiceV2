'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import useMobile from '@/hooks/useMobile'
import {
    User,
    Settings,
    LogOut,
    LayoutDashboard,
    ChevronDown,
} from 'lucide-react'

export const Header = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    const router = useRouter()
    const isMobile = useMobile()
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const handleProfileClick = () => {
        setIsProfileOpen(!isProfileOpen)
    }

    // Fermer le menu quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsProfileOpen(false)
            }
        }

        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isProfileOpen])

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center hover:opacity-80 transition-opacity"
                    >
                        <Image
                            src="/logo_black.png"
                            alt="Logo"
                            width={90}
                            height={25}
                            className=" w-auto"
                        />
                    </Link>

                    {/* Navigation pour non connectés */}
                    {!isLoggedIn && (
                        <div className="flex items-center gap-3">
                            {!isMobile ? (
                                <nav className="flex gap-3 items-center">
                                    <Button
                                        asChild
                                        variant="ghost"
                                        className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                                    >
                                        <Link href="/login">Connexion</Link>
                                    </Button>
                                    <Button
                                        asChild
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
                                    >
                                        <Link href="/signup">
                                            Créer un compte
                                        </Link>
                                    </Button>
                                </nav>
                            ) : (
                                <Button
                                    onClick={() => router.push('/login')}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md"
                                >
                                    Connexion
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Navigation pour connectés */}
                    {isLoggedIn && (
                        <div className="flex items-center gap-3">
                            <Button
                                asChild
                                variant="ghost"
                                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 gap-2"
                            >
                                <Link href="/dashboard">
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span className="hidden sm:inline">
                                        Dashboard
                                    </span>
                                </Link>
                            </Button>

                            {/* Menu profil avec dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={handleProfileClick}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-2 ring-blue-100">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <ChevronDown
                                        className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Dropdown menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                Mon compte
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Gérez vos paramètres
                                            </p>
                                        </div>

                                        <div className="py-1">
                                            <button
                                                onClick={() => {
                                                    router.push('/profile')
                                                    setIsProfileOpen(false)
                                                }}
                                                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                            >
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span>Modifier le profil</span>
                                            </button>

                                            <button
                                                onClick={() => {
                                                    router.push('/settings')
                                                    setIsProfileOpen(false)
                                                }}
                                                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                            >
                                                <Settings className="w-4 h-4 text-gray-400" />
                                                <span>Paramètres</span>
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-100 py-1">
                                            <form
                                                action="/auth/signout"
                                                method="post"
                                            >
                                                <button
                                                    type="submit"
                                                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Déconnexion</span>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}
