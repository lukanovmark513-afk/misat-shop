// client/src/pages/CheckoutPage.tsx
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
    }
  }, [user]);

  const totalPrice = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

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
      const itemTotal = item.price * item.quantity;
      const percent = item.prepaymentPercent || (item.stockType === 'preorder' ? 100 : 70);
      prepaymentTotal += (itemTotal * percent) / 100;
    });
    return prepaymentTotal;
  };

  const delivery = calculateDelivery(cartItems);
  const deliveryPrice = delivery.price;
  const finalPrice = totalPrice + deliveryPrice - discountAmount;
  const prepaymentAmountTotal = calculatePrepayment(cartItems);

  // С учётом баланса
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

        // Списание с баланса
        if (balanceToUse > 0) {
          subtractFromBalance(currentUser.id, balanceToUse);
        }

        const fullAddress = `Город: ${formData.city}, ПВЗ СДЭК: ${formData.deliveryPoint}, Адрес: ${formData.deliveryAddress || 'Не указан'}`;
        const fullName = `${formData.lastName} ${formData.firstName} ${formData.middleName}`.trim();

        createOrder(
          currentUser.id, cartItems.map(item => ({ ...item, userId: currentUser.id })), finalPrice, remainingPrepayment, Math.max(0, remainingToPay - remainingPrepayment),
          fullAddress, formData.phone,
          `ФИО: ${fullName}\nEmail: ${formData.email}\nСкидка: ${discountAmount} ₽\nПромокод: ${appliedPromo?.code || 'Нет'}\nТип доставки: ${delivery.text}\nСписано с баланса: ${balanceToUse} ₽\n${formData.comment ? `Комментарий: ${formData.comment}` : ''}`
        );
        dispatch(clearCartAsync());
        toast.success(`Заказ успешно оформлен! ${balanceToUse > 0 ? `С баланса списано ${balanceToUse.toLocaleString()} ₽. ` : ''}${remainingPrepayment > 0 ? `Сумма предоплаты: ${remainingPrepayment.toLocaleString()} ₽` : 'Заказ полностью оплачен!'}`);
        navigate('/orders');
      }
      setIsSubmitting(false);
    }, 1000);
  };

  if (cartItems.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-8">ОФОРМЛЕНИЕ ЗАКАЗА</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <form onSubmit={handleSubmit} className="flex-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm"><h2 className="text-xl font-black mb-4"><i className="fas fa-user mr-2"></i> КТО ПОЛУЧАЕТ</h2>
              <div className="grid md:grid-cols-3 gap-4"><div><label className="block text-sm font-bold mb-1">Фамилия *</label><input type="text" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black" required /></div>
              <div><label className="block text-sm font-bold mb-1">Имя *</label><input type="text" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black" required /></div>
              <div><label className="block text-sm font-bold mb-1">Отчество</label><input type="text" value={formData.middleName} onChange={(e) => setFormData({ ...formData, middleName: e.target.value })} className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black" /></div></div>
              <div className="grid md:grid-cols-2 gap-4 mt-4"><div><label className="block text-sm font-bold mb-1">Телефон *</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+7 (___) ___-__-__" className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black" required /></div>
              <div><label className="block text-sm font-bold mb-1">Email</label><input type="email" value={formData.email} readOnly className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl bg-gray-50" /></div></div></div>
            <div className="bg-white rounded-2xl p-6 shadow-sm"><h2 className="text-xl font-black mb-4"><i className="fas fa-map-marker-alt mr-2"></i> ГДЕ ПОЛУЧИТЬ</h2>
              <div className="mb-4"><label className="block text-sm font-bold mb-1">Город *</label><input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Например: Москва" className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black" required /></div>
              <div className="mb-4"><label className="block text-sm font-bold mb-1">Адрес ПВЗ СДЭК *<span className="text-xs text-gray-500 ml-2">(можно найти на сайте cdek.ru)</span></label><input type="text" value={formData.deliveryPoint} onChange={(e) => setFormData({ ...formData, deliveryPoint: e.target.value })} placeholder="г. Москва, ул. Тверская, д. 25, ПВЗ №123" className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black" required /></div>
              <div><label className="block text-sm font-bold mb-1">Детали адреса (дом, квартира, офис)</label><input type="text" value={formData.deliveryAddress} onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })} placeholder="Квартира/офис/домофон" className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black" /></div></div>
            <div className="bg-white rounded-2xl p-6 shadow-sm"><h2 className="text-xl font-black mb-4"><i className="fas fa-comment mr-2"></i> КОММЕНТАРИЙ</h2><textarea value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} rows={3} placeholder="Дополнительная информация к заказу..." className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-black resize-none" /></div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-black mb-4"><i className="fas fa-credit-card mr-2"></i> ОПЛАТА</h2>
              {userBalance > 0 && (
                <div className="mb-4 p-3 bg-green-50 rounded-xl border border-green-200">
                  <label className="flex items-center justify-between cursor-pointer"><div><p className="font-bold text-green-700">Использовать баланс</p><p className="text-sm text-gray-600">Доступно: {userBalance.toLocaleString()} ₽</p></div><input type="checkbox" checked={useBalance} onChange={(e) => setUseBalance(e.target.checked)} className="w-5 h-5 accent-green-600" /></label>
                  {useBalance && userBalance >= finalPrice && <p className="text-sm text-green-600 mt-2">✓ Заказ будет полностью оплачен с баланса</p>}
                </div>
              )}
              {useBalance && userBalance < finalPrice && <div className="mb-4 p-3 bg-orange-50 rounded-xl"><p className="text-sm">К оплате после списания баланса: <strong>{remainingToPay.toLocaleString()} ₽</strong></p></div>}
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-200 mb-4"><div className="flex items-center gap-2"><i className="fas fa-info-circle text-orange-600"></i><span className="font-bold text-sm">Правила предоплаты:</span></div><p className="text-xs text-gray-600 mt-1">• При отказе от заказа предоплата не возвращается</p></div>
              <div className="space-y-3"><div className="border rounded-xl p-3"><label className="flex items-center gap-3"><input type="radio" name="paymentMethod" value="card" defaultChecked className="w-4 h-4" /><div><p className="font-bold text-sm">Банковская карта</p><p className="text-xs text-gray-500">Visa, Mastercard, МИР</p></div></label></div>
              <div className="border rounded-xl p-3"><label className="flex items-center gap-3"><input type="radio" name="paymentMethod" value="sbp" className="w-4 h-4" /><div><p className="font-bold text-sm">СБП (Система быстрых платежей)</p><p className="text-xs text-gray-500">Оплата по QR-коду</p></div></label></div></div>
              <div className="mt-4 p-3 bg-gray-50 rounded-xl"><div className="flex justify-between mb-1"><span className="text-sm">Сумма предоплаты:</span><span className="font-bold text-orange-600">{remainingPrepayment.toLocaleString()} ₽</span></div>
              {remainingToPay - remainingPrepayment > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">К оплате при получении:</span><span>{(remainingToPay - remainingPrepayment).toLocaleString()} ₽</span></div>}</div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white py-4 rounded-xl font-black tracking-wider hover:bg-gray-800 transition disabled:opacity-50">{isSubmitting ? 'ОФОРМЛЕНИЕ...' : `ОПЛАТИТЬ ${remainingPrepayment.toLocaleString()} ₽`}</button>
          </form>
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-black mb-4">ВАШ ЗАКАЗ</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto mb-4">{cartItems.map((item: any) => (<div key={item.id} className="flex justify-between text-sm border-b pb-2"><div><span className="font-medium">{item.name}</span><span className="text-gray-500 ml-2">x{item.quantity}</span><div className="text-xs text-gray-400">Размер: {item.size}</div><div className="text-xs text-gray-400">{item.stockType === 'in_stock' ? '✅ В наличии (РФ)' : `📦 Предзаказ ~${item.preorderDays || 30} дней`}</div></div><span className="font-bold">{(item.price * item.quantity).toLocaleString()} ₽</span></div>))}</div>
              <div className="mb-4"><label className="block text-sm font-bold mb-1">ПРОМОКОД</label><div className="flex gap-2"><input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value.toUpperCase())} placeholder="Введите код" className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-xl text-sm uppercase" /><button type="button" onClick={applyPromoCode} className="bg-black text-white px-4 py-2 rounded-xl text-sm font-black">ПРИМЕНИТЬ</button></div>{appliedPromo && <p className="text-xs text-green-600 mt-1">Промокод {appliedPromo.code} применён!</p>}</div>
              <div className="border-t-2 border-black pt-3 space-y-2"><div className="flex justify-between"><span className="text-gray-500">Товары</span><span>{totalPrice.toLocaleString()} ₽</span></div><div className="flex justify-between"><span className="text-gray-500">Доставка</span><span>{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice.toLocaleString()} ₽`}</span></div><div className="flex justify-between"><span className="text-gray-500">Тип доставки</span><span className="text-sm">{delivery.text}</span></div>{delivery.days && delivery.days !== 'разные сроки' && <div className="flex justify-between"><span className="text-gray-500">Срок доставки</span><span className="text-sm">{delivery.days}</span></div>}{discountAmount > 0 && <div className="flex justify-between"><span className="text-gray-500">Скидка</span><span className="text-green-600">-{discountAmount.toLocaleString()} ₽</span></div>}<div className="flex justify-between font-black text-lg pt-2 border-t-2 border-black"><span>Итого:</span><span>{finalPrice.toLocaleString()} ₽</span></div>
              {useBalance && balanceToUse > 0 && <div className="flex justify-between"><span className="text-gray-500">Оплачено с баланса:</span><span className="text-green-600">-{balanceToUse.toLocaleString()} ₽</span></div>}
              <div className="flex justify-between"><span className="text-gray-500">Предоплата:</span><span className="font-bold text-orange-600">{remainingPrepayment.toLocaleString()} ₽</span></div>
              {remainingToPay - remainingPrepayment > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">К оплате при получении:</span><span>{(remainingToPay - remainingPrepayment).toLocaleString()} ₽</span></div>}</div>
              <p className="text-xs text-orange-600 text-center mt-4">⚠️ При отказе от заказа предоплата не возвращается</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;