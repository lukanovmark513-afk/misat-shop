import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { getAllOrders } from '../../services/storageService';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Дашборд', icon: 'fa-chart-line', color: 'text-blue-500' },
    { path: '/admin/products', label: 'Товары', icon: 'fa-box', color: 'text-green-500' },
    { path: '/admin/orders', label: 'Заказы', icon: 'fa-truck', color: 'text-orange-500' },
    { path: '/admin/categories', label: 'Категории', icon: 'fa-tags', color: 'text-purple-500' },
    { path: '/admin/users', label: 'Пользователи', icon: 'fa-users', color: 'text-indigo-500' },
    { path: '/admin/promocodes', label: 'Промокоды', icon: 'fa-tag', color: 'text-yellow-500' },
    { path: '/admin/chat', label: 'Чат', icon: 'fa-comments', color: 'text-pink-500' },
  ];

  // Проверка на мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Проверка новых заказов
  useEffect(() => {
    const interval = setInterval(() => {
      const orders = getAllOrders();
      const lastCheckTime = localStorage.getItem('last_order_check');
      const newOrders = orders.filter(o =>
        !lastCheckTime || new Date(o.created_at) > new Date(lastCheckTime)
      );

      if (newOrders.length > 0 && newOrders.some(o => o.status === 'pending')) {
        // Звуковое уведомление
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.log('Audio play failed'));

        // Визуальное уведомление
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Новый заказ!', {
            body: `Поступил новый заказ на сумму ${newOrders[0].total.toLocaleString()} ₽`,
            icon: '/logo192.png'
          });
        }

        toast('📦 Новый заказ!', { duration: 5000 });
        localStorage.setItem('last_order_check', new Date().toISOString());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'denied' && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  if (!user || user.role !== 'admin') {
    navigate('/');
    toast.error('У вас нет доступа к админ-панели');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Мобильная кнопка меню */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-6 left-6 z-50 bg-black text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center lg:hidden"
      >
        <i className={`fas fa-${isSidebarOpen ? 'times' : 'bars'} text-xl`}></i>
      </button>

      {/* Затемнение для мобильного меню */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-20 h-full bg-black text-white transition-all duration-300 z-40 ${
        isSidebarOpen ? 'w-64' : 'w-0'
      } overflow-hidden shadow-xl`}>
        <div className="p-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <i className="fas fa-crown text-black text-xl"></i>
            </div>
            {isSidebarOpen && (
              <div>
                <h2 className="font-black text-lg">MISAT ADMIN</h2>
                <p className="text-xs text-gray-400 truncate w-40">{user?.email}</p>
              </div>
            )}
          </div>

          <nav className="space-y-1">
            {menuItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-black'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <i className={`fas ${item.icon} w-5 ${isActive ? item.color : 'text-gray-400'}`}></i>
                  {isSidebarOpen && (
                    <span className={`text-sm font-medium ${isActive ? 'text-black' : 'text-white'}`}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-0 right-0 px-4">
            <hr className="border-gray-800 my-4" />
            <button
              onClick={() => {
                dispatch(logout());
                navigate('/');
                toast.success('Вы вышли из админ-панели');
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/10 transition"
            >
              <i className="fas fa-sign-out-alt w-5 text-gray-400"></i>
              {isSidebarOpen && <span className="text-sm text-white">Выйти</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen && !isMobile ? 'lg:ml-64' : ''}`}>
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;