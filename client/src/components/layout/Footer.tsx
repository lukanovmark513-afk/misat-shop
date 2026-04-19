import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4 hover:opacity-80 transition">
              <span className="text-2xl font-black tracking-tighter">MISAT</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Минимализм. Качество. Стиль.
            </p>
            <p className="text-gray-500 text-xs mt-4">
              © {currentYear} Все права защищены
            </p>
          </div>

          {/* Каталог */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Каталог</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/catalog?category=clothes" className="hover:text-white transition">Одежда</Link></li>
              <li><Link to="/catalog?category=shoes" className="hover:text-white transition">Обувь</Link></li>
              <li><Link to="/catalog?category=accessories" className="hover:text-white transition">Аксессуары</Link></li>
              <li><Link to="/catalog?category=sport" className="hover:text-white transition">Спорт</Link></li>
              <li><Link to="/catalog?category=sale" className="hover:text-white transition">Распродажа</Link></li>
            </ul>
          </div>

          {/* Информация */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Информация</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/about" className="hover:text-white transition">О магазине</Link></li>
              <li><Link to="/delivery" className="hover:text-white transition">Доставка и оплата</Link></li>
              <li><Link to="/returns" className="hover:text-white transition">Возврат товара</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">Вопросы и ответы</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Блог</Link></li>
            </ul>
          </div>

          {/* Поддержка */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Поддержка</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/support" className="hover:text-white transition">Служба поддержки</Link></li>
              <li><Link to="/contacts" className="hover:text-white transition">Контакты</Link></li>
              <li><Link to="/tracking" className="hover:text-white transition">Отследить заказ</Link></li>
              <li><Link to="/gift-card" className="hover:text-white transition">Подарочные сертификаты</Link></li>
            </ul>
          </div>

          {/* Соцсети и оплата */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Мы в соцсетях</h4>
            <div className="flex gap-4 text-2xl mb-6">
              <a href="https://www.tiktok.com/@misatchina" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
                <i className="fab fa-tiktok"></i>
              </a>
              <a href="https://vk.ru/mokidorastore" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
                <i className="fab fa-vk"></i>
              </a>
              <a href="https://t.me/misatshop" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition">
                <i className="fab fa-telegram"></i>
              </a>
            </div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Принимаем к оплате</h4>
            <div className="flex gap-3 text-2xl">
              <i className="fab fa-cc-visa text-gray-500"></i>
              <i className="fab fa-cc-mastercard text-gray-500"></i>
              <i className="fab fa-cc-mir text-gray-500"></i>
              <i className="fab fa-cc-apple-pay text-gray-500"></i>
              <i className="fab fa-cc-paypal text-gray-500"></i>
            </div>
          </div>
        </div>

        {/* Реквизиты и ИНН - ИСПРАВЛЕНО */}
        <div className="border-t border-gray-800 pt-8 mb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-gray-600">
              ИП MISAT | ИНН: 673111219228
            </p>
            <p className="text-xs text-gray-600">
              Режим налогообложения: Самозанятый
            </p>
          </div>
        </div>

        {/* Нижняя полоса */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} MISAT. Все права защищены.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
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
