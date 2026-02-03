import { Logo } from '../lib/components/logo'

export const AuthorizationPage = () => {
    return (
        <main className="relative hero-pattern h-screen bg-cover">
            <div className="absolute inset-0 bg-black/70" />

            <section className='brightness-100'>
                <Logo />
            </section>
        </main>
    )
}