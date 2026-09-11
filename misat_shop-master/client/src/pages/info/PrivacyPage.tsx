import React from 'react';

const PrivacyPage = () => {
  return (
    <main className="relative overflow-hidden min-h-screen bg-[#050505] pt-20">
      {/* Фон */}
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
            Политика
            <br />
            конфиденциальности
          </h1>
          <p className="text-zinc-500 text-base md:text-lg mt-5 max-w-2xl">
            Информация о сборе, обработке и защите персональных данных пользователей.
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
                <p>1.1. Настоящая Политика конфиденциальности является официальным документом интернет-магазина "MISAT".</p>
                <p>1.2. Политика определяет порядок обработки и защиты персональных данных пользователей.</p>
              </div>
            </section>

            {/* 2. Какие данные собираем */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  02
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Какие данные мы собираем
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>2.1. При оформлении заказа мы собираем следующие данные:</p>
                <ul className="space-y-3 mt-2">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Фамилия, имя, отчество</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Адрес электронной почты</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Номер телефона</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Адрес доставки</span>
                  </li>
                </ul>
                <p className="mt-4">2.2. Данные банковских карт не хранятся на нашем сайте, оплата производится через защищённые платёжные системы.</p>
              </div>
            </section>

            {/* 3. Цели сбора данных */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  03
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Цели сбора данных
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>3.1. Ваши данные используются для:</p>
                <ul className="space-y-3 mt-2">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Обработки и доставки заказов</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Связи с вами по вопросам заказа</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Информирования о статусе заказа</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Улучшения работы сайта</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 4. Передача данных третьим лицам */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  04
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Передача данных третьим лицам
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>4.1. Мы передаём ваши данные только:</p>
                <ul className="space-y-3 mt-2">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Службам доставки (для отправки заказа)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 mt-2.5 flex-shrink-0" />
                    <span>Платёжным системам (для обработки оплаты)</span>
                  </li>
                </ul>
                <p className="mt-4">4.2. Мы не продаём и не передаём ваши данные третьим лицам в иных целях.</p>
              </div>
            </section>

            {/* 5. Хранение и защита данных */}
            <section className="p-6 md:p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.04]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-sm font-bold text-emerald-400 flex-shrink-0">
                    05
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Хранение и защита данных
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>5.1. Ваши данные хранятся в зашифрованном виде и защищены от несанкционированного доступа.</p>
                <p>5.2. Мы принимаем все необходимые меры для защиты ваших персональных данных.</p>
              </div>
            </section>

            {/* 6. Удаление данных */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  06
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Удаление данных
                </h2>
              </div>
              <div className="space-y-4 text-[15px] leading-8 text-zinc-400">
                <p>6.1. Вы можете удалить свои данные, отправив запрос на электронную почту: <span className="text-white/80 font-mono text-sm">support@misat.ru</span></p>
                <p>6.2. Также вы можете удалить аккаунт самостоятельно в личном кабинете.</p>
              </div>
            </section>

            {/* 7. Контактная информация */}
            <section className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  07
                </div>
                <h2 className="text-white text-xl md:text-2xl font-semibold">
                  Контактная информация
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

export default PrivacyPage;