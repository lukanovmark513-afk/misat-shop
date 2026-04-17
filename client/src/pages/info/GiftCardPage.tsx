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
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black">Главная</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-black">Подарочные сертификаты</span>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">ПОДАРОЧНЫЕ СЕРТИФИКАТЫ</h1>
          <div className="w-20 h-0.5 bg-black mx-auto"></div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setActiveTab('buy')} className={`px-8 py-3 font-black tracking-wider transition ${activeTab === 'buy' ? 'bg-black text-white' : 'border-2 border-black'}`}>КУПИТЬ</button>
          <button onClick={() => setActiveTab('activate')} className={`px-8 py-3 font-black tracking-wider transition ${activeTab === 'activate' ? 'bg-black text-white' : 'border-2 border-black'}`}>АКТИВИРОВАТЬ</button>
          <button onClick={() => setActiveTab('my')} className={`px-8 py-3 font-black tracking-wider transition ${activeTab === 'my' ? 'bg-black text-white' : 'border-2 border-black'}`}>МОИ</button>
        </div>

        {activeTab === 'buy' && (
          <div className="max-w-2xl mx-auto bg-white border-2 border-black p-8">
            <h2 className="text-2xl font-black mb-6 text-center">ВЫБЕРИТЕ НОМИНАЛ</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {amounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => setSelectedAmount(amount)}
                  className={`py-4 text-center border-2 font-black transition ${
                    selectedAmount === amount ? 'border-black bg-black text-white' : 'border-gray-200'
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
              />
              <input
                type="text"
                placeholder="Имя получателя"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl"
              />
              <textarea
                placeholder="Поздравление"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl resize-none"
              />
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex justify-between mb-2">
                  <span>Номинал:</span>
                  <span className="font-bold">{selectedAmount.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-black">Итого:</span>
                  <span className="font-black text-xl">{selectedAmount.toLocaleString()} ₽</span>
                </div>
              </div>
              <button
                onClick={handleBuyGiftCard}
                disabled={isLoading}
                className="w-full bg-black text-white py-4 rounded-xl font-black hover:bg-gray-800 transition disabled:opacity-50"
              >
                {isLoading ? 'ОТПРАВКА...' : `ОПЛАТИТЬ ${selectedAmount.toLocaleString()} ₽`}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'activate' && (
          <div className="max-w-md mx-auto bg-white border-2 border-black p-8 text-center">
            <i className="fas fa-gift text-6xl text-gray-400 mb-4"></i>
            <h2 className="text-2xl font-black mb-4">АКТИВАЦИЯ</h2>
            <p className="text-sm text-gray-500 mb-4">После активации деньги поступят на ваш баланс</p>
            <input
              type="text"
              placeholder="Код сертификата"
              value={activateCode}
              onChange={(e) => setActivateCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-4 text-center uppercase"
            />
            <button
              onClick={handleActivateGiftCard}
              className="w-full bg-black text-white py-3 rounded-xl font-black"
            >
              АКТИВИРОВАТЬ
            </button>
          </div>
        )}

        {activeTab === 'my' && (
          <div className="max-w-2xl mx-auto">
            {myGiftCards.length === 0 ? (
              <div className="text-center py-12 border-2 border-gray-200">
                <i className="fas fa-gift text-5xl text-gray-300 mb-4"></i>
                <p>У вас пока нет сертификатов</p>
                <button onClick={() => setActiveTab('buy')} className="mt-4 text-black underline">
                  Купить сертификат
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myGiftCards.map((card, idx) => (
                  <div key={idx} className="border-2 border-black p-6">
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Код</p>
                        <p className="font-mono font-black">{card.code}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Номинал</p>
                        <p className="font-black text-2xl text-green-600">{card.amount.toLocaleString()} ₽</p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <p className="text-sm text-gray-500">Получатель</p>
                      <p>{card.recipientName || 'Не указан'} ({card.recipientEmail})</p>
                      {card.message && (
                        <p className="text-gray-600 italic mt-2">"{card.message}"</p>
                      )}
                      <p className="text-xs text-gray-400 mt-3">Создан: {new Date(card.createdAt).toLocaleDateString()}</p>
                      <p className={`text-xs mt-1 ${card.isUsed ? 'text-red-500' : 'text-green-500'}`}>
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