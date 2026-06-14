import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    condition: 'new',
    description: '',
    location: '',
    phone: '',
    images: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'clothes', label: 'Одежда', icon: 'fa-tshirt' },
    { value: 'shoes', label: 'Обувь', icon: 'fa-shoe-prints' },
    { value: 'accessories', label: 'Аксессуары', icon: 'fa-gem' },
    { value: 'bags', label: 'Сумки', icon: 'fa-bag-shopping' },
    { value: 'watches', label: 'Часы', icon: 'fa-clock' },
  ];

  const conditions = [
    { value: 'new', label: 'Новый', color: 'green' },
    { value: 'like-new', label: 'Как новый', color: 'blue' },
    { value: 'good', label: 'Хорошее', color: 'yellow' },
    { value: 'fair', label: 'Удовлетворительное', color: 'orange' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.price || !formData.description || !formData.location) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Объявление отправлено на модерацию! Ожидайте публикации.');
      setIsSubmitting(false);
      navigate('/my-listings');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">
        <div className="max-w-3xl mx-auto">

          {/* ========== БАННЕР СТРАНИЦЫ ========== */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-8">
            <div className="absolute inset-0 opacity-20">
              <img
                src="/images/brands/raspr.jpg"
                alt="Sell"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

            <div className="relative py-8 px-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-0.5 bg-white/40"></div>
                <span className="text-gray-400 text-[10px] tracking-[0.3em]">ПРОДАТЬ</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                ПРОДАТЬ ВЕЩЬ
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                Разместите объявление о продаже
              </p>
            </div>
          </div>

          {/* ========== ФОРМА ========== */}
          <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10">

            {/* Название товара */}
            <div className="mb-6">
              <label className="text-white/40 text-xs font-bold block mb-2 tracking-wider">НАЗВАНИЕ ТОВАРА *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Например: Кожаная куртка MISAT"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition duration-300"
                required
              />
            </div>

            {/* Категория */}
            <div className="mb-6">
              <label className="text-white/40 text-xs font-bold block mb-3 tracking-wider">КАТЕГОРИЯ *</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-3 rounded-xl text-center transition-all duration-300 ${
                      formData.category === cat.value
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    <i className={`fas ${cat.icon} text-xl mb-1 block`}></i>
                    <span className="text-xs">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Цена */}
            <div className="mb-6">
              <label className="text-white/40 text-xs font-bold block mb-2 tracking-wider">ЦЕНА *</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition duration-300 pr-12"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">₽</span>
              </div>
            </div>

            {/* Состояние */}
            <div className="mb-6">
              <label className="text-white/40 text-xs font-bold block mb-3 tracking-wider">СОСТОЯНИЕ *</label>
              <div className="flex flex-wrap gap-3">
                {conditions.map(cond => (
                  <button
                    key={cond.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, condition: cond.value })}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                      formData.condition === cond.value
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Описание */}
            <div className="mb-6">
              <label className="text-white/40 text-xs font-bold block mb-2 tracking-wider">ОПИСАНИЕ *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Опишите товар: размер, цвет, материал, особенности..."
                rows={5}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition duration-300 resize-none"
                required
              />
            </div>

            {/* Локация */}
            <div className="mb-6">
              <label className="text-white/40 text-xs font-bold block mb-2 tracking-wider">ГОРОД *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Например: Москва"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition duration-300"
                required
              />
            </div>

            {/* Телефон */}
            <div className="mb-6">
              <label className="text-white/40 text-xs font-bold block mb-2 tracking-wider">ТЕЛЕФОН ДЛЯ СВЯЗИ</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+7 (999) 123-45-67"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition duration-300"
              />
            </div>

            {/* Информация о модерации */}
            <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
              <p className="text-gray-400 text-sm flex items-center gap-2">
                <i className="fas fa-info-circle text-white/30"></i>
                После отправки объявление пройдёт модерацию в течение 24 часов
              </p>
            </div>

            {/* Кнопка отправки */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black py-3.5 rounded-xl font-bold text-sm tracking-wider hover:bg-white/90 transition-all duration-300 disabled:opacity-50"
              onClick={handleSubmit}
            >
              {isSubmitting ? 'ОТПРАВКА...' : 'РАЗМЕСТИТЬ ОБЪЯВЛЕНИЕ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPage;