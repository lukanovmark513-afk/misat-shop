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

  useEffect(() => {
    loadData();
  }, []);

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
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
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
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter">ДАШБОРД</h1>
        <p className="text-gray-500 mt-1">Общая статистика магазина</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Товары</p><p className="text-3xl font-black">{stats.totalProducts}</p></div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><i className="fas fa-box text-blue-600 text-xl"></i></div>
          </div>
          <Link to="/admin/products" className="text-sm text-blue-600 mt-3 inline-block hover:underline">Управление →</Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Заказы</p><p className="text-3xl font-black">{stats.totalOrders}</p></div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><i className="fas fa-shopping-cart text-green-600 text-xl"></i></div>
          </div>
          <Link to="/admin/orders" className="text-sm text-green-600 mt-3 inline-block hover:underline">Управление →</Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Пользователи</p><p className="text-3xl font-black">{stats.totalUsers}</p></div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"><i className="fas fa-users text-purple-600 text-xl"></i></div>
          </div>
          <Link to="/admin/users" className="text-sm text-purple-600 mt-3 inline-block hover:underline">Управление →</Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Выручка</p><p className="text-3xl font-black">{stats.totalRevenue.toLocaleString()} ₽</p></div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center"><i className="fas fa-ruble-sign text-yellow-600 text-xl"></i></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">В обработке</p><p className="text-3xl font-black">{stats.pendingOrders}</p></div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"><i className="fas fa-clock text-orange-600 text-xl"></i></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div><p className="text-sm text-gray-500">Заканчиваются</p><p className="text-3xl font-black">{stats.lowStock}</p></div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center"><i className="fas fa-exclamation-triangle text-red-600 text-xl"></i></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black">Последние заказы</h2>
          <Link to="/admin/orders" className="text-sm text-gray-500 hover:text-black">Все заказы →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr className="text-left">
                <th className="pb-3 text-sm font-medium text-gray-500">Номер</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Сумма</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Статус</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Дата</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-3 text-sm font-mono">{order.id}</td>
                  <td className="py-3 text-sm font-bold">{order.total.toLocaleString()} ₽</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {statusNames[order.status]}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black">Последние добавленные товары</h2>
          <Link to="/admin/products" className="text-sm text-gray-500 hover:text-black">Все товары →</Link>
        </div>
        <div className="space-y-3">
          {recentProducts.map(product => (
            <div key={product.id} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-box text-gray-600"></i>
                </div>
                <div>
                  <p className="font-black text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.price.toLocaleString()} ₽</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Остаток: {product.stock}</p>
                {product.isNew && <span className="text-xs text-green-600">NEW</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;