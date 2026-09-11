import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface Promocode {
  id: number;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

const AdminPromocodes = () => {
  const [promocodes, setPromocodes] = useState<Promocode[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromocode, setEditingPromocode] = useState<Promocode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    type: 'percentage',
    minAmount: '',
    maxDiscount: '',
    expiresAt: '',
    usageLimit: '',
    isActive: true
  });

  useEffect(() => {
    loadPromocodes();
  }, []);

  const loadPromocodes = () => {
    const saved = localStorage.getItem('misat_promocodes');
    if (saved) {
      setPromocodes(JSON.parse(saved));
    }
  };

  const savePromocodes = (data: Promocode[]) => {
    localStorage.setItem('misat_promocodes', JSON.stringify(data));
    setPromocodes(data);
  };

  const handleSave = () => {
    if (!formData.code.trim()) {
      toast.error('Введите код промокода');
      return;
    }
    if (!formData.discount || Number(formData.discount) <= 0) {
      toast.error('Введите корректную скидку');
      return;
    }

    if (editingPromocode) {
      const updated = promocodes.map(p =>
        p.id === editingPromocode.id
          ? {
              ...p,
              code: formData.code.toUpperCase(),
              discount: Number(formData.discount),
              type: formData.type as 'percentage' | 'fixed',
              minAmount: Number(formData.minAmount) || 0,
              maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
              expiresAt: formData.expiresAt,
              usageLimit: Number(formData.usageLimit) || 0,
              isActive: formData.isActive
            }
          : p
      );
      savePromocodes(updated);
      toast.success('Промокод обновлён');
    } else {
      const newPromocode: Promocode = {
        id: Date.now(),
        code: formData.code.toUpperCase(),
        discount: Number(formData.discount),
        type: formData.type as 'percentage' | 'fixed',
        minAmount: Number(formData.minAmount) || 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
        expiresAt: formData.expiresAt,
        usageLimit: Number(formData.usageLimit) || 0,
        usedCount: 0,
        isActive: true
      };
      savePromocodes([...promocodes, newPromocode]);
      toast.success('Промокод добавлен');
    }
    resetForm();
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm('Удалить промокод?')) {
      savePromocodes(promocodes.filter(p => p.id !== id));
      toast.success('Промокод удалён');
    }
  };

  const handleToggleStatus = (id: number) => {
    const updated = promocodes.map(p =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    );
    savePromocodes(updated);
    toast.success('Статус изменён');
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discount: '',
      type: 'percentage',
      minAmount: '',
      maxDiscount: '',
      expiresAt: '',
      usageLimit: '',
      isActive: true
    });
    setEditingPromocode(null);
  };

  const openEditModal = (promocode: Promocode) => {
    setEditingPromocode(promocode);
    setFormData({
      code: promocode.code,
      discount: promocode.discount.toString(),
      type: promocode.type,
      minAmount: promocode.minAmount.toString(),
      maxDiscount: promocode.maxDiscount?.toString() || '',
      expiresAt: promocode.expiresAt,
      usageLimit: promocode.usageLimit.toString(),
      isActive: promocode.isActive
    });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black">Управление промокодами</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          + Добавить промокод
        </button>
      </div>

      {promocodes.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <i className="fas fa-tag text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Промокодов пока нет</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left">
                <th className="px-6 py-4 text-sm font-black">Код</th>
                <th className="px-6 py-4 text-sm font-black">Скидка</th>
                <th className="px-6 py-4 text-sm font-black">Мин. сумма</th>
                <th className="px-6 py-4 text-sm font-black">Лимит</th>
                <th className="px-6 py-4 text-sm font-black">Использовано</th>
                <th className="px-6 py-4 text-sm font-black">Статус</th>
                <th className="px-6 py-4 text-sm font-black">Действия</th>
              </tr>
            </thead>
            <tbody>
              {promocodes.map(promo => (
                <tr key={promo.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-black">{promo.code}</td>
                  <td className="px-6 py-4">
                    {promo.discount}{promo.type === 'percentage' ? '%' : ' ₽'}
                  </td>
                  <td className="px-6 py-4">{promo.minAmount.toLocaleString()} ₽</td>
                  <td className="px-6 py-4">{promo.usageLimit || '∞'}</td>
                  <td className="px-6 py-4">{promo.usedCount}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(promo.id)}
                      className={`px-3 py-1 rounded-full text-xs font-black ${
                        promo.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {promo.isActive ? 'Активен' : 'Неактивен'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEditModal(promo)} className="text-blue-500 mr-3">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={() => handleDelete(promo.id)} className="text-red-500">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-black mb-4">{editingPromocode ? 'Редактировать' : 'Добавить'} промокод</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Код промокода"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border rounded-lg uppercase"
              />
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder="Скидка"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">₽</option>
                </select>
              </div>
              <input
                type="number"
                placeholder="Минимальная сумма заказа"
                value={formData.minAmount}
                onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Максимальная скидка (для %)"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="datetime-local"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Лимит использований"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
              <button
                onClick={handleSave}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
              >
                {editingPromocode ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromocodes;