import React, { useState, useEffect } from 'react';
import { getAllOrders, updateOrderStatus, Order } from '../../services/storageService';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const statuses = [
    { value: 'pending', label: 'Ожидает', color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
    { value: 'processing', label: 'В обработке', color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
    { value: 'shipped', label: 'Отправлен', color: 'bg-purple-500/20 text-purple-400 border border-purple-500/30' },
    { value: 'delivered', label: 'Доставлен', color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
    { value: 'cancelled', label: 'Отменён', color: 'bg-red-500/20 text-red-400 border border-red-500/30' },
  ];

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
    return s ? s.color : 'bg-white/10 text-gray-400 border border-white/10';
  };

  if (orders.length === 0) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">УПРАВЛЕНИЕ ЗАКАЗАМИ</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-8 h-0.5 bg-white/40"></div>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
          <div className="w-20 h-20 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-4">
            <i className="fas fa-box-open text-white/40 text-3xl"></i>
          </div>
          <h3 className="text-white font-black text-xl mb-2">ЗАКАЗОВ ПОКА НЕТ</h3>
          <p className="text-gray-400">Заказы появятся после оформления покупок</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">УПРАВЛЕНИЕ ЗАКАЗАМИ</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-8 h-0.5 bg-white/40"></div>
          <p className="text-gray-400 text-sm">Всего заказов: <span className="text-white font-bold">{stats.total}</span></p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <p className="text-white text-xl font-bold">{stats.total}</p>
          <p className="text-gray-400 text-xs">Всего</p>
        </div>
        <div className="bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/30">
          <p className="text-yellow-400 text-xl font-bold">{stats.pending}</p>
          <p className="text-yellow-400/70 text-xs">Ожидают</p>
        </div>
        <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/30">
          <p className="text-blue-400 text-xl font-bold">{stats.processing}</p>
          <p className="text-blue-400/70 text-xs">В обработке</p>
        </div>
        <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/30">
          <p className="text-purple-400 text-xl font-bold">{stats.shipped}</p>
          <p className="text-purple-400/70 text-xs">Отправлены</p>
        </div>
        <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/30">
          <p className="text-emerald-400 text-xl font-bold">{stats.delivered}</p>
          <p className="text-emerald-400/70 text-xs">Доставлены</p>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <p className="text-white text-xl font-bold">{stats.totalRevenue.toLocaleString()} ₽</p>
          <p className="text-gray-400 text-xs">Выручка</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
            filterStatus === 'all' ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          Все
        </button>
        {statuses.map(status => (
          <button
            key={status.value}
            onClick={() => setFilterStatus(status.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
              filterStatus === status.value ? 'bg-white text-black' : 'bg-white/10 text-white/70 hover:bg-white/20'
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
              <div key={order.id} className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-white font-black text-sm">{order.id}</span>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <p className="text-white font-medium">{user?.first_name} {user?.last_name}</p>
                <p className="text-gray-400 text-sm">{order.total.toLocaleString()} ₽</p>
                <p className="text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
                <div className="mt-3 flex gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrder(order.id, e.target.value as Order['status'])}
                    className="flex-1 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-white/30 focus:outline-none"
                  >
                    {statuses.map(s => (
                      <option key={s.value} value={s.value} className="bg-[#0a0a0a]">{s.label}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="bg-white text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/90 transition"
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
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr className="text-left">
                  <th className="px-4 py-3 text-white/40 text-[10px] font-bold tracking-wider">НОМЕР</th>
                  <th className="px-4 py-3 text-white/40 text-[10px] font-bold tracking-wider">ПОКУПАТЕЛЬ</th>
                  <th className="px-4 py-3 text-white/40 text-[10px] font-bold tracking-wider">СУММА</th>
                  <th className="px-4 py-3 text-white/40 text-[10px] font-bold tracking-wider">СТАТУС</th>
                  <th className="px-4 py-3 text-white/40 text-[10px] font-bold tracking-wider">ДАТА</th>
                  <th className="px-4 py-3 text-white/40 text-[10px] font-bold tracking-wider">ДЕЙСТВИЯ</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => {
                  const user = JSON.parse(localStorage.getItem('misat_users') || '[]').find((u: any) => u.id === order.userId);
                  return (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="px-4 py-3 font-mono text-white font-medium text-sm">{order.id}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white font-medium">{user?.first_name} {user?.last_name}</p>
                          <p className="text-gray-500 text-xs">{user?.email}</p>
                        </div>
                       </td>
                      <td className="px-4 py-3 text-white font-bold">{order.total.toLocaleString()} ₽</td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrder(order.id, e.target.value as Order['status'])}
                          className={`px-2 py-1 rounded-full text-[10px] font-bold border-0 focus:ring-1 focus:ring-white/50 cursor-pointer ${getStatusColor(order.status)}`}
                        >
                          {statuses.map(s => (
                            <option key={s.value} value={s.value} className="bg-[#0a0a0a]">{s.label}</option>
                          ))}
                        </select>
                        </td>
                      <td className="px-4 py-3 text-gray-400 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => setSelectedOrder(order)} className="text-gray-400 hover:text-white transition">
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

      {/* Модальное окно с деталями заказа - ТЕМНОЕ */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-black/80 z-50" onClick={() => setSelectedOrder(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0a0a0a] rounded-2xl border border-white/10 p-5 z-50 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white font-black text-xl">Детали заказа {selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-white/50 text-2xl w-8 h-8 flex items-center justify-center hover:text-white transition">×</button>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-5">
              {/* Информация о получателе */}
              <div>
                <h3 className="text-white/40 text-[10px] font-bold tracking-wider mb-2">ИНФОРМАЦИЯ О ПОЛУЧАТЕЛЕ</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(() => {
                    const fioMatch = selectedOrder.comment.match(/ФИО: (.*?)(\\n|$)/);
                    const emailMatch = selectedOrder.comment.match(/Email: (.*?)(\\n|$)/);
                    return (
                      <>
                        <div>
                          <p className="text-gray-500 text-xs">ФИО</p>
                          <p className="text-white text-sm font-medium">{fioMatch ? fioMatch[1] : 'Не указано'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Телефон</p>
                          <p className="text-white text-sm font-medium">{selectedOrder.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Email</p>
                          <p className="text-white text-sm font-medium">{emailMatch ? emailMatch[1] : 'Не указан'}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Адрес доставки */}
              <div>
                <h3 className="text-white/40 text-[10px] font-bold tracking-wider mb-2">АДРЕС ДОСТАВКИ</h3>
                <p className="text-gray-300 text-sm whitespace-pre-line">{selectedOrder.address}</p>
              </div>

              {/* Товары */}
              <div>
                <h3 className="text-white/40 text-[10px] font-bold tracking-wider mb-2">СОСТАВ ЗАКАЗА</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm border-b border-white/10 pb-2">
                      <div>
                        <span className="text-white font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        <div className="text-gray-500 text-xs">Размер: {item.size}</div>
                      </div>
                      <span className="text-white font-bold">{(item.price * item.quantity).toLocaleString()} ₽</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-base pt-3 mt-2 border-t border-white/10">
                  <span className="text-white">Итого:</span>
                  <span className="text-white">{selectedOrder.total.toLocaleString()} ₽</span>
                </div>
              </div>

              {/* Комментарий */}
              {(() => {
                const comment = selectedOrder.comment.replace(/ФИО: .*?\\n/, '').replace(/Email: .*?\\n/, '').trim();
                if (comment && comment !== '') {
                  return (
                    <div>
                      <h3 className="text-white/40 text-[10px] font-bold tracking-wider mb-2">КОММЕНТАРИЙ</h3>
                      <p className="text-gray-400 text-sm">{comment}</p>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Статус */}
              <div className="pt-2">
                <label className="text-white/40 text-[10px] font-bold block mb-2 tracking-wider">СТАТУС</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    updateOrder(selectedOrder.id, e.target.value as Order['status']);
                    setSelectedOrder({ ...selectedOrder, status: e.target.value as Order['status'] });
                  }}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-white/30 focus:outline-none transition text-sm"
                >
                  {statuses.map(s => (
                    <option key={s.value} value={s.value} className="bg-[#0a0a0a]">{s.label}</option>
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