'use client'
import { type User } from '@supabase/supabase-js'
import { Popup } from '../endAccount/Popup'
import { useState } from 'react'
import { Headband } from '../endAccount/Headband'

export default function Dashboard({
    user,
    profile,
}: {
    user: User | null
    profile: Profile | null
}) {
    const [showPopup, setShowPopup] = useState(true)
    console.log('user', user)
    console.log('profile', profile)
    return (
        <div className="relative">
            <div>
                <label htmlFor="email">Email</label>
                <p>{user?.email}</p>
            </div>
            <Headband />
            <div>
                <form action="/auth/signout" method="post">
                    <button className="button block" type="submit">
                        Sign out
                    </button>
                </form>
            </div>
            {showPopup && <Popup onClose={() => setShowPopup(false)} />}
        </div>
    )
}
