import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyListingsPage = () => {
  const [listings, setListings] = useState([
    { id: 1, title: 'Кожаная куртка MISAT', price: 12990, status: 'active', views: 45, likes: 12, date: '2025-01-15', image: 'https://placehold.co/80x80/1a1a1a/666666' },
    { id: 2, title: 'Худи Oversized', price: 5490, status: 'pending', views: 0, likes: 0, date: '2025-01-16', image: 'https://placehold.co/80x80/1a1a1a/666666' },
    { id: 3, title: 'Кроссовки Air Max', price: 8990, status: 'sold', views: 128, likes: 34, date: '2025-01-10', image: 'https://placehold.co/80x80/1a1a1a/666666' },
  ]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">Активно</span>;
      case 'pending':
        return <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">На модерации</span>;
      case 'sold':
        return <span className="bg-gray-500/20 text-gray-400 border border-gray-500/30 px-2.5 py-1 rounded-full text-[10px] font-bold">Продано</span>;
      default:
        return null;
    }
  };

  const handleDelete = (id: number, title: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить объявление "${title}"?`)) {
      setListings(listings.filter(item => item.id !== id));
      toast.success('Объявление удалено');
    }
  };

  const handleEdit = (id: number) => {
    toast.success('Редактирование объявления');
    // navigate(`/edit-listing/${id}`);
  };

  if (listings.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-20">
        <div className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <i className="fas fa-store text-white/40 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">У ВАС ПОКА НЕТ ОБЪЯВЛЕНИЙ</h2>
            <p className="text-gray-400 text-sm mb-8">Разместите первое объявление о продаже</p>
            <Link to="/sell" className="inline-block bg-white text-black px-8 py-3 font-bold text-sm tracking-wider hover:bg-white/90 transition rounded-xl">
              РАЗМЕСТИТЬ ОБЪЯВЛЕНИЕ
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
              alt="My Listings"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-8 px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-0.5 bg-white/40"></div>
                <span className="text-gray-400 text-[10px] tracking-[0.3em]">ПРОДАВЦАМ</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                МОИ ОБЪЯВЛЕНИЯ
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                Всего объявлений: <span className="text-white font-bold">{listings.length}</span>
              </p>
            </div>
            <Link to="/sell" className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider hover:bg-white/90 transition">
              <i className="fas fa-plus text-xs"></i> НОВОЕ ОБЪЯВЛЕНИЕ
            </Link>
          </div>
        </div>

        {/* Таблица объявлений */}
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr className="text-left">
                  <th className="px-5 py-4 text-white/40 text-[10px] font-bold tracking-wider">ТОВАР</th>
                  <th className="px-5 py-4 text-white/40 text-[10px] font-bold tracking-wider">ЦЕНА</th>
                  <th className="px-5 py-4 text-white/40 text-[10px] font-bold tracking-wider">СТАТУС</th>
                  <th className="px-5 py-4 text-white/40 text-[10px] font-bold tracking-wider">ПРОСМОТРЫ</th>
                  <th className="px-5 py-4 text-white/40 text-[10px] font-bold tracking-wider">ЛАЙКИ</th>
                  <th className="px-5 py-4 text-white/40 text-[10px] font-bold tracking-wider">ДЕЙСТВИЯ</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(item => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-all duration-200">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{item.title}</p>
                          <p className="text-gray-500 text-[10px] mt-0.5">{item.date}</p>
                        </div>
                      </div>
                     </td>
                    <td className="px-5 py-4">
                      <span className="text-white font-bold text-sm">{item.price.toLocaleString()} ₽</span>
                     </td>
                    <td className="px-5 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <i className="fas fa-eye text-[10px]"></i>
                        <span>{item.views}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <i className="fas fa-heart text-[10px]"></i>
                        <span>{item.likes}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="text-gray-500 hover:text-white transition-all duration-200 hover:scale-110"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="text-gray-500 hover:text-red-400 transition-all duration-200 hover:scale-110"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-check-circle text-emerald-400 text-sm"></i>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-bold tracking-wider">АКТИВНЫЕ</p>
                <p className="text-white font-bold text-xl">{listings.filter(i => i.status === 'active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-clock text-yellow-400 text-sm"></i>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-bold tracking-wider">НА МОДЕРАЦИИ</p>
                <p className="text-white font-bold text-xl">{listings.filter(i => i.status === 'pending').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-500/20 rounded-xl flex items-center justify-center">
                <i className="fas fa-tag text-gray-400 text-sm"></i>
              </div>
              <div>
                <p className="text-gray-400 text-[10px] font-bold tracking-wider">ПРОДАНО</p>
                <p className="text-white font-bold text-xl">{listings.filter(i => i.status === 'sold').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyListingsPage;