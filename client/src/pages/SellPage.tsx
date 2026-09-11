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
    { value: 'accessories', label: 'Аксессуары', icon: 'fa-clock' },
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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-light mb-2">Продать <span className="font-bold">вещь</span></h1>
        <p className="text-gray-400 mb-8">Разместите объявление о продаже</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
          {/* Название */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Название товара *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Например: Кожаная куртка MISAT"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
              required
            />
          </div>

          {/* Категория */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Категория *</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`p-3 border rounded-xl text-center transition ${formData.category === cat.value ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
                >
                  <i className={`fas ${cat.icon} text-xl mb-1 block`}></i>
                  <span className="text-xs">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Цена */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Цена *</label>
            <div className="relative">
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black pr-12"
                required
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">₽</span>
            </div>
          </div>

          {/* Состояние */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Состояние *</label>
            <div className="flex gap-3">
              {conditions.map(cond => (
                <button
                  key={cond.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, condition: cond.value })}
                  className={`px-4 py-2 rounded-full text-sm transition ${formData.condition === cond.value ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {cond.label}
                </button>
              ))}
            </div>
          </div>

          {/* Описание */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Описание *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Опишите товар: размер, цвет, материал, особенности..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black resize-none"
              required
            />
          </div>

          {/* Локация */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Город *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Например: Москва"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
              required
            />
          </div>

          {/* Телефон */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Телефон для связи</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+7 (999) 123-45-67"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <i className="fas fa-info-circle"></i>
              После отправки объявление пройдёт модерацию в течение 24 часов
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isSubmitting ? 'Отправка...' : 'Разместить объявление'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellPage;