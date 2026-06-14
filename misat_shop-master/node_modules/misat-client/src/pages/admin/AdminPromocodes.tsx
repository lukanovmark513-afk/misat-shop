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
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">УПРАВЛЕНИЕ ПРОМОКОДАМИ</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-0.5 bg-white/40"></div>
              <p className="text-gray-400 text-sm">Всего промокодов: <span className="text-white font-bold">{promocodes.length}</span></p>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-bold text-sm tracking-wider hover:bg-white/90 transition"
          >
            <i className="fas fa-plus text-xs"></i> ДОБАВИТЬ ПРОМОКОД
          </button>
        </div>
      </div>

      {promocodes.length === 0 ? (
        <div className="bg-white/5 rounded-2xl p-16 text-center border border-white/10">
          <div className="w-20 h-20 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-4">
            <i className="fas fa-tag text-white/40 text-3xl"></i>
          </div>
          <p className="text-gray-400">Промокодов пока нет</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/10 border-b border-white/10">
                <tr className="text-left">
                  <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">КОД</th>
                  <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">СКИДКА</th>
                  <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">МИН. СУММА</th>
                  <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">ЛИМИТ</th>
                  <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">ИСПОЛЬЗОВАНО</th>
                  <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">СТАТУС</th>
                  <th className="px-5 py-3 text-white/40 text-[10px] font-bold tracking-wider">ДЕЙСТВИЯ</th>
                </tr>
              </thead>
              <tbody>
                {promocodes.map(promo => (
                  <tr key={promo.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-5 py-4 font-mono text-white font-black text-sm">{promo.code}</td>
                    <td className="px-5 py-4 text-white">
                      {promo.discount}{promo.type === 'percentage' ? '%' : ' ₽'}
                    </td>
                    <td className="px-5 py-4 text-gray-300">{promo.minAmount.toLocaleString()} ₽</td>
                    <td className="px-5 py-4 text-gray-300">{promo.usageLimit || '∞'}</td>
                    <td className="px-5 py-4 text-gray-300">{promo.usedCount}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(promo.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          promo.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-white/10 text-gray-400'
                        }`}
                      >
                        {promo.isActive ? 'Активен' : 'Неактивен'}
                      </button>
                     </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(promo)} className="text-blue-400 hover:text-blue-300 transition">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button onClick={() => handleDelete(promo.id)} className="text-red-400 hover:text-red-300 transition">
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
      )}

      {/* Модальное окно - ТЕМНОЕ */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/80 z-40" onClick={() => setIsModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0a0a0a] rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden">
            <div className="p-6">
              <h2 className="text-white font-black text-xl mb-5">{editingPromocode ? 'Редактировать' : 'Добавить'} промокод</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">КОД ПРОМОКОДА</label>
                  <input
                    type="text"
                    placeholder="Введите код"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition uppercase"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">СКИДКА</label>
                    <input
                      type="number"
                      placeholder="Скидка"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
                    />
                  </div>
                  <div className="w-28">
                    <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">ТИП</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-white/30 focus:outline-none transition"
                    >
                      <option value="percentage" className="bg-[#0a0a0a]">%</option>
                      <option value="fixed" className="bg-[#0a0a0a]">₽</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">МИНИМАЛЬНАЯ СУММА</label>
                  <input
                    type="number"
                    placeholder="Минимальная сумма заказа"
                    value={formData.minAmount}
                    onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">МАКСИМАЛЬНАЯ СКИДКА</label>
                  <input
                    type="number"
                    placeholder="Для % скидки"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">ДАТА ИСТЕЧЕНИЯ</label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:border-white/30 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-white/40 text-[10px] font-bold block mb-1 tracking-wider">ЛИМИТ ИСПОЛЬЗОВАНИЙ</label>
                  <input
                    type="number"
                    placeholder="0 - без лимита"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="w-full bg-white text-black py-3 rounded-xl font-black text-sm tracking-wider hover:bg-white/90 transition mt-2"
                >
                  {editingPromocode ? 'СОХРАНИТЬ' : 'ДОБАВИТЬ'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPromocodes;