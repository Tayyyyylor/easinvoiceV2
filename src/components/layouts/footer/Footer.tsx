'use client'
import React from 'react'
import Image from 'next/image'
import {
    Mail,
    Twitter,
    Linkedin,
    Facebook,
    Instagram,
    Heart,
} from 'lucide-react'

export const Footer = () => {
    const currentYear = new Date().getFullYear()

    const footerLinks = {
        product: [
            { label: 'Fonctionnalités', href: '#features' },
            { label: 'Tarifs', href: '#pricing' },
            { label: 'Démo', href: '#demo' },
            { label: 'Témoignages', href: '#testimonials' },
        ],
        resources: [
            { label: 'Documentation', href: '#docs' },
            { label: 'Guide de démarrage', href: '#guide' },
            { label: 'Blog', href: '#blog' },
            { label: 'FAQ', href: '#faq' },
        ],
        company: [
            { label: 'À propos', href: '#about' },
            { label: 'Contact', href: '#contact' },
            { label: 'Carrières', href: '#careers' },
            { label: 'Presse', href: '#press' },
        ],
        legal: [
            { label: 'Mentions légales', href: '#legal' },
            { label: 'Politique de confidentialité', href: '#privacy' },
            { label: "Conditions d'utilisation", href: '#terms' },
            { label: 'Cookies', href: '#cookies' },
        ],
    }

    const socialLinks = [
        {
            icon: <Twitter className="w-5 h-5" />,
            href: '#twitter',
            label: 'Twitter',
        },
        {
            icon: <Linkedin className="w-5 h-5" />,
            href: '#linkedin',
            label: 'LinkedIn',
        },
        {
            icon: <Facebook className="w-5 h-5" />,
            href: '#facebook',
            label: 'Facebook',
        },
        {
            icon: <Instagram className="w-5 h-5" />,
            href: '#instagram',
            label: 'Instagram',
        },
    ]

    return (
        <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
            {/* Newsletter Section */}
            <div className="border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">
                                Restez informé des nouveautés
                            </h3>
                            <p className="text-gray-400">
                                Recevez nos dernières actualités, conseils et
                                offres exclusives
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    placeholder="Votre adresse email"
                                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg">
                                S&apos;abonner
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
                    {/* Logo and Description */}
                    <div className="col-span-2">
                        <div className="mb-4">
                            <Image
                                src="/logo_black.png"
                                alt="EasInvoice Logo"
                                width={150}
                                height={45}
                                className="h-10 w-auto brightness-0 invert"
                            />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                            La solution de facturation simple et professionnelle
                            pour les entrepreneurs, freelances et petites
                            entreprises.
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-600 transition-all transform hover:scale-110"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">
                            Produit
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">
                            Ressources
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">
                            Entreprise
                        </h4>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Légal</h4>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            © {currentYear} EasInvoice. Tous droits réservés.
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                            <span>Fait avec</span>
                            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                            <span>en France</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                            <a
                                href="#status"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Statut du service
                            </a>
                            <a
                                href="#support"
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
