import React, { useState } from 'react';

const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Сообщение отправлено! Мы ответим в ближайшее время.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-light mb-4 text-center">Служба <span className="font-bold">поддержки</span></h1>
          <p className="text-gray-500 text-center mb-12">Мы здесь, чтобы помочь вам с любыми вопросами</p>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-2xl">
                <i className="fas fa-envelope text-3xl mb-3"></i>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-gray-500">support@misat.com</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <i className="fas fa-phone text-3xl mb-3"></i>
                <h3 className="font-semibold mb-2">Телефон</h3>
                <p className="text-gray-500">+7 (800) 123-45-67</p>
                <p className="text-sm text-gray-400">Пн-Пт: 10:00 - 20:00</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl">
                <i className="fab fa-telegram text-3xl mb-3"></i>
                <h3 className="font-semibold mb-2">Telegram</h3>
                <p className="text-gray-500">@misat_support</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black"
                required
              />
              <textarea
                placeholder="Сообщение"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black resize-none"
                rows={5}
                required
              />
              <button type="submit" className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition">
                Отправить сообщение
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;