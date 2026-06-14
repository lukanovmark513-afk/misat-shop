import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <i className="fas fa-chevron-right text-[9px]"></i>
          <span className="text-white">Политика конфиденциальности</span>
        </div>

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-10">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="Privacy"
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
              ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
            </h1>
            <p className="text-gray-400 text-sm mt-2">Интернет-магазин "MISAT" (далее - Продавец)</p>
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
                  <p>1.1. Настоящая Политика конфиденциальности является официальным документом интернет-магазина "MISAT".</p>
                  <p>1.2. Политика определяет порядок обработки и защиты персональных данных пользователей.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 2. КАКИЕ ДАННЫЕ МЫ СОБИРАЕМ
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>2.1. При оформлении заказа мы собираем следующие данные:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Фамилия, имя, отчество</li>
                    <li>Адрес электронной почты</li>
                    <li>Номер телефона</li>
                    <li>Адрес доставки</li>
                  </ul>
                  <p>2.2. Данные банковских карт не хранятся на нашем сайте, оплата производится через защищённые платёжные системы.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 3. ЦЕЛИ СБОРА ДАННЫХ
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>3.1. Ваши данные используются для:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Обработки и доставки заказов</li>
                    <li>Связи с вами по вопросам заказа</li>
                    <li>Информирования о статусе заказа</li>
                    <li>Улучшения работы сайта</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 4. ПЕРЕДАЧА ДАННЫХ ТРЕТЬИМ ЛИЦАМ
                </h2>
                <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                  <p>4.1. Мы передаём ваши данные только:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Службам доставки (для отправки заказа)</li>
                    <li>Платёжным системам (для обработки оплаты)</li>
                  </ul>
                  <p>4.2. Мы не продаём и не передаём ваши данные третьим лицам в иных целях.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 5. ХРАНЕНИЕ И ЗАЩИТА ДАННЫХ
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>5.1. Ваши данные хранятся в зашифрованном виде и защищены от несанкционированного доступа.</p>
                  <p>5.2. Мы принимаем все необходимые меры для защиты ваших персональных данных.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 6. УДАЛЕНИЕ ДАННЫХ
                </h2>
                <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
                  <p>6.1. Вы можете удалить свои данные, отправив запрос на электронную почту: <span className="text-white/80 font-mono text-xs">support@misat.ru</span></p>
                  <p>6.2. Также вы можете удалить аккаунт самостоятельно в личном кабинете.</p>
                </div>
              </section>

              <section>
                <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                  <span className="w-6 h-0.5 bg-white/40"></span> 7. КОНТАКТНАЯ ИНФОРМАЦИЯ
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

export default PrivacyPage;