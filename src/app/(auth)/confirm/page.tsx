import Link from 'next/link'

export default function ConfirmPage() {
    return (
        <>
            <h2>Compte confirmé ! Vous pouvez maintenant vous connecter.</h2>
            <Link href="/login">Se connecter</Link>
        </>
    )
}
