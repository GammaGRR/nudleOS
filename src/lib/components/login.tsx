import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import logo from '/miniLogonudle.svg';

export const Login = () => {
  const [mode, setMode] = useState<'select' | 'email'>('select');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="w-full rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 text-white">
      <div className="mb-6">
        {mode === 'email' && (
          <button
            onClick={() => setMode('select')}
            className="flex items-center gap-2 text-sm text-gray-400 mb-4 hover:text-white transition">
            <ArrowLeft className="w-4 h-4" />
            Назад к выбору
          </button>
        )}
        <h1 className="text-2xl font-semibold mb-1 text-center">
          Вход в систему
        </h1>
        <p className="text-gray-400 text-sm text-center">
          Выберите способ авторизации
        </p>
      </div>
      {mode === 'select' && (
        <div className="space-y-3">
          <button className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center gap-2">
            <img src={logo} alt="" className="w-4 h-4" />
            Продолжить с nudle
          </button>
          <button
            onClick={() => setMode('email')}
            className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" />
            Использовать Email
          </button>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-1">
            <span>Нет аккаунта?</span>
            <span className="font-medium text-primary cursor-pointer">
              Зарегистрироваться
            </span>
          </div>
        </div>
      )}
      {mode === 'email' && (
        <div className="space-y-5">
          <div>
            <label className="text-sm text-gray-400">Email адрес</label>

            <div className="flex items-center gap-2 border-b border-white/20 py-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <input
                className="bg-transparent outline-none w-full text-sm"
                placeholder="name@example.com"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400">Пароль</label>
            <div className="flex items-center gap-2 border-b border-white/20 py-2">
              <Lock className="w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="bg-transparent outline-none w-full text-sm"
                placeholder="Введите пароль"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600">
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <button className="w-full h-12 rounded-xl bg-white/20 hover:bg-white/30 transition font-medium">
            Войти в систему →
          </button>
          <p className="text-center text-sm text-gray-400">
            Нет аккаунта?
            <span className="text-white ml-1 cursor-pointer underline">
              Зарегистрироваться
            </span>
          </p>
        </div>
      )}
    </section>
  );
};
