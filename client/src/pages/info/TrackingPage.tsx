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
    const statuses: Record<string, string> = { pending: 'Ожидает обработки', processing: 'В обработке', shipped: 'Отправлен', delivered: 'Доставлен', cancelled: 'Отменён' };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', shipped: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black">Главная</Link>
          <i className="fas fa-chevron-right text-xs"></i>
          <span className="text-black">Отследить заказ</span>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-4">ОТСЛЕДИТЬ ЗАКАЗ</h1>
          <div className="w-20 h-0.5 bg-black mx-auto"></div>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 p-8 rounded-2xl mb-8">
            <div className="flex gap-3">
              <input type="text" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="Номер заказа" className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl" />
              <button onClick={handleTrack} disabled={isLoading} className="bg-black text-white px-6 py-3 rounded-xl font-black">ОТСЛЕДИТЬ</button>
            </div>
          </div>
          {order && (
            <div className="bg-white border-2 border-black p-6 rounded-2xl">
              <div className="flex justify-between mb-4">
                <div><p className="text-sm text-gray-500">Номер заказа</p><p className="font-mono font-black">{order.id}</p></div>
                <div><p className="text-sm text-gray-500">Сумма</p><p className="font-black">{order.total.toLocaleString()} ₽</p></div>
              </div>
              <div className="border-t pt-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-black ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
              </div>
              <div className="border-t mt-4 pt-4">
                <p className="text-sm text-gray-500">Адрес доставки</p>
                <p>{order.address}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;