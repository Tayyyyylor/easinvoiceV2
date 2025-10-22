'use client'
import { Popup } from '../endAccount/Popup'
import { useState } from 'react'
import { Headband } from '../endAccount/Headband'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/useAuth'
import { DashboardCard } from '../dashboard/DashboardCard'
import { useSubscription } from '@/hooks/useSubscription'
import { Button } from '../ui/button'

interface DashboardProps {
    clients: Clients[]
    quotes: Quotes[]
    invoices: Invoices[]
}

export default function Dashboard({
    clients,
    quotes,
    invoices,
}: DashboardProps) {
    const [showPopup, setShowPopup] = useState(true)
    const { isSubscribed } = useSubscription()
    const { profile } = useAuth()
    const router = useRouter()
    const isProfileCompleted = profile?.firstname && profile?.lastname
    const handleClick = () => {
        setShowPopup(true)
    }

    return (
        <main className="flex flex-col items-center justify-center h-screen p-5">
            {!isProfileCompleted && <Headband />}
            {!isSubscribed && (
                <Button onClick={() => router.push('/billing')}>
                    Passez Premium !
                </Button>
            )}
            <div className="relative flex flex-row items-center justify-center gap-8 w-full">
                <DashboardCard
                    title="Mes devis"
                    buttonLabel="Créer un devis"
                    onClick={
                        isProfileCompleted
                            ? () => router.push('/quotes/create')
                            : handleClick
                    }
                    onClickMore={
                        isProfileCompleted
                            ? () => router.push('/quotes')
                            : handleClick
                    }
                    data={quotes}
                />
                <DashboardCard
                    title="Mes factures"
                    buttonLabel="Créer une facture"
                    onClick={
                        isProfileCompleted
                            ? () => router.push('/invoices/create')
                            : handleClick
                    }
                    onClickMore={
                        isProfileCompleted
                            ? () => router.push('/invoices')
                            : handleClick
                    }
                    data={invoices}
                />
                <DashboardCard
                    title="Mes clients"
                    buttonLabel="Créer un client"
                    onClick={
                        isProfileCompleted
                            ? () => router.push('/clients/create')
                            : handleClick
                    }
                    onClickMore={
                        isProfileCompleted
                            ? () => router.push('/clients')
                            : handleClick
                    }
                    data={clients}
                />
                {showPopup && !isProfileCompleted && (
                    <Popup onClose={() => setShowPopup(false)} />
                )}
            </div>
        </main>
    )
}
