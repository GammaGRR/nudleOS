import { Logo } from '../lib/components/logo'
import { InfoBlock } from '../lib/components/infoBlock'

export const AuthorizationPage = () => {
    return (
        <main className="relative hero-pattern h-screen bg-cover overflow-hidden">
            <div className="absolute inset-0 bg-black/70" />

            <section className='brightness-100'>
                <Logo />
            </section>

            <div className="absolute inset-0 z-10 flex items-center pointer-events-none mx-5">
                <div className="pointer-events-auto">
                    <InfoBlock />
                </div>
            </div>
        </main>
    )
}