import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY')
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET')
}

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-09-30.clover',
})

export async function POST(req: Request) {
    const supabase = await createClient()
    const body = await req.text()
    const signature = req.headers.get('stripe-signature') || ''

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        return new Response('Configuration webhook manquante', { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        const err = error as Error
        console.error('Erreur de signature webhook:', err.message)
        return new Response(`Erreur webhook: ${err.message}`, { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session

                if (!session.subscription || !session.customer) {
                    console.error('Session sans subscription ou customer')
                    return new Response('Session invalide', { status: 400 })
                }

                // Récupérer les détails de l'abonnement
                const subscription = await stripe.subscriptions.retrieve(
                    session.subscription as string
                )

                const subscriptionData = {
                    user_id: subscription.metadata.supabase_user_id,
                    stripe_subscription_id: subscription.id,
                    stripe_customer_id:
                        typeof session.customer === 'string'
                            ? session.customer
                            : session.customer.id,
                    status: subscription.status,
                    price_id: subscription.items.data[0]?.price.id,
                    current_period_start: new Date(
                        Number(subscription.created || 0) * 1000
                    ).toISOString(),
                    current_period_end: new Date(
                        Number(subscription.created || 0) * 1000
                    ).toISOString(),
                    cancel_at_period_end:
                        subscription.cancel_at_period_end || false,
                }

                await supabase
                    .from('app_subscriptions')
                    .upsert(subscriptionData, {
                        onConflict: 'stripe_subscription_id',
                    })
                break
            }

            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription

                if (!subscription.metadata.supabase_user_id) {
                    console.error('Subscription sans supabase_user_id')
                    return new Response('Metadata manquante', { status: 400 })
                }

                const subscriptionData = {
                    user_id: subscription.metadata.supabase_user_id,
                    stripe_subscription_id: subscription.id,
                    status: subscription.status,
                    price_id: subscription.items.data[0]?.price.id,
                    current_period_start: new Date(
                        Number(subscription.created || 0) * 1000
                    ).toISOString(),
                    current_period_end: new Date(
                        Number(subscription.created || 0) * 1000
                    ).toISOString(),
                    cancel_at_period_end:
                        subscription.cancel_at_period_end || false,
                }

                await supabase
                    .from('app_subscriptions')
                    .upsert(subscriptionData, {
                        onConflict: 'stripe_subscription_id',
                    })
                break
            }

            default:
                console.log('Événement Stripe non géré:', event.type)
        }

        return new Response('OK', { status: 200 })
    } catch (err) {
        console.error('Erreur handler webhook:', err)
        return new Response('Erreur serveur', { status: 500 })
    }
}
