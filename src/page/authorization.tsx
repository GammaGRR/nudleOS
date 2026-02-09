import { Logo } from '../lib/components/logo'
import { InfoBlock } from '../lib/components/infoBlock'

export const AuthorizationPage = () => {
    return (
        <main className="relative hero-pattern h-screen bg-cover">
            <div className="absolute inset-0 bg-black/70" />

            <section className='brightness-100'>
                <Logo />
            </section>

            <section className='brightness-100'>
                <InfoBlock />
            </section>
        </main>
    )
}