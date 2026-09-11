import React from 'react';

const OfferPage = () => {
  return (
    <main className="relative overflow-hidden min-h-screen bg-[#050505] pt-20">
      {/* Фон как в Tracking */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute left-1/2 top-[100px] -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-white/[0.015] blur-[250px]" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.02] blur-[180px]" />
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
            Публичная
            <br />
            оферта
          </h1>
          <p className="text-zinc-500 text-base md:text-lg mt-5 max-w-2xl">
            Условия покупки, оплаты, доставки и возврата товаров
            интернет-магазина MISAT.
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

          <div className="relative z-10 p-6 md:p-8 space-y-8">

            {/* 1. Общие положения */}
            <section className="pb-8 border-b border-white/10 last:border-0">
              <div className="flex items-center gap-4 mb-5">
                <div className="
                  w-10
                  h-10
                  rounded-full
                  bg-white/[0.05]
                  border border-white/10
                  flex
                  items-center
                  justify-center
                  text-white
                  text-sm
                  font-bold
                  flex-shrink-0
                ">
                  01
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Общие положения
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>1.1. Настоящий документ является официальной публичной офертой интернет-магазина "MISAT".</p>
                <p>1.2. Акцептом настоящей оферты является оформление заказа на сайте misat.ru.</p>
                <p>1.3. Продавец имеет право вносить изменения в оферту без предварительного уведомления.</p>
              </div>
            </section>

            {/* 2. Товар и порядок оформления заказа */}
            <section className="pb-8 border-b border-white/10 last:border-0">
              <div className="flex items-center gap-4 mb-5">
                <div className="
                  w-10
                  h-10
                  rounded-full
                  bg-white/[0.05]
                  border border-white/10
                  flex
                  items-center
                  justify-center
                  text-white
                  text-sm
                  font-bold
                  flex-shrink-0
                ">
                  02
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Товар и порядок оформления заказа
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>2.1. Продавец осуществляет продажу товаров, представленных на сайте.</p>
                <p>2.2. Заказ оформляется через корзину и форму оформления заказа.</p>
                <p>2.3. После оформления заказа покупатель получает подтверждение на email.</p>
              </div>
            </section>

            {/* 3. Оплата товара */}
            <section className="pb-8 border-b border-white/10 last:border-0">
              <div className="flex items-center gap-4 mb-5">
                <div className="
                  w-10
                  h-10
                  rounded-full
                  bg-white/[0.05]
                  border border-white/10
                  flex
                  items-center
                  justify-center
                  text-white
                  text-sm
                  font-bold
                  flex-shrink-0
                ">
                  03
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Оплата товара
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>3.1. Цены на товары указаны на сайте в российских рублях.</p>
                <p>3.2. Оплата производится банковской картой, СБП или наличными при получении.</p>
                <p>3.3. Продавец не хранит данные банковских карт.</p>
              </div>
            </section>

            {/* 4. Предоплата */}
            <section className="pb-8 border-b border-white/10 last:border-0">
              <div className="flex items-center gap-4 mb-5">
                <div className="
                  w-10
                  h-10
                  rounded-full
                  bg-white/[0.05]
                  border border-white/10
                  flex
                  items-center
                  justify-center
                  text-white
                  text-sm
                  font-bold
                  flex-shrink-0
                ">
                  04
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Предоплата
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>4.1. Для товаров в наличии (РФ): предоплата 70%, остаток 30% при получении.</p>
                <p>4.2. Для товаров под заказ из Китая: предоплата 100%.</p>
                <p>4.3. При отказе от заказа предоплата не возвращается.</p>
              </div>
            </section>

            {/* 5. Доставка товара */}
            <section className="pb-8 border-b border-white/10 last:border-0">
              <div className="flex items-center gap-4 mb-5">
                <div className="
                  w-10
                  h-10
                  rounded-full
                  bg-white/[0.05]
                  border border-white/10
                  flex
                  items-center
                  justify-center
                  text-white
                  text-sm
                  font-bold
                  flex-shrink-0
                ">
                  05
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Доставка товара
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>5.1. Доставка осуществляется по всей России через СДЭК.</p>
                <p>5.2. Отправка всех заказов производится из Смоленска.</p>
                <p>5.3. Срок доставки товаров в наличии: 2-5 дней.</p>
                <p>5.4. Срок доставки предзаказа из Китая: 20-35 дней.</p>
                <p>5.5. Бесплатная доставка при заказе от 5000 ₽.</p>
              </div>
            </section>

            {/* 6. Возврат товара */}
            <section className="pb-8 border-b border-white/10 last:border-0">
              <div className="flex items-center gap-4 mb-5">
                <div className="
                  w-10
                  h-10
                  rounded-full
                  bg-white/[0.05]
                  border border-white/10
                  flex
                  items-center
                  justify-center
                  text-white
                  text-sm
                  font-bold
                  flex-shrink-0
                ">
                  06
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Возврат товара
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>6.1. Возврат товара надлежащего качества возможен в течение 30 дней.</p>
                <p>6.2. Товар должен быть не использован и сохранены фабричные ярлыки.</p>
                <p>6.3. Возврат денежных средств осуществляется в течение 10 рабочих дней.</p>
                <p>6.4. Обратная доставка оплачивается покупателем.</p>
              </div>
            </section>

            {/* 7. Сроки обработки заказа */}
            <section className="pb-8 border-b border-white/10 last:border-0">
              <div className="flex items-center gap-4 mb-5">
                <div className="
                  w-10
                  h-10
                  rounded-full
                  bg-white/[0.05]
                  border border-white/10
                  flex
                  items-center
                  justify-center
                  text-white
                  text-sm
                  font-bold
                  flex-shrink-0
                ">
                  07
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Сроки обработки заказа
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>7.1. Заказ обрабатывается в течение 1-2 рабочих дней.</p>
                <p>7.2. В случае предзаказа товар отправляется после поступления на склад в Смоленске.</p>
              </div>
            </section>

            {/* 8. Реквизиты продавца */}
            <section className="last:border-0">
              <div className="flex items-center gap-4 mb-5">
                <div className="
                  w-10
                  h-10
                  rounded-full
                  bg-white/[0.05]
                  border border-white/10
                  flex
                  items-center
                  justify-center
                  text-white
                  text-sm
                  font-bold
                  flex-shrink-0
                ">
                  08
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Реквизиты продавца
                </h2>
              </div>

              <div className="
                rounded-3xl
                border border-white/10
                bg-white/[0.03]
                p-6 md:p-8
              ">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-zinc-500 text-sm mb-1">ИП</p>
                    <p className="text-white font-medium text-lg">MISAT</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-sm mb-1">ИНН</p>
                    <p className="text-white font-medium text-lg">673111219228</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-sm mb-1">Телефон</p>
                    <p className="text-white font-medium text-lg">+7 (993) 884-37-66</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-sm mb-1">Email</p>
                    <p className="text-white font-medium text-lg">misatsupport@gmail.com</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </main>
  );
};

export default OfferPage;