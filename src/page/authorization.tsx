import { Logo } from '../lib/components/logo'
import { InfoBlock } from '../lib/components/infoBlock'
import { Login } from '../lib/components/login'

export const AuthorizationPage = () => {
    return (
        <main className="relative min-h-screen hero-pattern bg-cover bg-center overflow-hidden">
            <div className="absolute inset-0 bg-[#0b1220]/80 backdrop-blur-sm" />
            <div className="relative z-20">
                <Logo />
            </div>
            <div className="relative z-20 flex flex-col lg:flex-row justify-center lg:justify-between items-center gap-10 px-6 lg:px-16 h-screen">
                <div className="hidden lg:block max-w-xl">
                    <InfoBlock />
                </div>
                <div className="w-full max-w-md">
                    <Login />
                </div>
            </div>
        </main>
    )
}
