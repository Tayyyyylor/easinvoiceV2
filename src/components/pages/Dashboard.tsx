'use client'
import { Popup } from '../endAccount/Popup'
import { useState, useEffect } from 'react'
import { Headband } from '../endAccount/Headband'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/useAuth'
import { CardInfos } from '../atoms/CardInfos'
import Image from 'next/image'

interface DashboardProps {
    clients: Clients[]
    quotes: Quotes[]
}

export default function Dashboard({ clients, quotes }: DashboardProps) {
    const [showPopup, setShowPopup] = useState(true)
    const { user, profile } = useAuth()
    const router = useRouter()
    const isProfileCompleted = profile?.firstname && profile?.lastname
    const handleClick = () => {
        setShowPopup(true)
    }

    // State pour l'URL du logo avec timestamp (évite les erreurs d'hydratation)
    const [logoUrlWithTimestamp, setLogoUrlWithTimestamp] = useState(
        profile?.logo_url || ''
    )

    // Mettre à jour l'URL avec timestamp uniquement côté client
    useEffect(() => {
        if (profile?.logo_url) {
            setLogoUrlWithTimestamp(`${profile.logo_url}?t=${Date.now()}`)
        } else {
            setLogoUrlWithTimestamp('')
        }
    }, [profile?.logo_url])

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            {!isProfileCompleted && <Headband />}
            {isProfileCompleted && (
                <div>
                    <Button onClick={() => router.push('/quotes/create')}>
                        Créer un devis
                    </Button>
                    <Button onClick={() => router.push('/invoices/create')}>
                        Créer une facture
                    </Button>
                </div>
            )}
            <div className="relative">
                <CardInfos
                    title="Mes infos"
                    content={
                        <div>
                            <p>{user?.email}</p>
                            <p>{profile?.firstname}</p>
                            <p>{profile?.lastname}</p>
                            <p>{profile?.company_name}</p>
                            <p>{profile?.address}</p>
                            {logoUrlWithTimestamp && (
                                <Image
                                    src={logoUrlWithTimestamp}
                                    alt="Logo"
                                    width={100}
                                    height={100}
                                    unoptimized
                                />
                            )}
                        </div>
                    }
                    action={
                        <div>
                            <p>{profile?.city}</p>
                            <p>{profile?.zipcode}</p>
                            <p>{profile?.capital}</p>
                            <p>{profile?.siret}</p>
                        </div>
                    }
                />

                <Button
                    variant="outline"
                    onClick={() => router.push('/finalizeAccount')}
                >
                    Modifier le profil
                </Button>
                <CardInfos
                    title="Mes devis"
                    content={
                        <div>
                            {quotes.map((quote) => (
                                <div key={quote.id}>
                                    <p>{quote.name}</p>
                                </div>
                            ))}
                        </div>
                    }
                    action={
                        <Button
                            onClick={
                                isProfileCompleted
                                    ? () => router.push('/quotes')
                                    : handleClick
                            }
                        >
                            Voir plus
                        </Button>
                    }
                />
                <CardInfos
                    title="Mes factures"
                    content=""
                    action={
                        <Button
                            onClick={
                                isProfileCompleted
                                    ? () => router.push('/invoices')
                                    : handleClick
                            }
                        >
                            Voir plus
                        </Button>
                    }
                />
                <CardInfos
                    title="Mes clients"
                    content={
                        <div>
                            {clients.map((client) => (
                                <div key={client.id}>
                                    {client.firstname !== '' ? (
                                        <p>{client.firstname}</p>
                                    ) : (
                                        <p>{client.company_name}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    }
                    action={
                        <Button
                            onClick={
                                isProfileCompleted
                                    ? () => router.push('/clients')
                                    : handleClick
                            }
                        >
                            Voir plus
                        </Button>
                    }
                />
                {showPopup && !isProfileCompleted && (
                    <Popup onClose={() => setShowPopup(false)} />
                )}
            </div>
        </main>
    )
}
