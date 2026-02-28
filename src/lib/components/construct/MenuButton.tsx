import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { appsConfig } from '../construct/startMenu.config';
import LogoMenu from '/miniLogonudle.svg';

type Props = {
  onLaunch: (appId: string) => void;
};

export const StartMenu = ({ onLaunch }: Props) => {
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

      const matchSearch = app.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [search, activeCategory]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-xl hover:bg-white/10 transition">
        <img src={LogoMenu} className="w-7 h-7" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 mt-4 w-[600px] h-[520px] rounded-3xl bg-[#0f172a]/85 backdrop-blur-2xl border border-white/10 shadow-2xl flex overflow-hidden z-50">

            {/* Sidebar */}
            <div className="w-56 p-4 border-r border-white/5 flex flex-col">
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск..."
                  className="w-full pl-9 h-9 rounded-xl bg-white/5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1 overflow-y-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left px-2 py-2 rounded-xl text-sm ${
                      cat === activeCategory
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-gray-400 hover:bg-white/5'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Apps */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-3 gap-5">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => {
                      onLaunch(app.id);
                      setOpen(false);
                    }}
                    className="flex flex-col items-center p-3 rounded-2xl cursor-pointer hover:bg-white/5">
                    <app.icon className="size-6 text-white" />
                    <span className="mt-3 text-sm text-gray-300">
                      {app.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};