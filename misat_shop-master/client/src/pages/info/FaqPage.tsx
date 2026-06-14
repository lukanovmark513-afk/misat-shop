import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [questionForm, setQuestionForm] = useState({ name: '', email: '', question: '' });

  const faqs = [
    { q: 'Как оформить заказ?', a: 'Выберите товар в каталоге, добавьте в корзину и перейдите к оформлению.' },
    { q: 'Сколько дней обрабатывается заказ?', a: 'Заказ обрабатывается в течение 1-2 рабочих дней.' },
    { q: 'Как отследить заказ?', a: 'После отправки вы получите трек-номер для отслеживания.' },
    { q: 'Можно ли вернуть товар?', a: 'Да, возврат возможен в течение 30 дней.' },
    { q: 'Откуда отправляются заказы?', a: 'Все заказы отправляются из Смоленска.' },
  ];

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionForm.name || !questionForm.email || !questionForm.question) {
      toast.error('Заполните все поля');
      return;
    }
    toast.success('Ваш вопрос отправлен!');
    setQuestionForm({ name: '', email: '', question: '' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <i className="fas fa-chevron-right text-[9px]"></i>
          <span className="text-white">Вопросы и ответы</span>
        </div>

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-10">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="FAQ"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-10 px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-white/40"></div>
              <span className="text-gray-400 text-[10px] tracking-[0.3em]">ПОМОЩЬ</span>
              <div className="w-8 h-0.5 bg-white/40"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              FAQ
            </h1>
            <p className="text-gray-400 text-sm mt-3">Часто задаваемые вопросы</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">

          {/* Аккордеон FAQ */}
          <div className="space-y-3 mb-12">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex justify-between items-center p-5 text-left text-white font-black text-base hover:bg-white/10 transition-all duration-300"
                >
                  <span>{faq.q}</span>
                  <i className={`fas fa-chevron-${openIndex === index ? 'up' : 'down'} text-white/50 transition-transform duration-300`}></i>
                </button>
                {openIndex === index && (
                  <div className="p-5 border-t border-white/10 bg-white/5">
                    <p className="text-gray-300 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Форма вопроса */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 md:p-8">
            <h2 className="text-white font-black text-2xl mb-5 text-center">ЗАДАТЬ ВОПРОС</h2>
            <form onSubmit={handleAskQuestion} className="space-y-4">
              <div>
                <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">ИМЯ</label>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={questionForm.name}
                  onChange={(e) => setQuestionForm({ ...questionForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">EMAIL</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={questionForm.email}
                  onChange={(e) => setQuestionForm({ ...questionForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">ВОПРОС</label>
                <textarea
                  placeholder="Ваш вопрос"
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-black py-3.5 rounded-xl font-black text-sm tracking-wider hover:bg-white/90 transition"
              >
                ОТПРАВИТЬ
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;