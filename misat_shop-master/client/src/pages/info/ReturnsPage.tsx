import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ReturnsPage = () => {
  const [formData, setFormData] = useState({
    orderNumber: '',
    productName: '',
    reason: '',
    comment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderNumber || !formData.reason) {
      toast.error('Заполните обязательные поля');
      return;
    }
    toast.success('Заявка на возврат отправлена! Мы свяжемся с вами.');
    setFormData({ orderNumber: '', productName: '', reason: '', comment: '' });
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
        Поддержка
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
        Возврат
      </h1>
      <p className="text-zinc-500 text-sm md:text-lg mt-4 max-w-xl">
        Оформите заявку на возврат товара. Мы рассмотрим её в течение 1–2 рабочих дней.
      </p>
    </div>
  );

  // Карточки условий
  const renderConditions = () => (
    <div className="grid lg:grid-cols-2 gap-5 mb-8">
      {/* Можно вернуть */}
      <div className="
        rounded-[28px]
        border border-white/10
        bg-gradient-to-b
        from-white/[0.04]
        to-white/[0.02]
        backdrop-blur-3xl
        p-6
      ">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-check text-emerald-400 text-lg" />
          </div>
          <h3 className="text-white font-semibold text-xl">
            Можно вернуть
          </h3>
        </div>
        <ul className="space-y-3 text-zinc-400 text-sm">
          <li className="flex items-start gap-3">
            <span className="text-emerald-400 text-base leading-none mt-0.5">•</span>
            <span>Товар не использовался</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-400 text-base leading-none mt-0.5">•</span>
            <span>Сохранены фабричные ярлыки</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-emerald-400 text-base leading-none mt-0.5">•</span>
            <span>Оригинальная упаковка</span>
          </li>
        </ul>
      </div>

      {/* Нельзя вернуть */}
      <div className="
        rounded-[28px]
        border border-white/10
        bg-gradient-to-b
        from-white/[0.04]
        to-white/[0.02]
        backdrop-blur-3xl
        p-6
      ">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
            <i className="fas fa-xmark text-red-400 text-lg" />
          </div>
          <h3 className="text-white font-semibold text-xl">
            Не принимается
          </h3>
        </div>
        <ul className="space-y-3 text-zinc-400 text-sm">
          <li className="flex items-start gap-3">
            <span className="text-red-400 text-base leading-none mt-0.5">•</span>
            <span>Нижнее бельё и купальники</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-400 text-base leading-none mt-0.5">•</span>
            <span>Носки и чулочно-носочные изделия</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-red-400 text-base leading-none mt-0.5">•</span>
            <span>Товары со следами использования</span>
          </li>
        </ul>
      </div>
    </div>
  );

  // Форма
  const renderForm = () => (
    <div className="
      overflow-hidden
      rounded-[32px]
      border border-white/10
      bg-gradient-to-b
      from-white/[0.04]
      to-white/[0.02]
      backdrop-blur-3xl
      p-6
      md:p-8
    ">
      <div className="mb-8">
        <h2 className="text-white text-3xl font-bold mb-2">
          Оформить возврат
        </h2>
        <p className="text-zinc-500">
          Заполните форму ниже
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-zinc-500 text-xs uppercase tracking-wider block mb-2">
            Номер заказа *
          </label>
          <input
            type="text"
            value={formData.orderNumber}
            onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
            placeholder="Например: MISAT-1234567890"
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
        </div>

        <div>
          <label className="text-zinc-500 text-xs uppercase tracking-wider block mb-2">
            Название товара
          </label>
          <input
            type="text"
            value={formData.productName}
            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
            placeholder="Например: Худи Oversized"
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
          />
        </div>

        {/* Select с кастомной стрелкой */}
        <div className="relative">
          <label className="text-zinc-500 text-xs uppercase tracking-wider block mb-2">
            Причина возврата *
          </label>
          <div className="relative">
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="
                w-full
                h-14
                px-5
                pr-12
                rounded-2xl
                bg-white/[0.03]
                border border-white/[0.06]
                text-white
                focus:outline-none
                focus:border-white/20
                transition
                appearance-none
                cursor-pointer
                text-base
                [&>option]:bg-[#0B0B0B]
                [&>option]:text-white
              "
              required
            >
              <option value="" className="bg-[#0B0B0B] text-zinc-500">Выберите причину</option>
              <option value="Не подошёл размер" className="bg-[#0B0B0B] text-white">Не подошёл размер</option>
              <option value="Не понравился цвет/модель" className="bg-[#0B0B0B] text-white">Не понравился цвет/модель</option>
              <option value="Брак/дефект" className="bg-[#0B0B0B] text-white">Брак/дефект</option>
              <option value="Другое" className="bg-[#0B0B0B] text-white">Другое</option>
            </select>
            {/* Кастомная стрелка */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
              <i className="fas fa-chevron-down text-xs" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-zinc-500 text-xs uppercase tracking-wider block mb-2">
            Комментарий
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={4}
            placeholder="Опишите подробнее..."
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
          />
        </div>

        <button
          type="submit"
          className="
            w-full
            h-14
            mt-3
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
          Отправить заявку
        </button>
      </form>
    </div>
  );

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#050505] pt-20">
      {renderBackground()}

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-8 pb-32">
        {renderHero()}
        {renderConditions()}
        {renderForm()}
      </div>
    </main>
  );
};

export default ReturnsPage;