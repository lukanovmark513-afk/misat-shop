import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const getPathName = (name: string) => {
    const names: Record<string, string> = {
      'catalog': 'Каталог',
      'product': 'Товар',
      'cart': 'Корзина',
      'checkout': 'Оформление заказа',
      'profile': 'Профиль',
      'orders': 'Заказы',
      'favorites': 'Избранное',
      'support': 'Поддержка',
      'about': 'О нас',
      'delivery': 'Доставка и оплата',
      'returns': 'Возврат',
      'contacts': 'Контакты',
      'faq': 'Вопросы и ответы',
      'blog': 'Блог',
      'tracking': 'Отследить заказ',
      'gift-card': 'Подарочные сертификаты',
      'admin': 'Админ-панель'
    };
    return names[name] || name;
  };

  if (pathnames.length === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      <Link to="/" className="hover:text-black transition">Главная</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        // Пропускаем ID товара в хлебных крошках
        if (!isNaN(Number(name)) && pathnames[index - 1] === 'product') {
          return null;
        }

        return (
          <React.Fragment key={name}>
            <i className="fas fa-chevron-right text-xs"></i>
            {isLast ? (
              <span className="text-black font-medium">{getPathName(name)}</span>
            ) : (
              <Link to={routeTo} className="hover:text-black transition">{getPathName(name)}</Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;