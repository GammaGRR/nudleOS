import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import 'react-calendar/dist/Calendar.css';

export const DateTimeBlock = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative text-white" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col items-end px-3 py-2 rounded-xl">
        <span className="text-sm font-semibold">
          {format(date, 'HH:mm:ss')}
        </span>
        <span className="text-xs text-gray-300 hidden sm:block">
          {format(date, 'dd MMM yyyy', { locale: ru })}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute right-0 mt-3 w-[300px] rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-[1px] shadow-2xl z-50">
            <div className="bg-[#0f172a] rounded-2xl p-4 backdrop-blur-xl">
              <div className="text-4xl font-bold mb-1">
                {format(date, 'HH:mm:ss')}
              </div>
              <div className="text-sm text-gray-400 mb-4">
                {format(date, 'dd MMMM yyyy', { locale: ru })}
              </div>
              <div className="rounded-xl overflow-hidden">
                <Calendar
                  onChange={() => {}}
                  value={date}
                  locale="ru-RU"
                  className="custom-calendar"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
