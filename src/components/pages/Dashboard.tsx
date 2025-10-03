/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Popup } from '../endAccount/Popup'
import { useState } from 'react'
import { Headband } from '../endAccount/Headband'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/useAuth'
import { CardInfos } from '../atoms/CardInfos'

interface DashboardProps {
    clients: any[]
}


export default function Dashboard({ clients }: DashboardProps) {
    const [showPopup, setShowPopup] = useState(true)
    const { user, profile } = useAuth()
    const router = useRouter()
    const isProfileCompleted = profile?.firstname && profile?.lastname
    const handleClick = () => {
       
            setShowPopup(true)
      
    }

    console.log('clients', clients)

    return (
        <main className="flex flex-col items-center justify-center h-screen">
                {!isProfileCompleted && <Headband />}
            <div className="relative">
                <CardInfos title="Mes infos" content={<div>
                    <p>{user?.email}</p>
                    <p>{profile?.firstname}</p>
                    <p>{profile?.lastname}</p>
                    <p>{profile?.company_name}</p>
                    <p>{profile?.address}</p>
                </div>} action={<div>
                    <p>{profile?.city}</p>
                    <p>{profile?.zipcode}</p>
                    <p>{profile?.capital}</p>
                    <p>{profile?.siret}</p>
                </div>} />
               
                
                <CardInfos title="Mes devis" content='' action={
                <Button onClick={isProfileCompleted ? () => router.push('/quotes') : handleClick}>
                     Voir plus
                </Button>
                } />
                <CardInfos title="Mes factures" content='' action={
                <Button onClick={isProfileCompleted ? () => router.push('/invoices') : handleClick}>
                    Voir plus
                </Button>
                } />
                <CardInfos title="Mes clients" content={<div>
                    {clients.map((client) => (
                        <div key={client.id}>
                            {
                                client.firstname !== ''? (
                                    <p>{client.firstname}</p>
                                ) : (
                                    <p>{client.company_name}</p>
                                )
                            }
                        </div>
                    ))}
                </div>} action={
                <Button onClick={isProfileCompleted ? () => router.push('/clients') : handleClick}>
                    Voir plus
                </Button>
                } />
                {showPopup && !isProfileCompleted && (
                    <Popup onClose={() => setShowPopup(false)} />
                )}
                <div>
                    <form action="/auth/signout" method="post">
                        <button className="button block" type="submit">
                            Sign out
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}
