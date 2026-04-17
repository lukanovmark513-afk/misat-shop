import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { categoriesAPI } from '../../services/api';

interface Category {
  id: number;
  name: string;
  slug: string;
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

  // Загрузка категорий из API
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
        is_active: true
      });

      toast.success('Категория добавлена');
      setNewCategory('');
      loadCategories(); // Перезагружаем список
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
        slug: slug
      });

      toast.success('Категория обновлена');
      setEditingCategory(null);
      setEditName('');
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
          <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Загрузка категорий...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-light">Управление <span className="font-bold">категориями</span></h1>
          <p className="text-gray-500 text-sm mt-1">Всего категорий: {categories.length}</p>
        </div>
      </div>

      {/* Режим редактирования */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Редактировать категорию</h2>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none mb-4"
              placeholder="Название категории"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-black text-white py-2 rounded-xl hover:bg-gray-800"
              >
                Сохранить
              </button>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setEditName('');
                }}
                className="flex-1 border-2 border-gray-200 py-2 rounded-xl hover:bg-gray-50"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center mb-8">
          <i className="fas fa-tags text-5xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Категорий пока нет</p>
          <p className="text-sm text-gray-400 mt-2">Добавьте первую категорию через форму ниже</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Название</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Slug</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Статус</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Действия</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(cat => (
                  <tr key={cat.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm">{cat.id}</td>
                    <td className="px-6 py-4 font-medium">{cat.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{cat.slug}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          cat.is_active !== false
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {cat.is_active !== false ? 'Активна' : 'Неактивна'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(cat)}
                        className="text-blue-500 hover:text-blue-700 mr-3 transition"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Форма добавления категории */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Добавить категорию</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            placeholder="Название категории"
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
          />
          <button
            onClick={handleAddCategory}
            disabled={!newCategory.trim()}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Добавить
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Slug будет сгенерирован автоматически из названия
        </p>
      </div>
    </div>
  );
};

export default AdminCategories;