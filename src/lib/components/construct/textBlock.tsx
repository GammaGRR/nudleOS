import logo from '../../../assets/whiteLogonudle.svg';

export const TextBlock = () => {
  return (
    <section className="p-4">
      <img src={logo} alt="nudle Logo" className="w-30" />
      <p className="text-white">Систеnма управления сервером</p>
    </section>
  );
};
