import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, register, logout } from '../store/slices/authSlice';
import { getUserOrders } from '../services/storageService';
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
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: ''
  });

  // Обновление баланса
  useEffect(() => {
    if (user) {
      setUserBalance(user.balance || 0);
    }
    const handleBalanceUpdate = () => {
      const updatedUser = JSON.parse(localStorage.getItem('misat_current_user') || '{}');
      setUserBalance(updatedUser.balance || 0);
    };
    window.addEventListener('balanceUpdated', handleBalanceUpdate);
    return () => window.removeEventListener('balanceUpdated', handleBalanceUpdate);
  }, [user]);

  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) return { isValid: false, message: 'Пароль должен содержать минимум 8 символов' };
    if (!/[A-Z]/.test(password)) return { isValid: false, message: 'Пароль должен содержать хотя бы одну заглавную букву' };
    if (!/[a-z]/.test(password)) return { isValid: false, message: 'Пароль должен содержать хотя бы одну строчную букву' };
    if (!/[0-9]/.test(password)) return { isValid: false, message: 'Пароль должен содержать хотя бы одну цифру' };
    return { isValid: true, message: '' };
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
    }
    if (isLoginMode) {
      const result = await dispatch(login({ email: formData.email, password: formData.password }) as any);
      if (result.payload?.user) {
        toast.success(`Добро пожаловать, ${result.payload.user.first_name || result.payload.user.email}!`);
        setFormData({ email: '', password: '', confirmPassword: '', first_name: '', last_name: '', phone: '' });
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
        toast.success('Регистрация успешна!');
        setIsLoginMode(true);
        setFormData({ email: '', password: '', confirmPassword: '', first_name: '', last_name: '', phone: '' });
      } else {
        toast.error(result.error?.message || 'Ошибка регистрации');
      }
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
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <i className="fas fa-user-circle text-6xl text-gray-400 mb-4"></i>
              <h1 className="text-3xl font-black tracking-tighter">{isLoginMode ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}</h1>
              <div className="w-16 h-0.5 bg-black mx-auto mt-4"></div>
            </div>
            <form onSubmit={handleAuth} className="bg-white border-2 border-black p-8">
              {!isLoginMode && (
                <>
                  <div className="mb-4"><label className="block text-sm font-black mb-2">ИМЯ *</label><input type="text" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition" required /></div>
                  <div className="mb-4"><label className="block text-sm font-black mb-2">ФАМИЛИЯ *</label><input type="text" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition" required /></div>
                  <div className="mb-4"><label className="block text-sm font-black mb-2">ТЕЛЕФОН</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition" /></div>
                </>
              )}
              <div className="mb-4"><label className="block text-sm font-black mb-2">EMAIL *</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition" required /></div>
              <div className="mb-4"><label className="block text-sm font-black mb-2">ПАРОЛЬ *</label><input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition" required />
                {!isLoginMode && <p className="text-xs text-gray-500 mt-1">Пароль: минимум 8 символов, заглавная и строчная буква, цифра</p>}
              </div>
              {!isLoginMode && <div className="mb-6"><label className="block text-sm font-black mb-2">ПОДТВЕРДИТЕ ПАРОЛЬ *</label><input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition" required /></div>}
              <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 font-black tracking-wider hover:bg-gray-800 transition disabled:opacity-50">{loading ? 'ЗАГРУЗКА...' : (isLoginMode ? 'ВОЙТИ' : 'ЗАРЕГИСТРИРОВАТЬСЯ')}</button>
            </form>
            <div className="text-center mt-6"><button onClick={() => setIsLoginMode(!isLoginMode)} className="text-sm text-gray-500 hover:text-black transition">{isLoginMode ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}</button></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter">ПРИВЕТ, {user?.first_name?.toUpperCase() || user?.email?.split('@')[0]?.toUpperCase()}!</h1>
          <p className="text-gray-500 mt-2">Добро пожаловать в личный кабинет MISAT</p>
        </div>
        <div className="flex border-b-2 border-black mb-8">
          <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 font-black tracking-wider transition ${activeTab === 'profile' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>ПРОФИЛЬ</button>
          <button onClick={() => setActiveTab('orders')} className={`px-6 py-3 font-black tracking-wider transition ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>ЗАКАЗЫ ({orders.length})</button>
          <button onClick={() => setActiveTab('settings')} className={`px-6 py-3 font-black tracking-wider transition ${activeTab === 'settings' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>НАСТРОЙКИ</button>
        </div>
        {activeTab === 'profile' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border-2 border-black p-6">
              <h2 className="text-xl font-black mb-4">ИНФОРМАЦИЯ О ПРОФИЛЕ</h2>
              <div className="space-y-3">
                <div><p className="text-xs text-gray-500 font-black">EMAIL</p><p className="text-lg">{user?.email}</p></div>
                <div><p className="text-xs text-gray-500 font-black">ИМЯ</p><p className="text-lg">{user?.first_name || 'Не указано'}</p></div>
                <div><p className="text-xs text-gray-500 font-black">ФАМИЛИЯ</p><p className="text-lg">{user?.last_name || 'Не указано'}</p></div>
                <div><p className="text-xs text-gray-500 font-black">ТЕЛЕФОН</p><p className="text-lg">{user?.phone || 'Не указан'}</p></div>
                <div><p className="text-xs text-gray-500 font-black">РОЛЬ</p><p className="text-lg capitalize">{user?.role || 'Пользователь'}</p></div>

                {/* Блок баланса с кнопкой ПОПОЛНИТЬ */}
                <div className="bg-green-50 p-3 rounded-xl mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500 font-black">БАЛАНС</p>
                      <p className="text-2xl font-black text-green-600">{userBalance.toLocaleString()} ₽</p>
                    </div>
                    <Link to="/balance-topup" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition">
                      ПОПОЛНИТЬ
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t">
                <button onClick={() => setShowChangePassword(!showChangePassword)} className="text-sm text-gray-500 hover:text-black transition flex items-center gap-2"><i className="fas fa-key"></i>{showChangePassword ? 'Отмена' : 'Сменить пароль'}</button>
                {showChangePassword && (
                  <div className="mt-4 space-y-3">
                    <input type="password" placeholder="Новый пароль" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    <input type="password" placeholder="Подтвердите новый пароль" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm" />
                    {passwordError && <p className="text-red-500 text-xs">{passwordError}</p>}
                    <p className="text-xs text-gray-400">Пароль: минимум 8 символов, заглавная и строчная буква, цифра</p>
                    <button onClick={handleChangePassword} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">Сохранить пароль</button>
                  </div>
                )}
              </div>
            </div>
            <div className="border-2 border-black p-6">
              <h2 className="text-xl font-black mb-4">СТАТИСТИКА</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2"><span>Всего заказов:</span><span className="font-black text-xl">{orders.length}</span></div>
                <div className="flex justify-between items-center border-b pb-2"><span>Общая сумма:</span><span className="font-black text-xl">{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()} ₽</span></div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'orders' && (
          <div className="border-2 border-black overflow-hidden">
            {orders.length === 0 ? (
              <div className="text-center py-12"><i className="fas fa-box-open text-5xl text-gray-300 mb-4"></i><p className="text-gray-500 mb-4">У вас пока нет заказов</p><Link to="/catalog" className="inline-block bg-black text-white px-6 py-2 text-sm font-black tracking-wider hover:bg-gray-800 transition">ПЕРЕЙТИ В КАТАЛОГ</Link></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full"><thead className="bg-gray-50 border-b"><tr className="text-left"><th className="px-6 py-4 text-sm font-black">НОМЕР</th><th className="px-6 py-4 text-sm font-black">ДАТА</th><th className="px-6 py-4 text-sm font-black">СУММА</th><th className="px-6 py-4 text-sm font-black">СТАТУС</th><th className="px-6 py-4 text-sm font-black">АДРЕС</th></tr></thead>
                  <tbody>{orders.map(order => (<tr key={order.id} className="border-b hover:bg-gray-50"><td className="px-6 py-4 font-mono text-sm">{order.id}</td><td className="px-6 py-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td><td className="px-6 py-4 font-black">{order.total.toLocaleString()} ₽</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-black ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span></td><td className="px-6 py-4 text-sm max-w-xs truncate">{order.address}</td></tr>))}</tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="border-2 border-black p-6">
            <h2 className="text-xl font-black mb-4">НАСТРОЙКИ</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b"><div><p className="font-black">Email рассылка</p><p className="text-sm text-gray-500">Получать новости о скидках и новинках</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" defaultChecked /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div></label></div>
              <div className="flex items-center justify-between py-3 border-b"><div><p className="font-black">СМС уведомления</p><p className="text-sm text-gray-500">Получать статус заказа по SMS</p></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div></label></div>
              <button className="w-full mt-6 bg-black text-white py-3 font-black tracking-wider hover:bg-gray-800 transition">СОХРАНИТЬ НАСТРОЙКИ</button>
            </div>
          </div>
        )}
        <div className="mt-8 text-center"><button onClick={handleLogout} className="inline-flex items-center gap-2 text-gray-500 hover:text-red-500 transition"><i className="fas fa-sign-out-alt"></i> ВЫЙТИ ИЗ АККАУНТА</button></div>
      </div>
    </div>
  );
};

export default ProfilePage;