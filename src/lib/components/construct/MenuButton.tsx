import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { appsConfig } from './startMenu.config';
import LogoMenu from '/miniLogonudle.svg';

export const StartMenu = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Все');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(appsConfig.map((a) => a.category))];
    return ['Все', ...unique];
  }, []);

  const filteredApps = useMemo(() => {
    return appsConfig.filter((app) => {
      const matchCategory =
        activeCategory === 'Все' || app.category === activeCategory;

      const matchSearch = app.name.toLowerCase().includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-xl hover:bg-white/10 transition">
        <img src={LogoMenu} alt="" className="w-7 h-7" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="
              absolute left-0 mt-4
              w-[600px] max-w-[95vw] h-[520px]
              rounded-3xl
              bg-[#0f172a]/85
              backdrop-blur-2xl
              border border-white/10
              shadow-[0_25px_60px_rgba(0,0,0,0.65)]
              flex overflow-hidden z-50
            ">
            <div
              className="
                w-56
                bg-[#0b1220]/70
                border-r border-white/5
                p-4
                flex flex-col
              ">
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск..."
                  className="
                    w-full pl-9 pr-3 h-9
                    rounded-xl
                    bg-white/5
                    text-sm text-white
                    placeholder-gray-400
                    focus:outline-none
                    focus:bg-white/10
                    transition
                  "
                />
              </div>
              <div className="flex flex-col gap-1 overflow-y-auto custom-scroll">
                {categories.map((cat) => (
                  <CategoryItem
                    key={cat}
                    active={cat === activeCategory}
                    onClick={() => setActiveCategory(cat)}>
                    {cat}
                  </CategoryItem>
                ))}
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto custom-scroll">
              <div className="grid grid-cols-3 gap-5">
                {filteredApps.map((app) => (
                  <AppCard key={app.id} app={app} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CategoryItem = ({ children, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`
      text-left px-2 py-2 rounded-xl text-sm transition-all
      ${
        active
          ? 'bg-blue-500/20 text-blue-400'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }
    `}>
    {children}
  </button>
);

const AppCard = ({ app }: any) => {
  const Icon = app.icon;

  return (
    <div
      className="
        group flex flex-col items-center justify-center
        p-3 rounded-2xl
        transition-all duration-200
        cursor-pointer
        hover:bg-white/5
      ">
      <div
        className="
          p-4 rounded-xl
          bg-[#1e293b]
          group-hover:bg-blue-500/20
          group-hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]
          transition-all duration-300
        ">
        <Icon className="text-white size-6" />
      </div>

      <span className="mt-3 text-sm text-gray-300 group-hover:text-white transition">
        {app.name}
      </span>
    </div>
  );
};
