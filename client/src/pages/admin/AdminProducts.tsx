import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { productsAPI } from '../../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  images: string[];
  description: string;
  category: string;
  sizes: string[];
  colors: string[];
  rating: number;
  isNew?: boolean;
  isSale?: boolean;
  stock: number;
  created_at: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentSizes, setCurrentSizes] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    description: '',
    category: 'clothes',
    sizes: [] as string[],
    colors: [] as string[],
    stock: '',
    isNew: false,
    isSale: false
  });

  const categories = [
    { id: 'clothes', name: 'Одежда' },
    { id: 'shoes', name: 'Обувь' },
    { id: 'accessories', name: 'Аксессуары' },
    { id: 'sport', name: 'Спорт' },
  ];

  const clothesSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const shoesSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
  const accessoriesSizes = ['One size'];
  const sportSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const getSizesByCategory = (category: string): string[] => {
    switch(category) {
      case 'shoes': return shoesSizes;
      case 'accessories': return accessoriesSizes;
      case 'sport': return sportSizes;
      default: return clothesSizes;
    }
  };

  const getCategoryName = (categoryId: string): string => {
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : categoryId;
  };

  const parseArrayField = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return [];
      }
    }
    return [];
  };

  useEffect(() => {
    setCurrentSizes(getSizesByCategory(formData.category));
    setFormData(prev => ({ ...prev, sizes: [] }));
  }, [formData.category]);

  const colorOptions = [
    { name: 'Чёрный', value: '#000000', code: 'black' },
    { name: 'Белый', value: '#FFFFFF', code: 'white' },
    { name: 'Серый', value: '#808080', code: 'gray' },
    { name: 'Синий', value: '#0000FF', code: 'blue' },
    { name: 'Красный', value: '#FF0000', code: 'red' },
    { name: 'Зелёный', value: '#00FF00', code: 'green' },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      const productsWithArrays = response.data.map((product: any) => ({
        ...product,
        sizes: parseArrayField(product.sizes),
        colors: parseArrayField(product.colors),
        images: parseArrayField(product.images),
      }));
      setProducts(productsWithArrays);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      toast.error('Ошибка загрузки товаров');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const compressImage = (file: File, maxSizeMB: number = 0.5): Promise<string> => {
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
          const maxWidth = 500;
          const maxHeight = 500;

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

          while (result.length > maxSizeMB * 1024 * 1024 && quality > 0.3) {
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
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (imagePreviews.length + files.length > 5) {
      toast.error('Максимум 5 фото на товар');
      return;
    }

    setIsUploading(true);
    toast.loading('Обработка изображений...', { id: 'upload' });

    try {
      const newImages: string[] = [];

      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Файл ${file.name} слишком большой. Максимум 5MB`);
          continue;
        }

        const compressed = await compressImage(file, 0.5);
        newImages.push(compressed);
      }

      setImagePreviews([...imagePreviews, ...newImages]);
      toast.success(`Загружено ${newImages.length} фото!`, { id: 'upload' });
    } catch (error) {
      toast.error('Ошибка загрузки изображений', { id: 'upload' });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleAddProduct = async () => {
    if (!formData.name) {
      toast.error('Введите название');
      return;
    }
    if (!formData.price) {
      toast.error('Введите цену');
      return;
    }
    if (imagePreviews.length === 0 && !editingProduct) {
      toast.error('Загрузите хотя бы одно изображение');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        old_price: formData.oldPrice ? Number(formData.oldPrice) : null,
        image: imagePreviews[0] || '',
        images: JSON.stringify(imagePreviews),
        description: formData.description,
        category: formData.category,
        sizes: JSON.stringify(formData.sizes),
        colors: JSON.stringify(formData.colors),
        stock: Number(formData.stock) || 0,
        is_new: formData.isNew ? 1 : 0,
        is_sale: formData.isSale ? 1 : 0
      };

      console.log('📦 Отправка товара:', productData);

      await productsAPI.create(productData);
      toast.success('Товар добавлен!');
      resetForm();
      setIsModalOpen(false);
      loadProducts();
    } catch (error: any) {
      console.error('Ошибка:', error);
      toast.error(error.response?.data?.error || 'Ошибка добавления товара');
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) return;
    if (!formData.name) {
      toast.error('Введите название');
      return;
    }
    if (!formData.price) {
      toast.error('Введите цену');
      return;
    }

    try {
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        old_price: formData.oldPrice ? Number(formData.oldPrice) : null,
        image: imagePreviews.length > 0 ? imagePreviews[0] : (editingProduct.images?.[0] || ''),
        images: JSON.stringify(imagePreviews.length > 0 ? imagePreviews : editingProduct.images),
        description: formData.description,
        category: formData.category,
        sizes: JSON.stringify(formData.sizes),
        colors: JSON.stringify(formData.colors),
        stock: Number(formData.stock) || editingProduct.stock,
        is_new: formData.isNew ? 1 : 0,
        is_sale: formData.isSale ? 1 : 0
      };

      await productsAPI.update(editingProduct.id, productData);
      toast.success('Товар обновлён!');
      resetForm();
      setIsModalOpen(false);
      loadProducts();
    } catch (error: any) {
      console.error('Ошибка:', error);
      toast.error(error.response?.data?.error || 'Ошибка обновления товара');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Удалить товар?')) {
      try {
        await productsAPI.delete(id);
        toast.success('Товар удалён');
        loadProducts();
      } catch (error) {
        toast.error('Ошибка удаления товара');
      }
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setImagePreviews(product.images || []);
    setCurrentSizes(getSizesByCategory(product.category));
    setFormData({
      name: product.name,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || '',
      description: product.description,
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock.toString(),
      isNew: product.isNew || false,
      isSale: product.isSale || false,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setCurrentSizes(getSizesByCategory('clothes'));
    setFormData({
      name: '',
      price: '',
      oldPrice: '',
      description: '',
      category: 'clothes',
      sizes: [],
      colors: [],
      stock: '',
      isNew: false,
      isSale: false,
    });
    setImagePreviews([]);
    setEditingProduct(null);
  };

  const handleSizeToggle = (size: string) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorToggle = (colorCode: string) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.includes(colorCode)
        ? prev.colors.filter(c => c !== colorCode)
        : [...prev.colors, colorCode]
    }));
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter">Управление товарами</h1>
          <p className="text-gray-500 text-sm mt-1">Всего товаров: {products.length}</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 w-full sm:w-auto"
        >
          + Добавить товар
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <i className="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">Товаров пока нет</p>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="mt-4 text-black underline"
          >
            Добавить первый товар
          </button>
        </div>
      ) : isMobile ? (
        <div className="space-y-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className="flex gap-3">
                <img src={product.images?.[0] || 'https://placehold.co/100x100/eeeeee/cccccc?text=No+Image'} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-black text-base">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.price.toLocaleString()} ₽</p>
                  <p className="text-xs text-gray-400">Размеры: {Array.isArray(product.sizes) ? product.sizes.join(', ') : ''}</p>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => openEditModal(product)} className="text-blue-500 text-sm px-2 py-1">
                      <i className="fas fa-edit"></i> Изменить
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 text-sm px-2 py-1">
                      <i className="fas fa-trash"></i> Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3 text-sm font-black">Фото</th>
                  <th className="px-4 py-3 text-sm font-black">Название</th>
                  <th className="px-4 py-3 text-sm font-black">Цена</th>
                  <th className="px-4 py-3 text-sm font-black">Категория</th>
                  <th className="px-4 py-3 text-sm font-black">Размеры</th>
                  <th className="px-4 py-3 text-sm font-black">Остаток</th>
                  <th className="px-4 py-3 text-sm font-black">Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img src={product.images?.[0] || 'https://placehold.co/100x100/eeeeee/cccccc?text=No+Image'} alt={product.name} className="w-10 h-10 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">{product.price.toLocaleString()} ₽</td>
                    <td className="px-4 py-3">{getCategoryName(product.category)}</td>
                    <td className="px-4 py-3 text-sm">{Array.isArray(product.sizes) ? product.sizes.join(', ') : ''}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => openEditModal(product)} className="text-blue-500 mr-3">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500">
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

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-black">{editingProduct ? 'Редактировать' : 'Добавить'} товар</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl w-8 h-8 flex items-center justify-center">×</button>
            </div>
            <div className="p-4 md:p-6">
              {/* Фото товара */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Фото товара *</label>

                <div className="flex flex-wrap gap-3 mb-3">
                  {imagePreviews.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <label className="cursor-pointer w-24 h-24 bg-gray-100 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-gray-200 transition border-2 border-dashed border-gray-300">
                    {isUploading ? (
                      <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <i className="fas fa-plus text-2xl text-gray-400"></i>
                        <span className="text-xs text-gray-500">Добавить</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Можно выбрать несколько фото (макс. 5). Первое фото будет основным. Максимум 5MB на файл.
                </p>
                {imagePreviews.length === 0 && !editingProduct && (
                  <p className="text-xs text-red-500 mt-1">Загрузите хотя бы одно фото</p>
                )}
              </div>

              {/* Название */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Название *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="Введите название товара" />
              </div>

              {/* Цена */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Цена *</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="0" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Старая цена (скидка)</label>
                  <input type="number" value={formData.oldPrice} onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="0" />
                </div>
              </div>

              {/* Категория и остаток */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Категория</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    {formData.category === 'shoes' && 'Размеры обуви: 35-46'}
                    {formData.category === 'clothes' && 'Размеры одежды: XS-XXL'}
                    {formData.category === 'accessories' && 'One size'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Количество на складе</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full px-3 py-2 border rounded-lg" placeholder="0" />
                </div>
              </div>

              {/* Описание */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Описание</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded-lg resize-none" placeholder="Описание товара" />
              </div>

              {/* Размеры */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Размеры *</label>
                <div className="flex flex-wrap gap-2">
                  {currentSizes.map(size => (
                    <button key={size} type="button" onClick={() => handleSizeToggle(size)} className={`w-14 h-14 rounded-lg border-2 text-sm font-bold ${formData.sizes.includes(size) ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'}`}>
                      {size}
                    </button>
                  ))}
                </div>
                {formData.sizes.length === 0 && <p className="text-xs text-red-500 mt-1">Выберите хотя бы один размер</p>}
              </div>

              {/* Цвета */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Цвета</label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button key={color.code} type="button" onClick={() => handleColorToggle(color.code)} className={`w-8 h-8 rounded-full border-2 ${formData.colors.includes(color.code) ? 'ring-2 ring-black ring-offset-2' : ''}`} style={{ backgroundColor: color.value }} title={color.name} />
                  ))}
                </div>
              </div>

              {/* Чекбоксы */}
              <div className="flex flex-wrap gap-4 mb-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isNew} onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })} />
                  <span>Новинка (NEW)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.isSale} onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })} />
                  <span>Распродажа (SALE)</span>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={editingProduct ? handleEditProduct : handleAddProduct} disabled={isUploading} className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50">
                  {editingProduct ? 'Сохранить' : 'Добавить'}
                </button>
                <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg hover:bg-gray-100">
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;