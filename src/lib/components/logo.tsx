import { LogoIcon } from './construct/logoIcon';
import { TextBlock } from './construct/textBlock';

export const Logo = () => {
  return (
    <section className="flex items-center mx-5 pt-5">
      <LogoIcon />
      <TextBlock />
    </section>
  );
};
