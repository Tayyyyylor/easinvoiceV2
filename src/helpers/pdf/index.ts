export const euro = (v: number) =>
    new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    })
        .format(v)
        // React-PDF et certaines polices gèrent mal l'espace fine insécable (U+202F)
        // et l'espace insécable (U+00A0). On les remplace par un espace normal
        // pour un alignement fiable à droite.
        .replace(/[\u202F\u00A0]/g, ' ')
