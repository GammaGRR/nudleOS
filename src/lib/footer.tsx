

export const Footer = () => {
    const now: Date = new Date();
    return(
        <footer className='text-base text-gray-500 py-8 mx-5'>
            <p>© {now.getFullYear()} ServerOS. Все права защищены.</p>
        </footer>
    )
}