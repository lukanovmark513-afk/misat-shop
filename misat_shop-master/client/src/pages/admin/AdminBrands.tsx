import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { brandsAPI } from '../../services/api';

interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active?: boolean;
}

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

// ============================================
// ПРЕДУСТАНОВЛЕННЫЕ БРЕНДЫ (из фильтров)
// ============================================
const PRESET_BRANDS = [
  // Европейские и американские
  { name: 'GUCCI', slug: 'gucci', description: 'Итальянский дом моды' },
  { name: 'PRADA', slug: 'prada', description: 'Итальянский люксовый бренд' },
  { name: 'BALENCIAGA', slug: 'balenciaga', description: 'Французский дом моды' },
  { name: 'LOUIS VUITTON', slug: 'louis-vuitton', description: 'Французский люксовый бренд' },
  { name: 'DIOR', slug: 'dior', description: 'Французский дом моды' },
  { name: 'VERSACE', slug: 'versace', description: 'Итальянский дом моды' },
  { name: 'BURBERRY', slug: 'burberry', description: 'Британский люксовый бренд' },
  { name: 'MONCLER', slug: 'moncler', description: 'Итальянский бренд верхней одежды' },
  { name: 'STONE ISLAND', slug: 'stone-island', description: 'Итальянский бренд' },
  { name: 'OFF-WHITE', slug: 'off-white', description: 'Американский стритвир бренд' },
  { name: 'VETEMENTS', slug: 'vetements', description: 'Французский бренд' },
  { name: 'MAISON MARGIELA', slug: 'maison-margiela', description: 'Французский дом моды' },
  { name: 'RICK OWENS', slug: 'rick-owens', description: 'Американский дизайнер' },
  { name: 'JIL SANDER', slug: 'jil-sander', description: 'Немецкий минималистичный бренд' },
  { name: 'ACNE STUDIOS', slug: 'acne-studios', description: 'Шведский бренд' },
  { name: 'LOEWE', slug: 'loewe', description: 'Испанский люксовый бренд' },
  { name: 'BOTTEGA VENETA', slug: 'bottega-veneta', description: 'Итальянский бренд' },
  { name: 'CELINE', slug: 'celine', description: 'Французский бренд' },
  { name: 'FENDI', slug: 'fendi', description: 'Итальянский бренд' },
  { name: 'GIVENCHY', slug: 'givenchy', description: 'Французский бренд' },
  // Спортивные
  { name: 'NIKE', slug: 'nike', description: 'Американский спортивный бренд' },
  { name: 'ADIDAS', slug: 'adidas', description: 'Немецкий спортивный бренд' },
  { name: 'YEEZY', slug: 'yeezy', description: 'Бренд Канье Уэста' },
  { name: 'NEW BALANCE', slug: 'new-balance', description: 'Американский спортивный бренд' },
  { name: 'ASICS', slug: 'asics', description: 'Японский спортивный бренд' },
  { name: 'SALOMON', slug: 'salomon', description: 'Французский outdoor бренд' },
  { name: 'ARC\'TERYX', slug: 'arcteryx', description: 'Канадский outdoor бренд' },
  { name: 'PATAGONIA', slug: 'patagonia', description: 'Американский outdoor бренд' },
  { name: 'THE NORTH FACE', slug: 'tnf', description: 'Американский outdoor бренд' },
  // Стритвир
  { name: 'CARHARTT WIP', slug: 'carhartt', description: 'Американский workwear бренд' },
  { name: 'STUSSY', slug: 'stussy', description: 'Американский стритвир бренд' },
  { name: 'SUPREME', slug: 'supreme', description: 'Американский стритвир бренд' },
  { name: 'PALACE', slug: 'palace', description: 'Британский скейт бренд' },
  { name: 'RAF SIMONS', slug: 'raf-simons', description: 'Бельгийский дизайнер' },
  // Японские бренды
  { name: 'COMME DES GARÇONS', slug: 'cdg', description: 'Японский авангардный бренд' },
  { name: 'ISSEY MIYAKE', slug: 'issey-miyake', description: 'Японский дизайнер' },
  { name: 'YOHJI YAMAMOTO', slug: 'yohji-yamamoto', description: 'Японский дизайнер' },
  { name: 'UNDERCOVER', slug: 'undercover', description: 'Японский бренд' },
  { name: 'NEIGHBORHOOD', slug: 'neighborhood', description: 'Японский бренд' },
  { name: 'WTAPS', slug: 'wtaps', description: 'Японский бренд' },
  { name: 'VISVIM', slug: 'visvim', description: 'Японский бренд' },
  { name: 'KAPITAL', slug: 'kapital', description: 'Японский бренд' },
  { name: 'BEAMS', slug: 'beams', description: 'Японский селект-магазин' },
  { name: 'UNITED ARROWS', slug: 'united-arrows', description: 'Японский селект-магазин' },
  { name: 'NANAMICA', slug: 'nanamica', description: 'Японский outdoor бренд' },
  { name: 'WHITE MOUNTAINEERING', slug: 'white-mountaineering', description: 'Японский outdoor бренд' },
  { name: 'SNOW PEAK', slug: 'snow-peak', description: 'Японский outdoor бренд' },
  { name: 'PORTER', slug: 'porter', description: 'Японский бренд сумок' },
  { name: 'EVISU', slug: 'evisu', description: 'Японский деним бренд' },
  { name: 'SOPHNET', slug: 'sophnet', description: 'Японский бренд' },
  { name: 'NONNATIVE', slug: 'nonnative', description: 'Японский бренд' },
  { name: 'SACAI', slug: 'sacai', description: 'Японский бренд' },
  { name: 'JUNYA WATANABE', slug: 'junya-watanabe', description: 'Японский дизайнер' },
  { name: 'NUMBER (N)INE', slug: 'number-nine', description: 'Японский бренд' },
  { name: 'MASTERMIND JAPAN', slug: 'mastermind', description: 'Японский бренд' },
  { name: 'FRAGMENT DESIGN', slug: 'fragment', description: 'Японский бренд' },
  { name: 'BAPE', slug: 'bape', description: 'Японский стритвир бренд' },
  { name: 'HYSTERIC GLAMOUR', slug: 'hysteric-glamour', description: 'Японский бренд' },
  { name: 'TAKAHIROMIYASHITA THESOLOIST', slug: 'takahiromiyashita', description: 'Японский бренд' },
];

const AdminBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [showPresetList, setShowPresetList] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    is_active: true
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const response = await brandsAPI.getAll();
      const sorted = (response.data || []).sort((a: Brand, b: Brand) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setBrands(sorted);
    } catch (error) {
      toast.error('Ошибка загрузки брендов');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        is_active: formData.is_active ? 1 : 0
      };

      if (editingBrand) {
        await brandsAPI.update(editingBrand.id, data);
        toast.success('Бренд обновлён! ✅', {
          style: { background: COLORS.bgCard, color: COLORS.ink, border: `1px solid ${COLORS.ruleStrong}`, borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace' }
        });
      } else {
        await brandsAPI.create(data);
        toast.success('Бренд создан! ✅', {
          style: { background: COLORS.bgCard, color: COLORS.ink, border: `1px solid ${COLORS.ruleStrong}`, borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace' }
        });
      }

      setIsModalOpen(false);
      setEditingBrand(null);
      setFormData({ name: '', description: '', slug: '', is_active: true });
      loadBrands();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Ошибка при сохранении');
    }
  };

  const handleAddPreset = async (preset: { name: string; slug: string; description: string }) => {
    try {
      // Проверяем, существует ли уже такой бренд
      const existing = brands.find(b => b.slug === preset.slug || b.name.toLowerCase() === preset.name.toLowerCase());
      if (existing) {
        toast.error(`Бренд ${preset.name} уже существует`);
        return;
      }

      await brandsAPI.create({
        name: preset.name,
        description: preset.description,
        slug: preset.slug,
        is_active: 1
      });
      toast.success(`${preset.name} добавлен! ✅`, {
        style: { background: COLORS.bgCard, color: COLORS.ink, border: `1px solid ${COLORS.ruleStrong}`, borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace' }
      });
      loadBrands();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Ошибка при добавлении');
    }
  };

  const handleAddAllPresets = async () => {
    let addedCount = 0;
    let skippedCount = 0;

    for (const preset of PRESET_BRANDS) {
      const existing = brands.find(b => b.slug === preset.slug || b.name.toLowerCase() === preset.name.toLowerCase());
      if (existing) {
        skippedCount++;
        continue;
      }

      try {
        await brandsAPI.create({
          name: preset.name,
          description: preset.description,
          slug: preset.slug,
          is_active: 1
        });
        addedCount++;
      } catch (error) {
        // Пропускаем ошибки
      }
    }

    if (addedCount > 0) {
      toast.success(`Добавлено брендов: ${addedCount}${skippedCount > 0 ? `, пропущено: ${skippedCount}` : ''}`, {
        style: { background: COLORS.bgCard, color: COLORS.ink, border: `1px solid ${COLORS.ruleStrong}`, borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace' }
      });
      loadBrands();
    } else {
      toast('Все бренды уже добавлены', {
        style: { background: COLORS.bgCard, color: COLORS.inkSoft, border: `1px solid ${COLORS.rule}`, borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace' }
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить бренд?')) return;
    try {
      await brandsAPI.delete(id);
      toast.success('Бренд удалён');
      loadBrands();
    } catch (error) {
      toast.error('Ошибка удаления');
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      slug: brand.slug || '',
      is_active: brand.is_active === 1 || brand.is_active === true
    });
    setIsModalOpen(true);
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.slug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" style={{ backgroundColor: COLORS.bg }}>
        <div className="text-center">
          <div className="relative w-10 h-10 mx-auto">
            <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${COLORS.rule}` }} />
            <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${COLORS.stamp}`, borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
          </div>
          <p className="text-[10px] tracking-[0.3em] mt-4" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
            ЗАГРУЗКА БРЕНДОВ
          </p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6" style={{ backgroundColor: COLORS.bg, minHeight: '100vh', color: COLORS.ink }}>

      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px" style={{ backgroundColor: COLORS.stamp }}></div>
            <span className="text-[10px] tracking-[0.3em]" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
              УПРАВЛЕНИЕ
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter" style={{ fontFamily: 'Anton, sans-serif', color: COLORS.ink }}>
            БРЕНДЫ
          </h1>
          <p className="text-xs mt-1" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
            {brands.length} БРЕНДОВ
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPresetList(!showPresetList)}
            className="px-4 py-2.5 rounded text-sm font-bold transition flex items-center gap-2"
            style={{
              backgroundColor: 'transparent',
              color: COLORS.stamp,
              fontFamily: 'JetBrains Mono, monospace',
              border: `1px solid ${COLORS.stamp}40`,
            }}
          >
            <i className="fas fa-list text-xs"></i> ПРЕДУСТАНОВЛЕННЫЕ
          </button>
          <button
            onClick={() => { setIsModalOpen(true); setEditingBrand(null); setFormData({ name: '', description: '', slug: '', is_active: true }); }}
            className="px-5 py-2.5 rounded text-sm font-bold transition flex items-center gap-2"
            style={{
              backgroundColor: COLORS.ink,
              color: COLORS.bg,
              fontFamily: 'JetBrains Mono, monospace',
              border: `1px solid ${COLORS.ink}`,
            }}
          >
            <span className="text-lg">+</span> ДОБАВИТЬ
          </button>
        </div>
      </div>

      {/* Список предустановленных брендов */}
      {showPresetList && (
        <div className="mb-6 p-4 rounded" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.ruleStrong}` }}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.ink }}>
              📦 ПРЕДУСТАНОВЛЕННЫЕ БРЕНДЫ ({PRESET_BRANDS.length})
            </h3>
            <button
              onClick={handleAddAllPresets}
              className="px-3 py-1.5 rounded text-[10px] font-bold transition"
              style={{ backgroundColor: COLORS.stamp, color: COLORS.bg, fontFamily: 'JetBrains Mono, monospace' }}
            >
              ДОБАВИТЬ ВСЕ
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-80 overflow-y-auto scrollbar-hide">
            {PRESET_BRANDS.map((preset) => {
              const exists = brands.some(b => b.slug === preset.slug || b.name.toLowerCase() === preset.name.toLowerCase());
              return (
                <div
                  key={preset.slug}
                  className="flex items-center justify-between p-2 rounded"
                  style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}` }}
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold truncate" style={{ color: exists ? COLORS.inkFaint : COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
                      {preset.name}
                    </p>
                    <p className="text-[8px] truncate" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                      {preset.description}
                    </p>
                  </div>
                  {exists ? (
                    <span className="text-[8px] px-2 py-0.5 rounded" style={{ backgroundColor: `${COLORS.olive}20`, color: COLORS.olive, fontFamily: 'JetBrains Mono, monospace' }}>
                      ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAddPreset(preset)}
                      className="text-[10px] px-2 py-1 rounded transition"
                      style={{ backgroundColor: 'transparent', color: COLORS.stamp, border: `1px solid ${COLORS.stamp}40`, fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      +
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Поиск */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Поиск бренда..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded"
          style={{
            backgroundColor: COLORS.bgCard,
            border: `1px solid ${COLORS.rule}`,
            color: COLORS.ink,
            fontFamily: 'JetBrains Mono, monospace',
            outline: 'none',
          }}
        />
        <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: COLORS.inkFaint }}></i>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: COLORS.inkFaint }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Список брендов */}
      <div className="rounded overflow-hidden" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
        {filteredBrands.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 opacity-30">🏷️</div>
            <p className="text-sm" style={{ color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace' }}>
              {searchQuery ? 'НИЧЕГО НЕ НАЙДЕНО' : 'НЕТ БРЕНДОВ'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowPresetList(true)}
                className="mt-3 px-4 py-2 rounded text-[10px]"
                style={{ backgroundColor: COLORS.stamp, color: COLORS.bg, fontFamily: 'JetBrains Mono, monospace' }}
              >
                ПОКАЗАТЬ ПРЕДУСТАНОВЛЕННЫЕ
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: COLORS.bgElevated, borderBottom: `1px solid ${COLORS.rule}` }}>
                <tr className="text-left text-xs font-bold tracking-wider uppercase">
                  <th className="px-4 py-3" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Название</th>
                  <th className="px-4 py-3 hidden md:table-cell" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Описание</th>
                  <th className="px-4 py-3 hidden md:table-cell" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Slug</th>
                  <th className="px-4 py-3" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Статус</th>
                  <th className="px-4 py-3 text-right" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredBrands.map((brand) => (
                  <tr key={brand.id} style={{ borderBottom: `1px solid ${COLORS.rule}` }} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 font-medium" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>{brand.name}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm" style={{ color: COLORS.inkSoft }}>
                      {brand.description || <span style={{ color: COLORS.inkFaint }}>—</span>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-sm" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                      {brand.slug || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2.5 py-1 rounded-full" style={{
                        backgroundColor: brand.is_active !== false ? `${COLORS.olive}20` : `${COLORS.inkFaint}20`,
                        color: brand.is_active !== false ? COLORS.olive : COLORS.inkFaint,
                        fontFamily: 'JetBrains Mono, monospace',
                        border: `1px solid ${brand.is_active !== false ? `${COLORS.olive}40` : COLORS.rule}`,
                      }}>
                        {brand.is_active !== false ? '● АКТИВЕН' : '○ НЕАКТИВЕН'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(brand)} className="transition mr-3" style={{ color: COLORS.inkFaint }}>
                        <i className="fas fa-edit text-sm"></i>
                      </button>
                      <button onClick={() => handleDelete(brand.id)} className="transition" style={{ color: COLORS.inkFaint }}>
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 backdrop-blur-sm z-40" style={{ backgroundColor: 'rgba(10, 10, 11, 0.9)' }} onClick={() => setIsModalOpen(false)} />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 z-50"
            style={{
              backgroundColor: COLORS.bgCard,
              borderRadius: '4px',
              border: `1px solid ${COLORS.ruleStrong}`,
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="flex justify-between items-center mb-4 pb-3" style={{ borderBottom: `1px solid ${COLORS.rule}` }}>
              <div>
                <span className="text-[9px] tracking-[0.2em] block mb-1" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
                  {editingBrand ? 'РЕДАКТИРОВАНИЕ' : 'СОЗДАНИЕ'}
                </span>
                <h2 className="text-xl font-black" style={{ fontFamily: 'Anton, sans-serif', color: COLORS.ink }}>
                  {editingBrand ? 'ИЗМЕНИТЬ БРЕНД' : 'НОВЫЙ БРЕНД'}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.bg, color: COLORS.inkFaint, border: `1px solid ${COLORS.rule}` }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold block mb-1.5 tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  НАЗВАНИЕ *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Введите название бренда"
                  className="w-full px-4 py-2.5 text-sm rounded"
                  style={{
                    backgroundColor: COLORS.bg,
                    border: `1px solid ${COLORS.rule}`,
                    color: COLORS.ink,
                    fontFamily: 'JetBrains Mono, monospace',
                    outline: 'none',
                  }}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold block mb-1.5 tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  ОПИСАНИЕ
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Краткое описание бренда"
                  className="w-full px-4 py-2.5 text-sm rounded resize-none h-20"
                  style={{
                    backgroundColor: COLORS.bg,
                    border: `1px solid ${COLORS.rule}`,
                    color: COLORS.ink,
                    fontFamily: 'JetBrains Mono, monospace',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label className="text-[10px] font-bold block mb-1.5 tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  SLUG
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="авто-генерация из названия"
                  className="w-full px-4 py-2.5 text-sm rounded"
                  style={{
                    backgroundColor: COLORS.bg,
                    border: `1px solid ${COLORS.rule}`,
                    color: COLORS.ink,
                    fontFamily: 'JetBrains Mono, monospace',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: formData.is_active ? COLORS.olive : COLORS.rule, backgroundColor: formData.is_active ? COLORS.olive : 'transparent' }}>
                    {formData.is_active && <i className="fas fa-check text-[8px]" style={{ color: COLORS.bg }} />}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="hidden"
                  />
                  <span className="text-sm" style={{ color: formData.is_active ? COLORS.ink : COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    АКТИВЕН
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-4" style={{ borderTop: `1px solid ${COLORS.rule}` }}>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded text-sm font-bold transition"
                  style={{ backgroundColor: COLORS.ink, color: COLORS.bg, fontFamily: 'JetBrains Mono, monospace', border: `1px solid ${COLORS.ink}` }}
                >
                  {editingBrand ? '💾 ОБНОВИТЬ' : '✅ СОЗДАТЬ'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded text-sm font-bold transition"
                  style={{ backgroundColor: 'transparent', color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace', border: `1px solid ${COLORS.rule}` }}
                >
                  ❌ ОТМЕНА
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AdminBrands;