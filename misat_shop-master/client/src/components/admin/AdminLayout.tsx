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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Дашборд', icon: 'fa-chart-line' },
    { path: '/admin/products', label: 'Товары', icon: 'fa-box' },
    { path: '/admin/orders', label: 'Заказы', icon: 'fa-truck' },
    { path: '/admin/categories', label: 'Категории', icon: 'fa-tags' },
    { path: '/admin/brands', label: 'Бренды', icon: 'fa-tag' },
    { path: '/admin/users', label: 'Пользователи', icon: 'fa-users' },
    { path: '/admin/promocodes', label: 'Промокоды', icon: 'fa-ticket' },
    { path: '/admin/chat', label: 'Чат', icon: 'fa-comments' },
  ];

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const orders = getAllOrders();
      const lastCheckTime = localStorage.getItem('last_order_check');
      const newOrders = orders.filter(o =>
        !lastCheckTime || new Date(o.created_at) > new Date(lastCheckTime)
      );

      if (newOrders.length > 0 && newOrders.some(o => o.status === 'pending')) {
        toast('📦 Новый заказ!', { duration: 5000 });
        localStorage.setItem('last_order_check', new Date().toISOString());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!user || user.role !== 'admin') {
    navigate('/');
    toast.error('Нет доступа к админ-панели');
    return null;
  }

  if (isMobile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pt-16">
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-white text-black w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-300"
      >
        <i className={`fas fa-${isSidebarOpen ? 'times' : 'bars'} text-base`}></i>
      </button>

      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-black border-r border-white/10 transition-all duration-300 z-40 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-white/10">
            <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-crown text-white/60 text-sm"></i>
              </div>
              {isSidebarOpen && (
                <div className="flex-1">
                  <div className="text-xs font-bold tracking-wider text-white/60">MISAT ADMIN</div>
                  <div className="text-[9px] text-gray-600 truncate mt-0.5">{user?.email}</div>
                </div>
              )}
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {menuItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-500 hover:bg-white/5 hover:text-white'
                  } ${!isSidebarOpen && 'justify-center'}`}
                >
                  <i className={`fas ${item.icon} w-4 text-sm flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500'}`}></i>
                  {isSidebarOpen && <span className="text-xs font-medium">{item.label}</span>}
                  {isActive && isSidebarOpen && <div className="ml-auto w-1 h-1 rounded-full bg-white"></div>}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={() => {
                dispatch(logout());
                navigate('/');
                toast.success('Вы вышли из админ-панели');
              }}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all duration-200 ${!isSidebarOpen && 'justify-center'}`}
            >
              <i className="fas fa-sign-out-alt w-4 text-sm text-gray-500 flex-shrink-0"></i>
              {isSidebarOpen && <span className="text-xs text-gray-500">Выйти</span>}
            </button>
          </div>
        </div>
      </aside>

      <main className={`transition-all duration-300 min-h-screen ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
