import React from 'react';
import { Link } from 'react-router-dom';

const DeliveryPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <i className="fas fa-chevron-right text-[9px]"></i>
          <span className="text-white">Доставка и оплата</span>
        </div>

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-10">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="Delivery"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-10 px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-white/40"></div>
              <span className="text-gray-400 text-[10px] tracking-[0.3em]">ИНФОРМАЦИЯ</span>
              <div className="w-8 h-0.5 bg-white/40"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              ДОСТАВКА И ОПЛАТА
            </h1>
            <p className="text-gray-400 text-sm mt-3">Все заказы отправляются из нашего склада в Смоленске</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">

          {/* Типы доставки */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">

            {/* Доставка по РФ */}
            <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <i className="fas fa-box text-emerald-400 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-black text-lg">В наличии (РФ)</h3>
                  <p className="text-emerald-400 text-xs">Товары со склада в Смоленске</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-400 text-xs"></i> Доставка по РФ: 2-5 дней</li>
                <li className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-400 text-xs"></i> Стоимость: 300 ₽</li>
                <li className="flex items-center gap-2"><i className="fas fa-check-circle text-emerald-400 text-xs"></i> Бесплатно от 5000 ₽</li>
              </ul>
            </div>

            {/* Предзаказ из Китая */}
            <div className="bg-orange-500/10 rounded-2xl p-6 border border-orange-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <i className="fas fa-ship text-orange-400 text-xl"></i>
                </div>
                <div>
                  <h3 className="text-white font-black text-lg">Предзаказ (Китай)</h3>
                  <p className="text-orange-400 text-xs">Товары под заказ из Китая</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2"><i className="fas fa-check-circle text-orange-400 text-xs"></i> Срок доставки: 20-35 дней</li>
                <li className="flex items-center gap-2"><i className="fas fa-check-circle text-orange-400 text-xs"></i> Стоимость: 500 ₽</li>
                <li className="flex items-center gap-2"><i className="fas fa-check-circle text-orange-400 text-xs"></i> Трекинг-номер предоставляется</li>
              </ul>
            </div>
          </div>

          {/* Способы оплаты */}
          <div className="mb-10">
            <h2 className="text-white font-black text-2xl mb-5 flex items-center gap-2">
              <i className="fas fa-credit-card text-white/40 text-xl"></i> Способы оплаты
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-5 text-center border border-white/10 hover:border-white/30 transition-all duration-300">
                <div className="w-12 h-12 mx-auto bg-white/10 rounded-xl flex items-center justify-center mb-3">
                  <i className="fab fa-cc-visa text-white/60 text-2xl"></i>
                </div>
                <p className="text-white font-bold text-sm">Банковская карта</p>
                <p className="text-gray-500 text-xs mt-1">Visa, Mastercard, МИР</p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 text-center border border-white/10 hover:border-white/30 transition-all duration-300">
                <div className="w-12 h-12 mx-auto bg-white/10 rounded-xl flex items-center justify-center mb-3">
                  <i className="fas fa-qrcode text-white/60 text-2xl"></i>
                </div>
                <p className="text-white font-bold text-sm">СБП</p>
                <p className="text-gray-500 text-xs mt-1">Система быстрых платежей</p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 text-center border border-white/10 hover:border-white/30 transition-all duration-300">
                <div className="w-12 h-12 mx-auto bg-white/10 rounded-xl flex items-center justify-center mb-3">
                  <i className="fas fa-wallet text-white/60 text-2xl"></i>
                </div>
                <p className="text-white font-bold text-sm">Наличные</p>
                <p className="text-gray-500 text-xs mt-1">При получении</p>
              </div>
            </div>
          </div>

          {/* Правила предоплаты */}
          <div className="bg-orange-500/10 rounded-2xl p-6 border border-orange-500/30">
            <h3 className="font-bold text-orange-400 mb-3 flex items-center gap-2">
              <i className="fas fa-info-circle text-orange-400"></i>
              Правила предоплаты
            </h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li className="flex items-center gap-2"><i className="fas fa-circle text-[6px] text-orange-400"></i> Предоплата 100% — для товаров под заказ из Китая</li>
              <li className="flex items-center gap-2"><i className="fas fa-circle text-[6px] text-orange-400"></i> Предоплата 70% — для товаров в наличии (30% при получении)</li>
              <li className="flex items-center gap-2"><i className="fas fa-circle text-[6px] text-orange-400"></i> При отказе от заказа предоплата не возвращается</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;