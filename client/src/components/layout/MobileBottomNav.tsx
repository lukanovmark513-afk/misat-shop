import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

const MobileBottomNav = () => {
  const location = useLocation();
  const cartItems = useAppSelector((state) => state.cart.items);

  const getCartItemsCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const navItems = [
    { path: '/', icon: 'fa-house', label: 'Главная' },
    { path: '/catalog', icon: 'fa-store', label: 'Каталог' },
    { path: '/favorites', icon: 'fa-heart', label: 'Избранное' },
    { path: '/cart', icon: 'fa-bag-shopping', label: 'Корзина', badge: true },
    { path: '/profile', icon: 'fa-user', label: 'Профиль' }
  ];

  const cartCount = getCartItemsCount();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Увеличенная тень сверху */}
      <div className="absolute -top-8 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>

      <div className="bg-black/95 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 py-2 px-3 relative group"
              >
                {/* Активный индикатор - увеличенный */}
                {isActive && (
                  <div className="absolute -top-3 w-8 h-1 bg-white rounded-full"></div>
                )}

                {/* Иконка - увеличенная */}
                <div className="relative">
                  <i
                    className={`fas ${item.icon} text-xl transition-all duration-200 ${
                      isActive
                        ? 'text-white scale-110'
                        : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  ></i>

                  {/* Бейдж корзины - увеличенный */}
                  {item.badge && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>

                {/* Текст - увеличенный */}
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Безопасная зона для iPhone */}
        <div className="h-[env(safe-area-inset-bottom)]"></div>
      </div>
    </div>
  );
};

export default MobileBottomNav;