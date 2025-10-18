import { useSubscription } from '@/hooks/useSubscription'
import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
    fallback?: React.ReactNode
}

export function SubscriptionGate({ children, fallback }: Props) {
    const { isSubscribed, isLoading } = useSubscription()

    if (isLoading) {
        return <div>Chargement...</div>
    }

    if (!isSubscribed) {
        return (
            fallback || (
                <div className="p-4 text-center">
                    <h2 className="text-lg font-semibold">Accès restreint</h2>
                    <p className="text-muted-foreground">
                        Cette fonctionnalité nécessite un abonnement actif.
                    </p>
                </div>
            )
        )
    }

    return <>{children}</>
}
