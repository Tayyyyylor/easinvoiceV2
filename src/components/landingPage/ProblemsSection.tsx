'use client'
import React from 'react'
import { FileX, Clock, AlertCircle, CheckCircle } from 'lucide-react'

export const ProblemsSection = () => {
    const problems = [
        {
            icon: <Clock className="w-6 h-6" />,
            title: 'Trop de temps perdu',
            description:
                'Créer des factures manuellement sur Word ou Excel prend des heures précieuses',
        },
        {
            icon: <FileX className="w-6 h-6" />,
            title: 'Documents non professionnels',
            description:
                'Des factures qui manquent de cohérence et de professionnalisme',
        },
        {
            icon: <AlertCircle className="w-6 h-6" />,
            title: 'Erreurs fréquentes',
            description:
                'Calculs incorrects, numérotation manuelle, informations manquantes',
        },
    ]

    const solutions = [
        {
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            title: 'Génération instantanée',
            description:
                'Créez des devis et factures professionnels en quelques clics',
        },
        {
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            title: 'Design professionnel',
            description:
                'Templates élégants et personnalisables pour impressionner vos clients',
        },
        {
            icon: <CheckCircle className="w-6 h-6 text-green-500" />,
            title: 'Zéro erreur',
            description:
                'Calculs automatiques, numérotation intelligente, conformité garantie',
        },
    ]

    return (
        <section className="w-full py-20 px-4 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Arrêtez de perdre du temps avec vos factures
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        La facturation ne devrait pas être un casse-tête.
                        Découvrez comment nous simplifions votre quotidien.
                    </p>
                </div>

                {/* Problems Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold mb-4">
                            LES PROBLÈMES
                        </span>
                        <h3 className="text-3xl font-bold text-gray-900">
                            Ce que vous vivez actuellement
                        </h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {problems.map((problem, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                            >
                                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 text-red-600">
                                    {problem.icon}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">
                                    {problem.title}
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    {problem.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider with Arrow */}
                <div className="flex justify-center mb-20">
                    <div className="flex flex-col items-center">
                        <div className="w-1 h-16 bg-gradient-to-b from-red-300 to-green-300"></div>
                        <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-green-400 rounded-full flex items-center justify-center text-white shadow-lg">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Solutions Section */}
                <div>
                    <div className="text-center mb-12">
                        <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                            LA SOLUTION
                        </span>
                        <h3 className="text-3xl font-bold text-gray-900">
                            Avec EasInvoice, tout devient simple
                        </h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {solutions.map((solution, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow hover:border-green-300"
                            >
                                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                                    {solution.icon}
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-3">
                                    {solution.title}
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                    {solution.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
