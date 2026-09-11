import React from 'react';
import { Link } from 'react-router-dom';

const DeliveryPage = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black">Главная</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-black">Доставка и оплата</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">ДОСТАВКА И ОПЛАТА</h1>
          <div className="w-20 h-0.5 bg-black mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 mb-6">
            <p className="font-bold text-blue-700">📍 Отправка из Смоленска</p>
            <p className="text-sm text-gray-600 mt-1">Все заказы отправляются из нашего склада в Смоленске</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-green-500">
              <i className="fas fa-box text-2xl text-green-600 mb-2"></i>
              <h3 className="font-bold text-lg">В наличии (РФ)</h3>
              <p className="text-sm text-gray-500 mt-1">Товары со склада в Смоленске</p>
              <ul className="mt-3 space-y-1 text-sm">
                <li>• Доставка по РФ: 2-5 дней</li>
                <li>• Стоимость: 300 ₽</li>
                <li>• Бесплатно от 5000 ₽</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border-l-4 border-orange-500">
              <i className="fas fa-ship text-2xl text-orange-600 mb-2"></i>
              <h3 className="font-bold text-lg">Предзаказ (Китай)</h3>
              <p className="text-sm text-gray-500 mt-1">Товары под заказ из Китая</p>
              <ul className="mt-3 space-y-1 text-sm">
                <li>• Срок доставки: 20-35 дней</li>
                <li>• Стоимость: 500 ₽</li>
                <li>• Трекинг-номер предоставляется</li>
              </ul>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
              <i className="fas fa-credit-card"></i> Способы оплаты
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <i className="fab fa-cc-visa text-3xl mb-2"></i>
                <p className="font-bold text-sm">Банковская карта</p>
                <p className="text-xs text-gray-500">Visa, Mastercard, МИР</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <i className="fas fa-qrcode text-3xl mb-2"></i>
                <p className="font-bold text-sm">СБП</p>
                <p className="text-xs text-gray-500">Система быстрых платежей</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl text-center">
                <i className="fas fa-wallet text-3xl mb-2"></i>
                <p className="font-bold text-sm">Наличные</p>
                <p className="text-xs text-gray-500">При получении</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
            <h3 className="font-bold text-orange-700 mb-2 flex items-center gap-2">
              <i className="fas fa-info-circle"></i>
              Правила предоплаты
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Предоплата 100% — для товаров под заказ из Китая</li>
              <li>• Предоплата 70% — для товаров в наличии (30% при получении)</li>
              <li>• При отказе от заказа предоплата не возвращается</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;