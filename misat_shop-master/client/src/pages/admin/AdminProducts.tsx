import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { productsAPI, categoriesAPI, brandsAPI } from '../../services/api';

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  images: string[];
  description: string;
  category: string;
  brand?: string;
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

interface Brand {
  id: number;
  name: string;
  slug: string;
  description?: string;
  is_active?: number;
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

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [brandsList, setBrandsList] = useState<Brand[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentSizes, setCurrentSizes] = useState<string[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    description: '',
    category: '',
    brand: '',
    sizes: [] as string[],
    colors: [] as string[],
    stock: '',
    isNew: false,
    isSale: false,
    stockType: 'in_stock',
    preorderDays: 30
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          categoriesAPI.getAll(),
          brandsAPI.getAll()
        ]);

        setCategoriesList(categoriesRes.data || []);
        setBrandsList(brandsRes.data || []);

        if (categoriesRes.data && categoriesRes.data.length > 0) {
          const firstCat = categoriesRes.data[0];
          setFormData(prev => ({ ...prev, category: firstCat.slug }));
        }
        if (brandsRes.data && brandsRes.data.length > 0) {
          const firstBrand = brandsRes.data[0];
          setFormData(prev => ({ ...prev, brand: firstBrand.slug }));
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };
    loadData();
  }, []);

  const getSizesByCategoryName = (categoryName: string): string[] => {
    const name = categoryName.toLowerCase();
    if (name === 'обувь' || name.includes('обув')) {
      return ['39', '40', '41', '42', '43', '44', '45', '46'];
    }
    if (name === 'аксессуары' || name.includes('аксесс') || name.includes('головные') || name.includes('ремни') || name.includes('носки')) {
      return ['ONE SIZE', 'S/M', 'L/XL'];
    }
    if (name === 'брюки' || name.includes('брюк') || name.includes('джинс')) {
      return ['28', '29', '30', '31', '32', '33', '34', '36', '38'];
    }
    if (name === 'пальто' || name.includes('пальто') || name.includes('куртк') || name.includes('пуховик')) {
      return ['44', '46', '48', '50', '52', '54', '56'];
    }
    if (name === 'одежда' || name.includes('одежд') || name.includes('футболк') || name.includes('рубашк') || name.includes('свитер') || name.includes('худи')) {
      return ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    }
    return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  };

  const handleCategoryChange = (categorySlug: string) => {
    const selectedCat = categoriesList.find(c => c.slug === categorySlug);
    const categoryName = selectedCat?.name || '';
    const sizes = getSizesByCategoryName(categoryName);

    setCurrentSizes(sizes);
    setFormData(prev => ({
      ...prev,
      category: categorySlug,
      sizes: []
    }));
    setIsCategoryDropdownOpen(false);
  };

  const getCategoryName = (categorySlug: string): string => {
    const cat = categoriesList.find(c => c.slug === categorySlug);
    return cat ? cat.name : categorySlug;
  };

  const getBrandName = (brandSlug: string): string => {
    const brand = brandsList.find(b => b.slug === brandSlug);
    return brand ? brand.name : brandSlug;
  };

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

  const colorOptions = [
    { name: 'Чёрный', value: '#1a1a1a', code: 'black' },
    { name: 'Белый', value: '#e8e4dd', code: 'white' },
    { name: 'Серый', value: '#808080', code: 'gray' },
    { name: 'Бежевый', value: '#d4c4b0', code: 'beige' },
    { name: 'Коричневый', value: '#8b6f5a', code: 'brown' },
    { name: 'Синий', value: '#4a6a8a', code: 'blue' },
    { name: 'Зелёный', value: '#6a8a6a', code: 'green' },
    { name: 'Красный', value: '#8a4a4a', code: 'red' },
    { name: 'Жёлтый', value: '#c4b04a', code: 'yellow' },
    { name: 'Фиолетовый', value: '#7a5a8a', code: 'purple' },
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
          const maxWidth = 400;
          const maxHeight = 400;

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

          let quality = 0.6;
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

        const compressed = await compressImage(file, 0.3);
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
    if (!formData.name) { toast.error('Введите название'); return; }
    if (!formData.price) { toast.error('Введите цену'); return; }
    if (imagePreviews.length === 0) { toast.error('Загрузите хотя бы одно изображение'); return; }
    if (!formData.category) { toast.error('Выберите категорию'); return; }

    try {
      const productData = {
        name: formData.name,
        price: Number(formData.price),
        old_price: formData.oldPrice ? Number(formData.oldPrice) : null,
        image: imagePreviews[0] || '',
        images: JSON.stringify(imagePreviews),
        description: formData.description,
        category: formData.category,
        brand: formData.brand || null,
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
      toast.success('Товар добавлен!', {
        style: { background: COLORS.bgCard, color: COLORS.ink, border: `1px solid ${COLORS.ruleStrong}`, borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace' }
      });
      resetForm();
      setIsModalOpen(false);
      loadProducts();
    } catch (error: any) {
      console.error('Ошибка:', error);
      toast.error(error.response?.data?.error || 'Ошибка добавления товара');
    }
  };

  const handleEditProduct = async () => {
    if (!editingProduct) { toast.error('Товар не выбран'); return; }
    if (!formData.name) { toast.error('Введите название'); return; }
    if (!formData.price) { toast.error('Введите цену'); return; }

    try {
      let finalImages = imagePreviews;
      if (finalImages.length === 0 && editingProduct.images) {
        finalImages = editingProduct.images;
      }

      const productData = {
        name: formData.name,
        price: Number(formData.price),
        old_price: formData.oldPrice ? Number(formData.oldPrice) : null,
        image: finalImages[0] || '',
        images: JSON.stringify(finalImages),
        description: formData.description,
        category: formData.category,
        brand: formData.brand || null,
        sizes: JSON.stringify(formData.sizes),
        colors: JSON.stringify(formData.colors),
        stock: Number(formData.stock) || editingProduct.stock || 0,
        is_new: formData.isNew ? 1 : 0,
        is_sale: formData.isSale ? 1 : 0,
        stockType: formData.stockType || 'in_stock',
        preorderDays: formData.stockType === 'preorder' ? formData.preorderDays : null,
        rating: 0
      };

      await productsAPI.update(editingProduct.id, productData);
      toast.success('Товар обновлён! ✅', {
        style: { background: COLORS.bgCard, color: COLORS.ink, border: `1px solid ${COLORS.ruleStrong}`, borderRadius: '4px', fontFamily: 'JetBrains Mono, monospace' }
      });

      resetForm();
      setIsModalOpen(false);
      loadProducts();
    } catch (error: any) {
      console.error('Ошибка обновления:', error);
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
    const productSizes = parseArrayField(product.sizes);
    const productColors = parseArrayField(product.colors);

    const selectedCat = categoriesList.find(c => c.slug === product.category);
    const catName = selectedCat?.name || '';
    const sizes = getSizesByCategoryName(catName);
    setCurrentSizes(sizes);

    setFormData({
      name: product.name,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || '',
      description: product.description || '',
      category: product.category,
      brand: product.brand || '',
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
    const defaultCat = categoriesList.length > 0 ? categoriesList[0].slug : '';
    const defaultBrand = brandsList.length > 0 ? brandsList[0].slug : '';
    const defaultName = categoriesList.length > 0 ? categoriesList[0].name : '';
    const defaultSizes = getSizesByCategoryName(defaultName);
    setCurrentSizes(defaultSizes);
    setFormData({
      name: '',
      price: '',
      oldPrice: '',
      description: '',
      category: defaultCat,
      brand: defaultBrand,
      sizes: [],
      colors: [],
      stock: '',
      isNew: false,
      isSale: false,
      stockType: 'in_stock',
      preorderDays: 30
    });
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

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCategoryObj = categoriesList.find(c => c.slug === formData.category);
  const selectedBrandObj = brandsList.find(b => b.slug === formData.brand);

  return (
    <div className="p-4 md:p-6 min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.ink }}>

      {/* Заголовок */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-px" style={{ backgroundColor: COLORS.stamp }}></div>
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
            УПРАВЛЕНИЕ
          </span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter" style={{ fontFamily: 'Anton, sans-serif', color: COLORS.ink }}>
              ТОВАРЫ
            </h1>
            <p className="text-xs mt-1" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
              ВСЕГО: <span className="font-bold" style={{ color: COLORS.ink }}>{products.length}</span>
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="px-6 py-2.5 rounded text-xs font-black tracking-wider transition"
            style={{
              backgroundColor: COLORS.ink,
              color: COLORS.bg,
              fontFamily: 'JetBrains Mono, monospace',
              border: `1px solid ${COLORS.ink}`,
            }}
          >
            <span className="flex items-center gap-2">
              <i className="fas fa-plus text-xs"></i>
              ДОБАВИТЬ ТОВАР
            </span>
          </button>
        </div>
      </div>

      {/* Поиск */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Поиск товара..."
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
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded p-12 text-center" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
          <div className="w-20 h-20 mx-auto rounded flex items-center justify-center mb-4" style={{ backgroundColor: COLORS.bgElevated }}>
            <i className="fas fa-box-open text-3xl" style={{ color: COLORS.inkFaint }}></i>
          </div>
          <p className="text-sm mb-2" style={{ color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace' }}>
            {searchQuery ? 'НИЧЕГО НЕ НАЙДЕНО' : 'ТОВАРОВ ПОКА НЕТ'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => { resetForm(); setIsModalOpen(true); }}
              className="mt-3 px-4 py-2 rounded text-[10px]"
              style={{ backgroundColor: COLORS.stamp, color: COLORS.bg, fontFamily: 'JetBrains Mono, monospace' }}
            >
              + ДОБАВИТЬ ПЕРВЫЙ ТОВАР
            </button>
          )}
        </div>
      ) : isMobile ? (
        <div className="space-y-3">
          {filteredProducts.map(product => (
            <div key={product.id} className="rounded p-4" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
              <div className="flex gap-4">
                <img src={product.images?.[0] || 'https://placehold.co/60x60/111113/e8e4dd'} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-bold text-sm mb-1" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>{product.name}</p>
                  <p className="text-sm font-semibold" style={{ color: COLORS.ink }}>{product.price.toLocaleString()} ₽</p>
                  <p className="text-xs mt-1" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>{getCategoryName(product.category)}</p>
                  {product.brand && (
                    <p className="text-xs" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>БРЕНД: {getBrandName(product.brand)}</p>
                  )}
                  <div className="flex gap-4 mt-3">
                    <button onClick={() => openEditModal(product)} className="text-sm transition" style={{ color: COLORS.inkFaint }}>
                      <i className="fas fa-pen"></i>
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="text-sm transition" style={{ color: COLORS.inkFaint }}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded overflow-hidden" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: COLORS.bgElevated, borderBottom: `1px solid ${COLORS.rule}` }}>
                <tr className="text-left text-xs font-bold tracking-wider uppercase">
                  <th className="px-4 py-3 w-16" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Фото</th>
                  <th className="px-4 py-3" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Название</th>
                  <th className="px-4 py-3" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Цена</th>
                  <th className="px-4 py-3" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Категория</th>
                  <th className="px-4 py-3" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Бренд</th>
                  <th className="px-4 py-3" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>В наличии</th>
                  <th className="px-4 py-3 text-right w-24" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} style={{ borderBottom: `1px solid ${COLORS.rule}` }} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3">
                      <img src={product.images?.[0] || 'https://placehold.co/40x40/111113/e8e4dd'} className="w-10 h-10 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm line-clamp-1" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>{product.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-sm" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>{product.price.toLocaleString()} ₽</p>
                      {product.oldPrice && (
                        <p className="text-[10px] line-through" style={{ color: COLORS.inkFaint }}>{product.oldPrice.toLocaleString()} ₽</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: COLORS.bg, color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace' }}>
                        {getCategoryName(product.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {product.brand ? (
                        <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: COLORS.bg, color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                          {getBrandName(product.brand)}
                        </span>
                      ) : (
                        <span style={{ color: COLORS.inkFaint }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium" style={{ color: product.stock > 0 ? COLORS.olive : '#8a4a4a', fontFamily: 'JetBrains Mono, monospace' }}>
                        {product.stock > 0 ? `${product.stock} ШТ` : 'НЕТ'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openEditModal(product)} className="transition mr-3" style={{ color: COLORS.inkFaint }}>
                        <i className="fas fa-pen text-xs"></i>
                      </button>
                      <button onClick={() => handleDeleteProduct(product.id)} className="transition" style={{ color: COLORS.inkFaint }}>
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
          <div className="fixed inset-0 backdrop-blur-sm z-40" style={{ backgroundColor: 'rgba(10, 10, 11, 0.9)' }} onClick={() => setIsModalOpen(false)} />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-hidden z-50"
            style={{
              backgroundColor: COLORS.bg,
              borderRadius: '4px',
              border: `1px solid ${COLORS.ruleStrong}`,
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div className="sticky top-0 p-5 flex justify-between items-center z-30" style={{ backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.rule}` }}>
              <div>
                <span className="text-[9px] tracking-[0.2em] block mb-1" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
                  {editingProduct ? 'РЕДАКТИРОВАНИЕ' : 'СОЗДАНИЕ'}
                </span>
                <h2 className="text-xl font-black" style={{ fontFamily: 'Anton, sans-serif', color: COLORS.ink }}>
                  {editingProduct ? 'ИЗМЕНИТЬ ТОВАР' : 'НОВЫЙ ТОВАР'}
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.bgCard, color: COLORS.inkFaint, border: `1px solid ${COLORS.rule}` }}>
                ✕
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6">
              {/* Фото */}
              <div>
                <label className="text-[10px] font-bold block mb-3 tracking-wider uppercase" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  <i className="fas fa-images text-xs mr-1"></i> ФОТОГРАФИИ
                </label>
                <div className="flex flex-wrap gap-3 mb-3 p-4 rounded min-h-[120px]" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
                  {imagePreviews.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <div className="w-24 h-24 rounded overflow-hidden" style={{ backgroundColor: COLORS.bg, border: `2px solid ${COLORS.rule}` }}>
                        <img src={img} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <div className="absolute top-0 left-0 text-[8px] font-bold px-2 py-0.5 z-10" style={{ backgroundColor: COLORS.stamp, color: COLORS.bg, fontFamily: 'JetBrains Mono, monospace' }}>
                            MAIN
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center gap-2 z-20" style={{ backgroundColor: 'rgba(10,10,11,0.8)' }}>
                        {idx > 0 && (
                          <button onClick={() => moveImageLeft(idx)} className="w-8 h-8 rounded-full flex items-center justify-center transition" style={{ backgroundColor: COLORS.bgCard, color: COLORS.ink }}>
                            <i className="fas fa-chevron-left text-xs"></i>
                          </button>
                        )}
                        {idx < imagePreviews.length - 1 && (
                          <button onClick={() => moveImageRight(idx)} className="w-8 h-8 rounded-full flex items-center justify-center transition" style={{ backgroundColor: COLORS.bgCard, color: COLORS.ink }}>
                            <i className="fas fa-chevron-right text-xs"></i>
                          </button>
                        )}
                        <button onClick={() => removeImage(idx)} className="w-8 h-8 rounded-full flex items-center justify-center transition" style={{ backgroundColor: '#8a4a4a', color: COLORS.ink }}>
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>
                  ))}

                  <label className="cursor-pointer w-24 h-24 rounded flex flex-col items-center justify-center border-2 border-dashed transition" style={{ backgroundColor: COLORS.bg, borderColor: COLORS.ruleStrong }}>
                    {isUploading ? (
                      <div className="w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: COLORS.rule, borderTopColor: COLORS.stamp }}></div>
                    ) : (
                      <>
                        <i className="fas fa-plus text-xl" style={{ color: COLORS.inkFaint }}></i>
                        <span className="text-[9px] mt-1" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>ДОБАВИТЬ</span>
                      </>
                    )}
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                  </label>
                </div>
              </div>

              {/* Название */}
              <div>
                <label className="text-[10px] font-bold block mb-2 tracking-wider uppercase" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  <i className="fas fa-tag text-xs mr-1"></i> НАЗВАНИЕ ТОВАРА
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded text-sm"
                  style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                  placeholder="Введите название товара"
                />
              </div>

              {/* Цена */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-[10px] font-bold block mb-2 tracking-wider uppercase" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    <i className="fas fa-ruble-sign text-xs mr-1"></i> ЦЕНА
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded text-sm"
                    style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                    placeholder="0 ₽"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold block mb-2 tracking-wider uppercase" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    <i className="fas fa-percent text-xs mr-1"></i> СТАРАЯ ЦЕНА
                  </label>
                  <input
                    type="number"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    className="w-full px-4 py-3 rounded text-sm"
                    style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                    placeholder="0 ₽"
                  />
                </div>
              </div>

              {/* Тип поставки */}
              <div>
                <label className="text-[10px] font-bold block mb-3 tracking-wider uppercase" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  <i className="fas fa-box text-xs mr-1"></i> ТИП ПОСТАВКИ
                </label>
                <div className="flex gap-4 flex-wrap">
                  <label className="flex items-center gap-3 cursor-pointer px-4 py-3 rounded" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${formData.stockType === 'in_stock' ? COLORS.stamp : COLORS.rule}` }}>
                    <input
                      type="radio"
                      name="stockType"
                      value="in_stock"
                      checked={formData.stockType === 'in_stock'}
                      onChange={() => setFormData({ ...formData, stockType: 'in_stock' })}
                      className="hidden"
                    />
                    <span className="w-4 h-4 rounded-full border flex items-center justify-center" style={{ borderColor: formData.stockType === 'in_stock' ? COLORS.stamp : COLORS.rule }}>
                      {formData.stockType === 'in_stock' && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.stamp }} />}
                    </span>
                    <div>
                      <span className="text-sm font-medium" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>В НАЛИЧИИ (РФ)</span>
                      <p className="text-[9px] mt-0.5" style={{ color: COLORS.olive }}>доставка 2-5 дней</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer px-4 py-3 rounded" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${formData.stockType === 'preorder' ? COLORS.stamp : COLORS.rule}` }}>
                    <input
                      type="radio"
                      name="stockType"
                      value="preorder"
                      checked={formData.stockType === 'preorder'}
                      onChange={() => setFormData({ ...formData, stockType: 'preorder' })}
                      className="hidden"
                    />
                    <span className="w-4 h-4 rounded-full border flex items-center justify-center" style={{ borderColor: formData.stockType === 'preorder' ? COLORS.stamp : COLORS.rule }}>
                      {formData.stockType === 'preorder' && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.stamp }} />}
                    </span>
                    <div>
                      <span className="text-sm font-medium" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>ПОД ЗАКАЗ (КИТАЙ)</span>
                      <p className="text-[9px] mt-0.5" style={{ color: COLORS.gold }}>доставка 20-35 дней</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Категория, Бренд, Количество */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="relative">
                  <label className="text-[10px] font-bold block mb-2 tracking-wider uppercase" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    <i className="fas fa-folder text-xs mr-1"></i> КАТЕГОРИЯ
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded text-sm transition"
                    style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    <span className="text-left truncate">{selectedCategoryObj?.name || 'Выберите категорию'}</span>
                    <i className={`fas fa-chevron-down text-xs transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} style={{ color: COLORS.inkFaint }}></i>
                  </button>
                  {isCategoryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded shadow-2xl z-50 max-h-60 overflow-y-auto" style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.ruleStrong}` }}>
                      {categoriesList.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryChange(cat.slug)}
                          className="w-full text-left px-4 py-3 text-sm transition"
                          style={{
                            backgroundColor: formData.category === cat.slug ? COLORS.bgCard : 'transparent',
                            color: formData.category === cat.slug ? COLORS.ink : COLORS.inkSoft,
                            fontFamily: 'JetBrains Mono, monospace',
                          }}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="text-[10px] font-bold block mb-2 tracking-wider uppercase" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    <i className="fas fa-tag text-xs mr-1"></i> БРЕНД
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded text-sm transition"
                    style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    <span className="text-left truncate">{selectedBrandObj?.name || 'Выберите бренд'}</span>
                    <i className={`fas fa-chevron-down text-xs transition-transform ${isBrandDropdownOpen ? 'rotate-180' : ''}`} style={{ color: COLORS.inkFaint }}></i>
                  </button>
                  {isBrandDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded shadow-2xl z-50 max-h-60 overflow-y-auto" style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.ruleStrong}` }}>
                      {brandsList.map(brand => (
                        <button
                          key={brand.id}
                          onClick={() => {
                            setFormData({ ...formData, brand: brand.slug });
                            setIsBrandDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 text-sm transition"
                          style={{
                            backgroundColor: formData.brand === brand.slug ? COLORS.bgCard : 'transparent',
                            color: formData.brand === brand.slug ? COLORS.ink : COLORS.inkSoft,
                            fontFamily: 'JetBrains Mono, monospace',
                          }}
                        >
                          {brand.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold block mb-2 tracking-wider uppercase" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    <i className="fas fa-database text-xs mr-1"></i> КОЛИЧЕСТВО
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 rounded text-sm"
                    style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Размеры */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-bold tracking-wider uppercase" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    <i className="fas fa-ruler-combined text-xs mr-1"></i> РАЗМЕРЫ
                  </label>
                  <span className="text-[9px]" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    {selectedCategoryObj?.name || 'Выберите категорию'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 p-4 rounded min-h-[60px]" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
                  {currentSizes.length > 0 ? (
                    currentSizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className="w-12 h-10 rounded text-xs font-semibold transition-all"
                        style={{
                          backgroundColor: formData.sizes.includes(size) ? COLORS.ink : COLORS.bg,
                          color: formData.sizes.includes(size) ? COLORS.bg : COLORS.inkSoft,
                          border: `1px solid ${formData.sizes.includes(size) ? COLORS.ink : COLORS.rule}`,
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        {size}
                      </button>
                    ))
                  ) : (
                    <p className="text-sm" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Выберите категорию</p>
                  )}
                </div>
                {formData.sizes.length > 0 && (
                  <p className="text-[9px] mt-2" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Выбрано: {formData.sizes.join(', ')}</p>
                )}
              </div>

              {/* Цвета */}
              <div>
                <label className="text-[10px] font-bold block mb-3 tracking-wider uppercase" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  <i className="fas fa-palette text-xs mr-1"></i> ЦВЕТА
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.code}
                      type="button"
                      onClick={() => handleColorToggle(color.code)}
                      className="w-9 h-9 rounded-xl border-2 transition-all"
                      style={{
                        backgroundColor: color.value,
                        borderColor: formData.colors.includes(color.code) ? COLORS.stamp : COLORS.rule,
                        boxShadow: formData.colors.includes(color.code) ? `0 0 0 3px ${COLORS.stamp}40` : 'none',
                        transform: formData.colors.includes(color.code) ? 'scale(1.1)' : 'scale(1)',
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
                {formData.colors.length > 0 && (
                  <p className="text-[10px] mt-2" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>Выбрано цветов: {formData.colors.length}</p>
                )}
              </div>

              {/* Чекбоксы */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${formData.isNew ? COLORS.stamp : COLORS.rule}` }}>
                  <span className="w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: formData.isNew ? COLORS.stamp : COLORS.rule, backgroundColor: formData.isNew ? COLORS.stamp : 'transparent' }}>
                    {formData.isNew && <i className="fas fa-check text-[8px]" style={{ color: COLORS.bg }} />}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="hidden"
                  />
                  <span className="text-sm" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>NEW</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${formData.isSale ? COLORS.stamp : COLORS.rule}` }}>
                  <span className="w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: formData.isSale ? COLORS.stamp : COLORS.rule, backgroundColor: formData.isSale ? COLORS.stamp : 'transparent' }}>
                    {formData.isSale && <i className="fas fa-check text-[8px]" style={{ color: COLORS.bg }} />}
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.isSale}
                    onChange={(e) => setFormData({ ...formData, isSale: e.target.checked })}
                    className="hidden"
                  />
                  <span className="text-sm" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>SALE</span>
                </label>
              </div>

              {/* Описание */}
              <div>
                <label className="text-[10px] font-bold block mb-2 tracking-wider uppercase" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  <i className="fas fa-align-left text-xs mr-1"></i> ОПИСАНИЕ
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded text-sm resize-none"
                  style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }}
                  placeholder="Подробное описание товара..."
                />
              </div>

              {/* Кнопки */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={editingProduct ? handleEditProduct : handleAddProduct}
                  disabled={isUploading}
                  className="flex-1 py-3 rounded text-xs font-black tracking-wider transition disabled:opacity-50"
                  style={{ backgroundColor: COLORS.ink, color: COLORS.bg, fontFamily: 'JetBrains Mono, monospace', border: `1px solid ${COLORS.ink}` }}
                >
                  {editingProduct ? '💾 СОХРАНИТЬ' : '➕ ДОБАВИТЬ'}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded text-xs font-medium transition"
                  style={{ backgroundColor: 'transparent', color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace', border: `1px solid ${COLORS.rule}` }}
                >
                  ❌ ОТМЕНА
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