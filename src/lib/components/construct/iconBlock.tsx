import { Shield, Zap, Cloud } from 'lucide-react';

const ConfigPack = [
  {
    icon: Shield,
    text: 'Защищенное подключение',
  },
  {
    icon: Zap,
    text: 'Мгновенный доступ',
  },
  {
    icon: Cloud,
    text: 'Работает везде',
  },
];

export const IconBlock = () => {
  return (
    <section className="px-4 sm:px-0">
      {ConfigPack.map((item, index) => (
        <div key={index} className="my-4 flex items-center">
          <div className="w-10 h-10 rounded-xl flex justify-center items-center bg-white/30 mr-3 shrink-0">
            <item.icon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <p className="text-white text-[clamp(0.9rem,2vw,1rem)] leading-snug">
            {item.text}
          </p>
        </div>
      ))}
    </section>
  );
};
