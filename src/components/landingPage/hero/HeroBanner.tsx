'use client'
import useMobile from '@/hooks/useMobile'
import Image from 'next/image'
import React from 'react'

export const HeroBanner = () => {
    const isMobile = useMobile()
    return (
        <section className="w-full h-full">
            <Image
                src={isMobile ? '/hero-mobile.png' : '/hero.png'}
                alt="Hero Banner"
                width={1000}
                height={1000}
                className="w-full h-full object-cover"
            />
        </section>
    )
}
