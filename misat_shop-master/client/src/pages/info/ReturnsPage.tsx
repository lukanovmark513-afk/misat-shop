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
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <i className="fas fa-chevron-right text-[9px]"></i>
          <span className="text-white">Возврат товара</span>
        </div>

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-10">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="Returns"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-10 px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-white/40"></div>
              <span className="text-gray-400 text-[10px] tracking-[0.3em]">ВОЗВРАТ</span>
              <div className="w-8 h-0.5 bg-white/40"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              ВОЗВРАТ ТОВАРА
            </h1>
            <p className="text-gray-400 text-sm mt-3">Вы можете вернуть товар в течение 30 дней после получения</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">

          {/* Информационные карточки */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">

            {/* Условия возврата */}
            <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-3">
                <i className="fas fa-check-circle text-emerald-400 text-xl"></i>
                <h3 className="text-white font-black text-lg">Условия возврата</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2"><i className="fas fa-check text-emerald-400 text-xs mt-0.5"></i> Товар не был в использовании</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-emerald-400 text-xs mt-0.5"></i> Сохранены фабричные ярлыки</li>
                <li className="flex items-start gap-2"><i className="fas fa-check text-emerald-400 text-xs mt-0.5"></i> Оригинальная упаковка</li>
              </ul>
            </div>

            {/* Возврат не принимается */}
            <div className="bg-red-500/10 rounded-2xl p-6 border border-red-500/30">
              <div className="flex items-center gap-2 mb-3">
                <i className="fas fa-times-circle text-red-400 text-xl"></i>
                <h3 className="text-white font-black text-lg">Возврат не принимается</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2"><i className="fas fa-times text-red-400 text-xs mt-0.5"></i> Нижнее бельё и купальники</li>
                <li className="flex items-start gap-2"><i className="fas fa-times text-red-400 text-xs mt-0.5"></i> Носки и чулочно-носочные изделия</li>
                <li className="flex items-start gap-2"><i className="fas fa-times text-red-400 text-xs mt-0.5"></i> Товары со следами использования</li>
              </ul>
            </div>
          </div>

          {/* Форма возврата */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-white font-black text-2xl mb-5 flex items-center gap-2">
              <i className="fas fa-reply-all text-white/40 text-lg"></i> Оформить возврат
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">НОМЕР ЗАКАЗА *</label>
                <input
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  placeholder="Например: MISAT-1234567890"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">НАЗВАНИЕ ТОВАРА</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="Например: Худи Oversized"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">ПРИЧИНА ВОЗВРАТА *</label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-white/30 focus:outline-none transition"
                  required
                >
                  <option value="" className="bg-[#0a0a0a]">Выберите причину</option>
                  <option value="Не подошёл размер" className="bg-[#0a0a0a]">Не подошёл размер</option>
                  <option value="Не понравился цвет/модель" className="bg-[#0a0a0a]">Не понравился цвет/модель</option>
                  <option value="Брак/дефект" className="bg-[#0a0a0a]">Брак/дефект</option>
                  <option value="Другое" className="bg-[#0a0a0a]">Другое</option>
                </select>
              </div>

              <div>
                <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">КОММЕНТАРИЙ</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition resize-none"
                  placeholder="Опишите подробнее..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-3.5 rounded-xl font-black text-sm tracking-wider hover:bg-white/90 transition mt-2"
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