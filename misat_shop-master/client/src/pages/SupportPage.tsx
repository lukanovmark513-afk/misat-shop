import React, { useState } from 'react';

const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Сообщение отправлено! Мы ответим в ближайшее время.');
    setFormData({ name: '', email: '', message: '' });
  };

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
              <span className="text-gray-500 text-[10px] tracking-[0.3em] font-medium">ПОДДЕРЖКА</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-[-0.05em] text-white leading-none text-center">
              Служба поддержки
            </h1>
            <p className="text-zinc-400 text-sm lg:text-base mt-4 max-w-lg leading-relaxed text-center mx-auto">
              Мы здесь, чтобы помочь вам с любыми вопросами
            </p>
          </div>

          {/* ========== ОСНОВНАЯ СЕТКА ========== */}
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">

            {/* ЛЕВАЯ КОЛОНКА - КОНТАКТЫ + FAQ */}
            <div className="order-2 lg:order-1 space-y-4">

              {/* Контакты - компактные */}
              <div className="grid grid-cols-3 gap-2">
                <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 p-3 text-center">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1.5 bg-white/[0.05] border border-white/10">
                    <i className="fas fa-envelope text-white/60 text-xs"></i>
                  </div>
                  <h4 className="text-white font-medium text-[10px]">Email</h4>
                  <p className="text-gray-500 text-[8px] hidden lg:block mt-1">misatsupport@gmail.com</p>
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 p-3 text-center">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1.5 bg-white/[0.05] border border-white/10">
                    <i className="fas fa-phone text-white/60 text-xs"></i>
                  </div>
                  <h4 className="text-white font-medium text-[10px]">Телефон</h4>
                  <p className="text-gray-500 text-[8px] hidden lg:block mt-1">+7 (993) 884-37-66</p>
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 p-3 text-center">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1.5 bg-white/[0.05] border border-white/10">
                    <i className="fab fa-telegram text-white/60 text-xs"></i>
                  </div>
                  <h4 className="text-white font-medium text-[10px]">Telegram</h4>
                  <p className="text-gray-500 text-[8px] hidden lg:block mt-1">@misat_support</p>
                </div>
              </div>

              {/* FAQ - с аккордеоном */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 lg:p-5">
                <h3 className="text-white font-semibold text-sm mb-3">Частые вопросы</h3>
                <div className="space-y-3">
                  
                  {/* Вопрос 1 */}
                  <div className="border-b border-white/5 pb-3">
                    <button 
                      onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                      className="flex items-center justify-between w-full cursor-pointer group"
                    >
                      <span className="text-white font-medium text-xs lg:text-sm hover:text-white/80 transition text-left">• Сколько идёт доставка?</span>
                      <span className={`text-gray-500 transition-transform duration-300 text-xs flex-shrink-0 ml-2 ${openFaq === 1 ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    {openFaq === 1 && (
                      <div className="mt-2 space-y-1.5 text-xs lg:text-sm pl-4 border-l-2 border-white/10">
                        <div className="text-emerald-400/80 font-medium text-[10px] lg:text-xs">В наличии (РФ)</div>
                        <p className="text-gray-500 text-[10px] lg:text-xs">Товары со склада в Смоленске</p>
                        <p className="text-gray-500 text-[10px] lg:text-xs">Доставка по РФ: 2-5 дней</p>
                        <p className="text-gray-500 text-[10px] lg:text-xs">Стоимость: 300 ₽</p>
                        <p className="text-emerald-400/60 text-[10px] lg:text-xs">Бесплатно от 5000 ₽</p>
                        <div className="text-orange-400/80 font-medium text-[10px] lg:text-xs mt-1.5">Предзаказ (Китай)</div>
                        <p className="text-gray-500 text-[10px] lg:text-xs">Товары под заказ из Китая</p>
                        <p className="text-gray-500 text-[10px] lg:text-xs">Срок доставки: 20-35 дней</p>
                        <p className="text-gray-500 text-[10px] lg:text-xs">Стоимость: 500 ₽</p>
                        <p className="text-gray-500 text-[10px] lg:text-xs">Трекинг-номер предоставляется</p>
                      </div>
                    )}
                  </div>

                  {/* Вопрос 2 */}
                  <div className="border-b border-white/5 pb-3">
                    <button 
                      onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                      className="flex items-center justify-between w-full cursor-pointer group"
                    >
                      <span className="text-white font-medium text-xs lg:text-sm hover:text-white/80 transition text-left">• Как оформить возврат?</span>
                      <span className={`text-gray-500 transition-transform duration-300 text-xs flex-shrink-0 ml-2 ${openFaq === 2 ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    {openFaq === 2 && (
                      <div className="mt-2 space-y-1 text-xs lg:text-sm pl-4 border-l-2 border-white/10">
                        <p className="text-gray-500 text-[10px] lg:text-xs">✅ Товар не был в использовании</p>
                        <p className="text-gray-500 text-[10px] lg:text-xs">✅ Сохранены фабричные ярлыки</p>
                        <p className="text-gray-500 text-[10px] lg:text-xs">✅ Оригинальная упаковка</p>
                        <p className="text-red-400/70 text-[10px] lg:text-xs mt-1">❌ Возврат не принимается:</p>
                        <p className="text-gray-500 text-[10px] lg:text-xs pl-4">• Нижнее бельё и купальники</p>
                        <p className="text-gray-500 text-[10px] lg:text-xs pl-4">• Носки и чулочно-носочные изделия</p>
                        <p className="text-gray-500 text-[10px] lg:text-xs pl-4">• Товары со следами использования</p>
                      </div>
                    )}
                  </div>

                  {/* Вопрос 3 */}
                  <div>
                    <button 
                      onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                      className="flex items-center justify-between w-full cursor-pointer group"
                    >
                      <span className="text-white font-medium text-xs lg:text-sm hover:text-white/80 transition text-left">• Как отследить заказ?</span>
                      <span className={`text-gray-500 transition-transform duration-300 text-xs flex-shrink-0 ml-2 ${openFaq === 3 ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    {openFaq === 3 && (
                      <div className="mt-2 space-y-1 text-xs lg:text-sm pl-4 border-l-2 border-white/10">
                        <p className="text-gray-500 text-[10px] lg:text-xs">После отправки вы получите трек-номер для отслеживания.</p>
                        <p className="text-gray-500 text-[10px] lg:text-xs">Отслеживать можно на сайте почты или через наш сервис.</p>
                      </div>
                    )}
                  </div>

                </div>
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
                    className="w-full h-12 lg:h-14 rounded-xl bg-gradient-to-b from-white to-zinc-200 text-black font-semibold transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] shadow-[0_10px_30px_rgba(255,255,255,0.08)]"
                  >
                    Отправить сообщение
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

export default SupportPage;
