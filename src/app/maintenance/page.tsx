export const metadata = {
    title: 'Maintenance',
    description: 'Site en maintenance',
}

// Cette page n'utilisera pas le layout par défaut
export const dynamic = 'force-static'

export default function Maintenance() {
    return (
        <main className="flex h-dvh flex-col justify-center items-center bg-[#f7f2ee]">
            <h1 className="text-[50px] font-bold">Maintenance en cours</h1>
            <p className="text-[30px]">
                Notre site est actuellement en maintenance. Revenez bientôt !
            </p>
        </main>
    )
}
