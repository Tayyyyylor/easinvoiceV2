'use client'
import { type User } from '@supabase/supabase-js'
import { Popup } from '../endAccount/Popup'
import { useState } from 'react'
import { Headband } from '../endAccount/Headband'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

export default function Dashboard({
    user,
    profile,
}: {
    user: User | null
    profile: Profile | null
}) {
    const [showPopup, setShowPopup] = useState(true)
    const router = useRouter()
    const isProfileCompleted = profile?.firstname && profile?.lastname
    console.log('user', user)
    console.log('profile', profile)
    return (
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
            <Button onClick={() => router.push('/create-quote')}>
                Créer un devis
            </Button>
            {showPopup && !isProfileCompleted && (
                <Popup onClose={() => setShowPopup(false)} />
            )}
        </div>
    )
}
