import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_ваш_ключ'); // Замени на свой ключ

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderId: string;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, amount, orderId, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'sbp' | 'crypto'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    // Имитация оплаты (в реальном проекте здесь будет запрос к серверу)
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl p-6 z-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">Оплата заказа</h2>
          <button onClick={onClose} className="text-2xl">✕</button>
        </div>

        <div className="mb-6">
          <p className="text-gray-500 mb-2">Сумма к оплате:</p>
          <p className="text-3xl font-black">{amount.toLocaleString()} ₽</p>
        </div>

        <div className="mb-6">
          <p className="font-black mb-3">Способ оплаты:</p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`p-3 border-2 rounded-xl text-center transition ${
                paymentMethod === 'card' ? 'border-black bg-black text-white' : 'border-gray-200'
              }`}
            >
              <i className="fas fa-credit-card text-xl mb-1"></i>
              <p className="text-xs">Картой</p>
            </button>
            <button
              onClick={() => setPaymentMethod('sbp')}
              className={`p-3 border-2 rounded-xl text-center transition ${
                paymentMethod === 'sbp' ? 'border-black bg-black text-white' : 'border-gray-200'
              }`}
            >
              <i className="fas fa-qrcode text-xl mb-1"></i>
              <p className="text-xs">СБП</p>
            </button>
            <button
              onClick={() => setPaymentMethod('crypto')}
              className={`p-3 border-2 rounded-xl text-center transition ${
                paymentMethod === 'crypto' ? 'border-black bg-black text-white' : 'border-gray-200'
              }`}
            >
              <i className="fab fa-bitcoin text-xl mb-1"></i>
              <p className="text-xs">Криптовалюта</p>
            </button>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="mb-6 space-y-3">
            <input
              type="text"
              placeholder="Номер карты"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
            />
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="MM/YY"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
              />
              <input
                type="text"
                placeholder="CVC"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
              />
            </div>
          </div>
        )}

        {paymentMethod === 'sbp' && (
          <div className="mb-6 text-center p-6 bg-gray-50 rounded-xl">
            <i className="fas fa-qrcode text-6xl text-gray-600 mb-3"></i>
            <p className="text-sm text-gray-500">Отсканируйте QR-код в приложении банка</p>
          </div>
        )}

        {paymentMethod === 'crypto' && (
          <div className="mb-6 text-center p-6 bg-gray-50 rounded-xl">
            <i className="fab fa-bitcoin text-6xl text-orange-500 mb-3"></i>
            <p className="text-sm text-gray-500">BTC: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</p>
          </div>
        )}

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-black text-white py-3 rounded-xl font-black tracking-wider hover:bg-gray-800 transition disabled:opacity-50"
        >
          {isProcessing ? 'ОБРАБОТКА...' : `ОПЛАТИТЬ ${amount.toLocaleString()} ₽`}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Данные защищены. Платёж безопасен.
        </p>
      </div>
    </>
  );
};

export default PaymentModal;