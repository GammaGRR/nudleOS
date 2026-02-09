import { HeadInf } from './construct/headInfBlock'
import { IconBlock } from './construct/iconBlock'


export const InfoBlock = () => {
    return(
        <section className='flex flex-col justify-center'>
            <HeadInf />
            <IconBlock />
        </section>
    )
}