import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { login, register, logout, updateUser } from '../store/slices/authSlice';
import { getUserOrders, getCurrentUser } from '../services/storageService';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state: any) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [userBalance, setUserBalance] = useState(0);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    phone: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: ''
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      first_name: '',
      last_name: '',
      phone: ''
    });
    setPasswordError('');
  }, [isLoginMode]);

  useEffect(() => {
    if (user) {
      const firstName = user.first_name || user.firstName || '';
      const lastName = user.last_name || user.lastName || '';
      setUserBalance(user.balance || 0);
      setEditForm({
        first_name: firstName,
        last_name: lastName,
        middle_name: user.middle_name || user.middleName || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const handleBalanceUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUserBalance(updatedUser.balance || 0);
    };
    window.addEventListener('balanceUpdated', handleBalanceUpdate);
    return () => window.removeEventListener('balanceUpdated', handleBalanceUpdate);
  }, []);

  useEffect(() => {
    const strength = formData.password.length < 6 ? 25 : formData.password.length < 10 ? 60 : 100;
    setPasswordStrength(strength);
  }, [formData.password]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const userOrders = getUserOrders(user.id);
      setOrders(userOrders);
    }
  }, [isAuthenticated, user]);

  const validatePassword = (password: string): { isValid: boolean; message: string; score: number } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;

    if (password.length < 8) {
      return { isValid: false, message: 'Минимум 8 символов', score };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Добавьте заглавную букву', score };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Добавьте строчную букву', score };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Добавьте цифру', score };
    }
    return { isValid: true, message: 'Надёжный пароль', score };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!formData.email || !formData.password) {
      toast.error('Заполните email и пароль');
      setIsSubmitting(false);
      return;
    }

    if (!isLoginMode) {
      if (!formData.first_name || !formData.last_name) {
        toast.error('Заполните имя и фамилию');
        setIsSubmitting(false);
        return;
      }

      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.message);
        setIsSubmitting(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Пароли не совпадают');
        setIsSubmitting(false);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Введите корректный email');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      if (isLoginMode) {
        const result = await dispatch(login({
          email: formData.email.trim(),
          password: formData.password,
          rememberMe: rememberMe
        }) as any);

        if (result.payload?.user) {
          const name = result.payload.user.first_name || result.payload.user.firstName || result.payload.user.email;
          toast.success(`Добро пожаловать, ${name}!`);
          setFormData({ email: '', password: '', confirmPassword: '', first_name: '', last_name: '', phone: '' });
          setRememberMe(false);
          navigate('/profile');
        } else {
          toast.error(result.error?.message || 'Неверный email или пароль');
        }
      } else {
        const result = await dispatch(register({
          email: formData.email.trim(),
          password: formData.password,
          firstName: formData.first_name.trim(),
          lastName: formData.last_name.trim(),
          phone: formData.phone.trim()
        }) as any);

        if (result.payload?.user) {
          toast.success('Регистрация успешна! Теперь войдите в аккаунт');
          setFormData({ email: '', password: '', confirmPassword: '', first_name: '', last_name: '', phone: '' });
          setIsLoginMode(true);
        } else {
          toast.error(result.error?.message || 'Ошибка регистрации');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error?.message || 'Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.id === user.id) {
        const updatedUser = {
          ...currentUser,
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          middle_name: editForm.middle_name,
          phone: editForm.phone
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch(updateUser(updatedUser));
        toast.success('Профиль обновлён');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Ошибка обновления профиля');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Заполните поля нового пароля');
      return;
    }
    const passwordValidation = validatePassword(passwordData.newPassword);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.message);
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Новые пароли не совпадают');
      return;
    }
    toast.success('Пароль успешно изменён!');
    setShowChangePassword(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Вы вышли из аккаунта');
    navigate('/');
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'delivered': return 'Доставлен';
      case 'processing': return 'В обработке';
      case 'shipped': return 'Отправлен';
      case 'pending': return 'Ожидает';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'delivered': return 'text-emerald-400';
      case 'processing': return 'text-yellow-400';
      case 'shipped': return 'text-blue-400';
      case 'pending': return 'text-orange-400';
      default: return 'text-white/30';
    }
  };

  const getUserName = () => {
    if (!user) return '';
    return user.first_name || user.firstName || user.email?.split('@')[0] || 'Пользователь';
  };

  const getUserFirstName = () => {
    if (!user) return '';
    return user.first_name || user.firstName || '';
  };

  const getUserLastName = () => {
    if (!user) return '';
    return user.last_name || user.lastName || '';
  };

  const getUserMiddleName = () => {
    if (!user) return '';
    return user.middle_name || user.middleName || '';
  };

  const getUserPhone = () => {
    if (!user) return '';
    return user.phone || '';
  };

  const EyeOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const EyeClosed = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  );

  // ============================================
  // НЕ АВТОРИЗОВАН
  // ============================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#050505] flex items-start lg:items-center justify-center pt-20 lg:pt-18 p-4 md:p-8">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#0a0a0a] to-black" />
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-white/5 blur-[180px] rounded-full" />
          <div className="absolute -bottom-40 -right-30 w-[700px] h-[700px] bg-white/3 blur-[200px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px]" />
        </div>

        <div className="relative w-full max-w-md lg:max-w-6xl h-auto lg:min-h-[750px] overflow-hidden rounded-2xl lg:rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_120px_rgba(0,0,0,0.9)] grid lg:grid-cols-2">
          <div className="hidden lg:flex relative min-h-full flex items-center justify-center px-12 py-18 overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0b0b0b] to-black" />
              <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-white/5 blur-[140px] rounded-full" />
            </div>
            <div className="relative z-10 w-full max-w-sm">
              <div className="mb-10"><span className="text-white text-2xl font-bold">MISAT</span></div>
              <h2 className="text-4xl font-bold text-white mb-3">Начните с нами</h2>
              <p className="text-white/60 text-base mb-12">Пройдите простые шаги для регистрации</p>
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-sm font-medium flex-shrink-0">1</div>
                    <span className="text-white text-base font-medium">Зарегистрируйте аккаунт</span>
                  </div>
                  <div className="h-12 w-px bg-white/10 ml-4 mt-3" />
                </div>
                <div>
                  <div className="flex items-center gap-4 opacity-60">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-sm text-white/40 flex-shrink-0">2</div>
                    <span className="text-white/40 text-base">Настройте рабочее пространство</span>
                  </div>
                  <div className="h-12 w-px bg-white/5 ml-4 mt-3" />
                </div>
                <div>
                  <div className="flex items-center gap-4 opacity-40">
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-sm text-white/20 flex-shrink-0">3</div>
                    <span className="text-white/20 text-base">Настройте профиль</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center px-5 py-6 lg:py-14 lg:px-12 bg-black/40">
            <div className="w-full max-w-md mx-auto">
              <div className="mb-6 lg:mb-10">
                <div className="lg:hidden mb-6"><span className="text-white text-xl font-bold">MISAT</span></div>
              </div>

              <div className="flex p-1 bg-white/[0.04] rounded-xl border border-white/10 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(true);
                    setFormData({ email: '', password: '', confirmPassword: '', first_name: '', last_name: '', phone: '' });
                    setPasswordError('');
                  }}
                  className={`flex-1 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${isLoginMode ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                >
                  Вход
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(false);
                    setFormData({ email: '', password: '', confirmPassword: '', first_name: '', last_name: '', phone: '' });
                    setPasswordError('');
                  }}
                  className={`flex-1 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium ${!isLoginMode ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                >
                  Регистрация
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isLoginMode ? 'login' : 'register'}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                >
                  <form ref={formRef} onSubmit={handleAuth} className="space-y-4" noValidate>
                    {!isLoginMode && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative group">
                            <input
                              type="text"
                              name="first_name"
                              placeholder=" "
                              value={formData.first_name}
                              onChange={handleChange}
                              className="peer w-full h-12 lg:h-14 px-4 bg-black/40 border border-white/10 rounded-xl text-white outline-none transition-all focus:border-white/30 text-base"
                              required
                            />
                            <label className="absolute left-4 top-3 lg:top-4 text-white/40 pointer-events-none transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-[#0a0a0a] peer-focus:px-2 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-[#0a0a0a] peer-[&:not(:placeholder-shown)]:px-2">
                              Имя
                            </label>
                          </div>
                          <div className="relative group">
                            <input
                              type="text"
                              name="last_name"
                              placeholder=" "
                              value={formData.last_name}
                              onChange={handleChange}
                              className="peer w-full h-12 lg:h-14 px-4 bg-black/40 border border-white/10 rounded-xl text-white outline-none transition-all focus:border-white/30 text-base"
                              required
                            />
                            <label className="absolute left-4 top-3 lg:top-4 text-white/40 pointer-events-none transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-[#0a0a0a] peer-focus:px-2 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-[#0a0a0a] peer-[&:not(:placeholder-shown)]:px-2">
                              Фамилия
                            </label>
                          </div>
                        </div>

                        <div className="relative group">
                          <input
                            type="tel"
                            name="phone"
                            placeholder=" "
                            value={formData.phone}
                            onChange={handleChange}
                            className="peer w-full h-12 lg:h-14 px-4 bg-black/40 border border-white/10 rounded-xl text-white outline-none transition-all focus:border-white/30 text-base"
                          />
                          <label className="absolute left-4 top-3 lg:top-4 text-white/40 pointer-events-none transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-[#0a0a0a] peer-focus:px-2 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-[#0a0a0a] peer-[&:not(:placeholder-shown)]:px-2">
                            Телефон
                          </label>
                        </div>
                      </>
                    )}

                    <div className="relative group">
                      <input
                        type="email"
                        name="email"
                        placeholder=" "
                        value={formData.email}
                        onChange={handleChange}
                        className="peer w-full h-12 lg:h-14 px-4 bg-black/40 border border-white/10 rounded-xl text-white outline-none transition-all focus:border-white/30 text-base"
                        required
                      />
                      <label className="absolute left-4 top-3 lg:top-4 text-white/40 pointer-events-none transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-[#0a0a0a] peer-focus:px-2 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-[#0a0a0a] peer-[&:not(:placeholder-shown)]:px-2">
                        Email
                      </label>
                    </div>

                    <div className="relative group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder=" "
                        value={formData.password}
                        onChange={handleChange}
                        className="peer w-full h-12 lg:h-14 px-4 bg-black/40 border border-white/10 rounded-xl text-white outline-none transition-all focus:border-white/30 pr-12 text-base"
                        required
                      />
                      <label className="absolute left-4 top-3 lg:top-4 text-white/40 pointer-events-none transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-[#0a0a0a] peer-focus:px-2 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-[#0a0a0a] peer-[&:not(:placeholder-shown)]:px-2">
                        Пароль
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition z-10"
                      >
                        {showPassword ? <EyeClosed /> : <EyeOpen />}
                      </button>
                    </div>

                    {!isLoginMode && formData.password && (
                      <div className="mt-2">
                        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            className="h-full bg-white/40 transition-all"
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-[10px] text-white/30 mt-1">
                          {passwordStrength < 60 ? 'Слабый пароль' : passwordStrength < 100 ? 'Средний пароль' : 'Надёжный пароль'}
                        </p>
                      </div>
                    )}

                    {!isLoginMode && (
                      <div className="relative group">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          placeholder=" "
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="peer w-full h-12 lg:h-14 px-4 bg-black/40 border border-white/10 rounded-xl text-white outline-none transition-all focus:border-white/30 pr-12 text-base"
                          required
                        />
                        <label className="absolute left-4 top-3 lg:top-4 text-white/40 pointer-events-none transition-all duration-200 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-[#0a0a0a] peer-focus:px-2 peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:bg-[#0a0a0a] peer-[&:not(:placeholder-shown)]:px-2">
                          Подтвердите пароль
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition z-10"
                        >
                          {showConfirmPassword ? <EyeClosed /> : <EyeOpen />}
                        </button>
                      </div>
                    )}

                    {isLoginMode && (
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 accent-white rounded"
                          />
                          <span className="text-white/40 text-sm">Запомнить меня</span>
                        </label>
                        <button type="button" className="text-white/30 text-sm hover:text-white transition">
                          Забыли пароль?
                        </button>
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading || isSubmitting}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-12 lg:h-14 rounded-xl font-semibold bg-white text-black transition-all duration-300 hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.08)] disabled:opacity-50 text-base"
                    >
                      {loading || isSubmitting ? 'Загрузка...' : (isLoginMode ? 'Войти' : 'Зарегистрироваться')}
                    </motion.button>
                  </form>
                </motion.div>
              </AnimatePresence>

              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginMode(!isLoginMode);
                    setFormData({ email: '', password: '', confirmPassword: '', first_name: '', last_name: '', phone: '' });
                    setRememberMe(false);
                    setPasswordError('');
                  }}
                  className="text-white/40 hover:text-white transition text-sm"
                >
                  {isLoginMode ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
                </button>
              </div>

              <div className="h-8 lg:h-0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // АВТОРИЗОВАН - ПРОФИЛЬ
  // ============================================
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-12 md:pt-20 pb-28 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.04),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[150px]" />
        <div className="absolute bottom-[-100px] right-0 w-[300px] h-[300px] rounded-full bg-white/[0.015] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full px-3 md:px-8 lg:px-16 py-4 md:py-6">

        {/* Хлебные крошки */}
        <div className="text-xs text-white/30 mt-2 md:mt-0 mb-4 md:mb-6">
          <Link to="/" className="hover:text-white/60 transition">Главная</Link>
          <span className="mx-1.5 text-white/20">›</span>
          <span className="text-white/60">Профиль</span>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Баннер профиля */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-6 md:mb-8 group">
            <div className="absolute inset-0 opacity-20">
              <img src="/images/brands/raspr.jpg" alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            <div className="relative py-6 md:py-10 px-5 md:px-8">
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-lg md:rounded-xl flex items-center justify-center border border-white/20">
                  <i className="fas fa-user text-white/60 text-sm md:text-lg"></i>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-px md:w-6 bg-white/40"></div>
                    <span className="text-white/40 text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] font-bold">ПРОФИЛЬ</span>
                  </div>
                  <h1 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tighter text-white">
                    ПРИВЕТ, {getUserName().toUpperCase()}!
                  </h1>
                </div>
              </div>
              <p className="text-white/30 text-[10px] md:text-sm ml-10 md:ml-14">Добро пожаловать в личный кабинет MISAT</p>
            </div>
          </div>

          {/* Вкладки */}
          <div className="flex flex-wrap gap-1 mb-5 md:mb-8 bg-white/5 rounded-xl p-1 w-fit backdrop-blur-xl border border-white/10">
            {[
              { id: 'profile', label: 'ПРОФИЛЬ', icon: 'fa-user' },
              { id: 'orders', label: 'ЗАКАЗЫ', icon: 'fa-box' },
              { id: 'settings', label: 'НАСТРОЙКИ', icon: 'fa-sliders-h' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-1.5 md:py-2 rounded-lg font-bold text-[10px] md:text-xs tracking-wider transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white text-black shadow-lg'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                <i className={`fas ${tab.icon} text-[10px] md:text-xs`}></i>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab === 'profile' && (
            <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-px md:w-6 bg-white/40"></div>
                    <h2 className="text-white font-black text-xs md:text-base">ЛИЧНЫЕ ДАННЫЕ</h2>
                  </div>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 text-white/30 text-[8px] md:text-[10px] hover:text-white transition">
                      <i className="fas fa-pen text-[7px] md:text-[9px]"></i> РЕДАКТ.
                    </button>
                  ) : (
                    <button onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        first_name: getUserFirstName(),
                        last_name: getUserLastName(),
                        middle_name: getUserMiddleName(),
                        phone: getUserPhone()
                      });
                    }} className="text-white/30 text-[8px] md:text-[10px] hover:text-white transition">
                      ОТМЕНА
                    </button>
                  )}
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex flex-col gap-1 pb-2 md:pb-3 border-b border-white/5">
                    <p className="text-white/40 text-[8px] md:text-[9px] font-bold tracking-wider uppercase">Email</p>
                    <p className="text-white text-xs md:text-sm">{user?.email}</p>
                  </div>

                  <div className="flex flex-col gap-1 pb-2 md:pb-3 border-b border-white/5">
                    <p className="text-white/40 text-[8px] md:text-[9px] font-bold tracking-wider uppercase">Имя</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                        className="w-full px-3 py-1.5 md:py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs md:text-sm focus:border-white/30 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white text-xs md:text-sm">{getUserFirstName() || 'Не указано'}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 pb-2 md:pb-3 border-b border-white/5">
                    <p className="text-white/40 text-[8px] md:text-[9px] font-bold tracking-wider uppercase">Фамилия</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                        className="w-full px-3 py-1.5 md:py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs md:text-sm focus:border-white/30 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white text-xs md:text-sm">{getUserLastName() || 'Не указано'}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 pb-2 md:pb-3 border-b border-white/5">
                    <p className="text-white/40 text-[8px] md:text-[9px] font-bold tracking-wider uppercase">Отчество</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.middle_name}
                        onChange={(e) => setEditForm({ ...editForm, middle_name: e.target.value })}
                        className="w-full px-3 py-1.5 md:py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs md:text-sm focus:border-white/30 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white text-xs md:text-sm">{getUserMiddleName() || 'Не указано'}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 pb-2 md:pb-3 border-b border-white/5">
                    <p className="text-white/40 text-[8px] md:text-[9px] font-bold tracking-wider uppercase">Телефон</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="+7 (___) ___-__-__"
                        className="w-full px-3 py-1.5 md:py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs md:text-sm focus:border-white/30 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white text-xs md:text-sm">{getUserPhone() || 'Не указан'}</p>
                    )}
                  </div>

                  {isEditing && (
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="mt-3 md:mt-4 w-full bg-white text-black py-2 rounded-lg text-[10px] md:text-xs font-bold tracking-wider hover:bg-white/90 transition disabled:opacity-50"
                    >
                      {isUpdating ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
                    </button>
                  )}

                  <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 rounded-xl p-3 md:p-4 mt-3 md:mt-4 border border-emerald-500/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-emerald-400/60 text-[8px] md:text-[9px] font-bold tracking-wider">БАЛАНС</p>
                        <p className="text-lg md:text-2xl font-black text-emerald-400">{userBalance.toLocaleString()} ₽</p>
                      </div>
                      <Link to="/balance-topup" className="bg-emerald-500 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-bold hover:bg-emerald-600 transition whitespace-nowrap flex items-center justify-center">
                        ПОПОЛНИТЬ
                      </Link>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-4">
                    <button onClick={() => setShowChangePassword(!showChangePassword)} className="flex items-center gap-1.5 md:gap-2 text-white/30 text-[9px] md:text-[10px] hover:text-white transition">
                      <i className="fas fa-key text-[8px] md:text-[9px]"></i> {showChangePassword ? 'ОТМЕНА' : 'СМЕНИТЬ ПАРОЛЬ'}
                    </button>
                    {showChangePassword && (
                      <div className="mt-3 space-y-3">
                        <input type="password" placeholder="Новый пароль" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-3 py-1.5 md:py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs md:text-sm placeholder-white/30 focus:border-white/30 focus:outline-none" />
                        <input type="password" placeholder="Подтвердите пароль" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full px-3 py-1.5 md:py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs md:text-sm placeholder-white/30 focus:border-white/30 focus:outline-none" />
                        {passwordError && <p className="text-red-400 text-[9px]">{passwordError}</p>}
                        <button onClick={handleChangePassword} className="w-full bg-white/10 text-white py-1.5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-bold hover:bg-white/20 transition">СОХРАНИТЬ</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="w-4 h-px md:w-6 bg-white/40"></div>
                  <h2 className="text-white font-black text-xs md:text-base">СТАТИСТИКА</h2>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-white/5">
                    <span className="text-white/40 text-xs md:text-sm">Всего заказов</span>
                    <span className="text-white font-black text-xl md:text-2xl">{orders.length}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-white/5">
                    <span className="text-white/40 text-xs md:text-sm">Общая сумма</span>
                    <span className="text-white font-black text-xl md:text-2xl">{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 md:pt-2">
                    <span className="text-white/40 text-xs md:text-sm">Средний чек</span>
                    <span className="text-white/80 text-base md:text-lg font-bold">
                      {orders.length > 0 ? Math.round(orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toLocaleString() : 0} ₽
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              {orders.length === 0 ? (
                <div className="text-center py-12 md:py-16">
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 relative">
                    <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse"></div>
                    <div className="absolute inset-2 border border-white/10 rounded-full"></div>
                    <i className="fas fa-box-open text-white/20 text-3xl md:text-4xl relative z-10"></i>
                  </div>
                  <h3 className="text-white font-black text-xl md:text-2xl mb-2">У ВАС ПОКА НЕТ ЗАКАЗОВ</h3>
                  <p className="text-white/40 text-xs md:text-sm mb-6 max-w-sm mx-auto">
                    Перейдите в каталог, чтобы сделать первый заказ
                  </p>
                  <Link to="/catalog" className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 md:px-8 py-2.5 md:py-3 font-bold text-xs md:text-sm tracking-wider hover:bg-white/90 transition rounded-xl">
                    <i className="fas fa-arrow-right text-xs md:text-sm"></i>
                    ПЕРЕЙТИ В КАТАЛОГ
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr className="text-left">
                        <th className="px-3 md:px-5 py-2 md:py-3 text-white/40 text-[8px] md:text-[9px] font-bold tracking-wider">НОМЕР</th>
                        <th className="px-3 md:px-5 py-2 md:py-3 text-white/40 text-[8px] md:text-[9px] font-bold tracking-wider">ДАТА</th>
                        <th className="px-3 md:px-5 py-2 md:py-3 text-white/40 text-[8px] md:text-[9px] font-bold tracking-wider">СУММА</th>
                        <th className="px-3 md:px-5 py-2 md:py-3 text-white/40 text-[8px] md:text-[9px] font-bold tracking-wider">СТАТУС</th>
                        <th className="hidden md:table-cell px-5 py-3 text-white/40 text-[9px] font-bold tracking-wider">АДРЕС</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="px-3 md:px-5 py-2 md:py-3 font-mono text-[10px] md:text-sm text-white/80">#{order.id}</td>
                          <td className="px-3 md:px-5 py-2 md:py-3 text-[10px] md:text-sm text-white/40">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-3 md:px-5 py-2 md:py-3 font-bold text-[10px] md:text-sm text-white">{order.total.toLocaleString()} ₽</td>
                          <td className="px-3 md:px-5 py-2 md:py-3">
                            <span className={`text-[8px] md:text-[10px] font-bold ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="hidden md:table-cell px-5 py-3 text-sm text-white/40 max-w-xs truncate">{order.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="w-4 h-px md:w-6 bg-white/40"></div>
                <h2 className="text-white font-black text-xs md:text-base">УВЕДОМЛЕНИЯ</h2>
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between py-2 md:py-3 border-b border-white/5">
                  <div>
                    <p className="text-white font-bold text-xs md:text-sm">Email рассылка</p>
                    <p className="text-white/40 text-[9px] md:text-xs">Новости о скидках и новинках</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white/30 rounded-full transition-all duration-300 peer-checked:bg-emerald-500/80 peer-checked:shadow-md peer-checked:shadow-emerald-500/20"></div>
                    <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-5 group-hover:scale-105"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-2 md:py-3 border-b border-white/5">
                  <div>
                    <p className="text-white font-bold text-xs md:text-sm">СМС уведомления</p>
                    <p className="text-white/40 text-[9px] md:text-xs">Статус заказа по SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer group">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white/30 rounded-full transition-all duration-300 peer-checked:bg-emerald-500/80 peer-checked:shadow-md peer-checked:shadow-emerald-500/20"></div>
                    <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-5 group-hover:scale-105"></div>
                  </label>
                </div>
                <button className="w-full mt-4 md:mt-6 bg-white text-black py-2 rounded-lg text-[10px] md:text-xs font-bold tracking-wider hover:bg-white/90 transition">СОХРАНИТЬ НАСТРОЙКИ</button>
              </div>
            </div>
          )}

          <div className="mt-6 md:mt-8 text-center">
            <button onClick={handleLogout} className="inline-flex items-center gap-1.5 md:gap-2 text-white/30 hover:text-red-400 transition text-[9px] md:text-xs">
              <i className="fas fa-sign-out-alt"></i> ВЫЙТИ ИЗ АККАУНТА
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;