import React from 'react';
import { Link } from 'react-router-dom';

const OfferPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <i className="fas fa-chevron-right text-[9px]"></i>
          <span className="text-white">Публичная оферта</span>
        </div>

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-10">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="Offer"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-10 px-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-white/40"></div>
              <span className="text-gray-400 text-[10px] tracking-[0.3em]">ДОКУМЕНТЫ</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
              ПУБЛИЧНАЯ ОФЕРТА
            </h1>
            <p className="text-gray-400 text-sm mt-2">Интернет-магазин "MISAT" в лице ИП MISAT (ИНН: 673111219228) (далее - Продавец)</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-6 md:p-8 space-y-8">

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 1. ОБЩИЕ ПОЛОЖЕНИЯ
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>1.1. Настоящий документ является официальной публичной офертой интернет-магазина "MISAT".</p>
                  <p>1.2. Акцептом настоящей оферты является оформление заказа на сайте misat.ru.</p>
                  <p>1.3. Продавец имеет право вносить изменения в оферту без предварительного уведомления.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 2. ТОВАР И ПОРЯДОК ОФОРМЛЕНИЯ ЗАКАЗА
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>2.1. Продавец осуществляет продажу товаров, представленных на сайте.</p>
                  <p>2.2. Заказ оформляется через корзину и форму оформления заказа.</p>
                  <p>2.3. После оформления заказа покупатель получает подтверждение на email.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 3. ОПЛАТА ТОВАРА
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>3.1. Цены на товары указаны на сайте в российских рублях.</p>
                  <p>3.2. Оплата производится банковской картой, СБП или наличными при получении.</p>
                  <p>3.3. Продавец не хранит данные банковских карт.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 4. ПРЕДОПЛАТА
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>4.1. Для товаров в наличии (РФ): предоплата 70%, остаток 30% при получении.</p>
                  <p>4.2. Для товаров под заказ из Китая: предоплата 100%.</p>
                  <p>4.3. При отказе от заказа предоплата не возвращается.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 5. ДОСТАВКА ТОВАРА
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>5.1. Доставка осуществляется по всей России через СДЭК.</p>
                  <p>5.2. Отправка всех заказов производится из Смоленска.</p>
                  <p>5.3. Срок доставки товаров в наличии: 2-5 дней.</p>
                  <p>5.4. Срок доставки предзаказа из Китая: 20-35 дней.</p>
                  <p>5.5. Бесплатная доставка при заказе от 5000 ₽.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 6. ВОЗВРАТ ТОВАРА
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>6.1. Возврат товара надлежащего качества возможен в течение 30 дней.</p>
                  <p>6.2. Товар должен быть не использован и сохранены фабричные ярлыки.</p>
                  <p>6.3. Возврат денежных средств осуществляется в течение 10 рабочих дней.</p>
                  <p>6.4. Обратная доставка оплачивается покупателем.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 7. СРОКИ ОБРАБОТКИ ЗАКАЗА
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>7.1. Заказ обрабатывается в течение 1-2 рабочих дней.</p>
                  <p>7.2. В случае предзаказа товар отправляется после поступления на склад в Смоленске.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 8. РЕКВИЗИТЫ ПРОДАВЦА
                </h2>
                <div className="space-y-1 text-gray-300 text-sm">
                  <p><span className="text-white font-bold">ИП MISAT</span></p>
                  <p>ИНН: 673111219228</p>
                  <p>Телефон: +7 (993) 884-37-66</p>
                  <p>Email: misatsupport@gmail.com</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferPage;