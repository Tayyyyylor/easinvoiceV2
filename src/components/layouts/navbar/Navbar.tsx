/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import useMobile from '@/hooks/useMobile'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const Navbar = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const isMobile = useMobile()
    const [overlay, setOverlay] = useState<{
        show: boolean
        label: string
        href: string
    }>({
        show: false,
        label: '',
        href: '',
    })

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const closeMenu = () => {
        setIsOpen(false)
    }

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

    const triggerOverlay = (label: string, href: string) => {
        setIsOpen(false)

        setOverlay({ show: true, label, href })
        setTimeout(() => {
            setOverlay({ show: false, label: '', href: '' })

            if (href.startsWith('/#')) {
                const id = href.replace('/#', '')
                const target = document.getElementById(id)
                if (target) {
                    target.scrollIntoView({ behavior: 'auto' })
                }
            } else {
                window.location.href = href
            }
        }, 1500)
    }

    return (
        <>
            {!isMobile ? (
                <>
                    <nav className="flex gap-2 items-center">
                        {dataNav.map((item, index) => (
                            <div key={index}>
                                <Link
                                    href={item.href}
                                    className=""
                                    onClick={(e) => {
                                        e.preventDefault()
                                        triggerOverlay(item.label, item.href)
                                    }}
                                >
                                    {item.label}
                                </Link>
                            </div>
                        ))}
                    </nav>
                </>
            ) : (
                <>
                    {isLoggedIn ? (
                        <div className="relative">
                            <button
                                className="flex flex-col w-[2rem] h-[2rem] justify-between p-0 z-50"
                                onClick={toggleMenu}
                                aria-label="Menu"
                            >
                                <span className="relative w-[2rem] h-[0.25rem] rounded-[10px] bg-black" />
                                <span className="relative w-[2rem] h-[0.25rem] rounded-[10px] bg-black" />
                                <span className="relative w-[2rem] h-[0.25rem] rounded-[10px] bg-black" />
                            </button>

                            <div
                                className={`fixed top-0 left-0 w-full h-full z-101 ${isOpen ? 'visible opacity-1' : 'opacity-0 invisible'}`}
                                onClick={closeMenu}
                            />

                            <nav
                                className={`fixed top-0 w-full h-full bg-white z-102 flex flex-col ${isOpen ? 'right-0' : 'right-[-100%]'}`}
                            >
                                <div className="flex justify-between items-center p-1">
                                    <button
                                        className="b-none bg-none p-[.5rem]"
                                        onClick={closeMenu}
                                        aria-label="Fermer le menu"
                                    >
                                        <X />
                                    </button>
                                </div>
                                <div className="flex flex-col p-[2rem,1rem] gap-2">
                                    <Link
                                        href={dataNav[0]?.href}
                                        className="p-[1rem,0]"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            triggerOverlay(
                                                dataNav[0]?.label,
                                                dataNav[0]?.href
                                            )
                                        }}
                                    >
                                        {dataNav[0]?.label}
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => router.push(dataNav[0]?.href)}
                            >
                                {dataNav[0]?.label}
                            </button>
                        </>
                    )}
                </>
            )}

            {/* --- Overlay Animation --- */}
            {overlay.show && (
                <div className="fixed inset-0 bg-red-500 z-999 flex items-center justify-center">
                    <div className="text-white">
                        <img
                            src="/images/HBstudiologo.png"
                            alt="Logo"
                            className=""
                        />
                        <h1 className="">{overlay.label}</h1>
                    </div>
                </div>
            )}
        </>
    )
}
