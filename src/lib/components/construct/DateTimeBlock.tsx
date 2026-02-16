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
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative text-white" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex flex-col items-end
          px-3 py-2
          rounded-xl
          hover:bg-white/10
          transition
        ">
        <span className="text-sm font-semibold">
          {format(date, 'HH:mm:ss')}
        </span>
        <span className="text-xs text-gray-400 hidden sm:block">
          {format(date, 'dd MMM yyyy', { locale: ru })}
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="
              absolute right-0 mt-3
              w-[320px]
              rounded-3xl
              bg-slate-900/95
              backdrop-blur-2xl
              border border-white/10
              shadow-[0_20px_60px_rgba(0,0,0,0.6)]
              p-5
              z-50
            ">
            <div className="text-4xl font-bold tracking-wide">
              {format(date, 'HH:mm:ss')}
            </div>
            <div className="text-sm text-gray-400 mb-4">
              {format(date, 'dd MMMM yyyy', { locale: ru })}
            </div>
            <Calendar
              onChange={() => {}}
              value={date}
              locale="ru-RU"
              className="!bg-transparent !border-none text-white"
              tileClassName="!rounded-xl hover:!bg-white/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
