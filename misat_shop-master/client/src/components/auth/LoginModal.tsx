import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      await dispatch(login({ email, password, rememberMe })).unwrap();
      toast.success('Добро пожаловать!');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Блюр фона */}
      <div onClick={onClose} className="absolute inset-0 bg-[#0A0A0A]/70 backdrop-blur-2xl" />

      {/* Синее свечение за модалкой */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[#0A84FF] opacity-[0.08] blur-[150px] pointer-events-none" />

      {/* Карточка */}
      <div
        className="
          relative
          w-full max-w-md
          overflow-hidden
          rounded-[32px]
          bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]
          border border-white/10
          backdrop-blur-3xl
          shadow-[0_20px_80px_rgba(0,0,0,0.6)]
        "
      >
        {/* Свечение сверху */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Контент */}
        <div className="px-8 pt-8 pb-6">
          {/* Заголовок */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[32px] font-semibold tracking-tight text-white">
                Вход
              </h2>
              <p className="text-[#98989D] mt-1 text-sm">
                Добро пожаловать обратно
              </p>
            </div>

            <button
              onClick={onClose}
              className="
                w-9 h-9
                rounded-full
                bg-white/[0.06]
                hover:bg-white/[0.12]
                text-[#98989D]
                transition-all
                flex items-center justify-center
              "
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-[#98989D] text-sm font-medium mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full
                  h-14
                  px-5
                  rounded-2xl
                  bg-white/[0.04]
                  border border-white/[0.06]
                  text-white
                  placeholder:text-[#636366]
                  focus:outline-none
                  focus:border-[#0A84FF]
                  focus:bg-white/[0.06]
                  transition-all
                "
                placeholder="example@mail.com"
              />
            </div>

            {/* Пароль с глазом */}
            <div>
              <label className="text-[#98989D] text-sm font-medium mb-1.5 block">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    w-full
                    h-14
                    px-5
                    pr-14
                    rounded-2xl
                    bg-white/[0.04]
                    border border-white/[0.06]
                    text-white
                    placeholder:text-[#636366]
                    focus:outline-none
                    focus:border-[#0A84FF]
                    focus:bg-white/[0.06]
                    transition-all
                  "
                  placeholder="Введите пароль"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#98989D] hover:text-white transition"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Запомнить меня и Забыли пароль */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-black/30 accent-[#0A84FF]"
                />
                <span className="text-[#98989D] text-sm">Запомнить меня</span>
              </label>
              <button type="button" className="text-[#636366] text-sm hover:text-[#98989D] transition">
                Забыли пароль?
              </button>
            </div>

            {/* Кнопка входа */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                h-14
                rounded-2xl
                bg-[#0A84FF]
                text-white
                font-semibold
                text-base
                hover:brightness-110
                active:scale-[0.985]
                shadow-[0_0_25px_rgba(10,132,255,0.35)]
                transition-all
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading ? 'Вход...' : 'Продолжить'}
            </button>
          </form>

          {/* Регистрация */}
          <p className="text-center text-[#636366] text-sm mt-6">
            Нет аккаунта?{' '}
            <button onClick={onSwitchToRegister} className="text-white hover:underline transition">
              Зарегистрироваться
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;