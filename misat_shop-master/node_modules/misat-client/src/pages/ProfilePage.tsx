import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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

  // Редактирование профиля
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    phone: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: '' });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setUserBalance(user.balance || 0);
      setEditForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        middle_name: user.middle_name || '',
        phone: user.phone || ''
      });
    }
    const handleBalanceUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem('misat_current_user') || '{}');
      setUserBalance(updatedUser.balance || 0);
    };
    window.addEventListener('balanceUpdated', handleBalanceUpdate);
    return () => window.removeEventListener('balanceUpdated', handleBalanceUpdate);
  }, [user]);

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

  const checkPasswordStrength = (password: string) => {
    const result = validatePassword(password);
    setPasswordStrength({ score: result.score, message: result.message });
    return result.isValid;
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      const userOrders = getUserOrders(user.id);
      setOrders(userOrders);
    }
  }, [isAuthenticated, user]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Заполните email и пароль');
      return;
    }

    if (!isLoginMode) {
      if (!formData.first_name || !formData.last_name) {
        toast.error('Заполните имя и фамилию');
        return;
      }

      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        toast.error(passwordValidation.message);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Пароли не совпадают');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Введите корректный email');
        return;
      }
    }

    if (isLoginMode) {
      const result = await dispatch(login({
        email: formData.email,
        password: formData.password,
        rememberMe: rememberMe
      }) as any);
      if (result.payload?.user) {
        toast.success(`Добро пожаловать, ${result.payload.user.first_name || result.payload.user.email}!`);
        setFormData({ email: '', password: '', confirmPassword: '', first_name: '', last_name: '', phone: '' });
        setRememberMe(false);
      } else {
        toast.error(result.error?.message || 'Неверный email или пароль');
      }
    } else {
      const result = await dispatch(register({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone
      }) as any);
      if (result.payload?.user) {
        toast.success('Регистрация успешна! Теперь войдите в аккаунт');
        setFormData({ email: '', password: '', confirmPassword: '', first_name: '', last_name: '', phone: '' });
        setPasswordStrength({ score: 0, message: '' });
        setIsLoginMode(true);
      } else {
        toast.error(result.error?.message || 'Ошибка регистрации');
      }
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
        localStorage.setItem('misat_current_user', JSON.stringify(updatedUser));
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
      case 'delivered': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'shipped': return 'text-blue-400';
      case 'pending': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black pt-20">
        <div className="w-full px-4 md:px-8 lg:px-16 py-8">
          <div className="max-w-md mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-8">
              <div className="absolute inset-0 opacity-20">
                <img src="/images/brands/raspr.jpg" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
              <div className="relative py-6 md:py-8 px-4 md:px-6 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center mb-3 md:mb-4 border border-white/20">
                  <i className="fas fa-user-circle text-white/80 text-3xl md:text-4xl"></i>
                </div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tighter text-white">{isLoginMode ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}</h1>
                <div className="w-10 h-0.5 md:w-12 bg-white/30 mx-auto mt-2 md:mt-3 rounded-full"></div>
              </div>
            </div>

            <form onSubmit={handleAuth} className="bg-white/5 rounded-xl md:rounded-2xl p-5 md:p-8 border border-white/10">
              {!isLoginMode && (
                <>
                  <div className="mb-3 md:mb-4">
                    <label className="text-gray-500 text-[9px] font-bold block mb-1.5 tracking-wider">ИМЯ</label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:border-white/30 focus:outline-none transition"
                      required
                    />
                  </div>
                  <div className="mb-3 md:mb-4">
                    <label className="text-gray-500 text-[9px] font-bold block mb-1.5 tracking-wider">ФАМИЛИЯ</label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:border-white/30 focus:outline-none transition"
                      required
                    />
                  </div>
                  <div className="mb-3 md:mb-4">
                    <label className="text-gray-500 text-[9px] font-bold block mb-1.5 tracking-wider">ТЕЛЕФОН</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:border-white/30 focus:outline-none transition"
                    />
                  </div>
                </>
              )}
              <div className="mb-3 md:mb-4">
                <label className="text-gray-500 text-[9px] font-bold block mb-1.5 tracking-wider">EMAIL</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:border-white/30 focus:outline-none transition"
                  required
                />
              </div>
              <div className="mb-3 md:mb-4">
                <label className="text-gray-500 text-[9px] font-bold block mb-1.5 tracking-wider">ПАРОЛЬ</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (!isLoginMode) checkPasswordStrength(e.target.value);
                  }}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 text-sm focus:border-white/30 focus:outline-none transition"
                  required
                />
                {!isLoginMode && formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1 mb-1">
                      {[1,2,3,4,5,6].map(i => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all ${
                            i <= passwordStrength.score
                              ? i <= 2 ? 'bg-red-500' : i <= 4 ? 'bg-yellow-500' : 'bg-green-500'
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-[9px] ${
                      passwordStrength.score <= 2 ? 'text-red-400' : passwordStrength.score <= 4 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {passwordStrength.message}
                    </p>
                  </div>
                )}
              </div>
              {!isLoginMode && (
                <div className="mb-4 md:mb-6">
                  <label className="text-gray-500 text-[9px] font-bold block mb-1.5 tracking-wider">ПОДТВЕРДИТЕ ПАРОЛЬ</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-black/40 border rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none transition ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-white/10 focus:border-white/30'
                    }`}
                    required
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-400 text-[9px] mt-1">Пароли не совпадают</p>
                  )}
                </div>
              )}

              {isLoginMode && (
                <div className="flex items-center justify-between mb-5 md:mb-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 md:w-4 md:h-4 accent-white rounded"
                    />
                    <span className="text-gray-500 text-[9px] md:text-[10px]">Запомнить меня</span>
                  </label>
                  <button type="button" className="text-gray-500 text-[9px] md:text-[10px] hover:text-white transition">Забыли пароль?</button>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-white text-black py-3 rounded-xl font-black text-xs md:text-sm tracking-wider hover:bg-gray-100 transition disabled:opacity-50">
                {loading ? 'ЗАГРУЗКА...' : (isLoginMode ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ')}
              </button>
            </form>

            <div className="text-center mt-5 md:mt-6">
              <button onClick={() => {
                setIsLoginMode(!isLoginMode);
                setFormData({ email: '', password: '', confirmPassword: '', first_name: '', last_name: '', phone: '' });
                setPasswordStrength({ score: 0, message: '' });
                setRememberMe(false);
              }} className="text-gray-500 text-xs md:text-sm hover:text-white transition">
                {isLoginMode ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16 md:pt-20">
      <div className="w-full px-3 md:px-8 lg:px-16 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">

          {/* Баннер - адаптивный */}
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-5 md:mb-8 group">
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
                    <span className="text-gray-400 text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em]">ПРОФИЛЬ</span>
                  </div>
                  <h1 className="text-xl md:text-3xl lg:text-4xl font-black tracking-tighter text-white">
                    ПРИВЕТ, {user?.first_name?.toUpperCase() || user?.email?.split('@')[0]?.toUpperCase()}!
                  </h1>
                </div>
              </div>
              <p className="text-gray-400 text-[10px] md:text-sm ml-10 md:ml-14">Добро пожаловать в личный кабинет MISAT</p>
            </div>
          </div>

          {/* Tabs - адаптивный переключатель (без сокращений) */}
        <div className="flex flex-wrap gap-1 mb-5 md:mb-8 bg-white/5 rounded-lg md:rounded-xl p-1 w-fit">
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
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              <i className={`fas ${tab.icon} text-[10px] md:text-xs`}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

          {/* Profile Tab - адаптивный */}
          {activeTab === 'profile' && (
            <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-px md:w-6 bg-white/40"></div>
                    <h2 className="text-white font-black text-xs md:text-base">ЛИЧНЫЕ ДАННЫЕ</h2>
                  </div>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-1 text-gray-500 text-[8px] md:text-[10px] hover:text-white transition">
                      <i className="fas fa-pen text-[7px] md:text-[9px]"></i> РЕДАКТ.
                    </button>
                  ) : (
                    <button onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        first_name: user?.first_name || '',
                        last_name: user?.last_name || '',
                        middle_name: user?.middle_name || '',
                        phone: user?.phone || ''
                      });
                    }} className="text-gray-500 text-[8px] md:text-[10px] hover:text-white transition">
                      ОТМЕНА
                    </button>
                  )}
                </div>

                <div className="space-y-3 md:space-y-4">
                  <div className="flex flex-col gap-1 pb-2 md:pb-3 border-b border-white/5">
                    <p className="text-gray-500 text-[8px] md:text-[9px] font-bold tracking-wider uppercase">Email</p>
                    <p className="text-white text-xs md:text-sm">{user?.email}</p>
                  </div>

                  <div className="flex flex-col gap-1 pb-2 md:pb-3 border-b border-white/5">
                    <p className="text-gray-500 text-[8px] md:text-[9px] font-bold tracking-wider uppercase">Имя</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                        className="w-full px-3 py-1.5 md:py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs md:text-sm focus:border-white/30 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white text-xs md:text-sm">{user?.first_name || 'Не указано'}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 pb-2 md:pb-3 border-b border-white/5">
                    <p className="text-gray-500 text-[8px] md:text-[9px] font-bold tracking-wider uppercase">Фамилия</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                        className="w-full px-3 py-1.5 md:py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs md:text-sm focus:border-white/30 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white text-xs md:text-sm">{user?.last_name || 'Не указано'}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 pb-2 md:pb-3 border-b border-white/5">
                    <p className="text-gray-500 text-[8px] md:text-[9px] font-bold tracking-wider uppercase">Отчество</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.middle_name}
                        onChange={(e) => setEditForm({ ...editForm, middle_name: e.target.value })}
                        className="w-full px-3 py-1.5 md:py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs md:text-sm focus:border-white/30 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white text-xs md:text-sm">{user?.middle_name || 'Не указано'}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 pb-2 md:pb-3 border-b border-white/5">
                    <p className="text-gray-500 text-[8px] md:text-[9px] font-bold tracking-wider uppercase">Телефон</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="+7 (___) ___-__-__"
                        className="w-full px-3 py-1.5 md:py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs md:text-sm focus:border-white/30 focus:outline-none"
                      />
                    ) : (
                      <p className="text-white text-xs md:text-sm">{user?.phone || 'Не указан'}</p>
                    )}
                  </div>

                  {isEditing && (
                    <button
                      onClick={handleUpdateProfile}
                      disabled={isUpdating}
                      className="mt-3 md:mt-4 w-full bg-white text-black py-2 rounded-lg text-[10px] md:text-xs font-bold tracking-wider hover:bg-gray-100 transition disabled:opacity-50"
                    >
                      {isUpdating ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
                    </button>
                  )}

                  {/* Баланс - исправленный */}

                <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 rounded-xl p-3 md:p-4 mt-3 md:mt-4 border border-emerald-500/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-emerald-400/60 text-[8px] md:text-[9px] font-bold tracking-wider">БАЛАНС</p>
                      <p className="text-lg md:text-2xl font-black text-emerald-400">{userBalance.toLocaleString()} ₽</p>
                    </div>
                    <Link
                      to="/balance-topup"
                      className="bg-emerald-500 text-white px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-[10px] md:text-xs font-bold hover:bg-emerald-600 transition whitespace-nowrap flex items-center justify-center"
                    >
                      ПОПОЛНИТЬ
                    </Link>
                  </div>
                </div>

                  <div className="mt-3 md:mt-4">
                    <button onClick={() => setShowChangePassword(!showChangePassword)} className="flex items-center gap-1.5 md:gap-2 text-gray-500 text-[9px] md:text-[10px] hover:text-white transition">
                      <i className="fas fa-key text-[8px] md:text-[9px]"></i> {showChangePassword ? 'ОТМЕНА' : 'СМЕНИТЬ ПАРОЛЬ'}
                    </button>
                    {showChangePassword && (
                      <div className="mt-3 space-y-3">
                        <input type="password" placeholder="Новый пароль" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-3 py-1.5 md:py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs md:text-sm placeholder-gray-600 focus:border-white/30 focus:outline-none" />
                        <input type="password" placeholder="Подтвердите пароль" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full px-3 py-1.5 md:py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs md:text-sm placeholder-gray-600 focus:border-white/30 focus:outline-none" />
                        {passwordError && <p className="text-red-400 text-[9px]">{passwordError}</p>}
                        <button onClick={handleChangePassword} className="w-full bg-white/10 text-white py-1.5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-bold hover:bg-white/20 transition">СОХРАНИТЬ</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4 md:mb-6">
                  <div className="w-4 h-px md:w-6 bg-white/40"></div>
                  <h2 className="text-white font-black text-xs md:text-base">СТАТИСТИКА</h2>
                </div>
                <div className="space-y-3 md:space-y-4">
                  <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-white/5">
                    <span className="text-gray-500 text-xs md:text-sm">Всего заказов</span>
                    <span className="text-white font-black text-xl md:text-2xl">{orders.length}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-white/5">
                    <span className="text-gray-500 text-xs md:text-sm">Общая сумма</span>
                    <span className="text-white font-black text-xl md:text-2xl">{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 md:pt-2">
                    <span className="text-gray-500 text-xs md:text-sm">Средний чек</span>
                    <span className="text-white/80 text-base md:text-lg font-bold">
                      {orders.length > 0 ? Math.round(orders.reduce((sum, o) => sum + o.total, 0) / orders.length).toLocaleString() : 0} ₽
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab - адаптивный */}
          {activeTab === 'orders' && (
            <div className="bg-white/5 rounded-xl md:rounded-2xl border border-white/10 overflow-hidden">
              {orders.length === 0 ? (
                <div className="text-center py-12 md:py-16">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                    <i className="fas fa-box-open text-white/30 text-2xl md:text-3xl"></i>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-4">У вас пока нет заказов</p>
                  <Link to="/catalog" className="inline-block bg-white text-black px-5 md:px-6 py-2 text-[10px] md:text-xs font-bold tracking-wider hover:bg-gray-100 transition rounded-lg md:rounded-xl">ПЕРЕЙТИ В КАТАЛОГ</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                      <tr className="text-left">
                        <th className="px-3 md:px-5 py-2 md:py-3 text-gray-500 text-[8px] md:text-[9px] font-bold tracking-wider">НОМЕР</th>
                        <th className="px-3 md:px-5 py-2 md:py-3 text-gray-500 text-[8px] md:text-[9px] font-bold tracking-wider">ДАТА</th>
                        <th className="px-3 md:px-5 py-2 md:py-3 text-gray-500 text-[8px] md:text-[9px] font-bold tracking-wider">СУММА</th>
                        <th className="px-3 md:px-5 py-2 md:py-3 text-gray-500 text-[8px] md:text-[9px] font-bold tracking-wider">СТАТУС</th>
                        <th className="hidden md:table-cell px-5 py-3 text-gray-500 text-[9px] font-bold tracking-wider">АДРЕС</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="px-3 md:px-5 py-2 md:py-3 font-mono text-[10px] md:text-sm text-white/80">#{order.id}</td>
                          <td className="px-3 md:px-5 py-2 md:py-3 text-[10px] md:text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-3 md:px-5 py-2 md:py-3 font-bold text-[10px] md:text-sm text-white">{order.total.toLocaleString()} ₽</td>
                          <td className="px-3 md:px-5 py-2 md:py-3">
                            <span className={`text-[8px] md:text-[10px] font-bold ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="hidden md:table-cell px-5 py-3 text-sm text-gray-500 max-w-xs truncate">{order.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab - исправленные переключатели */}
        {activeTab === 'settings' && (
          <div className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/10">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="w-4 h-px md:w-6 bg-white/40"></div>
              <h2 className="text-white font-black text-xs md:text-base">УВЕДОМЛЕНИЯ</h2>
            </div>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between py-2 md:py-3 border-b border-white/5">
                <div>
                  <p className="text-white font-bold text-xs md:text-sm">Email рассылка</p>
                  <p className="text-gray-500 text-[9px] md:text-xs">Новости о скидках и новинках</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-500/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white/30 rounded-full transition-all duration-300 peer-checked:bg-emerald-500/80 peer-checked:shadow-md peer-checked:shadow-emerald-500/20"></div>
                  <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-5 group-hover:scale-105"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-2 md:py-3 border-b border-white/5">
                <div>
                  <p className="text-white font-bold text-xs md:text-sm">СМС уведомления</p>
                  <p className="text-gray-500 text-[9px] md:text-xs">Статус заказа по SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-500/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-white/30 rounded-full transition-all duration-300 peer-checked:bg-emerald-500/80 peer-checked:shadow-md peer-checked:shadow-emerald-500/20"></div>
                  <div className="absolute left-[2px] top-[2px] w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-5 group-hover:scale-105"></div>
                </label>
              </div>
              <button className="w-full mt-4 md:mt-6 bg-white text-black py-2 rounded-lg text-[10px] md:text-xs font-bold tracking-wider hover:bg-gray-100 transition">СОХРАНИТЬ НАСТРОЙКИ</button>
            </div>
          </div>
        )}

          {/* Logout Button */}
          <div className="mt-6 md:mt-8 text-center">
            <button onClick={handleLogout} className="inline-flex items-center gap-1.5 md:gap-2 text-gray-500 hover:text-red-400 transition text-[9px] md:text-xs">
              <i className="fas fa-sign-out-alt"></i> ВЫЙТИ ИЗ АККАУНТА
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;