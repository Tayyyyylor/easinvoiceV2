'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export function useSubscription() {
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const checkSubscription = async () => {
            try {
                setError(null)
                const {
                    data: { session },
                    error: sessionError,
                } = await supabase.auth.getSession()

                if (sessionError) {
                    throw new Error("Erreur d'authentification")
                }

                if (!session?.user) {
                    setIsSubscribed(false)
                    return
                }
                console.log('test session', session)
                const user = session.user
                console.log('test user', user)

                // D'abord, vérifions tous les abonnements de l'utilisateur
                const { data: allSubscriptions, error: subError } =
                    await supabase
                        .from('app_subscriptions')
                        .select('*')
                        .eq('user_id', user.id)

                console.log(
                    'test Tous les abonnements trouvés:',
                    allSubscriptions
                )

                if (subError) {
                    console.error('test Erreur Supabase:', subError)
                    throw new Error(
                        "Erreur lors de la vérification de l'abonnement"
                    )
                }

                if (!allSubscriptions || allSubscriptions.length === 0) {
                    console.log('test Aucun abonnement trouvé')
                    setIsSubscribed(false)
                    return
                }

                // Trier les abonnements par date de création décroissante
                const sortedSubscriptions = allSubscriptions.sort((a, b) => {
                    return (
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                    )
                })

                // Prendre le plus récent
                const latestSubscription = sortedSubscriptions[0]
                console.log('test Dernier abonnement:', latestSubscription)

                // Liste des statuts valides selon Stripe
                const validStatuses = ['active', 'trialing']
                const isActive = validStatuses.includes(
                    latestSubscription.status
                )

                console.log("test Statut de l'abonnement:", {
                    status: latestSubscription.status,
                    isActive,
                })

                setIsSubscribed(isActive)
            } catch (err) {
                console.error('test Erreur dans useSubscription:', err)
                setError(err instanceof Error ? err.message : 'Erreur inconnue')
                setIsSubscribed(false)
            } finally {
                setIsLoading(false)
            }
        }

        // Vérifier immédiatement
        checkSubscription()

        // Mettre en place un listener pour les changements de la table app_subscriptions
        const channel = supabase
            .channel('subscription_updates')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'app_subscriptions',
                },
                () => {
                    checkSubscription()
                }
            )
            .subscribe()

        // Cleanup
        return () => {
            channel.unsubscribe()
        }
    }, [])

    return {
        isLoading,
        isSubscribed,
        error,
    }
}
