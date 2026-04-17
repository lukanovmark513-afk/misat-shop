import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black">Главная</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-black">Политика конфиденциальности</span>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black mb-6">ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</h1>
          <p className="text-gray-500 mb-8">Интернет-магазин "MISAT" (далее - Продавец)</p>

          <div className="space-y-6">
            <section>
              <h2 className="text-2xl font-black mb-3">1. ОБЩИЕ ПОЛОЖЕНИЯ</h2>
              <p>1.1. Настоящая Политика конфиденциальности является официальным документом интернет-магазина "MISAT".</p>
              <p>1.2. Политика определяет порядок обработки и защиты персональных данных пользователей.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-3">2. КАКИЕ ДАННЫЕ МЫ СОБИРАЕМ</h2>
              <p>2.1. При оформлении заказа мы собираем следующие данные:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Фамилия, имя, отчество</li>
                <li>Адрес электронной почты</li>
                <li>Номер телефона</li>
                <li>Адрес доставки</li>
              </ul>
              <p className="mt-2">2.2. Данные банковских карт не хранятся на нашем сайте, оплата производится через защищённые платёжные системы.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-3">3. ЦЕЛИ СБОРА ДАННЫХ</h2>
              <p>3.1. Ваши данные используются для:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Обработки и доставки заказов</li>
                <li>Связи с вами по вопросам заказа</li>
                <li>Информирования о статусе заказа</li>
                <li>Улучшения работы сайта</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-3">4. ПЕРЕДАЧА ДАННЫХ ТРЕТЬИМ ЛИЦАМ</h2>
              <p>4.1. Мы передаём ваши данные только:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Службам доставки (для отправки заказа)</li>
                <li>Платёжным системам (для обработки оплаты)</li>
              </ul>
              <p>4.2. Мы не продаём и не передаём ваши данные третьим лицам в иных целях.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-3">5. ХРАНЕНИЕ И ЗАЩИТА ДАННЫХ</h2>
              <p>5.1. Ваши данные хранятся в зашифрованном виде и защищены от несанкционированного доступа.</p>
              <p>5.2. Мы принимаем все необходимые меры для защиты ваших персональных данных.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-3">6. УДАЛЕНИЕ ДАННЫХ</h2>
              <p>6.1. Вы можете удалить свои данные, отправив запрос на электронную почту: <strong>support@misat.ru</strong></p>
              <p>6.2. Также вы можете удалить аккаунт самостоятельно в личном кабинете.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-3">7. КОНТАКТНАЯ ИНФОРМАЦИЯ</h2>
              <p><strong>ИП MISAT</strong></p>
              <p>ИНН: 673111219228</p>
              <p>Телефон: +7 (993) 884-37-66</p>
              <p>Email: shop@misat.ru</p>
              <p>Адрес: г. Смоленск, ул. Большая Советская, д. 25, офис 101</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;