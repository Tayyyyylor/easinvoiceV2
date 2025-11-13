import React from 'react'
import { HeroBanner } from '../landingPage/HeroBanner'
import { ProblemsSection } from '../landingPage/ProblemsSection'
import { FAQSection } from '../landingPage/FAQSection'
import { Footer } from '../landingPage/Footer'

export const LandingPage = () => {
    return (
        <main className="flex flex-col items-center justify-center overflow-x-hidden">
            <HeroBanner />
            <ProblemsSection />
            <FAQSection />
            <Footer />
        </main>
    )
}
