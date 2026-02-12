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
    <section>
      {ConfigPack.map((item, index) => (
        <div key={index} className="my-4 flex items-center">
          <div className="w-10 h-10 rounded-xl flex justify-center items-center bg-white/30 mr-2">
            <item.icon className="text-white w-6 h-6" />
          </div>
          <p className="text-white">{item.text}</p>
        </div>
      ))}
    </section>
  );
};
