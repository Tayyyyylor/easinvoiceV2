'use client'
import { useSubscription } from '@/hooks/useSubscription'

export default function SuccessPayment() {
    const { isSubscribed, isLoading } = useSubscription()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <div className="max-w-md w-full p-8 space-y-4 text-center">
                <h2 className="text-2xl font-bold text-foreground">
                    Paiement réussi !
                </h2>
                <p className="text-muted-foreground">
                    {isLoading
                        ? 'Vérification de votre abonnement...'
                        : isSubscribed
                          ? 'Votre abonnement est maintenant actif.'
                          : 'Votre abonnement sera bientôt actif.'}
                </p>
            </div>
        </div>
    )
}
