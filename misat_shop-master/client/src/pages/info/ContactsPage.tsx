import React, { useState } from 'react';
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
    <div className="min-h-screen relative overflow-hidden bg-[#050505]">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_50%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-white/[0.02] blur-[180px] rounded-full pointer-events-none" />
      </div>

      <div className="relative w-full px-4 md:px-8 lg:px-16 pt-20 md:py-10">
        <div className="max-w-5xl mx-auto">

          {/* ========== HERO ========== */}
          <div className="mb-6 lg:mb-12 text-center lg:text-left">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-6 h-0.5 bg-white/30" />
              <span className="text-gray-500 text-[10px] tracking-[0.3em] font-medium">КОНТАКТЫ</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-[-0.05em] text-white leading-none text-center">
              Контакты
            </h1>
            <p className="text-zinc-400 text-sm lg:text-base mt-4 max-w-lg leading-relaxed text-center mx-auto">
              Мы всегда на связи и готовы помочь
            </p>
          </div>

          {/* ========== ОСНОВНАЯ СЕТКА ========== */}
          <div className="grid gap-4 lg:grid-cols-2 lg:gap-10">

            {/* ЛЕВАЯ КОЛОНКА - КОНТАКТЫ */}
            <div className="order-2 lg:order-1 space-y-4">
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-5">
                {contactItems.map((item, idx) => (
                  <div key={idx} className="group relative overflow-hidden rounded-xl lg:rounded-[24px] border border-white/10 bg-white/[0.03] backdrop-blur-2xl hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1 transition-all duration-300 p-3 lg:p-5 text-center lg:text-left">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03]" />
                    <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-2 lg:mb-4 bg-white/[0.05] backdrop-blur-3xl border border-white/10">
                      <i className={`fas ${item.icon} text-white/60 text-base lg:text-xl`}></i>
                    </div>
                    <h4 className="text-white font-medium text-[10px] lg:text-base">{item.title}</h4>
                    <p className="text-gray-400 text-[9px] lg:text-sm hidden lg:block mt-1">{item.value}</p>
                    <p className="text-gray-500 text-[8px] lg:text-xs hidden lg:block mt-1">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА - ФОРМА */}
            <div className="order-1 lg:order-2 max-w-xl mx-auto w-full relative overflow-hidden rounded-2xl lg:rounded-[28px] p-5 md:p-6 lg:p-8 bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />

              <div className="relative">
                <h3 className="text-white font-bold text-lg lg:text-xl mb-1">Написать нам</h3>
                <p className="text-gray-400 text-sm mb-5 lg:mb-6">Заполните форму и мы свяжемся с вами</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder=" "
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="peer w-full h-12 lg:h-14 px-4 rounded-xl bg-black/30 border border-white/10 text-white outline-none transition-all focus:border-white/30"
                      required
                    />
                    <label className="absolute left-4 top-3 lg:top-4 text-zinc-500 transition-all pointer-events-none peer-focus:-top-2 peer-focus:text-xs peer-focus:px-2 peer-focus:bg-[#050505] peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:bg-[#050505]">
                      Имя
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      placeholder=" "
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="peer w-full h-12 lg:h-14 px-4 rounded-xl bg-black/30 border border-white/10 text-white outline-none transition-all focus:border-white/30"
                      required
                    />
                    <label className="absolute left-4 top-3 lg:top-4 text-zinc-500 transition-all pointer-events-none peer-focus:-top-2 peer-focus:text-xs peer-focus:px-2 peer-focus:bg-[#050505] peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:bg-[#050505]">
                      Email
                    </label>
                  </div>

                  <div className="relative">
                    <textarea
                      placeholder=" "
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="peer w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white outline-none transition-all focus:border-white/30 resize-none"
                      rows={4}
                      required
                    />
                    <label className="absolute left-4 top-3 text-zinc-500 transition-all pointer-events-none peer-focus:-top-2 peer-focus:text-xs peer-focus:px-2 peer-focus:bg-[#050505] peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:px-2 peer-[&:not(:placeholder-shown)]:bg-[#050505]">
                      Сообщение
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 lg:h-14 rounded-xl bg-gradient-to-b from-white to-zinc-200 text-black font-semibold transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-[0_10px_30px_rgba(255,255,255,0.08)] disabled:opacity-50"
                  >
                    {isLoading ? 'ОТПРАВКА...' : 'Отправить сообщение'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage;
