import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    { path: '/admin', label: 'Дашборд', icon: 'fa-chart-line' },
    { path: '/admin/products', label: 'Товары', icon: 'fa-box' },
    { path: '/admin/orders', label: 'Заказы', icon: 'fa-truck' },
    { path: '/admin/categories', label: 'Категории', icon: 'fa-tags' },
    { path: '/admin/users', label: 'Пользователи', icon: 'fa-users' },
    { path: '/admin/promocodes', label: 'Промокоды', icon: 'fa-tag' },
  ];

  if (!user || user.role !== 'admin') {
    navigate('/');
    toast.error('У вас нет доступа к админ-панели');
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-white text-black w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:bg-gray-100 transition-all duration-300"
      >
        <i className={`fas fa-${isSidebarOpen ? 'times' : 'bars'} text-base`}></i>
      </button>

      {/* Sidebar - тёмный стиль */}
      <aside className={`fixed left-0 top-0 h-full bg-black border-r border-white/10 transition-all duration-300 z-40 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } overflow-hidden`}>
        <div className="p-5">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <i className="fas fa-crown text-white/60 text-sm"></i>
            </div>
            {isSidebarOpen && (
              <span className="text-xs font-bold tracking-wider text-white/60">MISAT ADMIN</span>
            )}
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-500 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <i className={`fas ${item.icon} w-4 text-sm ${isActive ? 'text-white' : 'text-gray-500'}`}></i>
                  {isSidebarOpen && (
                    <span className="text-xs font-medium">{item.label}</span>
                  )}
                  {isActive && isSidebarOpen && (
                    <div className="ml-auto w-1 h-1 rounded-full bg-white"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-6 left-0 right-0 px-5">
            <div className="border-t border-white/10 mb-4"></div>
            <button
              onClick={() => {
                dispatch(logout());
                navigate('/');
                toast.success('Вы вышли из админ-панели');
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              <i className="fas fa-sign-out-alt w-4 text-sm text-gray-500"></i>
              {isSidebarOpen && <span className="text-xs text-gray-500">Выйти</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 min-h-screen ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;