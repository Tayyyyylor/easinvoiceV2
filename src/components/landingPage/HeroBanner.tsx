'use client'
import Image from 'next/image'
import React from 'react'
import { FileText, Zap, CheckCircle, ArrowRight } from 'lucide-react'

export const HeroBanner = () => {
    return (
        <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
                    {/* Left Column - Content */}
                    <div className="text-center lg:text-left z-10">
                        {/* Logo */}
                        <div className="flex justify-center lg:justify-start mb-8">
                            <div className="relative">
                                <Image
                                    src="/logo_black.png"
                                    alt="EasInvoice Logo"
                                    width={200}
                                    height={60}
                                    className="h-12 w-auto"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Badge */}
                        <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
                            <Zap className="w-4 h-4 text-blue-600 mr-2" />
                            <span className="text-sm font-semibold text-blue-700">
                                Facturation simplifiée en quelques clics
                            </span>
                        </div>

                        {/* Main Title */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Créez vos{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                factures
                            </span>{' '}
                            et{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                devis
                            </span>{' '}
                            en un éclair
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            La solution professionnelle pour gérer vos documents
                            de facturation. Simple, rapide et conforme.
                        </p>

                        {/* Features List */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center lg:justify-start">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-gray-700">
                                    Aucune installation
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-gray-700">
                                    Essai gratuit 14 jours
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-gray-700">
                                    Sans engagement
                                </span>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
                                Commencer gratuitement
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg border-2 border-gray-200 hover:border-blue-300 transition-all">
                                Voir la démo
                            </button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-10 pt-8 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-4">
                                Rejoint par plus de 1000+ entrepreneurs
                            </p>
                            <div className="flex items-center justify-center lg:justify-start gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                                        >
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <span className="text-yellow-500 text-lg ml-2">
                                    ★★★★★
                                </span>
                                <span className="text-gray-600 text-sm ml-1">
                                    4.9/5
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Visual/Mockup */}
                    <div className="relative z-10 lg:block">
                        <div className="relative">
                            {/* Main Card - Invoice Preview */}
                            <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                                <div className="space-y-6">
                                    {/* Header */}
                                    <div className="flex items-center justify-between pb-4 border-b">
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-8 h-8 text-blue-600" />
                                            <div>
                                                <div className="text-sm text-gray-500">
                                                    Facture
                                                </div>
                                                <div className="font-bold text-xl text-gray-900">
                                                    #INV-2024-001
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                            Payée
                                        </div>
                                    </div>

                                    {/* Client Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs text-gray-500 mb-1">
                                                Client
                                            </div>
                                            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4"></div>
                                            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-1/2 mt-2"></div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 mb-1">
                                                Date
                                            </div>
                                            <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-2/3 ml-auto"></div>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="flex justify-between items-center py-2 border-b border-gray-100"
                                            >
                                                <div className="flex-1">
                                                    <div
                                                        className={`h-3 bg-gradient-to-r from-blue-${100 + i * 50} to-indigo-${100 + i * 50} rounded w-${3 + i}/4 mb-2`}
                                                    ></div>
                                                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                                                </div>
                                                <div className="h-4 bg-gradient-to-r from-green-200 to-green-100 rounded w-20"></div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Total */}
                                    <div className="pt-4 border-t-2 border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-gray-900">
                                                Total
                                            </span>
                                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                                1 234,56 €
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Quote Card */}
                            <div className="absolute -top-8 -right-8 bg-white rounded-xl shadow-xl p-4 w-48 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="text-xs font-semibold text-gray-700">
                                        Devis
                                    </div>
                                </div>
                                <div className="h-2 bg-gray-100 rounded w-full mb-2"></div>
                                <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                            </div>

                            {/* Floating Stats */}
                            <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-xl p-4 w-40 text-white transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                                <div className="text-3xl font-bold">+ 50%</div>
                                <div className="text-sm opacity-90">
                                    Gain de temps
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom animations */}
            <style jsx>{`
                @keyframes blob {
                    0%,
                    100% {
                        transform: translate(0, 0) scale(1);
                    }
                    25% {
                        transform: translate(20px, -50px) scale(1.1);
                    }
                    50% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    75% {
                        transform: translate(50px, 50px) scale(1.05);
                    }
                }
                .animate-blob {
                    animation: blob 20s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </section>
    )
}
