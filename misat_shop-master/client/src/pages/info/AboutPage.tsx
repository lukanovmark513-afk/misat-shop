import React from 'react';

const AboutPage = () => {
  return (
    <main className="relative overflow-hidden min-h-screen bg-[#050505] pt-20">
      {/* Фон */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute left-1/2 top-[100px] -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-white/[0.015] blur-[250px]" />
        <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.02] blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 pb-32">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-white/20 mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent pointer-events-none" />
          <div className="relative py-16 px-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-10 h-px bg-white/30" />
              <span className="text-zinc-500 text-[10px] tracking-[0.3em] uppercase">Компания</span>
              <span className="w-10 h-px bg-white/30" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white">
              О нас
            </h1>
            <p className="text-zinc-500 text-base mt-4 max-w-2xl mx-auto">
              MISAT — ваш надёжный партнёр в мире стильной и качественной одежды
            </p>
          </div>
        </div>

        {/* Кто мы */}
        <div className="bg-[#111111] border border-white/20 rounded-3xl p-8 md:p-10 mb-8">
          <h2 className="text-white font-black text-2xl md:text-3xl mb-6 flex items-center gap-3">
            <span className="w-10 h-px bg-white/40" />
            Кто мы
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed">
            MISAT — это современный интернет-магазин одежды, основанный в 2024 году.
            Мы объединили минималистичный дизайн, высокое качество и доступные цены.
            Наша команда тщательно отбирает каждую модель, чтобы предложить вам только лучшие вещи.
          </p>
        </div>

        {/* Наша миссия */}
        <div className="bg-[#111111] border border-white/20 rounded-3xl p-8 md:p-10 mb-8">
          <h2 className="text-white font-black text-2xl md:text-3xl mb-6 flex items-center gap-3">
            <span className="w-10 h-px bg-white/40" />
            Наша миссия
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed">
            Сделать качественную и стильную одежду доступной для каждого.
            Мы верим, что хороший дизайн и отличное качество не должны стоить целое состояние.
          </p>
        </div>

        {/* Почему выбирают нас */}
        <div className="mb-10">
          <h2 className="text-white font-black text-2xl md:text-3xl mb-6 flex items-center gap-3">
            <span className="w-10 h-px bg-white/40" />
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="
              bg-[#111111]
              border border-white/20
              rounded-3xl
              p-8
              text-center
              transition-all
              duration-300
              hover:border-white/40
              hover:-translate-y-1
            ">
              <div className="w-16 h-16 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-5">
                <i className="fas fa-truck-fast text-white/60 text-2xl" />
              </div>
              <h3 className="text-white font-black text-lg mb-3">Быстрая доставка</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Доставка по всей России от 2 до 5 дней
              </p>
            </div>
            <div className="
              bg-[#111111]
              border border-white/20
              rounded-3xl
              p-8
              text-center
              transition-all
              duration-300
              hover:border-white/40
              hover:-translate-y-1
            ">
              <div className="w-16 h-16 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-5">
                <i className="fas fa-arrows-spin text-white/60 text-2xl" />
              </div>
              <h3 className="text-white font-black text-lg mb-3">Лёгкий возврат</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Возврат товара в течение 30 дней
              </p>
            </div>
            <div className="
              bg-[#111111]
              border border-white/20
              rounded-3xl
              p-8
              text-center
              transition-all
              duration-300
              hover:border-white/40
              hover:-translate-y-1
            ">
              <div className="w-16 h-16 mx-auto bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-5">
                <i className="fas fa-shield-alt text-white/60 text-2xl" />
              </div>
              <h3 className="text-white font-black text-lg mb-3">Гарантия качества</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Оригинальная продукция от проверенных поставщиков
              </p>
            </div>
          </div>
        </div>

        {/* Реквизиты */}
        <div className="bg-[#111111] border border-white/20 rounded-3xl p-8 md:p-10 mb-8">
          <h2 className="text-white font-black text-2xl md:text-3xl mb-6 flex items-center gap-3">
            <span className="w-10 h-px bg-white/40" />
            Реквизиты
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3 text-zinc-400">
              <p><span className="text-white font-medium">ИП MISAT</span></p>
              <p>ИНН: 673111219228</p>
              <p>ОГРНИП: 323456789012345</p>
            </div>
            <div className="space-y-3 text-zinc-400">
              <p><span className="text-white font-medium">Юридический адрес</span></p>
              <p>г. Смоленск, ул. Советская, д. 10</p>
              <p>Телефон: +7 (993) 884-37-66</p>
            </div>
          </div>
        </div>

        {/* Соцсети */}
        <div className="bg-[#111111] border border-white/20 rounded-3xl p-8 md:p-10 text-center">
          <h2 className="text-white font-black text-2xl md:text-3xl mb-4 flex items-center justify-center gap-3">
            <span className="w-10 h-px bg-white/40" />
            Наши соцсети
            <span className="w-10 h-px bg-white/40" />
          </h2>
          <p className="text-zinc-500 text-sm mb-6">
            Следите за нами в социальных сетях
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://t.me/misatshop"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:-translate-y-1"
            >
              <i className="fab fa-telegram text-white/70 text-xl" />
            </a>
            <a
              href="https://vk.ru/mokidorastore"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:-translate-y-1"
            >
              <i className="fab fa-vk text-white/70 text-xl" />
            </a>
            <a
              href="https://www.tiktok.com/@misatchina"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-300 hover:border-white/40 hover:bg-white/10 hover:-translate-y-1"
            >
              <i className="fab fa-tiktok text-white/70 text-xl" />
            </a>
          </div>
        </div>

      </div>
    </main>
  );
};

export default AboutPage;