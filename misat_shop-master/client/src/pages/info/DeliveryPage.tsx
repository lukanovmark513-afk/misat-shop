import React from 'react';

const DeliveryPage = () => {
  return (
    <main className="relative overflow-hidden min-h-screen bg-[#050505] pt-20">
      {/* Фон */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute left-1/2 top-[100px] -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-white/[0.015] blur-[250px]" />
        <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.02] blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-8 pb-32">

        {/* Hero */}
        <div className="mb-14">
          <p className="text-zinc-500 text-lg font-medium">
            Информация
          </p>
          <h1 className="
            text-5xl
            md:text-7xl
            lg:text-8xl
            font-black
            tracking-[-0.08em]
            leading-[0.9]
            text-white
            mt-2
          ">
            Доставка
            <br />
            и оплата
          </h1>
          <p className="text-zinc-500 text-base md:text-lg mt-5 max-w-2xl">
            Все заказы отправляются со склада MISAT в Смоленске.
          </p>
        </div>

        {/* Типы доставки */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 mb-12">
          {/* Доставка по РФ */}
          <div className="
            relative
            overflow-hidden
            rounded-[32px]
            border border-white/10
            bg-gradient-to-b
            from-white/[0.05]
            to-white/[0.02]
            backdrop-blur-3xl
            p-6 md:p-8
          ">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-box text-emerald-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">В наличии (РФ)</h3>
                  <p className="text-emerald-400 text-xs tracking-wider">Товары со склада в Смоленске</p>
                </div>
              </div>
              <ul className="space-y-3 text-zinc-400 text-sm">
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400 text-base leading-none">•</span>
                  <span>Доставка по РФ: 2-5 дней</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400 text-base leading-none">•</span>
                  <span>Стоимость: 300 ₽</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-emerald-400 text-base leading-none">•</span>
                  <span>Бесплатно от 5000 ₽</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Предзаказ из Китая */}
          <div className="
            relative
            overflow-hidden
            rounded-[32px]
            border border-white/10
            bg-gradient-to-b
            from-white/[0.05]
            to-white/[0.02]
            backdrop-blur-3xl
            p-6 md:p-8
          ">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-ship text-purple-400 text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Предзаказ (Китай)</h3>
                  <p className="text-purple-400 text-xs tracking-wider">Товары под заказ из Китая</p>
                </div>
              </div>
              <ul className="space-y-3 text-zinc-400 text-sm">
                <li className="flex items-center gap-3">
                  <span className="text-purple-400 text-base leading-none">•</span>
                  <span>Срок доставки: 20-35 дней</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400 text-base leading-none">•</span>
                  <span>Стоимость: 500 ₽</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400 text-base leading-none">•</span>
                  <span>Трекинг-номер предоставляется</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Способы оплаты */}
        <div className="mb-10">
          <h2 className="flex items-center gap-3 mb-6">
            <span className="w-10 h-px bg-white/30" />
            <span className="text-white font-bold text-xl">Способы оплаты</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="
              relative
              overflow-hidden
              rounded-[28px]
              border border-white/10
              bg-gradient-to-b
              from-white/[0.05]
              to-white/[0.02]
              backdrop-blur-xl
              p-6
              text-center
              transition-all
              duration-300
              hover:border-white/20
              hover:-translate-y-1
            ">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-3">
                  <i className="fab fa-cc-visa text-white/40 text-2xl" />
                </div>
                <p className="text-white font-medium text-sm">Банковская карта</p>
                <p className="text-zinc-500 text-xs mt-1">Visa, Mastercard, МИР</p>
              </div>
            </div>
            <div className="
              relative
              overflow-hidden
              rounded-[28px]
              border border-white/10
              bg-gradient-to-b
              from-white/[0.05]
              to-white/[0.02]
              backdrop-blur-xl
              p-6
              text-center
              transition-all
              duration-300
              hover:border-white/20
              hover:-translate-y-1
            ">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-3">
                  <i className="fas fa-qrcode text-white/40 text-2xl" />
                </div>
                <p className="text-white font-medium text-sm">СБП</p>
                <p className="text-zinc-500 text-xs mt-1">Система быстрых платежей</p>
              </div>
            </div>
            <div className="
              relative
              overflow-hidden
              rounded-[28px]
              border border-white/10
              bg-gradient-to-b
              from-white/[0.05]
              to-white/[0.02]
              backdrop-blur-xl
              p-6
              text-center
              transition-all
              duration-300
              hover:border-white/20
              hover:-translate-y-1
            ">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-3">
                  <i className="fas fa-wallet text-white/40 text-2xl" />
                </div>
                <p className="text-white font-medium text-sm">Наличные</p>
                <p className="text-zinc-500 text-xs mt-1">При получении</p>
              </div>
            </div>
          </div>
        </div>

        {/* Правила предоплаты */}
        <div className="
          relative
          overflow-hidden
          rounded-[32px]
          border border-white/10
          bg-gradient-to-b
          from-white/[0.05]
          to-white/[0.02]
          backdrop-blur-3xl
          p-6 md:p-8
        ">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-3">
              <span className="w-10 h-px bg-white/30" />
              Правила предоплаты
            </h3>
            <ul className="space-y-4 text-zinc-400 leading-7 text-[15px]">
              <li className="flex items-start gap-3">
                <span className="text-orange-400 text-base leading-none mt-1.5">•</span>
                <span>Предоплата 100% — для товаров под заказ из Китая</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-400 text-base leading-none mt-1.5">•</span>
                <span>Предоплата 70% — для товаров в наличии (30% при получении)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-400 text-base leading-none mt-1.5">•</span>
                <span>При отказе от заказа предоплата не возвращается</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </main>
  );
};

export default DeliveryPage;