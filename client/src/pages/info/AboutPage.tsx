import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black">Главная</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-black">О нас</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">О НАС</h1>
          <div className="w-20 h-0.5 bg-black mx-auto"></div>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            MISAT — ваш надёжный партнёр в мире стильной и качественной одежды
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-black mb-4">Кто мы</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              MISAT — это современный интернет-магазин одежды, основанный в 2024 году.
              Мы объединили минималистичный дизайн, высокое качество и доступные цены.
            </p>

            <h2 className="text-2xl font-black mb-4 mt-8">Наша миссия</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Сделать качественную и стильную одежду доступной для каждого.
            </p>

            <h2 className="text-2xl font-black mb-4 mt-8">Почему выбирают нас</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <i className="fas fa-truck-fast text-3xl text-black mb-3"></i>
                <h3 className="font-bold text-lg mb-2">Быстрая доставка</h3>
                <p className="text-gray-500 text-sm">Доставка по всей России от 2 до 5 дней</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <i className="fas fa-arrows-spin text-3xl text-black mb-3"></i>
                <h3 className="font-bold text-lg mb-2">Лёгкий возврат</h3>
                <p className="text-gray-500 text-sm">Возврат товара в течение 30 дней</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl text-center">
                <i className="fas fa-shield-alt text-3xl text-black mb-3"></i>
                <h3 className="font-bold text-lg mb-2">Гарантия качества</h3>
                <p className="text-gray-500 text-sm">Оригинальная продукция</p>
              </div>
            </div>

            <h2 className="text-2xl font-black mb-4 mt-8">Реквизиты</h2>
            <div className="bg-gray-50 p-6 rounded-2xl mb-8">
              <div className="space-y-2 text-sm">
                <p><span className="font-bold">ИП MISAT</span></p>
                <p>ИНН: 1234567890</p>
                <p>ОГРНИП: 323456789012345</p>
                <p>Юридический адрес: 214000, г. Смоленск, ул. Большая Советская, д. 25, офис 101</p>
              </div>
            </div>

            <h2 className="text-2xl font-black mb-4">Наши соцсети</h2>
            <div className="flex gap-4 text-3xl mb-8">
              <a href="https://t.me/misatshop" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 transition">
                <i className="fab fa-telegram"></i>
              </a>
              <a href="https://vk.ru/mokidorastore" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 transition">
                <i className="fab fa-vk"></i>
              </a>
              <a href="https://www.tiktok.com/@misatchina" target="_blank" rel="noopener noreferrer" className="hover:text-gray-500 transition">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;