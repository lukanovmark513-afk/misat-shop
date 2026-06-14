import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { productsAPI, categoriesAPI } from '../../services/api';

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
  stockType?: string;
  preorderDays?: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  is_active: number;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentSizes, setCurrentSizes] = useState<string[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    description: '',
    category: '',
    sizes: [] as string[],
    colors: [] as string[],
    stock: '',
    isNew: false,
    isSale: false,
    stockType: 'in_stock',
    preorderDays: 30
  });

  // Загрузка категорий из БД
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategoriesList(response.data || []);
        if (response.data && response.data.length > 0 && !formData.category) {
          setFormData(prev => ({ ...prev, category: response.data[0].slug }));
        }
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
      }
    };
    loadCategories();
  }, []);

  const clothesSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const shoesSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
  const accessoriesSizes = ['One size'];
  const sportSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const getSizesByCategory = (categorySlug: string): string[] => {
    const cat = categoriesList.find(c => c.slug === categorySlug);
    if (!cat) return clothesSizes;
    switch(cat.name) {
      case 'Обувь': return shoesSizes;
      case 'Аксессуары': return accessoriesSizes;
      case 'Спорт': return sportSizes;
      default: return clothesSizes;
    }
  };

  const getCategoryName = (categorySlug: string): string => {
    const cat = categoriesList.find(c => c.slug === categorySlug);
    return cat ? cat.name : categorySlug;
  };

  // Универсальный парсинг полей (массив из JSON строки или уже массив)
  const parseArrayField = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  useEffect(() => {
    if (categoriesList.length > 0 && formData.category) {
      setCurrentSizes(getSizesByCategory(formData.category));
      setFormData(prev => ({ ...prev, sizes: [] }));
    }
  }, [formData.category, categoriesList]);

  const colorOptions = [
    { name: 'Чёрный', value: '#000000', code: 'black' },
    { name: 'Белый', value: '#FFFFFF', code: 'white' },
    { name: 'Серый', value: '#808080', code: 'gray' },
    { name: 'Синий', value: '#0000FF', code: 'blue' },
    { name: 'Красный', value: '#FF0000', code: 'red' },
    { name: 'Зелёный', value: '#00FF00', code: 'green' },
    { name: 'Жёлтый', value: '#FFFF00', code: 'yellow' },
    { name: 'Розовый', value: '#FF69B4', code: 'pink' },
    { name: 'Фиолетовый', value: '#800080', code: 'purple' },
    { name: 'Оранжевый', value: '#FFA500', code: 'orange' },
    { name: 'Коричневый', value: '#8B4513', code: 'brown' },
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
        rating: 0,
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
          const maxWidth = 800;
          const maxHeight = 800;

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

          let quality = 0.8;
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

    if (imagePreviews.length + files.length > 10) {
      toast.error('Максимум 10 фото на товар');
      return;
    }

    setIsUploading(true);
    toast.loading('Обработка изображений...', { id: 'upload' });

    try {
      const newImages: string[] = [];

      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`Файл ${file.name} слишком большой. Максимум 10MB`);
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

  const moveImageLeft = (index: number) => {
    if (index === 0) return;
    const newImages = [...imagePreviews];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setImagePreviews(newImages);
  };

  const moveImageRight = (index: number) => {
    if (index === imagePreviews.length - 1) return;
    const newImages = [...imagePreviews];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setImagePreviews(newImages);
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
    if (imagePreviews.length === 0) {
      toast.error('Загрузите хотя бы одно изображение');
      return;
    }
    if (!formData.category) {
      toast.error('Выберите категорию');
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
        is_sale: formData.isSale ? 1 : 0,
        stockType: formData.stockType,
        preorderDays: formData.stockType === 'preorder' ? formData.preorderDays : null,
        rating: 0
      };

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
      const finalImages = imagePreviews.length > 0 ? imagePreviews : editingProduct.images;

      const productData = {
        name: formData.name,
        price: Number(formData.price),
        old_price: formData.oldPrice ? Number(formData.oldPrice) : null,
        image: finalImages[0] || '',
        images: JSON.stringify(finalImages),
        description: formData.description,
        category: formData.category,
        sizes: JSON.stringify(formData.sizes),
        colors: JSON.stringify(formData.colors),
        stock: Number(formData.stock) || editingProduct.stock,
        is_new: formData.isNew ? 1 : 0,
        is_sale: formData.isSale ? 1 : 0,
        stockType: formData.stockType,
        preorderDays: formData.stockType === 'preorder' ? formData.preorderDays : null,
        rating: 0
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

  // Исправленное открытие модального окна редактирования
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setImagePreviews(product.images || []);

    // Преобразуем размеры и цвета в массивы (на случай если пришли строкой)
    const productSizes = parseArrayField(product.sizes);
    const productColors = parseArrayField(product.colors);

    setCurrentSizes(getSizesByCategory(product.category));
    setFormData({
      name: product.name,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || '',
      description: product.description,
      category: product.category,
      sizes: productSizes,
      colors: productColors,
      stock: product.stock.toString(),
      isNew: product.isNew || false,
      isSale: product.isSale || false,
      stockType: product.stockType || 'in_stock',
      preorderDays: product.preorderDays || 30
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    if (categoriesList.length > 0) {
      setCurrentSizes(getSizesByCategory(categoriesList[0]?.slug || 'clothes'));
      setFormData({
        name: '',
        price: '',
        oldPrice: '',
        description: '',
        category: categoriesList[0]?.slug || '',
        sizes: [],
        colors: [],
        stock: '',
        isNew: false,
        isSale: false,
        stockType: 'in_stock',
        preorderDays: 30
      });
    } else {
      setCurrentSizes(getSizesByCategory('clothes'));
      setFormData({
        name: '',
        price: '',
        oldPrice: '',
        description: '',
        category: '',
        sizes: [],
        colors: [],
        stock: '',
        isNew: false,
        isSale: false,
        stockType: 'in_stock',
        preorderDays: 30
      });
    }
    setImagePreviews([]);
    setEditingProduct(null);
  };

  const handleSizeToggle = (size: string) => {
    const current = [...formData.sizes];
    if (current.includes(size)) {
      setFormData({ ...formData, sizes: current.filter(s => s !== size) });
    } else {
      setFormData({ ...formData, sizes: [...current, size] });
    }
  };

  const handleColorToggle = (code: string) => {
    const current = [...formData.colors];
    if (current.includes(code)) {
      setFormData({ ...formData, colors: current.filter(c => c !== code) });
    } else {
      setFormData({ ...formData, colors: [...current, code] });
    }
  };

  const selectedCategoryObj = categoriesList.find(c => c.slug === formData.category);

  return (
    <div className="p-4 md:p-6 min-h-screen bg-black">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-px bg-white/40"></div>
          <span className="text-gray-500 text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-medium">Управление</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
              ТОВАРЫ
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Всего товаров: <span className="text-white font-bold text-lg">{products.length}</span>
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-white text-black px-6 py-2.5 rounded-xl text-xs font-black tracking-wider hover:bg-gray-200 transition-all duration-300 shadow-lg"
          >
            <span className="flex items-center gap-2">
              <i className="fas fa-plus text-xs"></i>
              ДОБАВИТЬ ТОВАР
            </span>
          </button>
        </div>
      </div>

      {/* Список товаров */}
      {products.length === 0 ? (
        <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
          <div className="w-20 h-20 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-4">
            <i className="fas fa-box-open text-white/30 text-3xl"></i>
          </div>
          <p className="text-gray-400 text-base font-medium mb-2">Товаров пока нет</p>
          <p className="text-gray-600 text-sm mb-6">Добавьте первый товар в магазин</p>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="bg-white/10 text-white px-5 py-2 rounded-xl text-sm hover:bg-white/20 transition"
          >
            + Добавить товар
          </button>
        </div>
      ) : isMobile ? (
        <div className="space-y-3">
          {products.map(product => (
            <div key={product.id} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition">
              <div className="flex gap-4">
                <img src={product.images?.[0] || 'https://placehold.co/60x60/1a1a1a/666666'} className="w-16 h-16 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="text-white font-bold text-sm mb-1">{product.name}</p>
                  <p className="text-white/80 text-sm font-semibold">{product.price.toLocaleString()} ₽</p>
                  <p className="text-gray-500 text-xs mt-1">{getCategoryName(product.category)}</p>
                  <div className="flex gap-4 mt-3">
                    <button onClick={() => openEditModal(product)} className="text-gray-500 text-sm hover:text-white transition">
                      <i className="fas fa-pen"></i>
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-500 text-sm hover:text-red-400 transition">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-4 py-4 text-left text-gray-500 text-[10px] font-bold tracking-wider uppercase w-16">Фото</th>
                  <th className="px-4 py-4 text-left text-gray-500 text-[10px] font-bold tracking-wider uppercase">Название</th>
                  <th className="px-4 py-4 text-left text-gray-500 text-[10px] font-bold tracking-wider uppercase">Цена</th>
                  <th className="px-4 py-4 text-left text-gray-500 text-[10px] font-bold tracking-wider uppercase">Категория</th>
                  <th className="px-4 py-4 text-left text-gray-500 text-[10px] font-bold tracking-wider uppercase">В наличии</th>
                  <th className="px-4 py-4 text-right text-gray-500 text-[10px] font-bold tracking-wider uppercase w-24"></th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      <img src={product.images?.[0] || 'https://placehold.co/40x40/1a1a1a/666666'} className="w-10 h-10 object-cover rounded-lg" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-medium text-sm line-clamp-1">{product.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white font-bold text-sm">{product.price.toLocaleString()} ₽</p>
                      {product.oldPrice && (
                        <p className="text-gray-500 text-[10px] line-through">{product.oldPrice.toLocaleString()} ₽</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-white/10 rounded-lg text-gray-300 text-xs">
                        {getCategoryName(product.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {product.stock > 0 ? `${product.stock} шт` : 'Нет'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEditModal(product)} className="text-gray-500 mr-3 hover:text-white transition">
                        <i className="fas fa-pen text-xs"></i>
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-gray-500 hover:text-red-400 transition">
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

      {/* Модальное окно */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-40" onClick={() => setIsModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-hidden bg-black rounded-2xl border border-white/10 shadow-2xl z-50">
            {/* Заголовок модалки */}
            <div className="sticky top-0 bg-black p-5 border-b border-white/10 flex justify-between items-center z-30">
              <div>
                <h2 className="text-white font-black text-xl tracking-tight">
                  {editingProduct ? 'РЕДАКТИРОВАТЬ ТОВАР' : 'НОВЫЙ ТОВАР'}
                </h2>
                <p className="text-gray-500 text-[10px] mt-0.5">
                  {editingProduct ? 'Измените параметры товара' : 'Заполните информацию о товаре'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              >
                <i className="fas fa-times text-white/60 text-sm"></i>
              </button>
            </div>

            {/* Контент модалки */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6">
              {/* Фото товара */}
              <div>
                <label className="text-gray-400 text-[10px] font-bold block mb-3 tracking-wider uppercase flex items-center gap-2">
                  <i className="fas fa-images text-xs"></i>
                  Фотографии товара
                  <span className="text-gray-600 text-[8px] font-normal">(первое фото — основное)</span>
                </label>

                <div className="flex flex-wrap gap-3 mb-3 p-4 bg-white/5 rounded-xl border border-white/10 min-h-[120px]">
                  {imagePreviews.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <div className="w-24 h-24 bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 group-hover:border-white/40 transition-all duration-200">
                        <img src={img} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <div className="absolute top-0 left-0 bg-gradient-to-r from-white to-gray-200 text-black text-[8px] font-bold px-2 py-0.5 rounded-br-lg z-10 shadow-md">
                            MAIN
                          </div>
                        )}
                      </div>

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2 z-20">
                        {idx > 0 && (
                          <button
                            onClick={() => moveImageLeft(idx)}
                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-all hover:scale-110"
                            title="Влево"
                          >
                            <i className="fas fa-chevron-left text-white text-xs"></i>
                          </button>
                        )}
                        {idx < imagePreviews.length - 1 && (
                          <button
                            onClick={() => moveImageRight(idx)}
                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/40 transition-all hover:scale-110"
                            title="Вправо"
                          >
                            <i className="fas fa-chevron-right text-white text-xs"></i>
                          </button>
                        )}
                        <button
                          onClick={() => removeImage(idx)}
                          className="w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-600 transition-all hover:scale-110"
                          title="Удалить"
                        >
                          <i className="fas fa-trash text-white text-xs"></i>
                        </button>
                      </div>

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] px-2 py-0.5 rounded-full font-medium z-10 backdrop-blur-sm">
                        {idx + 1}
                      </div>
                    </div>
                  ))}

                  <label className="cursor-pointer w-24 h-24 bg-gray-800 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-gray-600 hover:border-white/40 hover:bg-gray-700 transition-all duration-200 group">
                    {isUploading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <i className="fas fa-plus text-gray-500 text-xl group-hover:text-white transition"></i>
                        <span className="text-gray-500 text-[9px] mt-1 group-hover:text-gray-400 transition">Добавить</span>
                      </>
                    )}
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                  </label>
                </div>

                <p className="text-gray-500 text-[9px] mt-2 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <i className="fas fa-arrow-left text-[8px]"></i>
                    <i className="fas fa-arrow-right text-[8px]"></i>
                    Кнопки для перемещения
                  </span>
                  <span className="w-px h-3 bg-gray-700"></span>
                  <span className="flex items-center gap-1">
                    <i className="fas fa-trash text-[8px] text-red-400"></i>
                    Удаление фото
                  </span>
                  <span className="w-px h-3 bg-gray-700"></span>
                  <span className="flex items-center gap-1">
                    <i className="fas fa-star text-[8px] text-yellow-500"></i>
                    MAIN — главное фото
                  </span>
                </p>
              </div>

              {/* Название */}
              <div>
                <label className="text-gray-400 text-[10px] font-bold block mb-2 tracking-wider uppercase">
                  <i className="fas fa-tag text-xs mr-1"></i>
                  Название товара
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-white/30 focus:outline-none"
                  placeholder="Введите название товара"
                />
              </div>

              {/* Цена и старая цена */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-gray-400 text-[10px] font-bold block mb-2 tracking-wider uppercase">
                    <i className="fas fa-ruble-sign text-xs mr-1"></i>
                    Цена
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                    placeholder="0 ₽"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-[10px] font-bold block mb-2 tracking-wider uppercase">
                    <i className="fas fa-percent text-xs mr-1"></i>
                    Старая цена
                  </label>
                  <input
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                    placeholder="0 ₽"
                  />
                </div>
              </div>

              {/* Тип товара */}
              <div>
                <label className="text-gray-400 text-[10px] font-bold block mb-3 tracking-wider uppercase">
                  <i className="fas fa-box text-xs mr-1"></i>
                  Тип поставки
                </label>
                <div className="flex gap-4 flex-wrap">
                  <label className="flex items-center gap-3 cursor-pointer bg-white/5 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition">
                    <input
                      type="radio"
                      name="stockType"
                      value="in_stock"
                      checked={formData.stockType === 'in_stock'}
                      onChange={() => setFormData({ ...formData, stockType: 'in_stock' })}
                      className="w-4 h-4 accent-white"
                    />
                    <div>
                      <span className="text-white text-sm font-medium">В наличии (РФ)</span>
                      <p className="text-green-400 text-[9px] mt-0.5">доставка 2-5 дней</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer bg-white/5 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition">
                    <input
                      type="radio"
                      name="stockType"
                      value="preorder"
                      checked={formData.stockType === 'preorder'}
                      onChange={() => setFormData({ ...formData, stockType: 'preorder' })}
                      className="w-4 h-4 accent-white"
                    />
                    <div>
                      <span className="text-white text-sm font-medium">Предзаказ (Китай)</span>
                      <p className="text-orange-400 text-[9px] mt-0.5">доставка 20-35 дней</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Срок предзаказа */}
              {formData.stockType === 'preorder' && (
                <div>
                  <label className="text-gray-400 text-[10px] font-bold block mb-2 tracking-wider uppercase">
                    <i className="fas fa-calendar text-xs mr-1"></i>
                    Срок предзаказа
                  </label>
                  <select
                    value={formData.preorderDays}
                    onChange={(e) => setFormData({ ...formData, preorderDays: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:border-white/30 focus:outline-none cursor-pointer appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23666'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                      backgroundSize: '1rem'
                    }}
                  >
                    <option value={20} className="bg-black text-white">📦 ~20 дней</option>
                    <option value={25} className="bg-black text-white">📦 ~25 дней</option>
                    <option value={30} className="bg-black text-white">📦 ~30 дней</option>
                    <option value={35} className="bg-black text-white">📦 ~35 дней</option>
                    <option value={40} className="bg-black text-white">📦 ~40 дней</option>
                  </select>
                </div>
              )}

              {/* Категория и количество */}
              <div className="grid grid-cols-2 gap-5">
                <div className="relative">
                  <label className="text-gray-400 text-[10px] font-bold block mb-2 tracking-wider uppercase">
                    <i className="fas fa-folder text-xs mr-1"></i>
                    Категория
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:bg-white/10 transition"
                  >
                    <span>{selectedCategoryObj?.name || 'Выберите категорию'}</span>
                    <i className={`fas fa-chevron-down text-gray-500 text-xs transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-black border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                      {categoriesList.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setFormData({ ...formData, category: cat.slug });
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition ${formData.category === cat.slug ? 'text-white bg-white/10' : 'text-gray-300'}`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-gray-400 text-[10px] font-bold block mb-2 tracking-wider uppercase">
                    <i className="fas fa-database text-xs mr-1"></i>
                    Количество
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Размеры */}
              <div>
                <label className="text-gray-400 text-[10px] font-bold block mb-3 tracking-wider uppercase">
                  <i className="fas fa-ruler-combined text-xs mr-1"></i>
                  Размеры
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentSizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`w-12 h-10 rounded-xl text-xs font-semibold transition-all ${
                        formData.sizes.includes(size)
                          ? 'bg-white text-black shadow-lg scale-105'
                          : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {formData.sizes.length > 0 && (
                  <p className="text-gray-500 text-[9px] mt-1">Выбрано: {formData.sizes.join(', ')}</p>
                )}
              </div>

              {/* Цвета */}
              <div>
                <label className="text-gray-400 text-[10px] font-bold block mb-3 tracking-wider uppercase">
                  <i className="fas fa-palette text-xs mr-1"></i>
                  Цвета
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.code}
                      type="button"
                      onClick={() => handleColorToggle(color.code)}
                      className={`w-9 h-9 rounded-xl border-2 transition-all ${
                        formData.colors.includes(color.code)
                          ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110 border-white shadow-lg'
                          : 'border-gray-600 hover:scale-105 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                {formData.colors.length > 0 && (
                  <p className="text-gray-500 text-[10px] mt-2">Выбрано цветов: {formData.colors.length}</p>
                )}
              </div>

              {/* Чекбоксы */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 accent-white"
                  />
                  <span className="text-white text-sm font-medium">NEW</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer bg-white/5 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition">
                  <input
                    type="checkbox"
                    checked={formData.isSale}
                    onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                    className="w-4 h-4 accent-white"
                  />
                  <span className="text-white text-sm font-medium">SALE</span>
                </label>
              </div>

              {/* Описание */}
              <div>
                <label className="text-gray-400 text-[10px] font-bold block mb-2 tracking-wider uppercase">
                  <i className="fas fa-align-left text-xs mr-1"></i>
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm resize-none"
                  placeholder="Подробное описание товара..."
                />
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingProduct ? handleEditProduct : handleAddProduct}
                  disabled={isUploading}
                  className="flex-1 bg-white text-black py-3 rounded-xl text-xs font-black tracking-wider hover:bg-gray-200 transition shadow-lg disabled:opacity-50"
                >
                  {editingProduct ? 'СОХРАНИТЬ' : 'ДОБАВИТЬ'}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-white/20 rounded-xl text-xs text-gray-400 font-medium hover:text-white hover:border-white/30 transition"
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

export default AdminProducts;