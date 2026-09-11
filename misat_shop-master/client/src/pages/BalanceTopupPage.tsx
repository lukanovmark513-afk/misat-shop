import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addToBalance } from '../services/storageService';
import { updateUserBalance } from '../store/slices/authSlice';

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
      <div className="min-h-screen bg-[#050505] text-white pt-12 md:pt-20 pb-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#050505]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="relative z-10 w-full px-4 md:px-8 lg:px-16 py-4 md:py-8">
          <div className="text-xs text-white/30 mt-6 md:mt-0 mb-4 md:mb-6">
            <Link to="/" className="hover:text-white/60 transition text-white/40 md:text-white/30 inline-block">
              Главная
            </Link>
            <span className="inline-block mx-1.5 text-white/20">›</span>
            <span className="text-white/60 inline-block">Пополнение</span>
          </div>

          <div className="max-w-md mx-auto text-center mt-2 md:mt-12">
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 md:mb-8 relative">
                <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 border border-white/10 rounded-full"></div>
                <i className="fas fa-lock text-white/20 text-4xl md:text-5xl relative z-10"></i>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-3 md:mb-4">
              ТРЕБУЕТСЯ АВТОРИЗАЦИЯ
            </h1>

            <p className="text-white/40 text-xs md:text-sm mb-6 md:mb-8 max-w-sm mx-auto">
              Войдите в аккаунт, чтобы пополнить баланс
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/profile"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 md:px-8 py-3 md:py-3.5 font-bold text-xs md:text-sm tracking-wider hover:bg-white/90 transition rounded-xl"
              >
                <i className="fas fa-arrow-right text-xs md:text-sm"></i>
                ВОЙТИ
              </Link>
            </div>
          </div>
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

    setTimeout(() => {
      const success = addToBalance(user.id, selectedAmount);

      if (success) {
        dispatch(updateUserBalance(user.balance + selectedAmount));
        toast.success(`Баланс пополнен на ${selectedAmount.toLocaleString()} ₽!`);
        window.dispatchEvent(new Event('balanceUpdated'));
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
    <div className="min-h-screen bg-[#050505] text-white pt-12 md:pt-20 pb-28 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.04),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[150px]" />
        <div className="absolute bottom-[-100px] right-0 w-[300px] h-[300px] rounded-full bg-white/[0.015] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full px-3 md:px-8 lg:px-16 py-4 md:py-6">

        {/* Хлебные крошки */}
        <div className="text-xs text-white/30 mt-2 md:mt-0 mb-4 md:mb-6">
          <Link to="/" className="hover:text-white/60 transition text-white/40 md:text-white/30 inline-block">
            Главная
          </Link>
          <span className="inline-block mx-1.5 text-white/20">›</span>
          <Link to="/profile" className="hover:text-white/60 transition text-white/40 md:text-white/30 inline-block">
            Профиль
          </Link>
          <span className="inline-block mx-1.5 text-white/20">›</span>
          <span className="text-white/60 inline-block">Пополнение</span>
        </div>

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-8 group">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="Balance Topup"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-8 md:py-10 px-6 md:px-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-0.5 bg-white/40"></div>
              <span className="text-white/40 text-[10px] tracking-[0.3em] font-bold">ПОПОЛНЕНИЕ</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
              ПОПОЛНЕНИЕ БАЛАНСА
            </h1>
            <p className="text-white/40 text-sm mt-2">
              Текущий баланс: <span className="text-white font-bold">{user?.balance?.toLocaleString() || 0} ₽</span>
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">

          {/* Основная карточка */}
          <div className="bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">

            {/* Выбор суммы */}
            <div className="p-6 border-b border-white/10">
              <h2 className="text-white font-black text-xl mb-4">ВЫБЕРИТЕ СУММУ</h2>
              <div className="grid grid-cols-3 gap-3">
                {amounts.map(amount => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-3 text-center text-sm font-bold rounded-xl transition-all duration-300 ${
                      selectedAmount === amount
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {amount.toLocaleString()} ₽
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="text-white/40 text-[10px] font-bold block mb-2 tracking-wider">ДРУГАЯ СУММА</label>
                <input
                  type="number"
                  placeholder="Введите сумму"
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min={100}
                  step={100}
                />
              </div>
            </div>

            {/* Способ оплаты */}
            <div className="p-6 border-b border-white/10">
              <h2 className="text-white font-black text-xl mb-4">СПОСОБ ОПЛАТЫ</h2>
              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'card' ? 'border-white bg-white/10' : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-white/50 flex items-center justify-center">
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                    </div>
                    <i className="fab fa-cc-visa text-white/40 text-xl"></i>
                    <i className="fab fa-cc-mastercard text-white/40 text-xl"></i>
                    <i className="fab fa-cc-mir text-white/40 text-xl"></i>
                    <span className="text-white font-bold ml-2">Банковская карта</span>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('sbp')}
                  className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                    paymentMethod === 'sbp' ? 'border-white bg-white/10' : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-white/50 flex items-center justify-center">
                      {paymentMethod === 'sbp' && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                    </div>
                    <i className="fas fa-qrcode text-white/40 text-xl"></i>
                    <span className="text-white font-bold">СБП (Система быстрых платежей)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Данные карты */}
            {paymentMethod === 'card' && (
              <div className="p-6 border-b border-white/10">
                <h2 className="text-white font-black text-xl mb-4">ДАННЫЕ КАРТЫ</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/40 text-[10px] font-bold block mb-2 tracking-wider">НОМЕР КАРТЫ</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      maxLength={19}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/40 text-[10px] font-bold block mb-2 tracking-wider">MM/YY</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-[10px] font-bold block mb-2 tracking-wider">CVC</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                        maxLength={3}
                        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* QR-код для СБП */}
            {paymentMethod === 'sbp' && (
              <div className="p-6 border-b border-white/10 text-center">
                <div className="bg-white/5 rounded-xl p-6">
                  <i className="fas fa-qrcode text-5xl text-white/20 mb-3"></i>
                  <p className="text-white/40 text-sm mb-3">Отсканируйте QR-код в приложении банка</p>
                  <div className="w-40 h-40 mx-auto bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                    <p className="text-[10px] text-white/30 text-center">Здесь будет QR-код<br/>для оплаты через СБП</p>
                  </div>
                </div>
              </div>
            )}

            {/* Итого */}
            <div className="p-6 bg-white/5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/40 text-sm">Сумма пополнения:</span>
                <span className="text-white text-2xl font-black">{selectedAmount.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-white/40 text-sm">Комиссия:</span>
                <span className="text-emerald-400 text-sm font-medium">0 ₽</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-white font-black text-lg">Итого к оплате:</span>
                <span className="text-white text-2xl font-black">{selectedAmount.toLocaleString()} ₽</span>
              </div>
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className="w-full mt-6 bg-white text-black py-4 rounded-xl font-black tracking-wider hover:bg-white/90 transition disabled:opacity-50"
              >
                {isLoading ? 'ОБРАБОТКА...' : `ОПЛАТИТЬ ${selectedAmount.toLocaleString()} ₽`}
              </button>
              <p className="text-[10px] text-white/30 text-center mt-4">
                Платёж защищён. Данные карты не хранятся на нашем сайте.
              </p>
            </div>
          </div>

          {/* Информация */}
          <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-info-circle text-blue-400 text-sm"></i>
              <p className="font-bold text-blue-400 text-sm">Информация</p>
            </div>
            <ul className="text-xs text-white/40 space-y-1">
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