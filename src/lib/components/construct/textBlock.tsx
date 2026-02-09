import logo from '../../../assets/whiteLogonudle.svg'

export const TextBlock = () => {
    return(
        <section className="p-5">
            <img src={logo} alt="nudle Logo" className="w-40 h-10" />
            <p className='text-white text-mg'>Система управления сервером</p>
        </section>
    )
}