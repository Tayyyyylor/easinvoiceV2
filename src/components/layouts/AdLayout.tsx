import type { ReactNode } from 'react'

export const AdLayout = ({ children }: { children: ReactNode }) => (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
        </div>
    </main>
)
