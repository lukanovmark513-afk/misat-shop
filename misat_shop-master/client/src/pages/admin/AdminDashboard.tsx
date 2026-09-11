import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getAllOrders, getUsers } from '../../services/storageService';

// ============================================
// ЦВЕТОВАЯ ПАЛИТРА — тёмный архив
// ============================================
const COLORS = {
  bg: '#0a0a0b',
  bgCard: '#111113',
  bgElevated: '#161619',
  ink: '#e8e4dd',
  inkSoft: 'rgba(232, 228, 221, 0.62)',
  inkFaint: 'rgba(232, 228, 221, 0.38)',
  stamp: '#b8937a',
  stampDark: '#8b6f5a',
  olive: '#7a8a7a',
  rule: 'rgba(232, 228, 221, 0.08)',
  ruleStrong: 'rgba(232, 228, 221, 0.15)',
  gold: '#b8a088',
  goldLight: '#d4c4b0',
};

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

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    pending: { bg: 'rgba(196, 176, 74, 0.15)', text: '#c4b04a', border: 'rgba(196, 176, 74, 0.3)' },
    processing: { bg: 'rgba(74, 106, 138, 0.15)', text: '#8ab4c4', border: 'rgba(138, 180, 196, 0.3)' },
    shipped: { bg: 'rgba(122, 90, 138, 0.15)', text: '#b4a0c4', border: 'rgba(180, 160, 196, 0.3)' },
    delivered: { bg: 'rgba(106, 138, 106, 0.15)', text: '#8ac48a', border: 'rgba(138, 196, 138, 0.3)' },
    cancelled: { bg: 'rgba(138, 74, 74, 0.15)', text: '#c48a8a', border: 'rgba(196, 138, 138, 0.3)' }
  };

  const statusNames: Record<string, string> = {
    pending: 'ОЖИДАЕТ',
    processing: 'В ОБРАБОТКЕ',
    shipped: 'ОТПРАВЛЕН',
    delivered: 'ДОСТАВЛЕН',
    cancelled: 'ОТМЕНЁН'
  };

  const statCards = [
    { icon: 'fa-box', label: 'ТОВАРЫ', value: stats.totalProducts, color: COLORS.ink },
    { icon: 'fa-shopping-cart', label: 'ЗАКАЗЫ', value: stats.totalOrders, color: COLORS.gold },
    { icon: 'fa-users', label: 'ПОЛЬЗОВАТЕЛИ', value: stats.totalUsers, color: COLORS.ink },
    { icon: 'fa-ruble-sign', label: 'ВЫРУЧКА', value: `${stats.totalRevenue.toLocaleString()} ₽`, color: COLORS.goldLight },
    { icon: 'fa-clock', label: 'В ОБРАБОТКЕ', value: stats.pendingOrders, color: '#c4b04a' },
    { icon: 'fa-exclamation-triangle', label: 'НИЗКИЙ ЗАПАС', value: stats.lowStock, color: '#c48a8a' },
  ];

  return (
    <div style={{ backgroundColor: COLORS.bg, minHeight: '100vh', color: COLORS.ink }}>
      {/* Заголовок */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-px" style={{ backgroundColor: COLORS.stamp }}></div>
          <span className="text-[10px] tracking-[0.3em]" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
            АДМИНИСТРИРОВАНИЕ
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter" style={{ fontFamily: 'Anton, sans-serif', color: COLORS.ink }}>
          ДАШБОРД
        </h1>
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {statCards.map((item, idx) => (
          <div
            key={idx}
            className="rounded p-3 text-center transition hover:scale-[1.02]"
            style={{
              backgroundColor: COLORS.bgCard,
              border: `1px solid ${COLORS.rule}`,
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            }}
          >
            <i className={`fas ${item.icon} text-lg mb-1`} style={{ color: item.color, opacity: 0.6 }}></i>
            <p className="text-[9px] tracking-wider mb-1" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
              {item.label}
            </p>
            <p className="text-lg font-bold" style={{ color: item.color, fontFamily: 'JetBrains Mono, monospace' }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* График */}
      <div className="rounded p-5 mb-6" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h2 className="text-sm font-bold tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.ink }}>
            📊 ПРОДАЖИ
          </h2>
          <div className="flex gap-1 p-0.5 rounded" style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}` }}>
            {[
              { id: 'week', label: 'НЕДЕЛЯ' },
              { id: 'month', label: 'МЕСЯЦ' },
              { id: 'year', label: 'ГОД' }
            ].map(period => (
              <button
                key={period.id}
                onClick={() => setChartPeriod(period.id as 'week' | 'month' | 'year')}
                className="px-3 py-1 rounded text-[9px] font-bold transition"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  backgroundColor: chartPeriod === period.id ? COLORS.ink : 'transparent',
                  color: chartPeriod === period.id ? COLORS.bg : COLORS.inkFaint,
                }}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {salesData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
            НЕТ ДАННЫХ
          </div>
        ) : (
          <div className="h-48 flex items-end gap-1">
            {salesData.map((data, idx) => {
              const height = Math.max((data.amount / maxAmount) * 120, 2);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center group">
                  <div
                    className="w-full rounded-t transition-all duration-300"
                    style={{
                      height: `${height}px`,
                      background: data.amount > 0
                        ? `linear-gradient(to top, ${COLORS.stamp}40, ${COLORS.stamp}20)`
                        : `${COLORS.rule}`,
                    }}
                  />
                  <p className="text-[8px] mt-1" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    {data.date}
                  </p>
                  <p className="text-[7px] opacity-0 group-hover:opacity-100 transition" style={{ color: COLORS.goldLight, fontFamily: 'JetBrains Mono, monospace' }}>
                    {data.amount.toLocaleString()} ₽
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Последние заказы и новые товары */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Заказы */}
        <div className="rounded p-5" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
          <div className="flex justify-between items-center mb-4 pb-3" style={{ borderBottom: `1px dashed ${COLORS.ruleStrong}` }}>
            <h2 className="text-sm font-bold tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.ink }}>
              🛒 ПОСЛЕДНИЕ ЗАКАЗЫ
            </h2>
            <Link to="/admin/orders" className="text-[10px] transition" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
              ВСЕ →
            </Link>
          </div>
          <div className="space-y-2">
            {recentOrders.length === 0 ? (
              <p className="text-center py-8 text-xs" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                НЕТ ЗАКАЗОВ
              </p>
            ) : (
              recentOrders.map(order => {
                const statusStyle = statusColors[order.status] || statusColors.pending;
                return (
                  <div key={order.id} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${COLORS.rule}` }}>
                    <div>
                      <p className="text-xs" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
                        №{order.id}
                      </p>
                      <p className="text-[9px]" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                        {order.items?.length || 0} ТОВАРОВ
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
                        {order.total.toLocaleString()} ₽
                      </p>
                      <span
                        className="px-2 py-0.5 rounded-full text-[8px] font-medium"
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          border: `1px solid ${statusStyle.border}`,
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        {statusNames[order.status]}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Товары */}
        <div className="rounded p-5" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
          <div className="flex justify-between items-center mb-4 pb-3" style={{ borderBottom: `1px dashed ${COLORS.ruleStrong}` }}>
            <h2 className="text-sm font-bold tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.ink }}>
              📦 НОВЫЕ ТОВАРЫ
            </h2>
            <Link to="/admin/products" className="text-[10px] transition" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
              ВСЕ →
            </Link>
          </div>
          <div className="space-y-2">
            {recentProducts.length === 0 ? (
              <p className="text-center py-8 text-xs" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                НЕТ ТОВАРОВ
              </p>
            ) : (
              recentProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between py-2" style={{ borderBottom: `1px solid ${COLORS.rule}` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}` }}>
                      <i className="fas fa-box text-xs" style={{ color: COLORS.inkFaint }}></i>
                    </div>
                    <div>
                      <p className="text-xs font-medium line-clamp-1" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
                        {product.name}
                      </p>
                      <p className="text-[9px]" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                        {product.price.toLocaleString()} ₽
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px]" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                      ОСТАТОК: {product.stock}
                    </p>
                    {product.isNew && (
                      <span className="text-[8px] font-bold" style={{ color: COLORS.olive, fontFamily: 'JetBrains Mono, monospace' }}>
                        NEW
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;