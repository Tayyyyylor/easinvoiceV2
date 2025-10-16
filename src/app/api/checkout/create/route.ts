import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('Missing NEXT_PUBLIC_APP_URL environment variable')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-09-30.clover',
})

export async function POST(req: Request) {
    const supabase = await createClient()
    try {
        const { priceId, supabaseUserId } = await req.json()

        if (!priceId) {
            return NextResponse.json(
                { error: 'Le priceId est requis' },
                { status: 400 }
            )
        }

        if (!supabaseUserId) {
            return NextResponse.json(
                { error: "L'identifiant utilisateur est requis" },
                { status: 400 }
            )
        }

        // 1) Récupérer le customer existant
        const { data: customer, error: customerError } = await supabase
            .from('customers')
            .select('customer_id')
            .eq('user_id', supabaseUserId)
            .single()

        if (customerError && customerError.code !== 'PGRST116') {
            console.error(
                'Erreur lors de la récupération du customer:',
                customerError
            )
            return NextResponse.json(
                {
                    error: 'Erreur lors de la récupération des informations client',
                },
                { status: 500 }
            )
        }

        let stripeCustomerId = customer?.customer_id

        // 2) Créer un nouveau customer si nécessaire
        if (!stripeCustomerId) {
            try {
                const stripeCustomer = await stripe.customers.create({
                    metadata: { supabase_user_id: supabaseUserId },
                })
                stripeCustomerId = stripeCustomer.id

                const { error: insertError } = await supabase
                    .from('customers')
                    .upsert({
                        user_id: supabaseUserId,
                        customer_id: stripeCustomerId,
                    })

                if (insertError) {
                    console.error(
                        'Erreur lors de la création du customer:',
                        insertError
                    )
                    return NextResponse.json(
                        {
                            error: 'Erreur lors de la création du profil client',
                        },
                        { status: 500 }
                    )
                }
            } catch (stripeError) {
                console.error('Erreur Stripe:', stripeError)
                return NextResponse.json(
                    { error: 'Erreur lors de la création du profil Stripe' },
                    { status: 500 }
                )
            }
        }

        // 3) Créer la session Checkout
        try {
            const session = await stripe.checkout.sessions.create({
                mode: 'subscription',
                payment_method_types: ['card'],
                line_items: [{ price: priceId, quantity: 1 }],
                customer: stripeCustomerId,
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
                subscription_data: {
                    metadata: { supabase_user_id: supabaseUserId },
                },
            })

            return NextResponse.json({ url: session.url })
        } catch (stripeError) {
            console.error(
                'Erreur lors de la création de la session:',
                stripeError
            )
            return NextResponse.json(
                {
                    error: 'Erreur lors de la création de la session de paiement',
                },
                { status: 500 }
            )
        }
    } catch (err) {
        console.error('Erreur générale:', err)
        return NextResponse.json(
            { error: "Une erreur inattendue s'est produite" },
            { status: 500 }
        )
    }
}
