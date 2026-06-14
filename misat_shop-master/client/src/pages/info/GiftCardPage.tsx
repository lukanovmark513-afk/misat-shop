import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <i className="fas fa-chevron-right text-[9px]"></i>
          <span className="text-white">Подарочные сертификаты</span>
        </div>

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-10">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="Gift Cards"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-10 px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-white/40"></div>
              <span className="text-gray-400 text-[10px] tracking-[0.3em]">ПОДАРКИ</span>
              <div className="w-8 h-0.5 bg-white/40"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              ПОДАРОЧНЫЕ СЕРТИФИКАТЫ
            </h1>
            <p className="text-gray-400 text-sm mt-3">Идеальный подарок для близких</p>
          </div>
        </div>

        {/* Табы */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('buy')}
            className={`px-8 py-3 font-black text-sm tracking-wider rounded-xl transition-all duration-300 ${
              activeTab === 'buy'
                ? 'bg-white text-black shadow-lg'
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
            }`}
          >
            КУПИТЬ
          </button>
          <button
            onClick={() => setActiveTab('activate')}
            className={`px-8 py-3 font-black text-sm tracking-wider rounded-xl transition-all duration-300 ${
              activeTab === 'activate'
                ? 'bg-white text-black shadow-lg'
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
            }`}
          >
            АКТИВИРОВАТЬ
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-8 py-3 font-black text-sm tracking-wider rounded-xl transition-all duration-300 ${
              activeTab === 'my'
                ? 'bg-white text-black shadow-lg'
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
            }`}
          >
            МОИ
          </button>
        </div>

        {/* Покупка сертификата */}
        {activeTab === 'buy' && (
          <div className="max-w-2xl mx-auto bg-white/5 rounded-2xl border border-white/10 p-8">
            <h2 className="text-white font-black text-2xl mb-6 text-center">ВЫБЕРИТЕ НОМИНАЛ</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {amounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`py-3 text-center font-bold rounded-xl transition-all duration-300 ${
                    selectedAmount === amount
                      ? 'bg-white text-black shadow-lg'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {amount.toLocaleString()} ₽
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email получателя *"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
              />
              <input
                type="text"
                placeholder="Имя получателя"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
              />
              <textarea
                placeholder="Поздравление"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition resize-none"
              />
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex justify-between mb-2 text-gray-300">
                  <span>Номинал:</span>
                  <span className="text-white font-bold">{selectedAmount.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2">
                  <span className="text-white font-black">Итого:</span>
                  <span className="text-white font-black text-xl">{selectedAmount.toLocaleString()} ₽</span>
                </div>
              </div>
              <button
                onClick={handleBuyGiftCard}
                disabled={isLoading}
                className="w-full bg-white text-black py-3.5 rounded-xl font-black text-sm tracking-wider hover:bg-white/90 transition disabled:opacity-50"
              >
                {isLoading ? 'ОТПРАВКА...' : `ОПЛАТИТЬ ${selectedAmount.toLocaleString()} ₽`}
              </button>
            </div>
          </div>
        )}

        {/* Активация сертификата */}
        {activeTab === 'activate' && (
          <div className="max-w-md mx-auto bg-white/5 rounded-2xl border border-white/10 p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-4">
              <i className="fas fa-gift text-white/40 text-3xl"></i>
            </div>
            <h2 className="text-white font-black text-2xl mb-3">АКТИВАЦИЯ</h2>
            <p className="text-gray-400 text-sm mb-5">После активации деньги поступят на ваш баланс</p>
            <input
              type="text"
              placeholder="Код сертификата"
              value={activateCode}
              onChange={(e) => setActivateCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition text-center uppercase mb-4"
            />
            <button
              onClick={handleActivateGiftCard}
              className="w-full bg-white text-black py-3 rounded-xl font-black text-sm tracking-wider hover:bg-white/90 transition"
            >
              АКТИВИРОВАТЬ
            </button>
          </div>
        )}

        {/* Мои сертификаты */}
        {activeTab === 'my' && (
          <div className="max-w-2xl mx-auto">
            {myGiftCards.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-20 h-20 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                  <i className="fas fa-gift text-white/40 text-3xl"></i>
                </div>
                <p className="text-gray-400 mb-4">У вас пока нет сертификатов</p>
                <button
                  onClick={() => setActiveTab('buy')}
                  className="text-white underline hover:text-gray-300 transition"
                >
                  Купить сертификат
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myGiftCards.map((card, idx) => (
                  <div key={idx} className="bg-white/5 rounded-2xl border border-white/10 p-6">
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="text-white/40 text-[10px] font-bold tracking-wider mb-1">КОД</p>
                        <p className="text-white font-mono font-black text-sm">{card.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white/40 text-[10px] font-bold tracking-wider mb-1">НОМИНАЛ</p>
                        <p className="text-emerald-400 font-black text-2xl">{card.amount.toLocaleString()} ₽</p>
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-white/40 text-[10px] font-bold tracking-wider mb-1">ПОЛУЧАТЕЛЬ</p>
                      <p className="text-white text-sm">{card.recipientName || 'Не указан'} <span className="text-gray-400">({card.recipientEmail})</span></p>
                      {card.message && (
                        <p className="text-gray-400 italic text-sm mt-2">"{card.message}"</p>
                      )}
                      <p className="text-gray-500 text-[10px] mt-3">Создан: {new Date(card.createdAt).toLocaleDateString()}</p>
                      <p className={`text-[10px] mt-1 font-bold ${card.isUsed ? 'text-red-400' : 'text-emerald-400'}`}>
                        {card.isUsed ? 'Использован' : 'Активен'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCardPage;