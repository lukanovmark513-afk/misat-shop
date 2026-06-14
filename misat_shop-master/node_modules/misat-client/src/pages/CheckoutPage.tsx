import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearCartAsync } from '../store/slices/cartSlice';
import { createOrder, getCurrentUser, subtractFromBalance, getUserBalance } from '../services/storageService';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { user } = useAppSelector((state) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [useBalance, setUseBalance] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  const [formData, setFormData] = useState({
    lastName: '', firstName: '', middleName: '', phone: '', email: user?.email || '',
    city: '', deliveryAddress: '', deliveryPoint: '', comment: ''
  });

  useEffect(() => {
    if (user) {
      setUserBalance(user.balance || 0);
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  // Безопасное вычисление общей суммы
  const totalPrice = cartItems.reduce((sum: number, item: any) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 1;
    return sum + (price * quantity);
  }, 0);

  const calculateDelivery = (items: any[]) => {
    let hasInStock = false, hasPreorder = false, preorderDays = 0;
    items.forEach(item => {
      if (item.stockType === 'in_stock') hasInStock = true;
      if (item.stockType === 'preorder') { hasPreorder = true; preorderDays = item.preorderDays || 30; }
    });
    if (hasInStock && hasPreorder) return { price: 800, text: 'Смешанная доставка (РФ + Китай)', days: 'разные сроки' };
    if (hasPreorder) return { price: 500, text: 'Доставка из Китая', days: `~${preorderDays} дней` };
    return { price: 300, text: 'Доставка по РФ', days: '2-5 дней' };
  };

  const calculatePrepayment = (items: any[]) => {
    let prepaymentTotal = 0;
    items.forEach(item => {
      const itemTotal = (Number(item.price) || 0) * (Number(item.quantity) || 1);
      const percent = item.prepaymentPercent || (item.stockType === 'preorder' ? 100 : 70);
      prepaymentTotal += (itemTotal * percent) / 100;
    });
    return prepaymentTotal;
  };

  const delivery = calculateDelivery(cartItems);
  const deliveryPrice = delivery.price;
  const finalPrice = totalPrice + deliveryPrice - discountAmount;
  const prepaymentAmountTotal = calculatePrepayment(cartItems);

  const balanceToUse = useBalance ? Math.min(userBalance, finalPrice) : 0;
  const remainingToPay = finalPrice - balanceToUse;
  const remainingPrepayment = Math.max(0, prepaymentAmountTotal - balanceToUse);

  const applyPromoCode = () => {
    if (!promoCode.trim()) { toast.error('Введите промокод'); return; }
    const promocodes = JSON.parse(localStorage.getItem('misat_promocodes') || '[]');
    const promo = promocodes.find((p: any) => p.code === promoCode.toUpperCase() && p.isActive);
    if (!promo) { toast.error('Промокод не найден'); return; }
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) { toast.error('Срок действия промокода истёк'); return; }
    if (totalPrice < promo.minAmount) { toast.error(`Минимальная сумма заказа: ${promo.minAmount.toLocaleString()} ₽`); return; }
    if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) { toast.error('Лимит использований промокода исчерпан'); return; }
    let discount = promo.type === 'percentage' ? (totalPrice * promo.discount) / 100 : promo.discount;
    if (promo.maxDiscount && discount > promo.maxDiscount) discount = promo.maxDiscount;
    setAppliedPromo(promo);
    setDiscountAmount(discount);
    toast.success(`Промокод применён! Скидка: ${discount.toLocaleString()} ₽`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.lastName) { toast.error('Введите фамилию'); return; }
    if (!formData.firstName) { toast.error('Введите имя'); return; }
    if (!formData.phone) { toast.error('Введите телефон'); return; }
    if (!formData.city) { toast.error('Введите город'); return; }
    if (!formData.deliveryPoint) { toast.error('Введите адрес ПВЗ СДЭК'); return; }

    setIsSubmitting(true);
    setTimeout(() => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        if (appliedPromo) {
          const promocodes = JSON.parse(localStorage.getItem('misat_promocodes') || '[]');
          const updated = promocodes.map((p: any) => p.id === appliedPromo.id ? { ...p, usedCount: p.usedCount + 1 } : p);
          localStorage.setItem('misat_promocodes', JSON.stringify(updated));
        }

        if (balanceToUse > 0) {
          subtractFromBalance(currentUser.id, balanceToUse);
        }

        const fullAddress = `Город: ${formData.city}, ПВЗ СДЭК: ${formData.deliveryPoint}, Адрес: ${formData.deliveryAddress || 'Не указан'}`;
        const fullName = `${formData.lastName} ${formData.firstName} ${formData.middleName}`.trim();

        createOrder(
          currentUser.id,
          cartItems.map(item => ({
            ...item,
            userId: currentUser.id,
            price: Number(item.price) || 0
          })),
          finalPrice,
          remainingPrepayment,
          Math.max(0, remainingToPay - remainingPrepayment),
          fullAddress,
          formData.phone,
          `ФИО: ${fullName}\nEmail: ${formData.email}\nСкидка: ${discountAmount} ₽\nПромокод: ${appliedPromo?.code || 'Нет'}\nТип доставки: ${delivery.text}\nСписано с баланса: ${balanceToUse} ₽\n${formData.comment ? `Комментарий: ${formData.comment}` : ''}`
        );
        dispatch(clearCartAsync());
        toast.success(`Заказ успешно оформлен! ${balanceToUse > 0 ? `С баланса списано ${balanceToUse.toLocaleString()} ₽. ` : ''}${remainingPrepayment > 0 ? `Сумма предоплаты: ${remainingPrepayment.toLocaleString()} ₽` : 'Заказ полностью оплачен!'}`);
        navigate('/orders');
      }
      setIsSubmitting(false);
    }, 1000);
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  // Отладочная информация
  console.log('📦 Cart Items:', cartItems);
  console.log('💰 Total Price:', totalPrice);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-8">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="Checkout"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-8 px-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-0.5 bg-white/40"></div>
              <span className="text-gray-400 text-[10px] tracking-[0.3em]">ОФОРМЛЕНИЕ</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
              ОФОРМЛЕНИЕ ЗАКАЗА
            </h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Левая колонка - Форма */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">

            {/* Кто получает */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                <i className="fas fa-user text-white/40 text-sm"></i> КТО ПОЛУЧАЕТ
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">ФАМИЛИЯ *</label>
                  <input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition" required />
                </div>
                <div>
                  <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">ИМЯ *</label>
                  <input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition" required />
                </div>
                <div>
                  <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">ОТЧЕСТВО</label>
                  <input type="text" value={formData.middleName} onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">ТЕЛЕФОН *</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+7 (___) ___-__-__" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition" required />
                </div>
                <div>
                  <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">EMAIL</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition" />
                </div>
              </div>
            </div>

            {/* Где получить */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-white/40 text-sm"></i> ГДЕ ПОЛУЧИТЬ
              </h2>
              <div className="mb-4">
                <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">ГОРОД *</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Например: Москва" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition" required />
              </div>
              <div className="mb-4">
                <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">АДРЕС ПВЗ СДЭК *</label>
                <input type="text" value={formData.deliveryPoint} onChange={(e) => setFormData({ ...formData, deliveryPoint: e.target.value })} placeholder="г. Москва, ул. Тверская, д. 25, ПВЗ №123" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition" required />
                <p className="text-gray-500 text-[9px] mt-1">Можно найти на сайте cdek.ru</p>
              </div>
              <div>
                <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">ДЕТАЛИ АДРЕСА</label>
                <input type="text" value={formData.deliveryAddress} onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })} placeholder="Квартира/офис/домофон" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition" />
              </div>
            </div>

            {/* Комментарий */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                <i className="fas fa-comment text-white/40 text-sm"></i> КОММЕНТАРИЙ
              </h2>
              <textarea value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} rows={3} placeholder="Дополнительная информация к заказу..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition resize-none" />
            </div>

            {/* Оплата */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-white font-black text-xl mb-4 flex items-center gap-2">
                <i className="fas fa-credit-card text-white/40 text-sm"></i> ОПЛАТА
              </h2>

              {userBalance > 0 && (
                <div className="mb-4 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="font-bold text-emerald-400 text-sm">Использовать баланс</p>
                      <p className="text-xs text-gray-400">Доступно: {userBalance.toLocaleString()} ₽</p>
                    </div>
                    <input type="checkbox" checked={useBalance} onChange={(e) => setUseBalance(e.target.checked)} className="w-5 h-5 accent-emerald-500" />
                  </label>
                  {useBalance && userBalance >= finalPrice && (
                    <p className="text-xs text-emerald-400 mt-2">✓ Заказ будет полностью оплачен с баланса</p>
                  )}
                </div>
              )}

              {useBalance && userBalance < finalPrice && (
                <div className="mb-4 p-3 bg-orange-500/10 rounded-xl border border-orange-500/30">
                  <p className="text-sm text-orange-400">К оплате после списания баланса: <strong>{remainingToPay.toLocaleString()} ₽</strong></p>
                </div>
              )}

              <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/30 mb-4">
                <div className="flex items-center gap-2">
                  <i className="fas fa-info-circle text-orange-400 text-xs"></i>
                  <span className="font-bold text-orange-400 text-xs">Правила предоплаты:</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">• При отказе от заказа предоплата не возвращается</p>
              </div>

              <div className="space-y-3">
                <div className="border border-white/10 rounded-xl p-3 bg-white/5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="paymentMethod" value="card" defaultChecked className="w-4 h-4 accent-white" />
                    <div>
                      <p className="font-bold text-white text-sm">Банковская карта</p>
                      <p className="text-xs text-gray-500">Visa, Mastercard, МИР</p>
                    </div>
                  </label>
                </div>
                <div className="border border-white/10 rounded-xl p-3 bg-white/5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="paymentMethod" value="sbp" className="w-4 h-4 accent-white" />
                    <div>
                      <p className="font-bold text-white text-sm">СБП (Система быстрых платежей)</p>
                      <p className="text-xs text-gray-500">Оплата по QR-коду</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white/5 rounded-xl">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Сумма предоплаты:</span>
                  <span className="font-bold text-orange-400">{remainingPrepayment.toLocaleString()} ₽</span>
                </div>
                {remainingToPay - remainingPrepayment > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">К оплате при получении:</span>
                    <span className="text-white">{(remainingToPay - remainingPrepayment).toLocaleString()} ₽</span>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-white text-black py-4 rounded-xl font-black tracking-wider hover:bg-white/90 transition disabled:opacity-50">
              {isSubmitting ? 'ОФОРМЛЕНИЕ...' : `ОПЛАТИТЬ ${remainingPrepayment.toLocaleString()} ₽`}
            </button>
          </form>

          {/* Правая колонка - Корзина */}
          <div className="lg:w-96">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 sticky top-24">
              <h3 className="text-white font-black text-xl mb-4">ВАШ ЗАКАЗ</h3>

              <div className="space-y-2 max-h-64 overflow-y-auto mb-4 pr-1 custom-scrollbar">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-white/10 pb-2">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-white font-medium text-sm">{item.name}</span>
                        <span className="text-white font-bold text-sm">
                          {((Number(item.price) || 0) * (Number(item.quantity) || 1)).toLocaleString()} ₽
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Размер: {item.size || 'M'} | Количество: {item.quantity || 1}
                      </div>
                      <div className="text-[10px] text-gray-600 mt-0.5">
                        {item.stockType === 'in_stock' ? '✅ В наличии (РФ)' : `📦 Предзаказ ~${item.preorderDays || 30} дней`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">ПРОМОКОД</label>
                <div className="flex gap-2">
                  <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="Введите код" className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm uppercase" />
                  <button type="button" onClick={applyPromoCode} className="bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/20 transition">ПРИМЕНИТЬ</button>
                </div>
                {appliedPromo && <p className="text-xs text-emerald-400 mt-1">Промокод {appliedPromo.code} применён!</p>}
              </div>

              <div className="border-t border-white/10 pt-3 space-y-2">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Товары</span>
                  <span className="text-white">{totalPrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Доставка</span>
                  <span className="text-white">{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice.toLocaleString()} ₽`}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Тип доставки</span>
                  <span className="text-white text-xs">{delivery.text}</span>
                </div>
                {delivery.days && delivery.days !== 'разные сроки' && (
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Срок доставки</span>
                    <span className="text-white text-xs">{delivery.days}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Скидка</span>
                    <span className="text-emerald-400">-{discountAmount.toLocaleString()} ₽</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-white text-lg pt-2 border-t border-white/10">
                  <span>Итого:</span>
                  <span>{finalPrice.toLocaleString()} ₽</span>
                </div>
                {useBalance && balanceToUse > 0 && (
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Оплачено с баланса:</span>
                    <span className="text-emerald-400">-{balanceToUse.toLocaleString()} ₽</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Предоплата:</span>
                  <span className="font-bold text-orange-400">{remainingPrepayment.toLocaleString()} ₽</span>
                </div>
                {remainingToPay - remainingPrepayment > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">К оплате при получении:</span>
                    <span className="text-white">{(remainingToPay - remainingPrepayment).toLocaleString()} ₽</span>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-orange-400/70 text-center mt-4">⚠️ При отказе от заказа предоплата не возвращается</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;