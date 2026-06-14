import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { categoriesAPI } from '../../services/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  products?: number;
  status?: string;
  is_active?: boolean;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [categoryImage, setCategoryImage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Компрессия изображения
  const compressImage = (file: File, maxSizeMB: number = 0.3): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxWidth = 300;
          const maxHeight = 300;

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          let quality = 0.5;
          let result = canvas.toDataURL('image/jpeg', quality);

          while (result.length > maxSizeMB * 1024 * 1024 && quality > 0.2) {
            quality -= 0.1;
            result = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(result);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Файл слишком большой. Максимум 2MB');
      return;
    }

    setIsUploading(true);
    toast.loading('Обработка изображения...', { id: 'categoryUpload' });

    try {
      const compressed = await compressImage(file, 0.3);
      setCategoryImage(compressed);
      toast.success('Изображение загружено!', { id: 'categoryUpload' });
    } catch (error) {
      toast.error('Ошибка загрузки изображения', { id: 'categoryUpload' });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setCategoryImage('');
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
      toast.error('Ошибка загрузки категорий');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Введите название категории');
      return;
    }

    const slug = newCategory.toLowerCase()
      .replace(/[^а-яёa-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    try {
      await categoriesAPI.create({
        name: newCategory,
        slug: slug,
        image: categoryImage || null,
        is_active: true
      });

      toast.success('Категория добавлена');
      setNewCategory('');
      setCategoryImage('');
      loadCategories();
    } catch (error: any) {
      console.error('Ошибка добавления:', error);
      toast.error(error.response?.data?.error || 'Ошибка добавления категории');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить категорию? Все товары в этой категории останутся без категории.')) {
      return;
    }

    try {
      await categoriesAPI.delete(id);
      toast.success('Категория удалена');
      loadCategories();
    } catch (error: any) {
      console.error('Ошибка удаления:', error);
      toast.error(error.response?.data?.error || 'Ошибка удаления категории');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setCategoryImage(category.image || '');
  };

  const handleUpdate = async () => {
    if (!editingCategory) return;
    if (!editName.trim()) {
      toast.error('Введите название категории');
      return;
    }

    const slug = editName.toLowerCase()
      .replace(/[^а-яёa-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    try {
      await categoriesAPI.update(editingCategory.id, {
        name: editName,
        slug: slug,
        image: categoryImage || null
      });

      toast.success('Категория обновлена');
      setEditingCategory(null);
      setEditName('');
      setCategoryImage('');
      loadCategories();
    } catch (error: any) {
      console.error('Ошибка обновления:', error);
      toast.error(error.response?.data?.error || 'Ошибка обновления категории');
    }
  };

  const handleToggleStatus = async (category: Category) => {
    try {
      await categoriesAPI.update(category.id, {
        is_active: !category.is_active
      });
      toast.success(`Категория ${category.is_active ? 'деактивирована' : 'активирована'}`);
      loadCategories();
    } catch (error: any) {
      console.error('Ошибка изменения статуса:', error);
      toast.error('Ошибка изменения статуса');
    }
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 text-[10px] tracking-wider mt-3 animate-pulse">ЗАГРУЗКА</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-px bg-white/40"></div>
          <span className="text-gray-400 text-[8px] md:text-[10px] tracking-[0.2em]">АДМИН</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">КАТЕГОРИИ</h1>
        </div>
        <p className="text-gray-500 text-xs mt-1">
          Всего категорий: <span className="text-white font-bold">{categories.length}</span>
        </p>
      </div>

      {/* Форма добавления категории */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-5 mb-6">
        <h2 className="text-white font-bold text-sm mb-3">НОВАЯ КАТЕГОРИЯ</h2>

        {/* Загрузка фото для категории */}
        <div className="mb-4">
          <label className="text-gray-500 text-[9px] font-bold block mb-1 tracking-wider">ФОТО КАТЕГОРИИ</label>
          <div className="flex items-center gap-3">
            {categoryImage ? (
              <div className="relative w-16 h-16 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                <img src={categoryImage} alt="Категория" className="w-full h-full object-cover" />
                <button
                  onClick={removeImage}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] hover:bg-red-600 transition"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="cursor-pointer w-16 h-16 bg-white/5 rounded-lg flex flex-col items-center justify-center border border-dashed border-white/20 hover:bg-white/10 transition">
                {isUploading ? (
                  <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <i className="fas fa-plus text-white/40 text-sm"></i>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
            <p className="text-gray-500 text-[8px]">Рекомендуемый размер: 300×300 px</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            placeholder="Название категории"
            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-white/30 focus:outline-none transition"
          />
          <button
            onClick={handleAddCategory}
            disabled={!newCategory.trim()}
            className="bg-white text-black px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ДОБАВИТЬ
          </button>
        </div>
      </div>

      {/* Таблица категорий */}
      {categories.length === 0 ? (
        <div className="bg-white/5 rounded-xl p-10 text-center border border-white/10">
          <i className="fas fa-tags text-white/20 text-4xl mb-3"></i>
          <p className="text-gray-500 text-sm">Категорий пока нет</p>
          <p className="text-gray-600 text-xs mt-1">Добавьте первую категорию через форму выше</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr className="text-left">
                  <th className="px-4 py-3 text-gray-500 text-[9px] font-bold tracking-wider">ФОТО</th>
                  <th className="px-4 py-3 text-gray-500 text-[9px] font-bold tracking-wider">НАЗВАНИЕ</th>
                  <th className="px-4 py-3 text-gray-500 text-[9px] font-bold tracking-wider">SLUG</th>
                  <th className="px-4 py-3 text-gray-500 text-[9px] font-bold tracking-wider">СТАТУС</th>
                  <th className="px-4 py-3 text-gray-500 text-[9px] font-bold tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-8 h-8 object-cover rounded" />
                      ) : (
                        <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center">
                          <i className="fas fa-folder text-white/30 text-xs"></i>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-white font-medium text-sm">{cat.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs font-mono">{cat.slug}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition ${
                          cat.is_active !== false
                            ? 'text-emerald-400'
                            : 'text-gray-500'
                        }`}
                      >
                        {cat.is_active !== false ? '● Активна' : '○ Неактивна'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="text-gray-500 hover:text-white transition mr-3"
                      >
                        <i className="fas fa-pen text-xs"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-gray-500 hover:text-red-400 transition"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Модальное окно редактирования */}
      {editingCategory && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={() => setEditingCategory(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0a0a0a] rounded-xl border border-white/10 shadow-2xl z-50 overflow-hidden">
            <div className="p-5">
              <h2 className="text-white font-bold text-lg mb-4">РЕДАКТИРОВАТЬ</h2>

              {/* Фото категории в модалке */}
              <div className="mb-4">
                <label className="text-gray-500 text-[9px] font-bold block mb-1 tracking-wider">ФОТО КАТЕГОРИИ</label>
                <div className="flex items-center gap-3">
                  {categoryImage ? (
                    <div className="relative w-16 h-16 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                      <img src={categoryImage} alt="Категория" className="w-full h-full object-cover" />
                      <button
                        onClick={removeImage}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[8px] hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer w-16 h-16 bg-white/5 rounded-lg flex flex-col items-center justify-center border border-dashed border-white/20 hover:bg-white/10 transition">
                      {isUploading ? (
                        <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <i className="fas fa-plus text-white/40 text-sm"></i>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-gray-500 focus:border-white/30 focus:outline-none transition mb-4"
                placeholder="Название категории"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-white text-black py-2.5 rounded-xl text-xs font-bold tracking-wider hover:bg-gray-100 transition"
                >
                  СОХРАНИТЬ
                </button>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setEditName('');
                    setCategoryImage('');
                  }}
                  className="flex-1 border border-white/20 py-2.5 rounded-xl text-white text-xs font-medium hover:bg-white/5 transition"
                >
                  ОТМЕНА
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCategories;