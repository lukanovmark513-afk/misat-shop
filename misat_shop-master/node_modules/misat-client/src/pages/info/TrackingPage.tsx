import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllOrders } from '../../services/storageService';
import toast from 'react-hot-toast';

const TrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = () => {
    if (!orderNumber.trim()) {
      toast.error('Введите номер заказа');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const orders = getAllOrders();
      const foundOrder = orders.find(o => o.id === orderNumber);
      setOrder(foundOrder || null);
      setIsLoading(false);
      if (!foundOrder) toast.error('Заказ не найден');
    }, 500);
  };

  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      pending: 'Ожидает обработки',
      processing: 'В обработке',
      shipped: 'Отправлен',
      delivered: 'Доставлен',
      cancelled: 'Отменён'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
      processing: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      shipped: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
      delivered: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30'
    };
    return colors[status] || 'bg-white/10 text-gray-400 border border-white/10';
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <i className="fas fa-chevron-right text-[9px]"></i>
          <span className="text-white">Отследить заказ</span>
        </div>

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-10">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="Track Order"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-10 px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-0.5 bg-white/40"></div>
              <span className="text-gray-400 text-[10px] tracking-[0.3em]">ОТСЛЕЖИВАНИЕ</span>
              <div className="w-8 h-0.5 bg-white/40"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              ОТСЛЕДИТЬ ЗАКАЗ
            </h1>
            <p className="text-gray-400 text-sm mt-3">Введите номер заказа для отслеживания</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">

          {/* Поиск заказа */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Введите номер заказа"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
              />
              <button
                onClick={handleTrack}
                disabled={isLoading}
                className="bg-white text-black px-6 py-3 rounded-xl font-black text-sm tracking-wider hover:bg-white/90 transition disabled:opacity-50"
              >
                {isLoading ? 'ПОИСК...' : 'ОТСЛЕДИТЬ'}
              </button>
            </div>
          </div>

          {/* Информация о заказе */}
          {order && (
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white/40 text-[10px] font-bold tracking-wider mb-1">НОМЕР ЗАКАЗА</p>
                    <p className="text-white font-mono font-black text-lg">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-bold tracking-wider mb-1">СУММА</p>
                    <p className="text-white font-black text-lg">{order.total.toLocaleString()} ₽</p>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 mb-4">
                  <p className="text-white/40 text-[10px] font-bold tracking-wider mb-2">СТАТУС</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-white/40 text-[10px] font-bold tracking-wider mb-1">АДРЕС ДОСТАВКИ</p>
                  <p className="text-gray-300 text-sm">{order.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;