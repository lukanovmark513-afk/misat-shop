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
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black">Главная</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-black">Вопросы и ответы</span>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">FAQ</h1>
          <div className="w-20 h-0.5 bg-black mx-auto"></div>
        </div>
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-2 border-black">
                <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="w-full flex justify-between items-center p-5 text-left font-black">
                  <span>{faq.q}</span>
                  <i className={`fas fa-chevron-${openIndex === index ? 'up' : 'down'}`}></i>
                </button>
                {openIndex === index && (
                  <div className="p-5 border-t-2 border-black bg-gray-50">
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl border-2 border-black">
            <h2 className="text-2xl font-black mb-4 text-center">Задать вопрос</h2>
            <form onSubmit={handleAskQuestion} className="space-y-4">
              <input type="text" placeholder="Ваше имя" value={questionForm.name} onChange={(e) => setQuestionForm({ ...questionForm, name: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" required />
              <input type="email" placeholder="Email" value={questionForm.email} onChange={(e) => setQuestionForm({ ...questionForm, email: e.target.value })} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl" required />
              <textarea placeholder="Ваш вопрос" value={questionForm.question} onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })} rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none" required />
              <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-black">ОТПРАВИТЬ</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;