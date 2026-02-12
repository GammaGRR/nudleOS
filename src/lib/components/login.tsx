import { useState } from 'react'
import { Mail, Lock, Eye, ArrowLeft } from 'lucide-react'

export const Login = () => {

    const [mode, setMode] = useState<'select' | 'email'>('select')

    return (
        <section
            className="
                w-full
                rounded-2xl
                bg-white/5
                backdrop-blur-xl
                border border-white/10
                p-6
                md:p-8
                text-white
            "
        >
            <div className="mb-6">
                {mode === 'email' && (
                    <button
                        onClick={() => setMode('select')}
                        className="flex items-center gap-2 text-sm text-gray-400 mb-4 hover:text-white transition"
                    >
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
                    <button className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/20 transition">
                        Продолжить с Nudle
                    </button>
                    <button
                        onClick={() => setMode('email')}
                        className="w-full h-12 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-center gap-2"
                    >
                        <Mail className="w-4 h-4" />
                        Использовать Email
                    </button>
                </div>
            )}
            {mode === 'email' && (
                <div className="space-y-5">

                    <div>
                        <label className="text-sm text-gray-400">
                            Email адрес
                        </label>

                        <div className="flex items-center gap-2 border-b border-white/20 py-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <input
                                className="bg-transparent outline-none w-full text-sm"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400">
                            Пароль
                        </label>
                        <div className="flex items-center gap-2 border-b border-white/20 py-2">
                            <Lock className="w-4 h-4 text-gray-400" />
                            <input
                                type="password"
                                className="bg-transparent outline-none w-full text-sm"
                                placeholder="Введите пароль"
                            />
                            <Eye className="w-4 h-4 text-gray-400 cursor-pointer" />
                        </div>
                    </div>
                    <button
                        className="
                            w-full
                            h-12
                            rounded-xl
                            bg-white/20
                            hover:bg-white/30
                            transition
                            font-medium
                        "
                    >
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
    )
}
