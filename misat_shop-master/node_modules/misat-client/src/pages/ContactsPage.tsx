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

  const contactItems = [
    { icon: 'fa-map-marker-alt', title: 'Адрес', value: 'г. Смоленск, ул. Большая Советская, д. 25', detail: 'офис 101' },
    { icon: 'fa-phone', title: 'Телефон', value: '+7 (993) 884-37-66', detail: 'Пн-Пт: 10:00 - 20:00' },
    { icon: 'fa-envelope', title: 'Email', value: 'misatsupport@gmail.com', detail: 'Ответ в течение 24 часов' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <i className="fas fa-chevron-right text-[9px]"></i>
          <span className="text-white">Контакты</span>
        </div>

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-10">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="Contacts"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-10 px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-white/40"></div>
              <span className="text-gray-400 text-[10px] tracking-[0.3em]">СВЯЖИТЕСЬ С НАМИ</span>
              <div className="w-8 h-0.5 bg-white/40"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              КОНТАКТЫ
            </h1>
            <p className="text-gray-400 text-sm mt-3">Мы всегда на связи и готовы помочь</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">

          {/* Левая колонка - Контакты */}
          <div>
            <h2 className="text-white font-black text-2xl mb-6">Свяжитесь с нами</h2>
            <div className="space-y-5">
              {contactItems.map((item, idx) => (
                <div key={idx} className="group bg-white/5 rounded-xl p-5 border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition">
                      <i className={`fas ${item.icon} text-white/60 text-xl`}></i>
                    </div>
                    <div>
                      <p className="text-white/40 text-[10px] font-bold tracking-wider">{item.title}</p>
                      <p className="text-white font-bold text-base mt-1">{item.value}</p>
                      <p className="text-gray-500 text-xs mt-1">{item.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Правая колонка - Форма */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 className="text-white font-black text-xl mb-4">НАПИСАТЬ НАМ</h2>
            <p className="text-gray-400 text-sm mb-6">Заполните форму и мы свяжемся с вами</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-white/40 text-xs font-bold block mb-1 tracking-wider">ИМЯ *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition duration-300"
                  required
                />
              </div>
              <div>
                <label className="text-white/40 text-xs font-bold block mb-1 tracking-wider">EMAIL *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition duration-300"
                  required
                />
              </div>
              <div>
                <label className="text-white/40 text-xs font-bold block mb-1 tracking-wider">СООБЩЕНИЕ *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition duration-300 resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black py-3.5 rounded-xl font-bold text-sm tracking-wider hover:bg-white/90 transition-all duration-300 disabled:opacity-50"
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