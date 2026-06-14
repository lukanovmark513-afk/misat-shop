import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <i className="fas fa-chevron-right text-[9px]"></i>
          <span className="text-white">О нас</span>
        </div>

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-10">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="About"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-10 px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-white/40"></div>
              <span className="text-gray-400 text-[10px] tracking-[0.3em]">КОМПАНИЯ</span>
              <div className="w-8 h-0.5 bg-white/40"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              О НАС
            </h1>
            <p className="text-gray-400 text-sm mt-3 max-w-2xl mx-auto">
              MISAT — ваш надёжный партнёр в мире стильной и качественной одежды
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">

          {/* Кто мы */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8 mb-8">
            <h2 className="text-white font-black text-2xl mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-white/40"></span> Кто мы
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              MISAT — это современный интернет-магазин одежды, основанный в 2024 году.
              Мы объединили минималистичный дизайн, высокое качество и доступные цены.
            </p>
          </div>

          {/* Наша миссия */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8 mb-8">
            <h2 className="text-white font-black text-2xl mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-white/40"></span> Наша миссия
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Сделать качественную и стильную одежду доступной для каждого.
            </p>
          </div>

          {/* Почему выбирают нас */}
          <div className="mb-8">
            <h2 className="text-white font-black text-2xl mb-6 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-white/40"></span> Почему выбирают нас
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mx-auto bg-white/10 rounded-xl flex items-center justify-center mb-3">
                  <i className="fas fa-truck-fast text-white/60 text-2xl"></i>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Быстрая доставка</h3>
                <p className="text-gray-400 text-sm">Доставка по всей России от 2 до 5 дней</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mx-auto bg-white/10 rounded-xl flex items-center justify-center mb-3">
                  <i className="fas fa-arrows-spin text-white/60 text-2xl"></i>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Лёгкий возврат</h3>
                <p className="text-gray-400 text-sm">Возврат товара в течение 30 дней</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 mx-auto bg-white/10 rounded-xl flex items-center justify-center mb-3">
                  <i className="fas fa-shield-alt text-white/60 text-2xl"></i>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Гарантия качества</h3>
                <p className="text-gray-400 text-sm">Оригинальная продукция</p>
              </div>
            </div>
          </div>

          {/* Реквизиты */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8 mb-8">
            <h2 className="text-white font-black text-2xl mb-4 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-white/40"></span> Реквизиты
            </h2>
            <div className="space-y-2 text-gray-300 text-sm">
              <p><span className="text-white font-bold">ИП MISAT</span></p>
              <p>ИНН: 1234567890</p>
              <p>ОГРНИП: 323456789012345</p>
            </div>
          </div>

          {/* Соцсети */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8 text-center">
            <h2 className="text-white font-black text-2xl mb-4 flex items-center justify-center gap-2">
              <span className="w-6 h-0.5 bg-white/40"></span> Наши соцсети
            </h2>
            <div className="flex justify-center gap-5 text-3xl">
              <a href="https://t.me/misatshop" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300">
                <i className="fab fa-telegram text-white/70 text-xl"></i>
              </a>
              <a href="https://vk.ru/mokidorastore" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300">
                <i className="fab fa-vk text-white/70 text-xl"></i>
              </a>
              <a href="https://www.tiktok.com/@misatchina" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300">
                <i className="fab fa-tiktok text-white/70 text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;