'use client'
import { Popup } from '../endAccount/Popup'
import { useState } from 'react'
import { Headband } from '../endAccount/Headband'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/useAuth'

export default function Dashboard() {
    const [showPopup, setShowPopup] = useState(true)
    const { user, profile } = useAuth()
    const router = useRouter()
    const isProfileCompleted = profile?.firstname && profile?.lastname

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <div className="relative">
                <div>
                    <p>{user?.email}</p>
                    <p>{profile?.firstname}</p>
                    <p>{profile?.lastname}</p>
                    <p>{profile?.company_name}</p>
                    <p>{profile?.address}</p>
                    <p>{profile?.city}</p>
                    <p>{profile?.zipcode}</p>
                    <p>{profile?.capital}</p>
                    <p>{profile?.siret}</p>
                </div>
                {!isProfileCompleted && <Headband />}
                <div>
                    <form action="/auth/signout" method="post">
                        <button className="button block" type="submit">
                            Sign out
                        </button>
                    </form>
                </div>
                <Button onClick={() => router.push('/quotes')}>
                    Créer un devis
                </Button>
                <Button onClick={() => router.push('/clients')}>
                    Créer un client
                </Button>
                {showPopup && !isProfileCompleted && (
                    <Popup onClose={() => setShowPopup(false)} />
                )}
            </div>
        </main>
    )
}
