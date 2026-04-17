import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCartAsync } from '../store/slices/cartSlice';
import { toggleFavoriteAsync } from '../store/slices/favoritesSlice';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';

const CatalogPage = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;
  const searchRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all', name: 'Все товары' },
    { id: 'clothes', name: 'Одежда' },
    { id: 'shoes', name: 'Обувь' },
    { id: 'accessories', name: 'Аксессуары' },
  ];

  const brands = [
    { id: 'all', name: 'Все бренды' },
    { id: 'nike', name: 'Nike' },
    { id: 'adidas', name: 'Adidas' },
    { id: 'balenciaga', name: 'Balenciaga' },
    { id: 'raf-simons', name: 'Raf Simons' },
    { id: 'carhartt', name: 'Carhartt WIP' },
    { id: 'tnf', name: 'The North Face' },
  ];

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
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productsAPI.getAll();
        const productsWithArrays = response.data.map((product: any) => ({
          ...product,
          sizes: parseArrayField(product.sizes),
          colors: parseArrayField(product.colors),
          images: parseArrayField(product.images),
        }));
        setProducts(productsWithArrays);
        applyFilters(productsWithArrays);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        toast.error('Ошибка загрузки товаров');
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        const suggestions = products.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6);
        setSearchSuggestions(suggestions);
        setShowSuggestions(true);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowSuggestions(false);
      setSearchSuggestions([]);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, priceRange, sortBy, searchQuery]);

  useEffect(() => {
    applyFilters(products);
  }, [selectedCategory, selectedBrand, priceRange, sortBy, searchQuery, products]);

  const applyFilters = (productsList: any[]) => {
    let filtered = [...productsList];

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(selectedBrand.toLowerCase())
      );
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    const total = filtered.length;
    const totalPagesCount = Math.ceil(total / itemsPerPage);
    setTotalPages(totalPagesCount);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);
    setFilteredProducts(paginatedItems);
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCartAsync({
      productId: product.id,
      quantity: 1,
      size: product.sizes?.[0] || 'M',
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image,
        sizes: product.sizes,
        stockType: product.stockType,
        preorderDays: product.preorderDays
      }
    }));
    toast.success(`${product.name} добавлен в корзину`);
  };

  const handleToggleFavorite = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavoriteAsync(productId));
  };

  const handleSuggestionClick = (product: any) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setPriceRange([0, 50000]);
    setSortBy('popular');
    setSearchQuery('');
    setCurrentPage(1);
    setShowSuggestions(false);
    setShowMobileFilter(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 text-sm">Загрузка товаров...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <i className="fas fa-box-open text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-black mb-4">ТОВАРОВ ПОКА НЕТ</h2>
          <p className="text-gray-500 mb-8">Добавьте товары через админ-панель</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black">Каталог</h1>
          <button
            onClick={() => setShowMobileFilter(true)}
            className="md:hidden bg-black text-white px-4 py-2 rounded-full text-sm flex items-center gap-2"
          >
            <i className="fas fa-filter"></i> Фильтр
          </button>
        </div>

        <p className="text-gray-500 text-sm mb-4">Найдено {filteredProducts.length} товаров</p>

        {/* Desktop Filters */}
        <div className="hidden md:flex gap-8 mb-8 flex-wrap">
          <div className="w-80" ref={searchRef}>
            <h3 className="font-bold mb-3">ПОИСК</h3>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
                  className="w-full px-4 py-2 pr-10 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <i className="fas fa-search text-gray-400"></i>
                  )}
                </div>
              </div>
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  {searchSuggestions.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSuggestionClick(product)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition border-b last:border-b-0 text-left"
                    >
                      <img
                        src={product.images?.[0] || product.image || 'https://placehold.co/40x40/eeeeee/cccccc?text=No+Image'}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.price.toLocaleString()} ₽</p>
                        <p className="text-xs text-gray-400">
                          {product.stockType === 'in_stock' ? '✅ В наличии' : '📦 Предзаказ'}
                        </p>
                      </div>
                      <i className="fas fa-arrow-right text-gray-400 text-xs"></i>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="w-48">
            <h3 className="font-bold mb-3">Категории</h3>
            <div className="space-y-1">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    selectedCategory === cat.id ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="w-48">
            <h3 className="font-bold mb-3">Бренды</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {brands.map(brand => (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    selectedBrand === brand.id ? 'bg-black text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {brand.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-3">Цена до</h3>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-48 accent-black"
            />
            <p className="text-sm mt-2">{priceRange[1].toLocaleString()} ₽</p>
          </div>

          <div>
            <h3 className="font-bold mb-3">Сортировка</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="popular">По популярности</option>
              <option value="price-asc">Цена: по возрастанию</option>
              <option value="price-desc">Цена: по убыванию</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>

          <button onClick={clearFilters} className="self-end px-4 py-2 border rounded-lg text-sm hover:bg-gray-100">
            Сбросить
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition group">
              <Link to={`/product/${product.id}`}>
                <div className="relative bg-gray-100 aspect-square overflow-hidden">
                  <img
                    src={product.images?.[0] || product.image || 'https://placehold.co/400x400/eeeeee/cccccc?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/eeeeee/cccccc?text=No+Image';
                    }}
                  />
                  {product.is_new && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">NEW</span>
                  )}
                  {product.is_sale && product.old_price && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">SALE</span>
                  )}
                  <button
                    onClick={(e) => handleToggleFavorite(product.id, e)}
                    className="absolute bottom-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                  >
                    <i className={`${favorites.includes(product.id) ? 'fas fa-heart text-red-500' : 'far fa-heart'} text-xs`}></i>
                  </button>
                </div>
              </Link>
              <div className="p-2 md:p-3">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-bold text-xs md:text-sm line-clamp-1">{product.name}</h3>
                </Link>
                <p className="font-bold text-sm md:text-base mt-1">{product.price.toLocaleString()} ₽</p>

                {/* Статус доставки */}
                <div className="mt-1">
                  {product.stockType === 'in_stock' ? (
                    <span className="text-[10px] text-green-600">✅ В наличии (РФ)</span>
                  ) : (
                    <span className="text-[10px] text-orange-600">
                      📦 Предзаказ • ~{product.preorderDays || 30} дней
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full mt-2 bg-black text-white py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold"
                >
                  В корзину
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8 flex-wrap">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              «
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              ‹
            </button>

            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-full text-sm transition ${
                    currentPage === pageNum
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              ›
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
            >
              »
            </button>
          </div>
        )}

        {/* Mobile Filter Modal */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilter(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] overflow-y-auto animate-slideInUp">
              <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">Фильтры</h3>
                <button onClick={() => setShowMobileFilter(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
                  ✕
                </button>
              </div>
              <div className="p-4 space-y-5">
                <div>
                  <h4 className="font-bold mb-2">Поиск</h4>
                  <input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <h4 className="font-bold mb-2">Категории</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setShowMobileFilter(false);
                        }}
                        className={`px-4 py-2 rounded-full text-sm ${
                          selectedCategory === cat.id ? 'bg-black text-white' : 'bg-gray-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Бренды</h4>
                  <div className="flex flex-wrap gap-2">
                    {brands.map(brand => (
                      <button
                        key={brand.id}
                        onClick={() => {
                          setSelectedBrand(brand.id);
                          setShowMobileFilter(false);
                        }}
                        className={`px-4 py-2 rounded-full text-sm ${
                          selectedBrand === brand.id ? 'bg-black text-white' : 'bg-gray-100'
                        }`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Цена до</h4>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-black"
                  />
                  <p className="text-center text-sm mt-2 font-bold">{priceRange[1].toLocaleString()} ₽</p>
                </div>
                <div>
                  <h4 className="font-bold mb-2">Сортировка</h4>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="popular">По популярности</option>
                    <option value="price-asc">Цена: по возрастанию</option>
                    <option value="price-desc">Цена: по убыванию</option>
                    <option value="rating">По рейтингу</option>
                  </select>
                </div>
              </div>
              <div className="sticky bottom-0 bg-white p-4 border-t flex gap-3">
                <button onClick={clearFilters} className="flex-1 py-3 border-2 border-black rounded-xl font-bold text-sm">
                  Сбросить всё
                </button>
                <button onClick={() => setShowMobileFilter(false)} className="flex-1 bg-black text-white py-3 rounded-xl font-bold text-sm">
                  Применить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;