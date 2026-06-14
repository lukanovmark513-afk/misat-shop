import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserOrders, getCurrentUser } from '../services/storageService';

const OrdersPage = () => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      const user = getCurrentUser();
      if (user) {
        const userOrders = getUserOrders(user.id);
        // Сортируем заказы по дате (сначала новые)
        const sortedOrders = [...userOrders].sort((a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setOrders(sortedOrders);
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
      pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      processing: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      delivered: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
    };
    return colors[status] || 'bg-white/10 text-gray-400 border border-white/10';
  };

  const toggleExpand = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-20">
        <div className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <i className="fas fa-lock text-white/40 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">ТРЕБУЕТСЯ АВТОРИЗАЦИЯ</h2>
            <p className="text-gray-400 text-sm mb-8">Войдите в аккаунт, чтобы просмотреть заказы</p>
            <Link to="/profile" className="inline-block bg-white text-black px-8 py-3 font-bold text-sm tracking-wider hover:bg-white/90 transition rounded-xl">
              ВОЙТИ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-20">
        <div className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <i className="fas fa-box-open text-white/40 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">У ВАС ПОКА НЕТ ЗАКАЗОВ</h2>
            <p className="text-gray-400 text-sm mb-8">Перейдите в каталог, чтобы сделать первый заказ</p>
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

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-8">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="Orders"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-8 px-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-0.5 bg-white/40"></div>
              <span className="text-gray-400 text-[10px] tracking-[0.3em]">ЛИЧНЫЙ КАБИНЕТ</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
              МОИ ЗАКАЗЫ
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Всего заказов: <span className="text-white font-bold">{orders.length}</span>
            </p>
          </div>
        </div>

        {/* Список заказов */}
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-white/30 transition-all duration-300"
            >
              {/* Заголовок заказа */}
              <div
                className="p-5 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-white/5 transition"
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <i className="fas fa-receipt text-white/50 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-bold tracking-wider">ЗАКАЗ №</p>
                    <p className="text-white font-mono text-sm">{order.id}</p>
                  </div>
                </div>

                <div>
                  <p className="text-white/40 text-[10px] font-bold tracking-wider">ДАТА</p>
                  <p className="text-white text-sm">{new Date(order.created_at).toLocaleDateString('ru-RU')}</p>
                </div>

                <div>
                  <p className="text-white/40 text-[10px] font-bold tracking-wider">СУММА</p>
                  <p className="text-white font-bold text-lg">{order.total.toLocaleString()} ₽</p>
                </div>

                <div>
                  <p className="text-white/40 text-[10px] font-bold tracking-wider">СТАТУС</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="text-white/40">
                  <i className={`fas fa-chevron-down transition-transform duration-300 ${expandedOrder === order.id ? 'rotate-180' : ''}`}></i>
                </div>
              </div>

              {/* Детали заказа (раскрывается) */}
              {expandedOrder === order.id && (
                <div className="border-t border-white/10 p-5 bg-white/5">
                  <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                    <i className="fas fa-box text-white/40 text-xs"></i>
                    ТОВАРЫ В ЗАКАЗЕ
                  </h3>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{item.name}</p>
                          <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                            <span>Размер: {item.size}</span>
                            <span>Кол-во: {item.quantity}</span>
                          </div>
                        </div>
                        <p className="text-white font-bold text-sm">{(item.price * item.quantity).toLocaleString()} ₽</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Адрес доставки:</span>
                      <span className="text-white text-sm">{order.address}</span>
                    </div>
                    {order.comment && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Комментарий:</span>
                        <span className="text-gray-300 text-sm max-w-md text-right">{order.comment}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;