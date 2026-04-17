import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getProducts,
  getAllOrders,
  getUsers,
  getStats,
  getCurrentUser
} from '../../services/storageService';

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
  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [salesData, setSalesData] = useState<{ date: string; amount: number }[]>([]);

  useEffect(() => {
    loadData();
  }, [chartPeriod]);

  const loadData = () => {
    try {
      const products = getProducts();
      const orders = getAllOrders();
      const users = getUsers();
      const statsData = getStats();

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        lowStock: products.filter(p => p.stock < 10).length
      });

      setRecentOrders(orders.slice(-5).reverse());

      // Популярные товары (по количеству продаж)
      const productSales = new Map();
      orders.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            const current = productSales.get(item.productId) || {
              name: item.name,
              quantity: 0,
              revenue: 0
            };
            current.quantity += item.quantity;
            current.revenue += item.price * item.quantity;
            productSales.set(item.productId, current);
          });
        }
      });

      const popular = Array.from(productSales.entries())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
      setPopularProducts(popular);

      // Данные для графика
      generateChartData(orders);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    }
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

  // Проверка на авторизацию админа
  const currentUser = getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">Доступ запрещен</h2>
        <p className="text-gray-600 mt-2">У вас нет прав для просмотра этой страницы</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-light mb-8">Дашборд</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Товары</p>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Заказы</p>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Пользователи</p>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Выручка</p>
          <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} ₽</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-orange-500">
          <p className="text-sm text-gray-500">В обработке</p>
          <p className="text-2xl font-bold">{stats.pendingOrders}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Низкий запас</p>
          <p className="text-2xl font-bold">{stats.lowStock}</p>
        </div>
      </div>

      {/* График продаж */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h2 className="text-xl font-black">График продаж</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setChartPeriod('week')}
              className={`px-4 py-1 rounded-full text-sm transition ${
                chartPeriod === 'week'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Неделя
            </button>
            <button
              onClick={() => setChartPeriod('month')}
              className={`px-4 py-1 rounded-full text-sm transition ${
                chartPeriod === 'month'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Месяц
            </button>
            <button
              onClick={() => setChartPeriod('year')}
              className={`px-4 py-1 rounded-full text-sm transition ${
                chartPeriod === 'year'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Год
            </button>
          </div>
        </div>

        {salesData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400">
            Нет данных для отображения
          </div>
        ) : (
          <div className="h-64 flex items-end gap-1 overflow-x-auto pb-4">
            {salesData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center min-w-[40px]">
                <div
                  className="w-full bg-gradient-to-t from-black to-gray-700 rounded-t transition-all duration-500 hover:from-gray-700 hover:to-gray-600"
                  style={{ height: `${Math.max((data.amount / maxAmount) * 180, 4)}px` }}
                />
                <p className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left whitespace-nowrap">
                  {data.date}
                </p>
                <p className="text-xs font-bold mt-1">
                  {data.amount.toLocaleString()} ₽
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Популярные товары и последние заказы */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-black mb-4">Популярные товары</h2>
          {popularProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Нет данных о продажах</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {popularProducts.map((product, idx) => (
                <div key={product.id} className="flex justify-between items-center border-b pb-3">
                  <div className="flex-1">
                    <span className="font-bold text-lg mr-2">{idx + 1}.</span>
                    <span className="text-sm">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{product.quantity} шт.</p>
                    <p className="text-xs text-gray-500">{product.revenue.toLocaleString()} ₽</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-black mb-4">Последние заказы</h2>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Нет заказов</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentOrders.map(order => {
                const users = getUsers();
                const user = users.find((u: any) => u.id === order.userId);
                return (
                  <Link
                    key={order.id}
                    to={`/admin/orders`}
                    className="flex justify-between items-center border-b pb-3 hover:bg-gray-50 p-2 rounded transition"
                  >
                    <div className="flex-1">
                      <p className="font-mono text-xs font-bold">{order.id}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {user?.first_name} {user?.last_name || user?.email || 'Пользователь'}
                      </p>
                      <p className="text-xs text-gray-400">{order.items?.length || 0} товаров</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{order.total.toLocaleString()} ₽</p>
                      <p className={`text-xs px-2 py-0.5 rounded-full mt-1 ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'pending' ? 'В обработке' :
                         order.status === 'processing' ? 'Готовится' :
                         order.status === 'delivered' ? 'Доставлен' : order.status}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;