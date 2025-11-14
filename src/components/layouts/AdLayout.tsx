'use client'
import React from 'react'

interface AdLayoutProps {
    children: React.ReactNode
}

export const AdLayout = ({ children }: AdLayoutProps) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-[1800px] mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
                    {/* Publicité gauche - visible uniquement en desktop */}
                    <aside className="hidden lg:block lg:col-span-2">
                        <div className="sticky top-6">
                            <div className="bg-white rounded-xl shadow-md p-4 min-h-[600px] flex items-center justify-center border-2 border-dashed border-gray-300">
                                <div className="text-center text-gray-400">
                                    <svg
                                        className="w-12 h-12 mx-auto mb-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="text-sm font-medium">
                                        Espace publicitaire
                                    </p>
                                    <p className="text-xs">160x600</p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Contenu principal */}
                    <main className="lg:col-span-8">{children}</main>

                    {/* Publicité droite - visible uniquement en desktop */}
                    <aside className="hidden lg:block lg:col-span-2">
                        <div className="sticky top-6">
                            <div className="bg-white rounded-xl shadow-md p-4 min-h-[600px] flex items-center justify-center border-2 border-dashed border-gray-300">
                                <div className="text-center text-gray-400">
                                    <svg
                                        className="w-12 h-12 mx-auto mb-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="text-sm font-medium">
                                        Espace publicitaire
                                    </p>
                                    <p className="text-xs">160x600</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
