import miniLogo from '/miniLogonudle.svg';

export const LogoIcon = () => {
    return(
        <section className='p-4 w-18 h-18 bg-white rounded-3xl flex justify-center items-center bg-white/30'>
            <img src={miniLogo} alt="Mini Logo" className='w-14 h-14' />
        </section>
    )
}
