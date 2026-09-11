import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserOrders, getCurrentUser } from '../services/storageService';

const OrdersPage = () => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      const user = getCurrentUser();
      if (user) {
        const userOrders = getUserOrders(user.id);
        setOrders(userOrders);
      }
    }
  }, [isAuthenticated]);

  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      pending: 'Ожидает',
      processing: 'В обработке',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменён',
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <i className="fas fa-lock text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-black mb-4">ТРЕБУЕТСЯ АВТОРИЗАЦИЯ</h2>
          <p className="text-gray-500 mb-8">Войдите в аккаунт, чтобы просмотреть заказы</p>
          <Link to="/profile" className="inline-block bg-black text-white px-8 py-3 font-black tracking-wider hover:bg-gray-800 transition">
            ВОЙТИ
          </Link>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-black mb-4">У ВАС ПОКА НЕТ ЗАКАЗОВ</h2>
          <p className="text-gray-500 mb-8">Перейдите в каталог, чтобы сделать первый заказ</p>
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
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-8">МОИ ЗАКАЗЫ</h1>

        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border-2 border-black overflow-hidden">
              <div className="bg-gray-50 p-4 flex flex-wrap justify-between items-center border-b-2 border-black">
                <div>
                  <p className="text-xs text-gray-500">ЗАКАЗ №</p>
                  <p className="font-black">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ДАТА</p>
                  <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">СУММА</p>
                  <p className="font-black">{order.total.toLocaleString()} ₽</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">СТАТУС</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-black ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-black mb-2">ТОВАРЫ:</p>
                <div className="space-y-1 mb-3">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.name} x{item.quantity} (Размер: {item.size})</span>
                      <span className="font-black">{(item.price * item.quantity).toLocaleString()} ₽</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <p className="text-sm"><span className="font-black">Адрес:</span> {order.address}</p>
                  {order.comment && <p className="text-sm mt-1"><span className="font-black">Комментарий:</span> {order.comment}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;