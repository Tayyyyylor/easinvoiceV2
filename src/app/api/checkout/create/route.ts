import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

if (!process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('Missing NEXT_PUBLIC_APP_URL environment variable')
}

export async function POST(req: Request) {
    const supabase = await createClient()
    try {
        const { priceId, supabaseUserId } = await req.json()

        const validPriceIds = [
            process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY,
            process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY,
        ]

        if (!priceId || !validPriceIds.includes(priceId)) {
            return NextResponse.json(
                { error: 'Prix invalide' },
                { status: 400 }
            )
        }

        if (!supabaseUserId) {
            return NextResponse.json(
                { error: "L'identifiant utilisateur est requis" },
                { status: 400 }
            )
        }

        // Vérifier si l'utilisateur a déjà un abonnement actif
        const { data: subscriptions, error: subError } = await supabase
            .from('app_subscriptions')
            .select('status')
            .eq('user_id', supabaseUserId)
            .eq('status', 'active')

        if (subError) {
            console.error(
                "Erreur lors de la vérification de l'abonnement:",
                subError
            )
            return NextResponse.json(
                { error: "Erreur lors de la vérification de l'abonnement" },
                { status: 500 }
            )
        }

        if (subscriptions && subscriptions.length > 0) {
            return NextResponse.json(
                { error: 'Vous avez déjà un abonnement actif' },
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
        // ⚠️ IMPORTANT: En mode TEST, ignorer les customer_id de PRODUCTION
        const isTestMode = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')
        if (
            isTestMode &&
            stripeCustomerId &&
            !stripeCustomerId.startsWith('cus_test_')
        ) {
            console.warn(
                "⚠️ Customer de production détecté en mode test, création d'un nouveau customer de test"
            )
            stripeCustomerId = undefined
        }

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
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
                subscription_data: {
                    metadata: { supabase_user_id: supabaseUserId },
                },
            })

            return NextResponse.json({ url: session.url })
        } catch (stripeError) {
            console.error(
                '❌ Erreur lors de la création de la session:',
                stripeError
            )
            // Afficher le message d'erreur complet de Stripe
            const errorMessage =
                stripeError instanceof Error
                    ? stripeError.message
                    : 'Erreur inconnue'
            console.error("Message d'erreur Stripe:", errorMessage)

            return NextResponse.json(
                {
                    error: 'Erreur lors de la création de la session de paiement',
                    details: errorMessage,
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
