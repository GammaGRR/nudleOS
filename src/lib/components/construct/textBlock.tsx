import logo from '../../../assets/whiteLogonudle.svg'

export const TextBlock = () => {
    return(
        <section className="p-5">
            <img src={logo} alt="nudle Logo" className="w-55 h-15" />
            <p className='text-white text-base'>Система управления сервером</p>
        </section>
    )
}