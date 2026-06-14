import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getAllOrders, getUsers } from '../../services/storageService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStock: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [salesData, setSalesData] = useState<{ date: string; amount: number }[]>([]);

  useEffect(() => {
    loadData();
  }, [chartPeriod]);

  const loadData = () => {
    const products = getProducts();
    const orders = getAllOrders();
    const users = getUsers();

    setStats({
      totalProducts: products.length,
      totalOrders: orders.length,
      totalUsers: users.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      lowStock: products.filter(p => p.stock < 10).length
    });

    setRecentOrders(orders.slice(0, 5));
    setRecentProducts(products.slice(0, 5));
    generateChartData(orders);
  };

  const generateChartData = (orders: any[]) => {
    const now = new Date();
    const data: { date: string; amount: number }[] = [];

    if (chartPeriod === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
        const dailyOrders = orders.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate.toDateString() === date.toDateString();
        });
        const total = dailyOrders.reduce((sum, o) => sum + o.total, 0);
        data.push({ date: dateStr, amount: total });
      }
    } else if (chartPeriod === 'month') {
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dateStr = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
        const dailyOrders = orders.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate.toDateString() === date.toDateString();
        });
        const total = dailyOrders.reduce((sum, o) => sum + o.total, 0);
        data.push({ date: dateStr, amount: total });
      }
    } else {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(now.getMonth() - i);
        const monthStr = date.toLocaleDateString('ru-RU', { month: 'short' });
        const monthlyOrders = orders.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate.getMonth() === date.getMonth() &&
            orderDate.getFullYear() === date.getFullYear();
        });
        const total = monthlyOrders.reduce((sum, o) => sum + o.total, 0);
        data.push({ date: monthStr, amount: total });
      }
    }

    setSalesData(data);
  };

  const maxAmount = Math.max(...salesData.map(d => d.amount), 1);

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    processing: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    shipped: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    delivered: 'bg-green-500/20 text-green-400 border border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30'
  };

  const statusNames: Record<string, string> = {
    pending: 'Ожидает',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменён'
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-px bg-white/40"></div>
          <span className="text-gray-400 text-[8px] md:text-[10px] tracking-[0.2em]">АДМИН</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">ДАШБОРД</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { icon: 'fa-box', label: 'ТОВАРЫ', value: stats.totalProducts },
          { icon: 'fa-shopping-cart', label: 'ЗАКАЗЫ', value: stats.totalOrders },
          { icon: 'fa-users', label: 'ПОЛЬЗОВАТЕЛИ', value: stats.totalUsers },
          { icon: 'fa-ruble-sign', label: 'ВЫРУЧКА', value: stats.totalRevenue.toLocaleString() + ' ₽' },
          { icon: 'fa-clock', label: 'В ОБРАБОТКЕ', value: stats.pendingOrders },
          { icon: 'fa-exclamation-triangle', label: 'НИЗКИЙ ЗАПАС', value: stats.lowStock },
        ].map((item, idx) => (
          <div key={idx} className="bg-white/5 rounded-xl p-3 border border-white/10 text-center">
            <i className={`fas ${item.icon} text-white/30 text-lg mb-1`}></i>
            <p className="text-gray-500 text-[9px] tracking-wider">{item.label}</p>
            <p className="text-white text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* График */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h2 className="text-white font-bold text-sm">ПРОДАЖИ</h2>
          <div className="flex gap-1">
            {[
              { id: 'week', label: 'Нед' },
              { id: 'month', label: 'Мес' },
              { id: 'year', label: 'Год' }
            ].map(period => (
              <button
                key={period.id}
                onClick={() => setChartPeriod(period.id as 'week' | 'month' | 'year')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition ${
                  chartPeriod === period.id
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {salesData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-500 text-sm">Нет данных</div>
        ) : (
          <div className="h-48 flex items-end gap-1">
            {salesData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group">
                <div className="w-full bg-white/20 rounded-t transition-all duration-300 group-hover:bg-white/40" style={{ height: `${Math.max((data.amount / maxAmount) * 120, 2)}px` }} />
                <p className="text-[8px] text-gray-600 mt-1">{data.date}</p>
                <p className="text-[7px] text-white/40 opacity-0 group-hover:opacity-100 transition">{data.amount.toLocaleString()} ₽</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white/5 rounded-xl border border-white/10 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold text-sm">ПОСЛЕДНИЕ ЗАКАЗЫ</h2>
            <Link to="/admin/orders" className="text-gray-500 text-[10px] hover:text-white transition">ВСЕ →</Link>
          </div>
          <div className="space-y-2">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between border-b border-white/5 pb-2">
                <div>
                  <p className="text-white text-xs font-mono">#{order.id}</p>
                  <p className="text-gray-500 text-[9px]">{order.items?.length || 0} товаров</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-xs font-bold">{order.total.toLocaleString()} ₽</p>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${statusColors[order.status]}`}>{statusNames[order.status]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold text-sm">НОВЫЕ ТОВАРЫ</h2>
            <Link to="/admin/products" className="text-gray-500 text-[10px] hover:text-white transition">ВСЕ →</Link>
          </div>
          <div className="space-y-2">
            {recentProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center"><i className="fas fa-box text-white/30 text-xs"></i></div>
                  <div>
                    <p className="text-white text-xs font-medium">{product.name}</p>
                    <p className="text-gray-500 text-[9px]">{product.price.toLocaleString()} ₽</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-[9px]">Остаток: {product.stock}</p>
                  {product.isNew && <span className="text-green-400 text-[8px]">NEW</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;