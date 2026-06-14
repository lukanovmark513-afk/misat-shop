import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCartAsync, updateCartItemAsync, clearCartAsync, fetchCart } from '../store/slices/cartSlice';
import { AppDispatch } from '../store';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: any) => state.cart.items);
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [isMobile, setIsMobile] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const loadCart = async () => {
      if (isAuthenticated) {
        await dispatch(fetchCart());
      }
      setIsLoading(false);
    };
    loadCart();

    return () => window.removeEventListener('resize', checkMobile);
  }, [dispatch, isAuthenticated]);

  const totalPrice = cartItems.reduce((sum: number, item: any) => {
    const price = item?.price || 0;
    const quantity = item?.quantity || 0;
    return sum + (price * quantity);
  }, 0);

  const calculateDelivery = (items: any[]) => {
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

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    setUpdatingItem(id);
    await dispatch(updateCartItemAsync({ itemId: id, quantity }));
    setUpdatingItem(null);
  };

  const handleRemove = async (id: number, name: string) => {
    await dispatch(removeFromCartAsync(id));
    toast.error(`${name} удалён из корзины`);
  };

  const handleClearCart = async () => {
    await dispatch(clearCartAsync());
    setShowClearModal(false);
    toast.success('Корзина очищена');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Войдите в аккаунт, чтобы оформить заказ');
      navigate('/profile');
      return;
    }
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 text-xs tracking-wider mt-4 animate-pulse">ЗАГРУЗКА</p>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-20">
        <div className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <i className="fas fa-shopping-cart text-white/40 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">КОРЗИНА ПУСТА</h2>
            <p className="text-gray-400 text-sm mb-8">Добавьте товары в корзину, чтобы продолжить</p>
            <Link to="/catalog" className="inline-block bg-white text-black px-8 py-3 font-bold text-sm tracking-wider hover:bg-white/90 transition rounded-xl">
              ПЕРЕЙТИ В КАТАЛОГ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* ========== БАННЕР КОРЗИНЫ (только ПК) ========== */}
        <div className="hidden md:block rounded-xl md:rounded-2xl border border-white/10 mb-4 md:mb-6 overflow-hidden bg-black">
          <div className="relative h-[140px] md:h-[300px] overflow-hidden">
            <img
              src="/images/brands/karzina.jpg"
              alt="Корзина"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
          </div>
        </div>

        {/* ========== ЗАГОЛОВОК ПОД БАННЕРОМ (везде) ========== */}
        <div className="mb-6 md:mb-8 px-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px bg-white/40"></div>
            <span className="text-gray-400 text-[8px] md:text-[10px] tracking-[0.2em]">КОРЗИНА</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-white">
            КОРЗИНА
          </h1>
          <p className="text-gray-500 text-[9px] md:text-xs mt-1">
            {cartItems.length} товаров на сумму {totalPrice.toLocaleString()} ₽
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Левая колонка - Товары */}
          <div className="flex-1">
            {isMobile ? (
              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex gap-3">
                      <img
                        src={item.image || 'https://placehold.co/100x100/1a1a1a/666666'}
                        alt={item.name || 'Товар'}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/1a1a1a/666666';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-white font-black text-base">{item.name || 'Товар'}</h3>
                        <p className="text-sm text-gray-500">Размер: {item.size || 'Не указан'}</p>
                        <p className="text-xs text-gray-500">
                          {item.stockType === 'in_stock' ? '✅ В наличии (РФ)' : `📦 Предзаказ ~${item.preorderDays || 30} дней`}
                        </p>
                        <p className="text-white font-bold text-base mt-1">{item?.price?.toLocaleString() || 0} ₽</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                            disabled={updatingItem === item.id}
                            className="w-8 h-8 border border-white/20 rounded-lg flex items-center justify-center text-white hover:border-white/50 transition disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-white font-black">{item.quantity || 1}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                            disabled={updatingItem === item.id}
                            className="w-8 h-8 border border-white/20 rounded-lg flex items-center justify-center text-white hover:border-white/50 transition disabled:opacity-50"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemove(item.id, item.name)}
                            className="text-red-400 hover:text-red-300 transition"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-black">
                          {((item?.price || 0) * (item?.quantity || 1)).toLocaleString()} ₽
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/10 border-b border-white/10">
                      <tr className="text-left">
                        <th className="px-5 py-4 text-white/40 text-[10px] font-bold tracking-wider">ТОВАР</th>
                        <th className="px-5 py-4 text-white/40 text-[10px] font-bold tracking-wider">НАЗВАНИЕ</th>
                        <th className="px-5 py-4 text-white/40 text-[10px] font-bold tracking-wider">ЦЕНА</th>
                        <th className="px-5 py-4 text-white/40 text-[10px] font-bold tracking-wider">КОЛИЧЕСТВО</th>
                        <th className="px-5 py-4 text-white/40 text-[10px] font-bold tracking-wider">ИТОГО</th>
                        <th className="px-5 py-4 text-white/40 text-[10px] font-bold tracking-wider"></th>
                       </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item: any) => (
                        <tr key={item.id} className="border-b border-white/5">
                          <td className="px-5 py-4">
                            <img
                              src={item.image || 'https://placehold.co/80x80/1a1a1a/666666'}
                              alt={item.name || 'Товар'}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/1a1a1a/666666';
                              }}
                            />
                           </td>
                          <td className="px-5 py-4">
                            <p className="text-white font-black text-sm">{item.name || 'Товар'}</p>
                            <p className="text-xs text-gray-500 mt-1">Размер: {item.size || 'Не указан'}</p>
                            <p className="text-[10px] text-gray-600 mt-0.5">
                              {item.stockType === 'in_stock' ? '✅ В наличии (РФ)' : `📦 Предзаказ ~${item.preorderDays || 30} дней`}
                            </p>
                           </td>
                          <td className="px-5 py-4 text-white font-bold">{item?.price?.toLocaleString() || 0} ₽</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                                disabled={updatingItem === item.id}
                                className="w-8 h-8 border border-white/20 rounded-lg flex items-center justify-center text-white hover:border-white/50 transition disabled:opacity-50"
                              >
                                -
                              </button>
                              <span className="w-8 text-center text-white font-black">{item.quantity || 1}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                                disabled={updatingItem === item.id}
                                className="w-8 h-8 border border-white/20 rounded-lg flex items-center justify-center text-white hover:border-white/50 transition disabled:opacity-50"
                              >
                                +
                              </button>
                            </div>
                           </td>
                          <td className="px-5 py-4 text-white font-bold">
                            {((item?.price || 0) * (item?.quantity || 1)).toLocaleString()} ₽
                           </td>
                          <td className="px-5 py-4">
                            <button onClick={() => handleRemove(item.id, item.name)} className="text-red-400 hover:text-red-300 transition">
                              <i className="fas fa-trash"></i>
                            </button>
                           </td>
                         </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Правая колонка - Итого */}
          <div className="lg:w-96">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 sticky top-24">
              <h3 className="text-white font-black text-xl mb-4">ИТОГО</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Товары ({cartItems.length})</span>
                  <span className="text-white">{totalPrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Доставка</span>
                  <span className="text-white">{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice.toLocaleString()} ₽`}</span>
                </div>
                {delivery.days && delivery.days !== 'разные сроки' && (
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Срок доставки</span>
                    <span className="text-white text-xs">{delivery.days}</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 mt-2">
                  <div className="flex justify-between text-white font-black text-lg">
                    <span>Всего:</span>
                    <span>{finalPrice.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between mt-2 text-gray-400 text-sm">
                    <span>Предоплата:</span>
                    <span className="font-bold text-orange-400">{prepaymentAmount.toLocaleString()} ₽</span>
                  </div>
                  {remainingAmount > 0 && (
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-500">К оплате при получении:</span>
                      <span className="text-gray-300">{remainingAmount.toLocaleString()} ₽</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-white text-black py-3.5 rounded-xl font-bold text-sm tracking-wider hover:bg-white/90 transition"
              >
                ОФОРМИТЬ ЗАКАЗ
              </button>

              <p className="text-[10px] text-gray-500 text-center mt-3">{delivery.text}</p>
              <p className="text-[10px] text-orange-400/70 text-center mt-2">⚠️ При отказе от заказа предоплата не возвращается</p>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно очистки корзины */}
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