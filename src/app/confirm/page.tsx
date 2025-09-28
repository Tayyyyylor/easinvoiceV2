import Link from 'next/link'

export default function ConfirmPage() {
    return (
        <>
            <h1>Compte confirmé ! Vous pouvez maintenant vous connecter.</h1>
            <Link href="/login">Se connecter</Link>
        </>
    )
}
