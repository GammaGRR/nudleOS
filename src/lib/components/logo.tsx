import { LogoIcon } from './construct/logoIcon';
import { TextBlock } from './construct/textBlock';

export const Logo = () => {
  return (
    <section className="flex items-center pt-5">
      <LogoIcon />
      <TextBlock />
    </section>
  );
};
