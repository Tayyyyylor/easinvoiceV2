'use client'
import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
    question: string
    answer: string
}

export const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs: FAQItem[] = [
        {
            question: 'Comment fonctionne EasInvoice ?',
            answer: "EasInvoice est une plateforme intuitive qui vous permet de créer, gérer et envoyer des devis et factures professionnels en quelques clics. Il suffit de créer un compte, d'ajouter vos clients et de commencer à générer vos documents. Tous vos calculs sont automatiques et vos documents sont conformes aux normes légales.",
        },
        {
            question: 'Puis-je personnaliser mes factures et devis ?',
            answer: "Absolument ! Vous pouvez personnaliser vos documents avec votre logo, vos couleurs, et vos informations d'entreprise. Nos templates professionnels s'adaptent automatiquement à votre identité visuelle tout en restant conformes aux exigences légales.",
        },
        {
            question: 'Mes données sont-elles sécurisées ?',
            answer: "La sécurité est notre priorité. Toutes vos données sont cryptées et stockées de manière sécurisée. Nous utilisons les meilleurs standards de l'industrie pour protéger vos informations et celles de vos clients. Vos données vous appartiennent et ne seront jamais partagées.",
        },
        {
            question: 'Combien coûte EasInvoice ?',
            answer: 'Nous proposons un essai gratuit de 14 jours sans carte bancaire. Ensuite, nos plans commencent à partir de 9,99€/mois. Vous pouvez annuler à tout moment, sans engagement. Consultez notre page tarifs pour découvrir toutes les options disponibles.',
        },
        {
            question: 'Puis-je exporter mes factures en PDF ?',
            answer: "Oui ! Toutes vos factures et devis peuvent être exportés en PDF de haute qualité en un seul clic. Vous pouvez ensuite les télécharger, les imprimer ou les envoyer directement par email à vos clients depuis l'application.",
        },
        {
            question:
                'Y a-t-il une limite au nombre de factures que je peux créer ?',
            answer: 'Avec nos plans payants, vous pouvez créer un nombre illimité de factures et de devis. Pas de restrictions, pas de frais cachés. Facturez autant que vous le souhaitez et développez votre activité sans contraintes.',
        },
        {
            question: 'Comment gérer mes clients ?',
            answer: 'EasInvoice inclut un système de gestion de clients intégré. Enregistrez les informations de vos clients une seule fois et retrouvez-les instantanément lors de la création de nouveaux documents. Gardez un historique complet de toutes vos transactions par client.',
        },
        {
            question: 'Puis-je utiliser EasInvoice sur mobile ?',
            answer: 'Oui ! EasInvoice est entièrement responsive et fonctionne parfaitement sur tous les appareils : ordinateur, tablette et smartphone. Créez et gérez vos factures où que vous soyez, à tout moment.',
        },
        {
            question: "Que se passe-t-il si j'annule mon abonnement ?",
            answer: "Vous pouvez annuler votre abonnement à tout moment sans frais supplémentaires. Vos données restent accessibles jusqu'à la fin de votre période d'abonnement. Si vous souhaitez conserver vos données, nous vous recommandons de les exporter avant l'expiration.",
        },
        {
            question: 'Proposez-vous un support client ?',
            answer: 'Bien sûr ! Notre équipe de support est disponible pour répondre à toutes vos questions. Contactez-nous par email et nous vous répondrons dans les plus brefs délais. Nous proposons également une documentation complète et des tutoriels pour vous aider.',
        },
    ]

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <section className="w-full py-20 px-4 bg-white" id="faq">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                        FAQ
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Questions fréquentes
                    </h2>
                    <p className="text-xl text-gray-600">
                        Tout ce que vous devez savoir sur EasInvoice
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-semibold text-gray-900 pr-4">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-6 h-6 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                                        openIndex === index ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                    openIndex === index ? 'max-h-96' : 'max-h-0'
                                }`}
                            >
                                <div className="px-6 pb-5 pt-2 text-gray-600 leading-relaxed bg-gray-50">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-16 text-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Vous avez d&apos;autres questions ?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Notre équipe est là pour vous aider. N&apos;hésitez pas
                        à nous contacter !
                    </p>
                    <button
                        onClick={() =>
                            (window.location.href =
                                'mailto:taylordevcontact@gmail.com')
                        }
                        className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer"
                    >
                        Contactez-nous
                    </button>
                </div>
            </div>
        </section>
    )
}
