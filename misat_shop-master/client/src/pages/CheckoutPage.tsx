import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearCartAsync } from '../store/slices/cartSlice';
import { createOrder, getCurrentUser, subtractFromBalance } from '../services/storageService';
import toast from 'react-hot-toast';

// ============================================
// ТИПЫ
// ============================================
interface PvzPoint {
  address: string;
  lat: number;
  lng: number;
  code?: string;
  workTime?: string;
  phone?: string;
  nearest?: boolean;
  distance?: number;
  note?: string;
  city?: string;
}

interface FormData {
  lastName: string;
  firstName: string;
  middleName: string;
  phone: string;
  email: string;
  city: string;
  deliveryPoint: string;
  deliveryAddress: string;
  comment: string;
}

// ============================================
// ОСНОВНОЙ КОМПОНЕНТ
// ============================================
const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);
  const { user } = useAppSelector((s) => s.auth);

  // ===== БАЗОВЫЕ СОСТОЯНИЯ =====
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [useBalance, setUseBalance] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  // ===== ПВЗ СОСТОЯНИЯ =====
  const [pvzList, setPvzList] = useState<PvzPoint[]>([]);
  const [isLoadingPvz, setIsLoadingPvz] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const ymapsRef = useRef<any>(null);

  // ===== ФОРМА =====
  const [formData, setFormData] = useState<FormData>({
    lastName: '',
    firstName: '',
    middleName: '',
    phone: '',
    email: user?.email || '',
    city: '',
    deliveryPoint: '',
    deliveryAddress: '',
    comment: ''
  });

  // ============================================
  // 1. ИНИЦИАЛИЗАЦИЯ
  // ============================================
  useEffect(() => {
    if (user) {
      setUserBalance(user.balance || 0);
      setFormData((p) => ({ ...p, email: user.email || '' }));
    }
    if (!cartItems.length) navigate('/cart');
  }, [cartItems, user, navigate]);

  // ============================================
  // 2. ЗАГРУЗКА ПВЗ С БЭКЕНДА
  // ============================================
  const fetchPvz = useCallback(async (city: string) => {
    if (!city || city.length < 2) {
      setPvzList([]);
      return;
    }

    try {
      setIsLoadingPvz(true);
      const response = await fetch(`/api/cdek/pvz?city=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (data?.pvz?.length) {
        setPvzList(data.pvz);
        setFormData(prev => ({
          ...prev,
          deliveryPoint: data.pvz[0].address
        }));
      } else {
        setPvzList([]);
        toast.error('Пунктов выдачи в этом городе не найдено');
      }
    } catch (error) {
      console.error('Ошибка загрузки ПВЗ:', error);
      toast.error('Не удалось загрузить пункты выдачи');
    } finally {
      setIsLoadingPvz(false);
    }
  }, []);

  // ============================================
  // 3. DEBOUNCE ДЛЯ ПОИСКА ГОРОДА
  // ============================================
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPvz(formData.city);
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.city, fetchPvz]);

  // ============================================
  // 4. ОБНОВЛЕНИЕ МЕТОК НА КАРТЕ
  // ============================================
  const updateMapMarkers = useCallback((map: any, points: PvzPoint[]) => {
    if (!ymapsRef.current) return;

    const ymaps = ymapsRef.current;
    map.geoObjects.removeAll();

    points.forEach((pvz) => {
      const placemark = new ymaps.Placemark(
        [pvz.lat, pvz.lng],
        {
          balloonContent: `
            <div style="padding: 8px; max-width: 260px; font-family: 'Inter', sans-serif;">
              <strong style="font-size: 14px; display: block; margin-bottom: 6px;">📍 ${pvz.address}</strong>
              ${pvz.workTime ? `<span style="font-size: 12px; color: #666;">🕐 ${pvz.workTime}</span><br/>` : ''}
              ${pvz.phone ? `<span style="font-size: 12px; color: #666;">📞 ${pvz.phone}</span><br/>` : ''}
              ${pvz.nearest ? '<span style="color: #22c55e; font-size: 12px; font-weight: 600;">📍 Ближайший</span><br/>' : ''}
              <button
                onclick="window.selectPvz('${pvz.address.replace(/'/g, "\\'")}')"
                style="
                  background: #000;
                  color: #fff;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 8px;
                  cursor: pointer;
                  font-weight: 600;
                  font-size: 13px;
                  width: 100%;
                  margin-top: 8px;
                  transition: all 0.2s;
                "
                onmouseover="this.style.background='#222'"
                onmouseout="this.style.background='#000'"
              >
                ✅ Выбрать этот ПВЗ
              </button>
            </div>
          `,
        },
        {
          preset: pvz.nearest ? 'islands#greenDotIcon' : 'islands#blueDotIcon',
          iconColor: pvz.nearest ? '#22c55e' : '#3b82f6',
          draggable: false,
        }
      );

      placemark.events.add('click', () => {
        setFormData(prev => ({ ...prev, deliveryPoint: pvz.address }));
        toast.success('ПВЗ выбран!');
      });

      map.geoObjects.add(placemark);
    });

    if (points.length > 0) {
      map.setCenter([points[0].lat, points[0].lng], 12);
    }
  }, []);

  // ============================================
  // 5. ИНИЦИАЛИЗАЦИЯ КАРТЫ
  // ============================================
  const initMap = useCallback(() => {
    if (!mapContainerRef.current || !(window as any).ymaps) return;

    const ymaps = (window as any).ymaps;
    ymapsRef.current = ymaps;

    ymaps.ready(() => {
      const center = pvzList.length > 0
        ? [pvzList[0].lat, pvzList[0].lng]
        : [55.751244, 37.618423];

      const map = new ymaps.Map(mapContainerRef.current, {
        center: center,
        zoom: 11,
        controls: [],
      });

      setMapInstance(map);
      setMapReady(true);

      if (pvzList.length > 0) {
        updateMapMarkers(map, pvzList);
      }
    });
  }, [pvzList, updateMapMarkers]);

  // ============================================
  // 6. АВТО-ИНИЦИАЛИЗАЦИЯ КАРТЫ
  // ============================================
  useEffect(() => {
    if (pvzList.length === 0) return;

    const timer = setTimeout(() => {
      initMap();
    }, 300);

    return () => clearTimeout(timer);
  }, [pvzList, initMap]);

  // ============================================
  // 7. АВТО-ЦЕНТР КАРТЫ
  // ============================================
  useEffect(() => {
    if (!mapInstance || !pvzList.length || !mapReady) return;

    const selected = pvzList.find(p => p.address === formData.deliveryPoint);
    if (selected) {
      mapInstance.setCenter([selected.lat, selected.lng], 13);
    }
  }, [formData.deliveryPoint, pvzList, mapInstance, mapReady]);

  // ============================================
  // 8. ГЛОБАЛЬНАЯ ФУНКЦИЯ
  // ============================================
  useEffect(() => {
    (window as any).selectPvz = (address: string) => {
      setFormData(prev => ({ ...prev, deliveryPoint: address }));
      toast.success('ПВЗ выбран!');
    };

    return () => {
      delete (window as any).selectPvz;
    };
  }, []);

  // ============================================
  // 9. РАСЧЁТЫ
  // ============================================
  const totalPrice = cartItems.reduce(
    (s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 1),
    0
  );

  const calculateDelivery = (items: any[]) => {
    let hasInStock = false, hasPreorder = false, preorderDays = 30;
    items.forEach(i => {
      if (i.stockType === 'in_stock') hasInStock = true;
      if (i.stockType === 'preorder') {
        hasPreorder = true;
        preorderDays = i.preorderDays || 30;
      }
    });
    if (hasInStock && hasPreorder) return { price: 800, text: 'Смешанная доставка (РФ + Китай)', days: 'разные сроки' };
    if (hasPreorder) return { price: 500, text: 'Доставка из Китая', days: `~${preorderDays} дней` };
    return { price: 300, text: 'Доставка по РФ', days: '2-5 дней' };
  };

  const calculatePrepayment = (items: any[]) => {
    return items.reduce((sum, i) => {
      const total = (Number(i.price) || 0) * (Number(i.quantity) || 1);
      const percent = i.prepaymentPercent || (i.stockType === 'preorder' ? 100 : 70);
      return sum + (total * percent) / 100;
    }, 0);
  };

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

  const delivery = calculateDelivery(cartItems);
  const deliveryPrice = delivery.price;
  const finalPrice = totalPrice + deliveryPrice - discountAmount;
  const prepayment = calculatePrepayment(cartItems);
  const balanceToUse = useBalance ? Math.min(userBalance, finalPrice) : 0;
  const remaining = finalPrice - balanceToUse;
  const remainingPrepayment = Math.max(0, prepayment - balanceToUse);

  // ============================================
  // 10. СТИЛИ
  // ============================================
  const inputClass =
    "w-full h-12 lg:h-14 px-4 rounded-xl bg-black/30 border border-white/10 " +
    "text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 " +
    "focus:ring-2 focus:ring-white/5 transition text-base";

  // ============================================
  // 11. НАВИГАЦИЯ
  // ============================================
  const next = () => setStep((p) => Math.min(p + 1, 3));
  const back = () => setStep((p) => Math.max(p - 1, 1));

  const handleSubmit = () => {
    if (!formData.lastName || !formData.firstName || !formData.phone || !formData.city || !formData.deliveryPoint) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const currentUser = getCurrentUser();
      if (!currentUser) { setIsSubmitting(false); return; }

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
        cartItems.map(item => ({ ...item, userId: currentUser.id, price: Number(item.price) || 0 })),
        finalPrice,
        remainingPrepayment,
        Math.max(0, remaining - remainingPrepayment),
        fullAddress,
        formData.phone,
        `ФИО: ${fullName}\nEmail: ${formData.email}\nСкидка: ${discountAmount} ₽\nПромокод: ${appliedPromo?.code || 'Нет'}\nТип доставки: ${delivery.text}\nСписано с баланса: ${balanceToUse} ₽\n${formData.comment ? `Комментарий: ${formData.comment}` : ''}`
      );

      dispatch(clearCartAsync());
      toast.success(`Заказ успешно оформлен! ${balanceToUse > 0 ? `С баланса списано ${balanceToUse.toLocaleString()} ₽. ` : ''}${remainingPrepayment > 0 ? `Сумма предоплаты: ${remainingPrepayment.toLocaleString()} ₽` : 'Заказ полностью оплачен!'}`);
      navigate('/orders');
      setIsSubmitting(false);
    }, 800);
  };

  // ============================================
  // 12. RENDER
  // ============================================
  if (!cartItems.length) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-16 pb-10 relative overflow-x-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden px-4 relative z-10 pt-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-black">Оформление</h1>
            <span className="text-gray-400 text-xs">Шаг {step} из 3</span>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition ${step >= s ? 'bg-white' : 'bg-white/20'}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-3 animate-fadeIn">
            <h2 className="text-sm font-bold text-gray-300">Получатель</h2>
            <input className={inputClass} placeholder="Фамилия *" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
            <input className={inputClass} placeholder="Имя *" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
            <input className={inputClass} placeholder="Отчество" value={formData.middleName} onChange={e => setFormData({ ...formData, middleName: e.target.value })} />
            <input className={inputClass} placeholder="Телефон *" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            <input className={inputClass} placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />

            <div className="pt-4 flex gap-3">
              {step > 1 && (
                <button onClick={back} className="w-1/3 h-12 bg-white/10 text-white rounded-xl font-bold text-base active:scale-[0.98] transition">
                  Назад
                </button>
              )}
              <button onClick={next} className="flex-1 h-12 bg-white text-black rounded-xl font-bold text-base active:scale-[0.98] transition">
                Далее
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 animate-fadeIn">
            <h2 className="text-sm font-bold text-gray-300">Доставка</h2>

            <input
              className={inputClass}
              placeholder="Город *"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
            />

            <div className="relative">
              <input
                className={inputClass}
                placeholder="ПВЗ СДЭК *"
                value={formData.deliveryPoint}
                onChange={e => setFormData({ ...formData, deliveryPoint: e.target.value })}
              />

              {isLoadingPvz && (
                <p className="text-xs text-gray-400 mt-1">🔍 Поиск пунктов выдачи...</p>
              )}

              {pvzList.length > 0 && !isLoadingPvz && (
                <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-black/60 backdrop-blur">
                  {pvzList.map((pvz, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, deliveryPoint: pvz.address }));
                        setPvzList([]);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-white/10 text-sm text-white border-b border-white/5 last:border-0 flex items-start gap-2"
                    >
                      <span className="mt-0.5">📍</span>
                      <span className="flex-1">{pvz.address}</span>
                      {pvz.nearest && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full whitespace-nowrap">
                          Ближайший
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input className={inputClass} placeholder="Детали адреса" value={formData.deliveryAddress} onChange={e => setFormData({ ...formData, deliveryAddress: e.target.value })} />
            <input className={inputClass} placeholder="Комментарий" value={formData.comment} onChange={e => setFormData({ ...formData, comment: e.target.value })} />

            {pvzList.length > 0 && (
              <div className="mt-4">
                <div
                  ref={mapContainerRef}
                  className="w-full h-[250px] rounded-xl overflow-hidden bg-[#111] border border-white/10"
                />

                <div className="mt-3 max-h-28 overflow-y-auto space-y-1.5">
                  {pvzList.map((pvz, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setFormData(prev => ({ ...prev, deliveryPoint: pvz.address }));
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-start gap-2 ${
                        formData.deliveryPoint === pvz.address
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <span className="mt-0.5">📍</span>
                      <span className="flex-1 text-white/90">{pvz.address}</span>
                      {pvz.nearest && (
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full whitespace-nowrap">
                          Ближайший
                        </span>
                      )}
                      {formData.deliveryPoint === pvz.address && (
                        <span className="text-blue-400 text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex gap-3">
              <button onClick={back} className="w-1/3 h-12 bg-white/10 text-white rounded-xl font-bold text-base active:scale-[0.98] transition">
                Назад
              </button>
              <button onClick={next} className="flex-1 h-12 bg-white text-black rounded-xl font-bold text-base active:scale-[0.98] transition">
                Далее
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-sm font-bold text-gray-300">Подтверждение</h2>

            <div className="bg-white/5 rounded-xl p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="Промокод"
                  className="flex-1 h-10 px-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30 text-sm uppercase focus:outline-none focus:border-white/40"
                />
                <button
                  type="button"
                  onClick={applyPromoCode}
                  className="px-4 h-10 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition"
                >
                  Применить
                </button>
              </div>
              {appliedPromo && <p className="text-xs text-emerald-400 mt-1">Промокод {appliedPromo.code} применён!</p>}
            </div>

            {userBalance > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
                <label className="flex justify-between items-center cursor-pointer">
                  <div>
                    <span className="text-sm text-white font-medium">Использовать баланс</span>
                    <p className="text-xs text-gray-400">{userBalance.toLocaleString()} ₽ доступно</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={useBalance}
                    onChange={e => setUseBalance(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 rounded"
                  />
                </label>
              </div>
            )}

            <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Товары</span>
                <span className="text-white">{totalPrice.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Доставка</span>
                <span className="text-white">{deliveryPrice} ₽</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Скидка</span>
                  <span>-{discountAmount.toLocaleString()} ₽</span>
                </div>
              )}
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white text-lg">
                <span>Итого</span>
                <span>{finalPrice.toLocaleString()} ₽</span>
              </div>
              {useBalance && balanceToUse > 0 && (
                <div className="flex justify-between text-emerald-400 text-xs">
                  <span>Списано с баланса</span>
                  <span>-{balanceToUse.toLocaleString()} ₽</span>
                </div>
              )}
              <div className="flex justify-between text-orange-400 font-bold text-sm">
                <span>Предоплата</span>
                <span>{remainingPrepayment.toLocaleString()} ₽</span>
              </div>
            </div>

            <div className="bg-orange-500/10 rounded-xl p-3 text-xs text-orange-300 text-center">
              ⚠️ При отказе от заказа предоплата не возвращается
            </div>

            <div className="pt-4 flex gap-3">
              <button onClick={back} className="w-1/3 h-12 bg-white/10 text-white rounded-xl font-bold text-base active:scale-[0.98] transition">
                Назад
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 h-12 bg-white text-black rounded-xl font-bold text-base active:scale-[0.98] transition disabled:opacity-50"
              >
                {isSubmitting ? 'Оформление...' : `Оплатить ${remainingPrepayment.toLocaleString()} ₽`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:block relative max-w-6xl mx-auto px-8 py-6 z-10">
        <div className="mb-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-2xl p-5">
          <h1 className="text-4xl font-black">Оформление заказа</h1>
          <p className="text-gray-400 text-sm mt-1">Проверьте данные перед оплатой</p>
        </div>

        <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <i className="fas fa-user text-white/30" />
                Получатель
              </h2>
              <div className="grid grid-cols-3 gap-3">
                <input className={inputClass} placeholder="Фамилия *" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                <input className={inputClass} placeholder="Имя *" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                <input className={inputClass} placeholder="Отчество" value={formData.middleName} onChange={e => setFormData({ ...formData, middleName: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className={inputClass} placeholder="Телефон *" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                <input className={inputClass} placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <i className="fas fa-truck text-white/30" />
                Доставка
              </h2>

              <input
                className={inputClass}
                placeholder="Город *"
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
              />

              <div className="relative">
                <input
                  className={inputClass}
                  placeholder="ПВЗ СДЭК *"
                  value={formData.deliveryPoint}
                  onChange={e => setFormData({ ...formData, deliveryPoint: e.target.value })}
                />

                {isLoadingPvz && (
                  <p className="text-xs text-gray-400 mt-1">🔍 Поиск пунктов выдачи...</p>
                )}

                {pvzList.length > 0 && !isLoadingPvz && (
                  <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-xl border border-white/10 bg-black/90 backdrop-blur z-10 shadow-2xl">
                    {pvzList.map((pvz, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, deliveryPoint: pvz.address }));
                          setPvzList([]);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 text-sm text-white border-b border-white/5 last:border-0 flex items-start gap-3 transition"
                      >
                        <span className="mt-0.5">📍</span>
                        <span className="flex-1">{pvz.address}</span>
                        {pvz.nearest && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full whitespace-nowrap">
                            Ближайший
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <input className={inputClass} placeholder="Детали адреса" value={formData.deliveryAddress} onChange={e => setFormData({ ...formData, deliveryAddress: e.target.value })} />
              <input className={inputClass} placeholder="Комментарий" value={formData.comment} onChange={e => setFormData({ ...formData, comment: e.target.value })} />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <i className="fas fa-credit-card text-white/30" />
                Оплата
              </h2>

              {userBalance > 0 && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                  <label className="flex justify-between items-center cursor-pointer">
                    <div>
                      <span className="text-sm text-white font-medium">Использовать баланс</span>
                      <p className="text-xs text-gray-400">{userBalance.toLocaleString()} ₽ доступно</p>
                    </div>
                    <input type="checkbox" checked={useBalance} onChange={e => setUseBalance(e.target.checked)} className="w-5 h-5 accent-emerald-500 rounded" />
                  </label>
                </div>
              )}

              <div className="space-y-3">
                <div className="border border-white/10 rounded-xl p-3 bg-white/5 hover:bg-white/10 transition">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="paymentMethod" value="card" defaultChecked className="w-4 h-4 accent-white rounded-full" />
                    <div>
                      <p className="font-bold text-white text-sm">Банковская карта</p>
                      <p className="text-xs text-gray-500">Visa, Mastercard, МИР</p>
                    </div>
                  </label>
                </div>
                <div className="border border-white/10 rounded-xl p-3 bg-white/5 hover:bg-white/10 transition">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="paymentMethod" value="sbp" className="w-4 h-4 accent-white rounded-full" />
                    <div>
                      <p className="font-bold text-white text-sm">СБП</p>
                      <p className="text-xs text-gray-500">Оплата по QR-коду</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/30">
                <div className="flex items-center gap-2">
                  <i className="fas fa-info-circle text-orange-400 text-xs" />
                  <span className="font-bold text-orange-400 text-xs">Правила предоплаты:</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">• При отказе от заказа предоплата не возвращается</p>
              </div>

              <div className="bg-white/5 rounded-xl p-3">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400">Предоплата:</span>
                  <span className="font-bold text-orange-400">{remainingPrepayment.toLocaleString()} ₽</span>
                </div>
                {remaining - remainingPrepayment > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">К оплате при получении:</span>
                    <span className="text-white">{(remaining - remainingPrepayment).toLocaleString()} ₽</span>
                  </div>
                )}
              </div>
            </div>

            <button onClick={handleSubmit} disabled={isSubmitting} className="w-full h-14 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition active:scale-[0.98] disabled:opacity-50">
              {isSubmitting ? 'ОФОРМЛЕНИЕ...' : `Оплатить ${remainingPrepayment.toLocaleString()} ₽`}
            </button>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 sticky top-24">
              <h3 className="font-bold text-lg">Ваш заказ</h3>

              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm border-b border-white/5 pb-2">
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-gray-500 text-xs">{item.quantity} × {Number(item.price).toLocaleString()} ₽</p>
                    </div>
                    <p className="text-white font-bold">{(Number(item.price) * Number(item.quantity)).toLocaleString()} ₽</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Товары</span>
                  <span className="text-white">{totalPrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Доставка</span>
                  <span className="text-white">{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice.toLocaleString()} ₽`}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Скидка</span>
                    <span>-{discountAmount.toLocaleString()} ₽</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-white text-lg">
                  <span>Итого</span>
                  <span>{finalPrice.toLocaleString()} ₽</span>
                </div>
                {useBalance && balanceToUse > 0 && (
                  <div className="flex justify-between text-sm text-emerald-400">
                    <span>Оплачено с баланса</span>
                    <span>-{balanceToUse.toLocaleString()} ₽</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-orange-400 font-bold">
                  <span>Предоплата</span>
                  <span>{remainingPrepayment.toLocaleString()} ₽</span>
                </div>
                {remaining - remainingPrepayment > 0 && (
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>К оплате при получении</span>
                    <span className="text-white">{(remaining - remainingPrepayment).toLocaleString()} ₽</span>
                  </div>
                )}
              </div>

              <p className="text-[10px] text-orange-400/70 text-center">⚠️ При отказе от заказа предоплата не возвращается</p>

              <div className="pt-3 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Промокод"
                    className="flex-1 h-10 px-3 rounded-xl bg-black/30 border border-white/10 text-white placeholder:text-white/30 text-sm uppercase focus:outline-none focus:border-white/40"
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    className="px-4 h-10 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/20 transition"
                  >
                    Применить
                  </button>
                </div>
                {appliedPromo && <p className="text-xs text-emerald-400 mt-1">Промокод {appliedPromo.code} применён!</p>}
              </div>

              <div className="text-xs text-gray-400 space-y-2 pt-3 border-t border-white/10">
                <p>📦 В наличии (РФ): 2–5 дней / 300 ₽ / от 5000 ₽ бесплатно</p>
                <p>📦 Предзаказ (Китай): 20–35 дней / 500 ₽ / трекинг</p>
                <p>💳 Карта / СБП / Наличные</p>
                <p className="text-orange-400">⚠ Предоплата не возвращается</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
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
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;