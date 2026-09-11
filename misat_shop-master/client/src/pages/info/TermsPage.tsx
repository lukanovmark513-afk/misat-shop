import React from 'react';

const TermsPage = () => {
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
            Документы
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
            Пользовательское
            <br />
            соглашение
          </h1>
          <p className="text-zinc-500 text-base md:text-lg mt-5 max-w-2xl">
            Условия использования сайта и сервисов интернет-магазина MISAT.
          </p>
        </div>

        {/* Документ */}
        <div className="
          relative
          overflow-hidden
          rounded-[32px]
          border border-white/10
          bg-gradient-to-b
          from-white/[0.04]
          to-white/[0.015]
          backdrop-blur-3xl
        ">
          {/* Внутреннее свечение */}
          <div className="
            absolute
            inset-0
            bg-gradient-to-br
            from-white/[0.05]
            via-transparent
            to-transparent
            pointer-events-none
          " />

          <div className="relative z-10 p-6 md:p-8 space-y-5">

            {/* 1. Общие положения */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  01
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Общие положения
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>1.1. Использование сайта misat.ru означает полное согласие с условиями настоящего Соглашения.</p>
                <p>1.2. Продавец оставляет за собой право изменять условия Соглашения без предварительного уведомления.</p>
              </div>
            </section>

            {/* 2. Права и обязанности сторон */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  02
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Права и обязанности сторон
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p className="font-medium text-white/80">2.1. Продавец обязуется:</p>
                <ul className="space-y-3 mt-2 pl-2">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Предоставлять достоверную информацию о товарах</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Обрабатывать заказы в установленные сроки</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Обеспечивать конфиденциальность персональных данных</span>
                  </li>
                </ul>
                <p className="font-medium text-white/80 mt-4">2.2. Покупатель обязуется:</p>
                <ul className="space-y-3 mt-2 pl-2">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Предоставлять достоверные данные при оформлении заказа</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Своевременно оплачивать заказы</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Соблюдать условия возврата товара</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 3. Оформление заказа */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  03
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Оформление заказа
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>3.1. Заказ считается оформленным после заполнения формы и подтверждения.</p>
                <p>3.2. После оформления заказа покупатель получает подтверждение на email.</p>
                <p>3.3. Продавец имеет право отменить заказ при отсутствии товара на складе.</p>
              </div>
            </section>

            {/* 4. Оплата товара */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  04
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Оплата товара
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>4.1. Цены на товары указаны на сайте и могут изменяться.</p>
                <p>4.2. Оплата производится в российских рублях.</p>
                <p>4.3. Способы оплаты: банковская карта, СБП, наличные при получении.</p>
              </div>
            </section>

            {/* 5. Доставка */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  05
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Доставка
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>5.1. Доставка осуществляется по всей России.</p>
                <p>5.2. Отправка заказов производится из Смоленска.</p>
                <p>5.3. Срок доставки товаров в наличии: 2-5 дней.</p>
                <p>5.4. Срок доставки предзаказа из Китая: 20-35 дней.</p>
                <p>5.5. Бесплатная доставка при заказе от 5000 ₽.</p>
              </div>
            </section>

            {/* 6. Возврат товара */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  06
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Возврат товара
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>6.1. Возврат товара надлежащего качества возможен в течение 30 дней.</p>
                <p>6.2. Товар должен быть не использован, с сохранёнными ярлыками и упаковкой.</p>
                <p>6.3. Обратная доставка оплачивается покупателем.</p>
              </div>
            </section>

            {/* 7. Предоплата */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  07
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Предоплата
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>7.1. Для товаров в наличии РФ: предоплата 70%.</p>
                <p>7.2. Для товаров под заказ из Китая: предоплата 100%.</p>
                <p>7.3. При отказе от заказа предоплата не возвращается.</p>
              </div>
            </section>

            {/* 8. Ответственность */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  08
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Ответственность
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>8.1. Продавец не несёт ответственности за задержки доставки по вине транспортных компаний.</p>
                <p>8.2. Продавец не несёт ответственности за несоответствие ожиданиям покупателя.</p>
              </div>
            </section>

            {/* 9. Реквизиты продавца */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  09
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Реквизиты продавца
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-zinc-500 text-sm mb-1">ИП</p>
                  <p className="text-white font-medium">MISAT</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-zinc-500 text-sm mb-1">ИНН</p>
                  <p className="text-white font-medium">673111219228</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-zinc-500 text-sm mb-1">Телефон</p>
                  <p className="text-white font-medium">+7 (993) 884-37-66</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-zinc-500 text-sm mb-1">Email</p>
                  <p className="text-white font-medium">misatsupport@gmail.com</p>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </main>
  );
};

export default TermsPage;