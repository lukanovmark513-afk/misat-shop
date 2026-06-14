import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Полные ссылки для ПК
  const links = {
    catalog: [
      { to: '/catalog?category=clothes', label: 'Одежда' },
      { to: '/catalog?category=shoes', label: 'Обувь' },
      { to: '/catalog?category=accessories', label: 'Аксессуары' },
      { to: '/catalog?category=sport', label: 'Спорт' },
      { to: '/catalog?category=sale', label: 'Распродажа', sale: true }
    ],
    info: [
      { to: '/about', label: 'О магазине' },
      { to: '/delivery', label: 'Доставка и оплата' },
      { to: '/returns', label: 'Возврат товара' },
      { to: '/faq', label: 'Вопросы и ответы' },
      { to: '/blog', label: 'Блог' }
    ],
    support: [
      { to: '/support', label: 'Служба поддержки' },
      { to: '/contacts', label: 'Контакты' },
      { to: '/tracking', label: 'Отследить заказ' },
      { to: '/gift-card', label: 'Подарочные сертификаты' }
    ]
  };

  const socials = [
    { href: 'https://www.tiktok.com/@misatchina', icon: 'fa-tiktok' },
    { href: 'https://vk.ru/mokidorastore', icon: 'fa-vk' },
    { href: 'https://t.me/misatshop', icon: 'fa-telegram' }
  ];

  const payments = ['fa-cc-visa', 'fa-cc-mastercard', 'fa-cc-mir', 'fa-cc-apple-pay', 'fa-cc-paypal'];

  // Короткие ссылки для мобильной версии
  const mobileNavLinks = [
    { to: '/catalog', label: 'Каталог' },
    { to: '/about', label: 'О нас' },
    { to: '/delivery', label: 'Доставка' },
    { to: '/contacts', label: 'Контакты' }
  ];

  return (
    <footer className="bg-gradient-to-b from-[#0a0a0a] to-black border-t border-white/10">

      {/* ========== МОБИЛЬНАЯ ВЕРСИЯ (до 768px) ========== */}
    <div className="md:hidden px-4 pt-4 pb-20 text-center">
      <Link to="/" className="inline-block text-sm font-bold tracking-wider text-white/60 hover:text-white">
        MISAT
      </Link>
      <div className="flex justify-center gap-4 text-[9px]">
        {mobileNavLinks.map((link) => (
          <Link key={link.to} to={link.to} className="text-gray-500 hover:text-white transition">
            {link.label}
          </Link>
        ))}
      </div>
    </div>

      {/* ========== ПК ВЕРСИЯ (от 768px) ========== */}
      <div className="hidden md:block px-4 md:px-6 lg:px-8 py-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="inline-block mb-3">
                <span className="text-2xl font-black tracking-tighter text-white">MISAT</span>
              </Link>
              <p className="text-gray-400 text-sm mb-3">Минимализм. Качество. Стиль.</p>
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex items-center gap-2"><i className="fas fa-map-marker-alt text-white/30"></i><span>Смоленск, Россия</span></div>
                <div className="flex items-center gap-2"><i className="fas fa-envelope text-white/30"></i><a href="mailto:info@misat.ru" className="hover:text-white transition">info@misat.ru</a></div>
                <div className="flex items-center gap-2"><i className="fas fa-phone text-white/30"></i><a href="tel:+79938843766" className="hover:text-white transition">+7 (993) 884-37-66</a></div>
              </div>
            </div>

            {/* Каталог */}
            <div>
              <h4 className="font-bold mb-3 text-xs uppercase tracking-wider text-white/60">Каталог</h4>
              <ul className="space-y-1.5">
                {links.catalog.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className={`text-gray-400 text-sm hover:text-white transition ${link.sale ? 'text-red-400 hover:text-red-300' : ''}`}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Информация */}
            <div>
              <h4 className="font-bold mb-3 text-xs uppercase tracking-wider text-white/60">Информация</h4>
              <ul className="space-y-1.5">
                {links.info.map(link => (
                  <li key={link.to}><Link to={link.to} className="text-gray-400 text-sm hover:text-white transition">{link.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Поддержка */}
            <div>
              <h4 className="font-bold mb-3 text-xs uppercase tracking-wider text-white/60">Поддержка</h4>
              <ul className="space-y-1.5">
                {links.support.map(link => (
                  <li key={link.to}><Link to={link.to} className="text-gray-400 text-sm hover:text-white transition">{link.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Соцсети и оплата */}
            <div>
              <h4 className="font-bold mb-3 text-xs uppercase tracking-wider text-white/60">Мы в соцсетях</h4>
              <div className="flex gap-3 mb-4">
                {socials.map(social => (
                  <a key={social.icon} href={social.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition text-lg">
                    <i className={`fab ${social.icon}`}></i>
                  </a>
                ))}
              </div>
              <h4 className="font-bold mb-2 text-xs uppercase tracking-wider text-white/60">Принимаем к оплате</h4>
              <div className="flex gap-2 text-xl">
                {payments.map(payment => <i key={payment} className={`fab ${payment} text-gray-500`}></i>)}
              </div>
            </div>
          </div>

          {/* Реквизиты и копирайт */}
          <div className="border-t border-white/10 pt-5 text-center text-xs text-gray-500 space-y-2">
            <p>MISAT | ИНН: 673111219228 | Режим налогообложения: Самозанятый</p>
            <p>© {currentYear} MISAT. Все права защищены.</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/privacy" className="hover:text-white transition">Политика конфиденциальности</Link>
              <Link to="/terms" className="hover:text-white transition">Пользовательское соглашение</Link>
              <Link to="/offer" className="hover:text-white transition">Публичная оферта</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;