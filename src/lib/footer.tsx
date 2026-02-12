export const Footer = () => {
  const now: Date = new Date();
  return (
    <footer className="text-base text-gray-500 py-8">
      <p>© {now.getFullYear()} nudleOS. Все права защищены.</p>
    </footer>
  );
};
