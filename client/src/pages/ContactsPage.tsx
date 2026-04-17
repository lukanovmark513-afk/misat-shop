import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ContactsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Заполните все поля');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/forms/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Сообщение отправлено! Мы ответим в ближайшее время.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error(data.error || 'Ошибка отправки');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка отправки. Попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black">Главная</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-black">Контакты</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">КОНТАКТЫ</h1>
          <div className="w-20 h-0.5 bg-black mx-auto"></div>
          <p className="text-gray-500 mt-4">Мы всегда на связи и готовы помочь</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h2 className="text-2xl font-black mb-6">Свяжитесь с нами</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <i className="fas fa-map-marker-alt text-2xl text-gray-600 mt-1"></i>
                <div>
                  <p className="font-bold">Адрес</p>
                  <p className="text-gray-500">г. Смоленск, ул. Большая Советская, д. 25, офис 101</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="fas fa-phone text-2xl text-gray-600 mt-1"></i>
                <div>
                  <p className="font-bold">Телефон</p>
                  <p className="text-gray-500">+7 (993) 884-37-66</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <i className="fas fa-envelope text-2xl text-gray-600 mt-1"></i>
                <div>
                  <p className="font-bold">Email</p>
                  <p className="text-gray-500">8888888gorni@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Ваше имя *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Сообщение *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 rounded-xl font-black hover:bg-gray-800 transition disabled:opacity-50"
              >
                {isLoading ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;