import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCartAsync } from '../store/slices/cartSlice';
import { toggleFavoriteAsync } from '../store/slices/favoritesSlice';
import { productsAPI, categoriesAPI } from '../services/api';
import toast from 'react-hot-toast';

const CatalogPage = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(50000);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const itemsPerPage = 12;
  const searchRef = useRef<HTMLDivElement>(null);

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

  // Функция для получения рейтинга товара из отзывов
  const getProductRating = (productId: number) => {
    const allReviews = JSON.parse(localStorage.getItem('misat_reviews') || '[]');
    const productReviews = allReviews.filter((r: any) => r.productId === productId);
    if (productReviews.length === 0) return 0;
    const avg = productReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / productReviews.length;
    return Math.round(avg * 2) / 2;
  };

  // Функция для получения количества отзывов
  const getProductReviewsCount = (productId: number) => {
    const allReviews = JSON.parse(localStorage.getItem('misat_reviews') || '[]');
    return allReviews.filter((r: any) => r.productId === productId).length;
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
      }
    };
    loadCategories();
  }, []);

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
          rating: getProductRating(product.id),
          reviews: getProductReviewsCount(product.id)
        }));
        setProducts(productsWithArrays);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        toast.error('Ошибка загрузки товаров');
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filterCategories = React.useMemo(() => {
    const result: any[] = [{ id: 'all', name: 'Все товары', count: products.length }];
    categories.forEach(cat => {
      if (cat.is_active !== false) {
        result.push({
          id: cat.slug,
          name: cat.name,
          count: products.filter(p => p.category === cat.name).length
        });
      }
    });
    return result;
  }, [categories, products]);

  const applyFilters = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      const selectedCat = categories.find(c => c.slug === selectedCategory);
      if (selectedCat) {
        filtered = filtered.filter(p => p.category === selectedCat.name);
      }
    }

    if (selectedBrand !== 'all') {
      filtered = filtered.filter(p =>
        p.brand?.toLowerCase().includes(selectedBrand.toLowerCase())
      );
    }

    filtered = filtered.filter(p => p.price >= priceMin && p.price <= priceMax);

    if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

    const totalPagesCount = Math.ceil(filtered.length / itemsPerPage);
    setTotalPages(totalPagesCount);
    const startIndex = (currentPage - 1) * itemsPerPage;
    setFilteredProducts(filtered.slice(startIndex, startIndex + itemsPerPage));
  };

  useEffect(() => {
    if (products.length > 0) {
      applyFilters();
    }
  }, [products, selectedCategory, selectedBrand, priceMin, priceMax, sortBy, searchQuery, currentPage, categories]);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const timer = setTimeout(() => {
        const suggestions = products.filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6);
        setSearchSuggestions(suggestions);
        setShowSuggestions(true);
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
  }, [selectedCategory, selectedBrand, priceMin, priceMax, sortBy, searchQuery]);

  const handleAddToCart = async (product: any) => {
    setAddingToCart(product.id);
    try {
      await dispatch(addToCartAsync({
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
    } catch (error) {
      toast.error('Ошибка при добавлении');
    } finally {
      setAddingToCart(null);
    }
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
    setPriceMin(0);
    setPriceMax(50000);
    setSortBy('popular');
    setSearchQuery('');
    setCurrentPage(1);
    setShowSuggestions(false);
    setShowMobileFilter(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pt-16 md:pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 md:w-16 md:h-16 mx-auto">
            <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 text-[10px] md:text-xs tracking-wider mt-3 md:mt-4 animate-pulse">ЗАГРУЗКА</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-16 md:pt-20">
        <div className="w-full px-4 md:px-8 lg:px-16 text-center pt-32 md:pt-20 pb-20">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-4 md:mb-6">
              <i className="fas fa-box-open text-white/40 text-2xl md:text-3xl"></i>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white mb-2 md:mb-4">ТОВАРОВ ПОКА НЕТ</h2>
            <p className="text-gray-400 text-xs md:text-sm mb-6 md:mb-8">Загляните позже</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16 md:pt-20">
      <div className="w-full px-3 md:px-8 lg:px-16 py-4 md:py-6">

        {/* Заголовок */}
        <div className="mb-6 md:mb-8 px-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px bg-white/40"></div>
            <span className="text-gray-400 text-[8px] md:text-[10px] tracking-[0.2em]">КАТАЛОГ</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-white">ВСЕ ТОВАРЫ</h1>
          <p className="text-gray-500 text-[9px] md:text-xs mt-1">{filteredProducts.length} товаров</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-8">

          {/* Фильтры (ПК) */}
          <div className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-white font-medium text-sm">Фильтры</h3>
              </div>

              <div ref={searchRef}>
                <label className="text-gray-500 text-[10px] font-medium block mb-2">Поиск</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Поиск товаров..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-black border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:border-white/30 focus:outline-none"
                  />
                  <i className="fas fa-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs"></i>
                </div>
              </div>

              <div>
                <label className="text-gray-500 text-[10px] font-medium block mb-2">Категории</label>
                <div className="space-y-1">
                  {filterCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-white text-black font-medium'
                          : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-gray-500">{cat.count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-500 text-[10px] font-medium block mb-2">Бренды</label>
                <div className="space-y-1">
                  {brands.map(brand => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedBrand === brand.id
                          ? 'bg-white text-black font-medium'
                          : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-500 text-[10px] font-medium block mb-2">Цена</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value))}
                    placeholder="от"
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:border-white/30 focus:outline-none"
                  />
                  <span className="text-gray-500 text-xs self-center">—</span>
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    placeholder="до"
                    className="w-full px-3 py-2 bg-black border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:border-white/30 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Товары */}
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <p className="text-gray-400 text-[10px] md:text-sm">
                Найдено <span className="text-white font-bold text-sm md:text-lg">{filteredProducts.length}</span> товаров
              </p>
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 bg-black border border-white/10 rounded-lg text-white text-xs focus:border-white/30 focus:outline-none cursor-pointer"
                >
                  <option value="popular">Популярные</option>
                  <option value="price-asc">Дешевле</option>
                  <option value="price-desc">Дороже</option>
                  <option value="rating">Рейтинг</option>
                </select>
                <button
                  onClick={() => setShowMobileFilter(true)}
                  className="lg:hidden flex items-center gap-1.5 bg-white/10 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-medium"
                >
                  <i className="fas fa-filter text-[10px]"></i> Фильтр
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white/5 rounded-lg md:rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-white/10"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                      <img
                        src={product.images?.[0] || product.image || 'https://placehold.co/400x400/1a1a1a/666666'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      {product.is_new && (
                        <span className="absolute top-2 left-2 bg-white text-black text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                      )}
                      {product.is_sale && product.old_price && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] md:text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          -{Math.round((1 - product.price / product.old_price) * 100)}%
                        </span>
                      )}
                      <button
                        onClick={(e) => handleToggleFavorite(product.id, e)}
                        className="absolute bottom-2 right-2 w-6 h-6 md:w-7 md:h-7 bg-black/60 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/20 transition"
                      >
                        <i className={`${favorites.includes(product.id) ? 'fas fa-heart text-red-400' : 'far fa-heart text-white'} text-[8px] md:text-[10px]`}></i>
                      </button>
                    </div>
                  </Link>
                  <div className="p-2 md:p-3">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-white font-semibold text-[10px] md:text-sm mb-0.5 line-clamp-1">{product.name}</h3>
                    </Link>

                    {/* ЗВЁЗДЫ РЕЙТИНГА (КАК НА ГЛАВНОЙ) */}
                    <div className="flex items-center gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`${
                            star <= Math.floor(product.rating)
                              ? 'fas fa-star text-amber-400'
                              : star - 0.5 <= product.rating
                              ? 'fas fa-star-half-alt text-amber-400'
                              : 'far fa-star text-gray-500'
                          } text-[8px] md:text-[9px]`}
                        />
                      ))}
                      {product.reviews > 0 && (
                        <span className="text-gray-500 text-[7px] md:text-[8px] ml-1">({product.reviews})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-white font-bold text-xs md:text-base">{product.price.toLocaleString()} ₽</span>
                      {product.old_price && (
                        <span className="text-gray-500 text-[7px] md:text-[9px] line-through">{product.old_price.toLocaleString()} ₽</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCart === product.id}
                      className="w-full bg-white/10 text-white py-1.5 md:py-2 rounded-lg text-[8px] md:text-[10px] font-bold tracking-wider hover:bg-white hover:text-black transition disabled:opacity-50"
                    >
                      {addingToCart === product.id ? '...' : 'В КОРЗИНУ'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1 md:gap-2 mt-8 md:mt-12 flex-wrap">
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="w-7 h-7 md:w-9 md:h-9 rounded-lg border border-white/20 text-white/50 disabled:opacity-30 hover:bg-white/10 transition text-xs">«</button>
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-7 h-7 md:w-9 md:h-9 rounded-lg border border-white/20 text-white/50 disabled:opacity-30 hover:bg-white/10 transition text-xs">‹</button>
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 md:w-9 md:h-9 rounded-lg text-[10px] md:text-sm font-medium transition ${
                        currentPage === pageNum ? 'bg-white text-black' : 'text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-7 h-7 md:w-9 md:h-9 rounded-lg border border-white/20 text-white/50 disabled:opacity-30 hover:bg-white/10 transition text-xs">›</button>
                <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="w-7 h-7 md:w-9 md:h-9 rounded-lg border border-white/20 text-white/50 disabled:opacity-30 hover:bg-white/10 transition text-xs">»</button>
              </div>
            )}
          </div>
        </div>

        {/* МОБИЛЬНЫЙ ФИЛЬТР */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowMobileFilter(false)} />
            <div className="absolute bottom-0 left-0 right-0 bg-black rounded-t-2xl max-h-[85vh] overflow-y-auto border-t border-white/10">
              <div className="sticky top-0 bg-black p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg">ФИЛЬТРЫ</h3>
                <button onClick={() => setShowMobileFilter(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white text-sm">✕</button>
              </div>
              <div className="p-4 space-y-5">
                <div>
                  <label className="text-white/60 text-xs font-medium mb-1.5 block">Поиск</label>
                  <input type="text" placeholder="Поиск товаров..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm" />
                </div>
                <div>
                  <label className="text-white/60 text-xs font-medium mb-1.5 block">Категории</label>
                  <div className="grid grid-cols-2 gap-2">
                    {filterCategories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setShowMobileFilter(false); }}
                        className={`px-3 py-2.5 rounded-xl text-xs transition-all ${selectedCategory === cat.id ? 'bg-white text-black font-medium' : 'bg-white/10 text-white'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-white/60 text-xs font-medium mb-1.5 block">Бренды</label>
                  <div className="flex flex-wrap gap-2">
                    {brands.map(brand => (
                      <button
                        key={brand.id}
                        onClick={() => { setSelectedBrand(brand.id); setShowMobileFilter(false); }}
                        className={`px-3 py-2 rounded-xl text-xs transition-all ${selectedBrand === brand.id ? 'bg-white text-black font-medium' : 'bg-white/10 text-white'}`}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-white/60 text-xs font-medium mb-1.5 block">Цена</label>
                  <div className="flex gap-2">
                    <input type="number" value={priceMin} onChange={(e) => setPriceMin(Number(e.target.value))} placeholder="от" className="flex-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm" />
                    <input type="number" value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} placeholder="до" className="flex-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm" />
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 bg-black p-4 border-t border-white/10 flex gap-3">
                <button onClick={clearFilters} className="flex-1 py-2.5 border border-white/30 rounded-xl text-white text-sm">Сбросить всё</button>
                <button onClick={() => setShowMobileFilter(false)} className="flex-1 bg-white text-black py-2.5 rounded-xl text-sm font-bold">Применить</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
};

export default CatalogPage;