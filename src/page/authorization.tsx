import { Logo } from '../lib/components/logo'
import { InfoBlock } from '../lib/components/infoBlock'
import { Login } from '../lib/components/login'
import { Footer } from '../lib/footer'

export const AuthorizationPage = () => {
    return (
        <main className="relative min-h-screen hero-pattern bg-cover bg-center overflow-hidden">
            <div className="absolute inset-0 bg-[#0b1220]/80 backdrop-blur-sm pointer-events-none" />

            <section className="relative z-20 mx-auto w-full max-w-[1920px] px-4 sm:px-6 lg:px-10">
                <div className="flex min-h-screen flex-col">
                    <div className=''>
                        <Logo />
                    </div>
                    <div className="
                        flex flex-1 flex-col
                        justify-center
                        gap-10
                        py-10
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                        lg:gap-16
                    ">
                        <div className="hidden lg:flex lg:flex-1">
                            <InfoBlock />
                        </div>
                        <div className="
                            w-full
                            max-w-md
                            mx-auto
                            sm:max-w-lg
                            lg:mx-0
                            lg:flex-shrink-0
                        ">
                            <Login />
                        </div>
                    </div>
                    <div className="py-4">
                        <Footer />
                    </div>
                </div>
            </section>
        </main>
    )
}
