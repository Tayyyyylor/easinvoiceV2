import Image from 'next/image'
export default function Maintenance() {
    return (
        <html>
            <body>
                <main className="flex h-dvh flex-col justify-center items-center bg-[#f7f2ee]">
                    {/* <Image
                        src="/logoDpdBlack.png"
                        alt="logo"
                        width={500}
                        height={300}
                        className="w-full h-[400px]"
                    /> */}
                    <h1 className="text-[50px] font-bold">Maintenance en cours</h1>
                    <p className="text-[30px]">
                        Notre site est actuellement en maintenance. Revenez
                        bientôt !
                    </p>
                </main>
            </body>
        </html>
    )
}
