import React, { useState } from 'react';
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
      pending: 'bg-yellow-400',
      processing: 'bg-blue-400',
      shipped: 'bg-purple-400',
      delivered: 'bg-emerald-400',
      cancelled: 'bg-red-400'
    };
    return colors[status] || 'bg-white/40';
  };

  const getStatusTextColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-400',
      processing: 'text-blue-400',
      shipped: 'text-purple-400',
      delivered: 'text-emerald-400',
      cancelled: 'text-red-400'
    };
    return colors[status] || 'text-white/40';
  };

  const getStatusBg = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-400/10 border-yellow-400/20',
      processing: 'bg-blue-400/10 border-blue-400/20',
      shipped: 'bg-purple-400/10 border-purple-400/20',
      delivered: 'bg-emerald-400/10 border-emerald-400/20',
      cancelled: 'bg-red-400/10 border-red-400/20'
    };
    return colors[status] || 'bg-white/5 border-white/10';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      pending: 'fa-clock',
      processing: 'fa-box',
      shipped: 'fa-truck',
      delivered: 'fa-check',
      cancelled: 'fa-times'
    };
    return icons[status] || 'fa-circle';
  };

  const getTimelineStatus = (status: string) => {
    const steps = [
      { key: 'created', label: 'Создан', icon: 'fa-check' },
      { key: 'processing', label: 'Сборка', icon: 'fa-box' },
      { key: 'shipped', label: 'Отправлен', icon: 'fa-truck' },
      { key: 'delivered', label: 'Доставлен', icon: 'fa-home' }
    ];

    const statusMap: Record<string, number> = {
      pending: 0,
      processing: 1,
      shipped: 2,
      delivered: 3
    };

    const activeIndex = statusMap[status] ?? 0;

    return steps.map((step, index) => ({
      ...step,
      isActive: index <= activeIndex,
      isLast: index === steps.length - 1
    }));
  };

  // ФОН — теперь absolute, не fixed
  const renderBackground = () => (
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute left-1/2 top-[100px] -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-white/[0.015] blur-[250px]" />
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.02] blur-[180px]" />
    </div>
  );

  const renderHero = () => (
    <div className="mb-12 md:mb-20 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 text-xs uppercase tracking-[0.2em] mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
        Tracking
      </div>
      <h1 className="text-[56px] sm:text-[72px] md:text-[100px] lg:text-[120px] font-black tracking-[-0.09em] text-white leading-[0.9]">
        Заказ
      </h1>
      <p className="text-zinc-500 text-base sm:text-lg max-w-md mx-auto mt-4">
        Проверьте текущий статус доставки по номеру заказа
      </p>
    </div>
  );

  const renderSearch = () => (
    <div className="relative max-w-2xl mx-auto">
      <i className="fas fa-search absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 text-sm" />
      <input
        type="text"
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
        placeholder="Введите номер заказа"
        className="w-full h-[72px] pl-14 pr-36 rounded-[28px] bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl text-white text-base placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-all"
        onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
      />
      <button
        onClick={handleTrack}
        disabled={isLoading}
        className="absolute right-3 top-3 h-[48px] min-w-[100px] px-7 rounded-2xl bg-white text-black font-semibold transition-all hover:opacity-90 active:scale-[0.97] disabled:opacity-50 flex items-center justify-center text-sm"
      >
        {isLoading ? <i className="fas fa-spinner animate-spin" /> : 'Найти'}
      </button>
    </div>
  );

  const renderNotFound = () => (
    <div className="relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/[0.08] bg-[#0b0b0b] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] p-12 text-center max-w-2xl mx-auto mt-8">
      <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />
      <div className="relative z-10">
        <i className="fas fa-box-open text-4xl text-white/20 mb-4" />
        <h3 className="text-white text-xl font-medium">Заказ не найден</h3>
        <p className="text-zinc-500 mt-2">Проверьте номер заказа и попробуйте снова</p>
      </div>
    </div>
  );

  const renderOrderCard = () => {
    if (!order) return null;

    const statusColor = getStatusColor(order.status);
    const statusTextColor = getStatusTextColor(order.status);
    const statusBg = getStatusBg(order.status);
    const timeline = getTimelineStatus(order.status);

    return (
      <div className="relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-white/[0.08] bg-[#0b0b0b] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] p-5 md:p-8 max-w-2xl mx-auto mt-8 transition-all duration-500 animate-fadeIn">
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-8">
            <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full ${statusBg}`}>
              <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`} />
              <span className={`${statusTextColor} font-semibold text-sm`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-zinc-500 text-xs uppercase tracking-wider">Номер</p>
              <p className="text-white text-lg font-semibold mt-1 font-mono">#{order.id}</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-zinc-500 text-xs uppercase tracking-wider">Сумма</p>
              <p className="text-white text-lg font-semibold mt-1">{order.total.toLocaleString()} ₽</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-zinc-500 text-xs uppercase tracking-wider">Статус</p>
              <p className={`text-lg font-semibold mt-1 ${statusTextColor}`}>
                {getStatusText(order.status)}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-5 mb-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                <i className="fas fa-location-dot text-zinc-500 text-sm" />
              </div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider">Адрес доставки</p>
                <p className="text-white text-sm mt-1">{order.address}</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/[0.06]">
            <div className="flex flex-col md:flex-row gap-6 md:gap-0">
              {timeline.map((step, index) => {
                const isActive = step.isActive;

                return (
                  <div key={step.key} className="flex md:flex-col items-center gap-4 flex-1 relative">
                    {!step.isLast && (
                      <div className={`hidden md:block w-full h-px mx-2 transition-all duration-500 ${isActive ? 'bg-white/20' : 'bg-white/5'}`} />
                    )}
                    {!step.isLast && (
                      <div className={`md:hidden w-px h-8 transition-all duration-500 ${isActive ? 'bg-white/20' : 'bg-white/5'}`} />
                    )}

                    <div className="flex flex-col items-center md:items-center gap-2">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500
                        ${isActive
                          ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                          : 'bg-white/[0.03] border border-white/10'
                        }
                      `}>
                        {isActive ? (
                          <i className={`fas ${step.icon} text-sm`} />
                        ) : (
                          <i className={`fas ${step.icon} text-white/20 text-sm`} />
                        )}
                      </div>
                      <span className={`text-xs transition-all duration-500 ${isActive ? 'text-white font-medium' : 'text-zinc-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="relative overflow-hidden min-h-screen bg-[#050505] pt-20">
      {renderBackground()}

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 relative z-10">
        {renderHero()}
        {renderSearch()}

        {!isLoading && order === null && orderNumber && renderNotFound()}
        {!isLoading && order && renderOrderCard()}
      </div>
    </main>
  );
};

export default TrackingPage;