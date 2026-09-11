import React, { useState } from 'react';
import toast from 'react-hot-toast';

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [questionForm, setQuestionForm] = useState({ name: '', email: '', question: '' });

  const faqs = [
    { q: 'Как оформить заказ?', a: 'Выберите товар в каталоге, добавьте в корзину и перейдите к оформлению заказа.' },
    { q: 'Сколько дней обрабатывается заказ?', a: 'Заказ обрабатывается в течение 1-2 рабочих дней. После обработки вы получите уведомление на email.' },
    { q: 'Как отследить заказ?', a: 'После отправки вы получите трек-номер для отслеживания. Вы также можете отследить заказ в личном кабинете.' },
    { q: 'Можно ли вернуть товар?', a: 'Да, возврат возможен в течение 30 дней с момента получения заказа. Подробнее на странице возвратов.' },
    { q: 'Откуда отправляются заказы?', a: 'Все заказы отправляются из Смоленска. Доставка осуществляется СДЭК и Почтой России.' },
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

  // Фон
  const renderBackground = () => (
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute left-1/2 top-[100px] -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-white/[0.015] blur-[250px]" />
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.02] blur-[180px]" />
    </div>
  );

  // Hero
  const renderHero = () => (
    <div className="mb-12 md:mb-16">
      <p className="text-zinc-500 text-base md:text-lg font-medium tracking-wide">
        Помощь
      </p>
      <h1 className="
        text-5xl
        sm:text-6xl
        md:text-7xl
        lg:text-8xl
        font-black
        tracking-[-0.08em]
        leading-[0.9]
        text-white
        mt-1
      ">
        FAQ
      </h1>
      <p className="text-zinc-500 text-sm md:text-lg mt-4 max-w-lg">
        Ответы на самые популярные вопросы клиентов
      </p>
    </div>
  );

  // FAQ Аккордеон
  const renderFaqs = () => (
    <div className="space-y-3 mb-12">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="
            overflow-hidden
            rounded-[24px]
            border border-white/10
            bg-gradient-to-b
            from-white/[0.04]
            to-white/[0.02]
            backdrop-blur-3xl
            transition-all
          "
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="
              w-full
              flex
              items-center
              justify-between
              p-5
              md:p-6
              text-left
              group
            "
          >
            <span className="text-white font-medium text-sm md:text-base pr-4">
              {faq.q}
            </span>

            <div
              className={`
                w-8 h-8
                rounded-full
                flex items-center justify-center
                border border-white/10
                transition-all
                shrink-0
                ${openIndex === index ? 'rotate-180' : ''}
              `}
            >
              <i className="fas fa-chevron-down text-white/40 text-xs" />
            </div>
          </button>

          <div
            className={`
              transition-all duration-300 ease-in-out
              overflow-hidden
              ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="px-5 md:px-6 pb-6">
              <div className="border-t border-white/10 pt-5">
                <p className="text-zinc-400 leading-7 text-sm md:text-base">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Форма вопроса
  const renderQuestionForm = () => (
    <div
      className="
        overflow-hidden
        rounded-[28px]
        border border-white/10
        bg-gradient-to-b
        from-white/[0.04]
        to-white/[0.02]
        backdrop-blur-3xl
        p-6
        md:p-8
      "
    >
      <div className="relative z-10">
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
          Не нашли ответ?
        </h2>
        <p className="text-zinc-500 mb-8">
          Отправьте вопрос и мы свяжемся с вами.
        </p>

        <form onSubmit={handleAskQuestion} className="space-y-4">
          <input
            type="text"
            placeholder="Ваше имя"
            value={questionForm.name}
            onChange={(e) => setQuestionForm({ ...questionForm, name: e.target.value })}
            className="
              w-full
              h-14
              px-5
              rounded-2xl
              bg-white/[0.03]
              border border-white/[0.06]
              text-white
              placeholder:text-zinc-600
              focus:outline-none
              focus:border-white/20
              transition
              text-base
            "
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={questionForm.email}
            onChange={(e) => setQuestionForm({ ...questionForm, email: e.target.value })}
            className="
              w-full
              h-14
              px-5
              rounded-2xl
              bg-white/[0.03]
              border border-white/[0.06]
              text-white
              placeholder:text-zinc-600
              focus:outline-none
              focus:border-white/20
              transition
              text-base
            "
            required
          />

          <textarea
            rows={5}
            placeholder="Ваш вопрос"
            value={questionForm.question}
            onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
            className="
              w-full
              p-5
              rounded-2xl
              bg-white/[0.03]
              border border-white/[0.06]
              text-white
              placeholder:text-zinc-600
              focus:outline-none
              focus:border-white/20
              resize-none
              text-base
            "
            required
          />

          <button
            type="submit"
            className="
              w-full
              h-14
              rounded-full
              bg-white
              text-black
              font-medium
              transition
              hover:opacity-90
              active:scale-[0.98]
              text-base
            "
          >
            Отправить вопрос
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#050505] pt-20">
      {renderBackground()}

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-8 pb-32">
        {renderHero()}
        {renderFaqs()}
        {renderQuestionForm()}
      </div>
    </main>
  );
};

export default FaqPage;