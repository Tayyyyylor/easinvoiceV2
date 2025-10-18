import { stripe } from '@/lib/stripe'
import { webhookClient } from '@/utils/supabase/webhook'
import Stripe from 'stripe'
import { headers } from 'next/headers'

interface StripeSubscription extends Stripe.Subscription {
    current_period_start: number
    current_period_end: number
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET')
}

// Configuration importante pour les webhooks
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Route GET pour tester que le webhook est accessible
export async function GET() {
    console.log('✅ GET request reçu sur /api/webhook')
    return new Response('Webhook endpoint is working!', { status: 200 })
}

export async function POST(request: Request) {
    // ⚠️ CE LOG DOIT S'AFFICHER QUOI QU'IL ARRIVE

    console.log('🔔 ========== WEBHOOK POST REÇU ==========')

    const supabase = webhookClient

    let body: string
    let signature: string

    try {
        // Lire le body brut
        body = await request.text()

        // Récupérer la signature
        const headersList = await headers()
        signature = headersList.get('stripe-signature') || ''

        console.log(
            'Webhook secret présent:',
            !!process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        console.error('Erreur lecture body:', error)
        return new Response('Erreur lecture body', { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error) {
        const err = error as Error
        console.error('Erreur de signature:', err.message)
        return new Response(`Erreur webhook: ${err.message}`, { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                console.log(' Session complétée:', {
                    sessionId: session.id,
                    subscription: session.subscription,
                    customer: session.customer,
                    mode: session.mode,
                })

                // Vérifier que c'est bien un abonnement
                if (session.mode !== 'subscription') {
                    console.log('Session pas en mode subscription, ignoré')
                    return new Response('OK - Not a subscription', {
                        status: 200,
                    })
                }

                if (!session.subscription || !session.customer) {
                    console.error(' Session sans subscription ou customer')
                    return new Response('Session invalide', { status: 400 })
                }

                // IMPORTANT : Attendre un peu que Stripe finalise l'abonnement
                await new Promise((resolve) => setTimeout(resolve, 2000))

                // Récupérer l'abonnement complet
                const subscription = (await stripe.subscriptions.retrieve(
                    session.subscription as string
                )) as unknown as StripeSubscription

                console.log('📦 Subscription récupérée:', {
                    id: subscription.id,
                    status: subscription.status,
                    metadata: subscription.metadata,
                })

                const supabaseUserId = subscription.metadata?.supabase_user_id
                if (!supabaseUserId) {
                    console.error('❌ Pas de supabase_user_id dans metadata')
                    return new Response('Metadata manquante', { status: 400 })
                }

                // Log des timestamps pour debug
                console.log('🕒 Timestamps reçus:', {
                    start: subscription.current_period_start,
                    end: subscription.current_period_end,
                })

                const subscriptionData = {
                    user_id: supabaseUserId,
                    stripe_subscription_id: subscription.id,
                    stripe_customer_id:
                        typeof session.customer === 'string'
                            ? session.customer
                            : session.customer.id,
                    status: subscription.status,
                    price_id: subscription.items.data[0]?.price.id,
                    current_period_start: subscription.current_period_start
                        ? new Date(
                              subscription.current_period_start * 1000
                          ).toISOString()
                        : null,
                    current_period_end: subscription.current_period_end
                        ? new Date(
                              subscription.current_period_end * 1000
                          ).toISOString()
                        : null,
                }

                const { error: upsertError } = await supabase
                    .from('app_subscriptions')
                    .upsert(subscriptionData, {
                        onConflict: 'stripe_subscription_id',
                    })

                if (upsertError) {
                    console.error('❌ Erreur Supabase:', upsertError)
                    return new Response(`Erreur DB: ${upsertError.message}`, {
                        status: 500,
                    })
                }

                break
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as StripeSubscription

                const supabaseUserId = subscription.metadata?.supabase_user_id
                if (!supabaseUserId) {
                    console.error('Pas de supabase_user_id dans metadata')
                    return new Response('Metadata manquante', { status: 400 })
                }

                const subscriptionData = {
                    user_id: supabaseUserId,
                    stripe_subscription_id: subscription.id,
                    stripe_customer_id:
                        typeof subscription.customer === 'string'
                            ? subscription.customer
                            : subscription.customer.id,
                    status: subscription.status,
                    price_id: subscription.items.data[0]?.price.id,
                    current_period_start: subscription.current_period_start
                        ? new Date(
                              subscription.current_period_start * 1000
                          ).toISOString()
                        : null,
                    current_period_end: subscription.current_period_end
                        ? new Date(
                              subscription.current_period_end * 1000
                          ).toISOString()
                        : null,
                }

                const { error: upsertError } = await supabase
                    .from('app_subscriptions')
                    .upsert(subscriptionData, {
                        onConflict: 'stripe_subscription_id',
                    })

                if (upsertError) {
                    return new Response(`Erreur DB: ${upsertError.message}`, {
                        status: 500,
                    })
                }

                break
            }

            default:
        }

        return new Response('OK', { status: 200 })
    } catch (err) {
        return new Response(
            `Erreur: ${err instanceof Error ? err.message : 'Inconnue'}`,
            { status: 500 }
        )
    }
}
