'use client'
import React from 'react'
import PricingOptions from '../subscription/PricingOptions'
import { useAuth } from '@/contexts/useAuth'

export const Billing = () => {
    const { user } = useAuth()
    return (
        <main>
            <PricingOptions userId={user?.id} />
        </main>
    )
}
