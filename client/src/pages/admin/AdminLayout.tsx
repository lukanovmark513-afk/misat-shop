import React, { useState } from 'react';
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

  const menuItems = [
    { path: '/admin', label: 'Дашборд', icon: 'fa-chart-line', color: 'text-blue-500' },
    { path: '/admin/products', label: 'Товары', icon: 'fa-box', color: 'text-green-500' },
    { path: '/admin/orders', label: 'Заказы', icon: 'fa-truck', color: 'text-orange-500' },
    { path: '/admin/categories', label: 'Категории', icon: 'fa-tags', color: 'text-purple-500' },
    { path: '/admin/users', label: 'Пользователи', icon: 'fa-users', color: 'text-indigo-500' },
  ];

  // Проверка прав доступа
  if (!user || user.role !== 'admin') {
    navigate('/');
    toast.error('У вас нет доступа к админ-панели');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-50 bg-black text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
      >
        <i className={`fas fa-${isSidebarOpen ? 'times' : 'bars'}`}></i>
      </button>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-20 h-full bg-black text-white transition-all duration-300 z-40 ${
        isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'
      } overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <i className="fas fa-crown text-black text-xl"></i>
            </div>
            {isSidebarOpen && (
              <div>
                <h2 className="font-black text-lg">MISAT ADMIN</h2>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            )}
          </div>

          <nav className="space-y-2">
            {menuItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
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
                  {isActive && isSidebarOpen && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-6 left-0 right-0 px-6">
            <hr className="border-gray-800 my-4" />
            <button
              onClick={() => {
                dispatch(logout());
                navigate('/');
                toast.success('Вы вышли из админ-панели');
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              <i className="fas fa-sign-out-alt w-5 text-gray-400"></i>
              {isSidebarOpen && <span className="text-sm text-white">Выйти</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;