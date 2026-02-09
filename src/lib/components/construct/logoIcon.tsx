import miniLogo from '/miniLogonudle.svg';

export const LogoIcon = () => {
    return(
        <section className='p-5 w-25 h-25 bg-white rounded-3xl flex justify-center items-center bg-white/30'>
            <img src={miniLogo} alt="Mini Logo" className='w-20 h-20' />
        </section>
    )
}
