import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { addToBalance } from '../../services/storageService';

const GiftCardPage = () => {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [activateCode, setActivateCode] = useState('');
  const [activeTab, setActiveTab] = useState('buy');
  const [myGiftCards, setMyGiftCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const amounts = [500, 1000, 2000, 3000, 5000, 10000];

  useEffect(() => {
    if (isAuthenticated && user) {
      const giftCards = JSON.parse(localStorage.getItem('misat_gift_cards') || '[]');
      const myCards = giftCards.filter((card: any) => card.createdBy === user.email);
      setMyGiftCards(myCards);
    }
  }, [isAuthenticated, user]);

  const handleBuyGiftCard = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Войдите в аккаунт для покупки сертификата');
      return;
    }
    if (!recipientEmail) {
      toast.error('Введите email получателя');
      return;
    }

    setIsLoading(true);

    const code = 'GIFT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const giftCards = JSON.parse(localStorage.getItem('misat_gift_cards') || '[]');

    const newCard = {
      code,
      amount: selectedAmount,
      recipientEmail,
      recipientName,
      message,
      isUsed: false,
      createdBy: user?.email,
      createdAt: new Date().toISOString()
    };

    giftCards.push(newCard);
    localStorage.setItem('misat_gift_cards', JSON.stringify(giftCards));

    try {
      const response = await fetch('/api/forms/send-gift-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          recipientName,
          code,
          amount: selectedAmount,
          message,
          senderName: user?.first_name || user?.email?.split('@')[0]
        })
      });

      if (response.ok) {
        toast.success(`Сертификат на ${selectedAmount} ₽ отправлен на почту ${recipientEmail}!`);
      } else {
        toast.error(`Сертификат создан, но письмо не отправлено. Код: ${code}`);
      }
    } catch (error) {
      toast.error(`Сертификат создан! Код: ${code}`);
    }

    setRecipientEmail('');
    setRecipientName('');
    setMessage('');
    setMyGiftCards(giftCards.filter((card: any) => card.createdBy === user?.email));
    setIsLoading(false);
  };

  const handleActivateGiftCard = () => {
    if (!activateCode) {
      toast.error('Введите код сертификата');
      return;
    }
    if (!isAuthenticated || !user) {
      toast.error('Войдите в аккаунт для активации');
      return;
    }

    const giftCards = JSON.parse(localStorage.getItem('misat_gift_cards') || '[]');
    const card = giftCards.find((c: any) => c.code === activateCode && !c.isUsed);

    if (!card) {
      toast.error('Неверный или уже использованный код');
      return;
    }

    const success = addToBalance(user.id, card.amount);

    if (success) {
      toast.success(`Сертификат активирован! ${card.amount} ₽ зачислены на баланс!`);
      card.isUsed = true;
      card.activatedBy = user.email;
      card.activatedAt = new Date().toISOString();
      localStorage.setItem('misat_gift_cards', JSON.stringify(giftCards));
      setActivateCode('');
      window.dispatchEvent(new Event('balanceUpdated'));
    } else {
      toast.error('Ошибка активации');
    }
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
    <div className="mb-14 md:mb-20">
      <p className="text-zinc-500 text-lg font-medium">
        Подарки
      </p>
      <h1 className="
        text-[56px]
        sm:text-[72px]
        md:text-[100px]
        lg:text-[120px]
        font-black
        tracking-[-0.08em]
        leading-[0.9]
        text-white
      ">
        Gift Card
      </h1>
      <p className="text-zinc-500 text-lg mt-4 max-w-xl">
        Подарите сертификат друзьям и близким.
        Средства можно использовать для любых покупок.
      </p>
    </div>
  );

  // iOS Segmented Control
  const renderTabs = () => (
    <div className="flex justify-center mb-10">
      <div className="p-1 rounded-full bg-white/[0.03] border border-white/[0.06] flex gap-1">
        {[
          { id: 'buy', label: 'Купить' },
          { id: 'activate', label: 'Активировать' },
          { id: 'my', label: 'Мои' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              h-11
              px-6
              rounded-full
              text-sm
              font-medium
              transition-all
              ${activeTab === tab.id
                ? 'bg-white text-black'
                : 'text-zinc-400 hover:text-white'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  // Покупка
  const renderBuyTab = () => (
    <div className="grid lg:grid-cols-[420px_1fr] gap-8">
      {/* Превью сертификата */}
      <div className="
        relative
        overflow-hidden
        rounded-[32px]
        border border-white/10
        bg-gradient-to-br
        from-white/[0.06]
        to-white/[0.02]
        p-8
        h-[260px]
        flex
        flex-col
        justify-between
      ">
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

        <div className="relative z-10">
          <p className="text-white/40 text-xs uppercase tracking-wider">Gift Card</p>
          <p className="text-white text-3xl font-black mt-1">{selectedAmount.toLocaleString()} ₽</p>
          <p className="text-white/60 text-sm mt-1">Для {recipientName || 'Получателя'}</p>
        </div>

        <div className="relative z-10 flex justify-end">
          <i className="fas fa-gift text-6xl text-white/20" />
        </div>
      </div>

      {/* Форма */}
      <div className="space-y-6">
        <div>
          <p className="text-zinc-500 text-sm font-medium mb-3">Выберите номинал</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {amounts.map(amount => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`
                  h-14
                  rounded-2xl
                  border
                  border-white/[0.08]
                  font-medium
                  transition-all
                  ${selectedAmount === amount
                    ? 'bg-white text-black'
                    : 'bg-white/[0.03] text-white hover:bg-white/[0.06]'
                  }
                `}
              >
                {amount.toLocaleString()} ₽
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email получателя *"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
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
          <input
            type="text"
            placeholder="Имя получателя"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
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
          <textarea
            placeholder="Поздравление"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="
              w-full
              px-5
              py-3
              rounded-2xl
              bg-white/[0.03]
              border border-white/[0.06]
              text-white
              placeholder:text-zinc-600
              focus:outline-none
              focus:border-white/20
              transition
              resize-none
              text-base
            "
          />
        </div>

        <div className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-5">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Номинал</span>
            <span className="text-white font-medium">{selectedAmount.toLocaleString()} ₽</span>
          </div>
          <div className="flex justify-between text-sm mt-2 pt-2 border-t border-white/[0.06]">
            <span className="text-white font-semibold">Итого</span>
            <span className="text-white font-black text-xl">{selectedAmount.toLocaleString()} ₽</span>
          </div>
        </div>

        <button
          onClick={handleBuyGiftCard}
          disabled={isLoading}
          className="
            w-full
            h-14
            rounded-2xl
            bg-white
            text-black
            font-semibold
            transition-all
            hover:opacity-90
            active:scale-[0.97]
            disabled:opacity-50
            text-base
          "
        >
          {isLoading ? 'ОТПРАВКА...' : `Оплатить ${selectedAmount.toLocaleString()} ₽`}
        </button>
      </div>
    </div>
  );

  // Активация
  const renderActivateTab = () => (
    <div className="max-w-lg mx-auto">
      <div className="
        relative
        overflow-hidden
        rounded-[32px]
        border border-white/[0.08]
        bg-[#0b0b0b]
        shadow-[0_0_0_1px_rgba(255,255,255,0.02)]
        p-8
        text-center
      ">
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="
            w-24
            h-24
            mx-auto
            rounded-3xl
            bg-white/[0.04]
            border border-white/[0.08]
            flex
            items-center
            justify-center
            mb-6
          ">
            <i className="fas fa-gift text-4xl text-white/40" />
          </div>

          <h3 className="text-white text-xl font-medium mb-1">Активация сертификата</h3>
          <p className="text-zinc-500 text-sm mb-6">После активации деньги поступят на ваш баланс</p>

          <input
            type="text"
            placeholder="Введите код сертификата"
            value={activateCode}
            onChange={(e) => setActivateCode(e.target.value.toUpperCase())}
            className="
              w-full
              h-16
              px-5
              rounded-2xl
              bg-white/[0.03]
              border border-white/[0.06]
              text-white
              text-center
              font-mono
              tracking-[0.2em]
              uppercase
              placeholder:tracking-normal
              placeholder:text-zinc-600
              focus:outline-none
              focus:border-white/20
              transition
              text-base
            "
          />

          <button
            onClick={handleActivateGiftCard}
            className="
              w-full
              h-14
              mt-4
              rounded-2xl
              bg-white
              text-black
              font-semibold
              transition-all
              hover:opacity-90
              active:scale-[0.97]
              text-base
            "
          >
            Активировать
          </button>
        </div>
      </div>
    </div>
  );

  // Мои сертификаты
  const renderMyTab = () => (
    <div className="max-w-3xl mx-auto">
      {myGiftCards.length === 0 ? (
        <div className="
          relative
          overflow-hidden
          rounded-[32px]
          border border-white/[0.08]
          bg-[#0b0b0b]
          shadow-[0_0_0_1px_rgba(255,255,255,0.02)]
          p-12
          text-center
        ">
          <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="
              w-20
              h-20
              mx-auto
              rounded-3xl
              bg-white/[0.04]
              border border-white/[0.08]
              flex
              items-center
              justify-center
              mb-4
            ">
              <i className="fas fa-gift text-3xl text-white/20" />
            </div>
            <p className="text-zinc-500 mb-4">У вас пока нет сертификатов</p>
            <button
              onClick={() => setActiveTab('buy')}
              className="text-white hover:text-white/80 transition font-medium"
            >
              Купить сертификат →
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {myGiftCards.map((card, idx) => (
            <div
              key={idx}
              className="
                relative
                overflow-hidden
                rounded-[28px]
                border border-white/[0.08]
                bg-gradient-to-b
                from-white/[0.04]
                to-white/[0.02]
                p-6
                transition-all
                hover:border-white/20
              "
            >
              <div className="absolute top-0 left-0 right-0 h-[100px] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Код</p>
                    <p className="text-white font-mono text-sm font-medium tracking-[0.15em]">
                      {card.code}
                    </p>
                  </div>
                  <span className={`
                    text-[10px] px-3 py-1 rounded-full font-medium
                    ${card.isUsed
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }
                  `}>
                    {card.isUsed ? 'Использован' : 'Активен'}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Номинал</p>
                  <p className="text-4xl font-black tracking-tight text-white">
                    {card.amount.toLocaleString()} ₽
                  </p>
                </div>

                <div className="border-t border-white/[0.06] pt-4">
                  <p className="text-zinc-500 text-[10px] uppercase tracking-wider">Получатель</p>
                  <p className="text-white text-sm">
                    {card.recipientName || 'Не указан'}
                    <span className="text-zinc-500 text-xs ml-2">({card.recipientEmail})</span>
                  </p>
                  {card.message && (
                    <p className="text-zinc-500 italic text-sm mt-2">"{card.message}"</p>
                  )}
                  <p className="text-zinc-600 text-[10px] mt-3">
                    {new Date(card.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#050505] pt-20">
      {renderBackground()}

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 relative z-10">
        {renderHero()}
        {renderTabs()}

        {activeTab === 'buy' && renderBuyTab()}
        {activeTab === 'activate' && renderActivateTab()}
        {activeTab === 'my' && renderMyTab()}

        <div className="h-8" />
      </div>
    </main>
  );
};

export default GiftCardPage;