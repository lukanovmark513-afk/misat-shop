import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ReturnsPage = () => {
  const [formData, setFormData] = useState({
    orderNumber: '',
    productName: '',
    reason: '',
    comment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderNumber || !formData.reason) {
      toast.error('Заполните обязательные поля');
      return;
    }
    toast.success('Заявка на возврат отправлена! Мы свяжемся с вами.');
    setFormData({ orderNumber: '', productName: '', reason: '', comment: '' });
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black">Главная</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-black">Возврат товара</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">ВОЗВРАТ ТОВАРА</h1>
          <div className="w-20 h-0.5 bg-black mx-auto"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 mb-8">
            <p className="text-green-700 text-sm">
              <i className="fas fa-check-circle mr-2"></i>
              Вы можете вернуть товар в течение 30 дней после получения
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="font-black mb-3">Условия возврата</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-500 mt-0.5"></i> Товар не был в использовании</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-500 mt-0.5"></i> Сохранены фабричные ярлыки</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-green-500 mt-0.5"></i> Оригинальная упаковка</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="font-black mb-3">Возврат не принимается</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><i className="fas fa-times text-red-500 mt-0.5"></i> Нижнее бельё и купальники</li>
                <li className="flex items-start gap-2"><i className="fas fa-times text-red-500 mt-0.5"></i> Носки и чулочно-носочные изделия</li>
                <li className="flex items-start gap-2"><i className="fas fa-times text-red-500 mt-0.5"></i> Товары со следами использования</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-6 rounded-2xl">
            <h2 className="text-xl font-black mb-4">Оформить возврат</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Номер заказа *</label>
                <input
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  placeholder="Например: MISAT-1234567890"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Название товара</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="Например: Худи Oversized"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Причина возврата *</label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                  required
                >
                  <option value="">Выберите причину</option>
                  <option value="Не подошёл размер">Не подошёл размер</option>
                  <option value="Не понравился цвет/модель">Не понравился цвет/модель</option>
                  <option value="Брак/дефект">Брак/дефект</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Комментарий</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none resize-none"
                  placeholder="Опишите подробнее..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-xl font-black hover:bg-gray-800 transition"
              >
                ОТПРАВИТЬ ЗАЯВКУ
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;