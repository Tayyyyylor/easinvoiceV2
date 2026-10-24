'use client'

/** Toutes les fonctionnalités sont disponibles dans la version locale. */
export function useSubscription() {
    return { isSubscribed: true, isLoading: false, error: null }
}
