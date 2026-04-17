import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MyListingsPage = () => {
  const [listings, setListings] = useState([
    { id: 1, title: 'Кожаная куртка MISAT', price: 12990, status: 'active', views: 45, likes: 12, date: '2025-01-15' },
    { id: 2, title: 'Худи Oversized', price: 5490, status: 'pending', views: 0, likes: 0, date: '2025-01-16' },
    { id: 3, title: 'Кроссовки Air Max', price: 8990, status: 'sold', views: 128, likes: 34, date: '2025-01-10' },
  ]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Активно</span>;
      case 'pending': return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">На модерации</span>;
      case 'sold': return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Продано</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light">Мои <span className="font-bold">объявления</span></h1>
          <Link to="/sell" className="bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800 transition">
            + Новое объявление
          </Link>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left">
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Товар</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Цена</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Статус</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Просмотры</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Лайки</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(item => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.date}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">{item.price.toLocaleString()} ₽</td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4 text-gray-600">{item.views}</td>
                  <td className="px-6 py-4 text-gray-600">{item.likes}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-gray-400 hover:text-black transition">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-gray-400 hover:text-red-500 transition">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {listings.length === 0 && (
          <div className="text-center py-20">
            <i className="fas fa-store text-5xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 mb-4">У вас пока нет объявлений</p>
            <Link to="/sell" className="btn-primary">Разместить объявление</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListingsPage;