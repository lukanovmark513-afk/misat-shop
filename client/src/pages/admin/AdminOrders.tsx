import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, Order } from '../../services/storageService';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const statuses = [
    { value: 'pending', label: 'Ожидает', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'processing', label: 'В обработке', color: 'bg-blue-100 text-blue-700' },
    { value: 'shipped', label: 'Отправлен', color: 'bg-purple-100 text-purple-700' },
    { value: 'delivered', label: 'Доставлен', color: 'bg-green-100 text-green-700' },
    { value: 'cancelled', label: 'Отменён', color: 'bg-red-100 text-red-700' },
  ];

  // Проверка на мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const allOrders = getAllOrders();
    setOrders(allOrders);
  };

  const updateOrder = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    loadOrders();
    toast.success(`Статус заказа ${orderId} изменён`);
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
  };

  const getStatusText = (status: string) => {
    const s = statuses.find(s => s.value === status);
    return s ? s.label : status;
  };

  const getStatusColor = (status: string) => {
    const s = statuses.find(s => s.value === status);
    return s ? s.color : 'bg-gray-100 text-gray-700';
  };

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl md:text-3xl font-light mb-6">Управление <span className="font-bold">заказами</span></h1>
        <div className="bg-white rounded-2xl p-12 text-center">
          <i className="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-black mb-2">ЗАКАЗОВ ПОКА НЕТ</h3>
          <p className="text-gray-500">Заказы появятся после оформления покупок</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-light mb-6">Управление <span className="font-bold">заказами</span></h1>

      {/* Stats Cards - адаптивные */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3 shadow-sm border-l-4 border-black">
          <p className="text-xl font-bold">{stats.total}</p>
          <p className="text-xs text-gray-500">Всего</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border-l-4 border-yellow-500">
          <p className="text-xl font-bold">{stats.pending}</p>
          <p className="text-xs text-gray-500">Ожидают</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border-l-4 border-blue-500">
          <p className="text-xl font-bold">{stats.processing}</p>
          <p className="text-xs text-gray-500">В обработке</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border-l-4 border-purple-500">
          <p className="text-xl font-bold">{stats.shipped}</p>
          <p className="text-xs text-gray-500">Отправлены</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border-l-4 border-green-500">
          <p className="text-xl font-bold">{stats.delivered}</p>
          <p className="text-xs text-gray-500">Доставлены</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border-l-4 border-black">
          <p className="text-xl font-bold">{stats.totalRevenue.toLocaleString()} ₽</p>
          <p className="text-xs text-gray-500">Выручка</p>
        </div>
      </div>

      {/* Filter - адаптивные кнопки */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
            filterStatus === 'all' ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Все
        </button>
        {statuses.map(status => (
          <button
            key={status.value}
            onClick={() => setFilterStatus(status.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              filterStatus === status.value ? 'bg-black text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {isMobile ? (
        // Мобильная версия - карточки
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const user = JSON.parse(localStorage.getItem('misat_users') || '[]').find((u: any) => u.id === order.userId);
            return (
              <div key={order.id} className="bg-white rounded-2xl p-4 shadow-sm border">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-sm font-black">{order.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-black ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                <p className="text-sm text-gray-500">{order.total.toLocaleString()} ₽</p>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                <div className="mt-3 flex gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrder(order.id, e.target.value as Order['status'])}
                    className="flex-1 px-2 py-1.5 border rounded-lg text-sm"
                  >
                    {statuses.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-black text-white px-3 py-1.5 rounded-lg text-sm"
                  >
                    Детали
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Десктопная версия - таблица
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Номер</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Покупатель</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Сумма</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Статус</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Дата</th>
                  <th className="px-4 py-3 text-sm font-medium text-gray-500">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => {
                  const user = JSON.parse(localStorage.getItem('misat_users') || '[]').find((u: any) => u.id === order.userId);
                  return (
                    <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-mono text-sm font-medium">{order.id}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                       </td>
                      <td className="px-4 py-3 font-bold">{order.total.toLocaleString()} ₽</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrder(order.id, e.target.value as Order['status'])}
                          className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-1 focus:ring-black ${getStatusColor(order.status)}`}
                        >
                          {statuses.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                       </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-gray-500 hover:text-black transition"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                       </td>
                     </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Модальное окно с деталями заказа */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setSelectedOrder(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl p-4 md:p-6 z-50 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Детали заказа {selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-2xl w-8 h-8 flex items-center justify-center">×</button>
            </div>

            <div className="border-t pt-4 space-y-4">
              {/* Информация о получателе */}
              <div>
                <h3 className="font-black text-md mb-2 border-b pb-1">Информация о получателе</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {(() => {
                    const fioMatch = selectedOrder.comment.match(/ФИО: (.*?)\\n/);
                    const emailMatch = selectedOrder.comment.match(/Email: (.*?)(\\n|$)/);
                    return (
                      <>
                        <div>
                          <p className="text-gray-500">ФИО</p>
                          <p className="font-semibold">{fioMatch ? fioMatch[1] : 'Не указано'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Телефон</p>
                          <p className="font-semibold">{selectedOrder.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="font-semibold">{emailMatch ? emailMatch[1] : 'Не указан'}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Адрес доставки */}
              <div>
                <h3 className="font-black text-md mb-2 border-b pb-1">Адрес доставки</h3>
                <p className="text-sm whitespace-pre-line">{selectedOrder.address}</p>
              </div>

              {/* Товары */}
              <div>
                <h3 className="font-black text-md mb-2 border-b pb-1">Состав заказа</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm border-b pb-2">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        <div className="text-xs text-gray-400">Размер: {item.size}</div>
                      </div>
                      <span className="font-bold">{(item.price * item.quantity).toLocaleString()} ₽</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-md pt-2">
                  <span>Итого:</span>
                  <span>{selectedOrder.total.toLocaleString()} ₽</span>
                </div>
              </div>

              {/* Комментарий */}
              {(() => {
                const comment = selectedOrder.comment.replace(/ФИО: .*?\\n/, '').replace(/Email: .*?\\n/, '').trim();
                if (comment && comment !== '') {
                  return (
                    <div>
                      <h3 className="font-black text-md mb-2 border-b pb-1">Комментарий</h3>
                      <p className="text-sm text-gray-600">{comment}</p>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Статус */}
              <div className="pt-2">
                <label className="block text-sm font-bold mb-2">Изменить статус</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    updateOrder(selectedOrder.id, e.target.value as Order['status']);
                    setSelectedOrder({ ...selectedOrder, status: e.target.value as Order['status'] });
                  }}
                  className="w-full px-3 py-2 border rounded-xl text-sm"
                >
                  {statuses.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;