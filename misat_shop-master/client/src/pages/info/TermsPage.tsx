import React from 'react';
import { Link } from 'react-router-dom';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <i className="fas fa-chevron-right text-[9px]"></i>
          <span className="text-white">Пользовательское соглашение</span>
        </div>

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-10">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="Terms"
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
              ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ
            </h1>
            <p className="text-gray-400 text-sm mt-2">Интернет-магазин "MISAT" (ИП MISAT) (далее - Продавец)</p>
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
                  <p>1.1. Использование сайта misat.ru означает полное согласие с условиями настоящего Соглашения.</p>
                  <p>1.2. Продавец оставляет за собой право изменять условия Соглашения без предварительного уведомления.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 2. ПРАВА И ОБЯЗАННОСТИ СТОРОН
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p className="font-bold text-white/80 mb-2">2.1. Продавец обязуется:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Предоставлять достоверную информацию о товарах</li>
                    <li>Обрабатывать заказы в установленные сроки</li>
                    <li>Обеспечивать конфиденциальность персональных данных</li>
                  </ul>
                  <p className="font-bold text-white/80 mt-3 mb-2">2.2. Покупатель обязуется:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Предоставлять достоверные данные при оформлении заказа</li>
                    <li>Своевременно оплачивать заказы</li>
                    <li>Соблюдать условия возврата товара</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 3. ОФОРМЛЕНИЕ ЗАКАЗА
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>3.1. Заказ считается оформленным после заполнения формы и подтверждения.</p>
                  <p>3.2. После оформления заказа покупатель получает подтверждение на email.</p>
                  <p>3.3. Продавец имеет право отменить заказ при отсутствии товара на складе.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 4. ОПЛАТА ТОВАРА
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>4.1. Цены на товары указаны на сайте и могут изменяться.</p>
                  <p>4.2. Оплата производится в российских рублях.</p>
                  <p>4.3. Способы оплаты: банковская карта, СБП, наличные при получении.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 5. ДОСТАВКА
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>5.1. Доставка осуществляется по всей России.</p>
                  <p>5.2. Отправка заказов производится из Смоленска.</p>
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
                  <p>6.2. Товар должен быть не использован, с сохранёнными ярлыками и упаковкой.</p>
                  <p>6.3. Обратная доставка оплачивается покупателем.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 7. ПРЕДОПЛАТА
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>7.1. Для товаров в наличии РФ: предоплата 70%.</p>
                  <p>7.2. Для товаров под заказ из Китая: предоплата 100%.</p>
                  <p>7.3. При отказе от заказа предоплата не возвращается.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 8. ОТВЕТСТВЕННОСТЬ
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>8.1. Продавец не несёт ответственности за задержки доставки по вине транспортных компаний.</p>
                  <p>8.2. Продавец не несёт ответственности за несоответствие ожиданиям покупателя.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 9. РЕКВИЗИТЫ ПРОДАВЦА
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

export default TermsPage;