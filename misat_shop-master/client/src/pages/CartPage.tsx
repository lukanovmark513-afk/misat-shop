import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ← исправлено: react-router-dom
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCartAsync, updateCartItemAsync, clearCartAsync, fetchCart } from '../store/slices/cartSlice';
import { AppDispatch } from '../store';
import toast from 'react-hot-toast';

// ============================================
// СТИЛИ
// ============================================
const glassCard =
  "bg-white/5 backdrop-blur-2xl border border-white/10 " +
  "rounded-2xl hover:border-white/20 transition-all duration-300";

const glassPanel =
  "bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl";

const btnPrimary =
  "w-full h-14 rounded-xl bg-white text-black font-bold " +
  "hover:bg-gray-200 transition active:scale-[0.98]";

// ============================================
// КОМПОНЕНТ
// ============================================
const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: any) => state.cart.items || []);
  const cartInitialized = useSelector((state: any) => state.cart.initialized || false);
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isLoading, setIsLoading] = useState(!cartInitialized);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);

  // ============================================
  // ИНИЦИАЛИЗАЦИЯ КОРЗИНЫ
  // ============================================
  useEffect(() => {
    let mounted = true;

    const loadCart = async () => {
      if (cartInitialized) {
        if (mounted) setIsLoading(false);
        return;
      }

      try {
        if (isAuthenticated) {
          await dispatch(fetchCart());
        }
      } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadCart();

    return () => {
      mounted = false;
    };
  }, [dispatch, isAuthenticated, cartInitialized]);

  // ============================================
  // РАСЧЁТЫ
  // ============================================
  const totalPrice = cartItems.reduce((sum: number, item: any) => {
    const price = item?.price || 0;
    const quantity = item?.quantity || 0;
    return sum + (price * quantity);
  }, 0);

  const calculateDelivery = (items: any[]) => {
    if (!items || items.length === 0) {
      return { price: 0, text: 'Нет товаров', days: '—' };
    }

    let hasInStock = false;
    let hasPreorder = false;
    let preorderDays = 0;

    items.forEach(item => {
      if (item.stockType === 'in_stock') hasInStock = true;
      if (item.stockType === 'preorder') {
        hasPreorder = true;
        preorderDays = item.preorderDays || 30;
      }
    });

    if (hasInStock && hasPreorder) {
      return {
        price: 800,
        text: 'Смешанная доставка (РФ + Китай)',
        days: 'разные сроки'
      };
    } else if (hasPreorder) {
      return {
        price: 500,
        text: 'Доставка из Китая',
        days: `~${preorderDays} дней`
      };
    } else {
      return {
        price: 300,
        text: 'Доставка по РФ',
        days: '2-5 дней'
      };
    }
  };

  const calculatePrepayment = (items: any[]) => {
    if (!items || items.length === 0) return 0;

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
  const finalPrice = totalPrice + deliveryPrice;
  const prepaymentAmount = calculatePrepayment(cartItems);
  const remainingAmount = finalPrice - prepaymentAmount;

  // ============================================
  // ОБРАБОТЧИКИ
  // ============================================
  const handleUpdateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    setUpdatingItem(id);
    try {
      await dispatch(updateCartItemAsync({ itemId: id, quantity }));
    } catch (error) {
      console.error('Ошибка обновления количества:', error);
      toast.error('Не удалось обновить количество');
    }
    setUpdatingItem(null);
  };

  const handleRemove = async (id: number, name: string) => {
    try {
      await dispatch(removeFromCartAsync(id));
      toast.success(`${name} удалён из корзины`);
    } catch (error) {
      console.error('Ошибка удаления:', error);
      toast.error('Не удалось удалить товар');
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCartAsync());
      setShowClearModal(false);
      toast.success('Корзина очищена');
    } catch (error) {
      console.error('Ошибка очистки корзины:', error);
      toast.error('Не удалось очистить корзину');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Войдите в аккаунт, чтобы оформить заказ');
      navigate('/profile');
      return;
    }
    navigate('/checkout');
  };

  // ============================================
  // LOADING
  // ============================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-20 flex items-center justify-center">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // ============================================
  // EMPTY CART - премиальный дизайн
  // ============================================
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white pt-12 md:pt-20 pb-28 relative overflow-hidden">
        {/* Background FX */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#050505]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="relative z-10 w-full px-4 md:px-8 lg:px-16 py-4 md:py-8">
          {/* Хлебные крошки */}
          <div className="text-xs text-gray-500 mt-6 md:mt-0 mb-4 md:mb-6">
            <Link
              to="/"
              className="hover:text-white transition text-gray-400 md:text-gray-500 inline-block"
            >
              Главная
            </Link>
            <span className="inline-block mx-1"> </span>
            <i className="fas fa-chevron-right text-[9px] text-gray-600 inline-block"></i>
            <span className="inline-block mx-1"> </span>
            <span className="text-white/80 md:text-white inline-block">Корзина</span>
          </div>

          {/* Пустая корзина */}
          <div className="max-w-md mx-auto text-center mt-2 md:mt-12">
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 md:mb-8 relative">
                <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 border border-white/10 rounded-full"></div>
                <i className="fas fa-shopping-bag text-white/20 text-4xl md:text-5xl relative z-10"></i>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-3 md:mb-4">
              КОРЗИНА ПУСТА
            </h1>

            <p className="text-gray-400 text-xs md:text-sm mb-6 md:mb-8 max-w-sm mx-auto">
              Похоже, вы ещё не добавили ни одного товара. <br />
              Откройте каталог и найдите что-то особенное.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 md:px-8 py-3 md:py-3.5 font-bold text-xs md:text-sm tracking-wider hover:bg-white/90 transition rounded-xl"
              >
                <i className="fas fa-arrow-right text-xs md:text-sm"></i>
                ПЕРЕЙТИ В КАТАЛОГ
              </Link>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 border border-white/10 text-white/70 px-6 md:px-8 py-3 md:py-3.5 font-medium text-xs md:text-sm hover:bg-white/5 hover:text-white transition rounded-xl"
              >
                <i className="fas fa-home text-xs md:text-sm"></i>
                НА ГЛАВНУЮ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER - корзина с товарами
  // ============================================
  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 pb-28 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16 py-8">

        {/* HEADER */}
        <div className="mb-8 px-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-px bg-white/40"></div>
            <span className="text-gray-400 text-[10px] tracking-[0.2em]">КОРЗИНА</span>
          </div>
          <div className="flex items-end justify-between">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white">
              КОРЗИНА
            </h1>
            {cartItems.length > 0 && (
              <button
                onClick={() => setShowClearModal(true)}
                className="text-white/30 hover:text-red-400 transition text-xs tracking-wider"
              >
                ОЧИСТИТЬ
              </button>
            )}
          </div>
          <p className="text-gray-500 text-xs mt-1">
            {cartItems.length} товаров на сумму {totalPrice.toLocaleString()} ₽
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT - ТОВАРЫ */}
          <div className="flex-1 space-y-4">
            {cartItems.map((item: any) => {
              const productId = item.productId || item.id;
              const cartId = item.id || item.productId;
              const itemName = item.name || 'Товар';
              const itemPrice = item.price || 0;
              const itemQuantity = item.quantity || 1;
              const itemImage = item.image || 'https://placehold.co/100x100/1a1a1a/666666';
              const itemSize = item.size || '—';
              const itemStockType = item.stockType || 'in_stock';
              const itemPreorderDays = item.preorderDays || 30;

              // Проверяем, что productId - число
              const productLink = `/product/${productId}`;

              return (
                <div
                  key={cartId}
                  className={`${glassCard} p-4 hover:scale-[1.01] group relative overflow-hidden`}
                >
                  {/* Вся карточка - ссылка на товар */}
                  <Link
                    to={productLink}
                    className="absolute inset-0 z-0 rounded-2xl"
                  />

                  <div className="flex gap-4 relative z-10 pointer-events-none">
                    {/* IMAGE */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                      <img
                        src={itemImage}
                        alt={itemName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/1a1a1a/666666';
                        }}
                      />
                    </div>

                    {/* INFO */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-sm md:text-base truncate text-white">
                          {itemName}
                        </h3>
                        <span className="text-white font-bold text-sm md:text-base whitespace-nowrap">
                          {(itemPrice * itemQuantity).toLocaleString()} ₽
                        </span>
                      </div>

                      <div className="mt-1 text-xs text-white/30">
                        Размер: {itemSize}
                      </div>

                      {/* BADGE */}
                      <div className="mt-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border whitespace-nowrap ${
                          itemStockType === 'in_stock'
                            ? 'border-emerald-400/20 text-emerald-400 bg-emerald-400/10'
                            : 'border-amber-400/20 text-amber-400 bg-amber-400/10'
                        }`}>
                          {itemStockType === 'in_stock' ? 'В НАЛИЧИИ' : `ПРЕДЗАКАЗ ~${itemPreorderDays}д`}
                        </span>
                      </div>

                      {/* CONTROLS - поверх ссылки с pointer-events-auto */}
                      <div className="flex items-center gap-3 mt-4 pointer-events-auto">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUpdateQuantity(cartId, itemQuantity - 1);
                          }}
                          disabled={updatingItem === cartId}
                          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition flex items-center justify-center disabled:opacity-50"
                        >
                          <span className="text-sm font-bold text-white">−</span>
                        </button>

                        <span className="w-8 text-center font-bold text-sm text-white">
                          {itemQuantity}
                        </span>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUpdateQuantity(cartId, itemQuantity + 1);
                          }}
                          disabled={updatingItem === cartId}
                          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/30 transition flex items-center justify-center disabled:opacity-50"
                        >
                          <span className="text-sm font-bold text-white">+</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemove(cartId, itemName);
                          }}
                          className="ml-auto text-white/20 hover:text-red-400 transition text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT - ИТОГО */}
          <div className="lg:w-[420px] space-y-4">

            {/* ИТОГО */}
            <div className={`${glassPanel} p-6 space-y-4`}>
              <h3 className="text-lg font-black text-white">ИТОГО</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Товары ({cartItems.length})</span>
                  <span className="text-white">{totalPrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Доставка</span>
                  <span className="text-white">
                    {deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice.toLocaleString()} ₽`}
                  </span>
                </div>
                {delivery.days && delivery.days !== 'разные сроки' && (
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>Срок доставки</span>
                    <span className="text-white/60">{delivery.days}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 mt-2 space-y-2">
                  <div className="flex justify-between font-bold text-white text-lg">
                    <span>Всего</span>
                    <span>{finalPrice.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Предоплата</span>
                    <span className="font-bold text-orange-400">{prepaymentAmount.toLocaleString()} ₽</span>
                  </div>
                  {remainingAmount > 0 && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>К оплате при получении</span>
                      <span className="text-white/60">{remainingAmount.toLocaleString()} ₽</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className={btnPrimary}
              >
                ОФОРМИТЬ ЗАКАЗ
              </button>

              <p className="text-[10px] text-orange-400/70 text-center">
                ⚠️ При отказе от заказа предоплата не возвращается
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* MODAL */}
      {showClearModal && (
        <>
          <div className="fixed inset-0 bg-black/80 z-40" onClick={() => setShowClearModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-trash-alt text-2xl text-red-400"></i>
              </div>
              <h3 className="text-white font-black text-xl mb-2">Очистить корзину?</h3>
              <p className="text-gray-400 text-sm mb-4">Вы действительно хотите удалить все товары из корзины?</p>
              <div className="bg-white/5 p-3 rounded-xl mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Товаров:</span>
                  <span className="text-white font-black">{cartItems.length} шт.</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">На сумму:</span>
                  <span className="text-white font-black text-red-400">{totalPrice.toLocaleString()} ₽</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 py-3 border border-white/20 rounded-xl text-white font-medium hover:bg-white/10 transition"
                >
                  Отмена
                </button>
                <button
                  onClick={handleClearCart}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition"
                >
                  Да, очистить
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;