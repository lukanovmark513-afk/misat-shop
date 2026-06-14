import React, { useState } from 'react';

const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Сообщение отправлено! Мы ответим в ближайшее время.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">
        <div className="max-w-5xl mx-auto">

          {/* ========== БАННЕР СТРАНИЦЫ ========== */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-10">
            <div className="absolute inset-0 opacity-20">
              <img
                src="/images/brands/raspr.jpg"
                alt="Support"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

            <div className="relative py-10 px-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-0.5 bg-white/40"></div>
                <span className="text-gray-400 text-[10px] tracking-[0.3em]">ПОДДЕРЖКА</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                СЛУЖБА ПОДДЕРЖКИ
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                Мы здесь, чтобы помочь вам с любыми вопросами
              </p>
            </div>
          </div>

          {/* ========== ОСНОВНАЯ СЕТКА ========== */}
          <div className="grid lg:grid-cols-2 gap-8">

            {/* ЛЕВАЯ КОЛОНКА - КОНТАКТЫ */}
            <div className="space-y-4">

              {/* Email */}
              <div className="group bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/30">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <i className="fas fa-envelope text-white/70 text-xl"></i>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Email</h3>
                <p className="text-gray-400 text-sm">misatsupport@gmail.com</p>
                <p className="text-gray-500 text-xs mt-2">Ответ в течение 24 часов</p>
              </div>

              {/* Телефон */}
              <div className="group bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/30">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <i className="fas fa-phone text-white/70 text-xl"></i>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Телефон</h3>
                <p className="text-gray-400 text-sm">+7 (993) 884-37-66</p>
                <p className="text-gray-500 text-xs mt-2">Пн-Пт: 10:00 - 20:00</p>
              </div>

              {/* Telegram */}
              <div className="group bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-white/30">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300">
                  <i className="fab fa-telegram text-white/70 text-xl"></i>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Telegram</h3>
                <p className="text-gray-400 text-sm">@misat_support</p>
                <p className="text-gray-500 text-xs mt-2">Ответ в течение часа</p>
              </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА - ФОРМА */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-white font-bold text-xl mb-4">НАПИСАТЬ НАМ</h3>
              <p className="text-gray-400 text-sm mb-6">Заполните форму и мы свяжемся с вами</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-white/40 text-xs font-bold block mb-1 tracking-wider">ИМЯ</label>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="text-white/40 text-xs font-bold block mb-1 tracking-wider">EMAIL</label>
                  <input
                    type="email"
                    placeholder="Ваш email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="text-white/40 text-xs font-bold block mb-1 tracking-wider">СООБЩЕНИЕ</label>
                  <textarea
                    placeholder="Ваше сообщение..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition duration-300 resize-none"
                    rows={5}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black py-3.5 rounded-xl font-bold text-sm tracking-wider hover:bg-white/90 transition-all duration-300"
                >
                  ОТПРАВИТЬ СООБЩЕНИЕ
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;