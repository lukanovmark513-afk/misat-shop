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
    await dispatch(updateCartItemAsync({ itemId: id, quantity }));
  };

  const handleRemove = async (id: number) => {
    await dispatch(removeFromCartAsync(id));
    toast.error('Товар удалён из корзины');
  };

  const handleClearCart = async () => {
    await dispatch(clearCartAsync());
    setShowClearModal(false);
    toast.success('Корзина очищена', {
      icon: '🗑️',
      duration: 3000,
      style: { background: '#000', color: '#fff' },
    });
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
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 text-sm">Загрузка корзины...</p>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <i className="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-black mb-4">КОРЗИНА ПУСТА</h2>
          <p className="text-gray-500 mb-8">Добавьте товары в корзину, чтобы продолжить</p>
          <Link to="/catalog" className="inline-block bg-black text-white px-8 py-3 font-black tracking-wider hover:bg-gray-800 transition">
            ПЕРЕЙТИ В КАТАЛОГ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter">КОРЗИНА</h1>
          <button
            onClick={() => setShowClearModal(true)}
            className="text-sm text-red-500 hover:text-red-700 transition flex items-center gap-1"
          >
            <i className="fas fa-trash-alt"></i> Очистить корзину
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {isMobile ? (
              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border">
                    <div className="flex gap-3">
                      <img
                        src={item.image || 'https://placehold.co/100x100/eeeeee/cccccc?text=No+Image'}
                        alt={item.name || 'Товар'}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/eeeeee/cccccc?text=No+Image';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-black text-base">{item.name || 'Товар'}</h3>
                        <p className="text-sm text-gray-500">Размер: {item.size || 'Не указан'}</p>
                        <p className="text-xs text-gray-500">
                          {item.stockType === 'in_stock' ? '✅ В наличии (РФ)' : `📦 Предзаказ ~${item.preorderDays || 30} дней`}
                        </p>
                        <p className="font-bold text-base mt-1">{item?.price?.toLocaleString() || 0} ₽</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="w-8 h-8 border-2 border-gray-300 rounded-lg flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-black">{item.quantity || 1}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="w-8 h-8 border-2 border-gray-300 rounded-lg flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleRemove(item.id)}
                            className="text-red-500 ml-2"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black">
                          {((item?.price || 0) * (item?.quantity || 1)).toLocaleString()} ₽
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b-2 border-black">
                    <tr className="text-left">
                      <th className="pb-3 text-sm font-black">Товар</th>
                      <th className="pb-3 text-sm font-black">Название</th>
                      <th className="pb-3 text-sm font-black">Цена</th>
                      <th className="pb-3 text-sm font-black">Количество</th>
                      <th className="pb-3 text-sm font-black">Итого</th>
                      <th className="pb-3 text-sm font-black"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item: any) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-4 pr-4">
                          <img
                            src={item.image || 'https://placehold.co/100x100/eeeeee/cccccc?text=No+Image'}
                            alt={item.name || 'Товар'}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/eeeeee/cccccc?text=No+Image';
                            }}
                          />
                        </td>
                        <td className="py-4">
                          <p className="font-black">{item.name || 'Товар'}</p>
                          <p className="text-sm text-gray-500">Размер: {item.size || 'Не указан'}</p>
                          <p className="text-xs text-gray-500">
                            {item.stockType === 'in_stock' ? '✅ В наличии (РФ)' : `📦 Предзаказ ~${item.preorderDays || 30} дней`}
                          </p>
                        </td>
                        <td className="py-4 font-bold">{item?.price?.toLocaleString() || 0} ₽</td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                              className="w-8 h-8 border rounded-lg"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-black">{item.quantity || 1}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="w-8 h-8 border rounded-lg"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="py-4 font-bold">
                          {((item?.price || 0) * (item?.quantity || 1)).toLocaleString()} ₽
                        </td>
                        <td className="py-4">
                          <button onClick={() => handleRemove(item.id)} className="text-red-500">
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                       </tr>
                    ))}
                  </tbody>
                 </table>
              </div>
            )}
          </div>

          <div className="lg:w-96">
            <div className="border-2 border-black p-6 sticky top-24">
              <h3 className="font-black text-xl mb-4">ИТОГО</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Товары ({cartItems.length})</span>
                  <span>{totalPrice.toLocaleString()} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Доставка</span>
                  <span>{deliveryPrice === 0 ? 'Бесплатно' : `${deliveryPrice.toLocaleString()} ₽`}</span>
                </div>
                {delivery.days && delivery.days !== 'разные сроки' && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Срок доставки</span>
                    <span className="text-sm">{delivery.days}</span>
                  </div>
                )}
                <div className="border-t-2 border-black pt-2 mt-2">
                  <div className="flex justify-between font-black text-lg">
                    <span>Всего:</span>
                    <span>{finalPrice.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-500">Предоплата:</span>
                    <span className="font-bold text-orange-600">{prepaymentAmount.toLocaleString()} ₽</span>
                  </div>
                  {remainingAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">К оплате при получении:</span>
                      <span>{remainingAmount.toLocaleString()} ₽</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 font-black tracking-wider hover:bg-gray-800 transition"
              >
                ОФОРМИТЬ ЗАКАЗ
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">{delivery.text}</p>
              <p className="text-xs text-orange-600 text-center mt-2">⚠️ При отказе от заказа предоплата не возвращается</p>
            </div>
          </div>
        </div>
      </div>

      {showClearModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowClearModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-trash-alt text-2xl text-red-500"></i>
              </div>
              <h3 className="text-xl font-black mb-2">Очистить корзину?</h3>
              <p className="text-gray-500 mb-4">Вы действительно хотите удалить все товары из корзины?</p>
              <div className="bg-gray-50 p-3 rounded-xl mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Товаров:</span>
                  <span className="font-black">{cartItems.length} шт.</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">На сумму:</span>
                  <span className="font-black text-red-500">{totalPrice.toLocaleString()} ₽</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-black hover:bg-gray-50 transition"
                >
                  Отмена
                </button>
                <button
                  onClick={handleClearCart}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black hover:bg-red-600 transition"
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