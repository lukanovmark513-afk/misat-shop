import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addToBalance } from '../services/storageService';
import { updateUserBalance } from '../store/slices/authSlice';  // ← ДОБАВИТЬ

const BalanceTopupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp'>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const amounts = [500, 1000, 2000, 3000, 5000, 10000];

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <i className="fas fa-lock text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-black mb-4">ТРЕБУЕТСЯ АВТОРИЗАЦИЯ</h2>
          <p className="text-gray-500 mb-8">Войдите в аккаунт, чтобы пополнить баланс</p>
          <Link to="/profile" className="inline-block bg-black text-white px-8 py-3 font-black tracking-wider hover:bg-gray-800 transition">
            ВОЙТИ
          </Link>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    if (selectedAmount < 100) {
      toast.error('Минимальная сумма пополнения 100 ₽');
      return;
    }

    setIsLoading(true);

    // Имитация оплаты
    setTimeout(() => {
      // Добавляем деньги на баланс
      const success = addToBalance(user.id, selectedAmount);

      if (success) {
        // Обновляем Redux state
        dispatch(updateUserBalance(user.balance + selectedAmount));

        toast.success(`Баланс пополнен на ${selectedAmount.toLocaleString()} ₽!`);

        // Обновляем отображение баланса
        window.dispatchEvent(new Event('balanceUpdated'));

        // Перенаправляем в профиль
        setTimeout(() => navigate('/profile'), 1500);
      } else {
        toast.error('Ошибка пополнения баланса');
      }

      setIsLoading(false);
    }, 1500);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-black">Главная</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <Link to="/profile" className="hover:text-black">Профиль</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-black">Пополнение баланса</span>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter">ПОПОЛНЕНИЕ БАЛАНСА</h1>
            <div className="w-16 h-0.5 bg-black mx-auto mt-3"></div>
            <p className="text-gray-500 mt-3">Текущий баланс: <span className="font-bold text-green-600">{user?.balance?.toLocaleString() || 0} ₽</span></p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-black mb-4">ВЫБЕРИТЕ СУММУ</h2>
              <div className="grid grid-cols-3 gap-3">
                {amounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-3 text-center border-2 font-bold rounded-xl transition ${
                      selectedAmount === amount
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {amount.toLocaleString()} ₽
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-bold mb-2">Другая сумма</label>
                <input
                  type="number"
                  placeholder="Введите сумму"
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                  min={100}
                  step={100}
                />
              </div>
            </div>

            <div className="p-6 border-b">
              <h2 className="text-xl font-black mb-4">СПОСОБ ОПЛАТЫ</h2>
              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                    paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                      {paymentMethod === 'card' && <div className="w-3 h-3 rounded-full bg-black"></div>}
                    </div>
                    <i className="fab fa-cc-visa text-2xl text-gray-600"></i>
                    <i className="fab fa-cc-mastercard text-2xl text-gray-600"></i>
                    <i className="fab fa-cc-mir text-2xl text-gray-600"></i>
                    <span className="font-bold ml-2">Банковская карта</span>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('sbp')}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                    paymentMethod === 'sbp' ? 'border-black bg-gray-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center">
                      {paymentMethod === 'sbp' && <div className="w-3 h-3 rounded-full bg-black"></div>}
                    </div>
                    <i className="fas fa-qrcode text-2xl text-gray-600"></i>
                    <span className="font-bold">СБП (Система быстрых платежей)</span>
                  </div>
                </div>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="p-6 border-b">
                <h2 className="text-xl font-black mb-4">ДАННЫЕ КАРТЫ</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Номер карты</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">MM/YY</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={3}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'sbp' && (
              <div className="p-6 border-b text-center">
                <div className="bg-gray-100 p-8 rounded-xl">
                  <i className="fas fa-qrcode text-6xl text-gray-600 mb-3"></i>
                  <p className="text-gray-500 mb-2">Отсканируйте QR-код в приложении банка</p>
                  <div className="w-48 h-48 bg-white mx-auto rounded-xl flex items-center justify-center border-2 border-gray-200">
                    <p className="text-xs text-gray-400 text-center">Здесь будет QR-код<br/>для оплаты через СБП</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">Сумма пополнения:</span>
                <span className="text-2xl font-black">{selectedAmount.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">Комиссия:</span>
                <span className="text-green-600">0 ₽</span>
              </div>
              <div className="border-t-2 border-black pt-3 flex justify-between items-center">
                <span className="font-black text-lg">Итого к оплате:</span>
                <span className="text-2xl font-black">{selectedAmount.toLocaleString()} ₽</span>
              </div>
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full mt-6 bg-black text-white py-4 rounded-xl font-black tracking-wider hover:bg-gray-800 transition disabled:opacity-50"
              >
                {isLoading ? 'ОБРАБОТКА...' : `ОПЛАТИТЬ ${selectedAmount.toLocaleString()} ₽`}
              </button>
              <p className="text-xs text-gray-400 text-center mt-4">
                Платёж защищён. Данные карты не хранятся на нашем сайте.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-info-circle text-blue-600"></i>
              <p className="font-bold text-blue-700">Информация</p>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Минимальная сумма пополнения — 100 ₽</li>
              <li>• Средства зачисляются на баланс мгновенно</li>
              <li>• Балансом можно оплатить до 100% стоимости заказа</li>
              <li>• При отказе от заказа предоплата не возвращается</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceTopupPage;