'use client'
import { type User } from '@supabase/supabase-js'

export default function Dashboard({ user }: { user: User | null }) {
    return (
        <div className="form-widget">
            <div>
                <label htmlFor="email">Email</label>
                <p>{user?.email}</p>
            </div>
            <div>
                <form action="/auth/signout" method="post">
                    <button className="button block" type="submit">
                        Sign out
                    </button>
                </form>
            </div>
        </div>
    )
}
