import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavoriteAsync } from '../store/slices/favoritesSlice';
import { addToCartAsync } from '../store/slices/cartSlice';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';

// ============================================
// ТИПЫ
// ============================================
interface Product {
  id: number;
  name: string;
  price: number;
  old_price?: number;
  image?: string;
  images: string[];
  sizes: string[];
  colors: string[];
  category: string;
  rating: number;
  reviews: number;
  is_new?: boolean;
  is_sale?: boolean;
  stockType?: string;
  preorderDays?: number;
  prepaymentPercent?: number;
}

// ============================================
// БЕЗОПАСНЫЙ ПАРСЕР
// ============================================
const safeParseArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

// ============================================
// КОМПОНЕНТ КАРТОЧКИ ТОВАРА
// ============================================
interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: number, e: React.MouseEvent) => void;
  onAddToCart: (product: Product) => void;
  isAdding: boolean;
}

const ProductCard = React.memo(({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  isAdding
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getStatusBadge = () => {
    switch (product.stockType) {
      case 'instock':
        return { text: 'В НАЛИЧИИ', className: 'text-green-400 border-green-400/20' };
      case 'china':
        return { text: 'ПОД ЗАКАЗ', className: 'text-yellow-400 border-yellow-400/20' };
      case 'preorder':
        return { text: 'ПРЕДЗАКАЗ', className: 'text-amber-400 border-amber-400/20' };
      default:
        return { text: 'В НАЛИЧИИ', className: 'text-green-400 border-green-400/20' };
    }
  };

  const status = getStatusBadge();

  // На мобильных кнопка всегда видна, на ПК - только при ховере
  const buttonVisibility = isMobile
    ? 'opacity-100 translate-y-0'
    : (isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2');

  return (
    <div
      className="group bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-[#0a0a0a]">
          <img
            src={product.images?.[0] || product.image || 'https://placehold.co/400x400/0a0a0a/333'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {(product.stockType === 'instock' || product.stockType === 'china' || product.stockType === 'preorder') && (
            <span className={`absolute bottom-3 left-3 bg-black/80 backdrop-blur px-2 py-1 text-[8px] tracking-[0.15em] border ${status.className}`}>
              {status.text}
            </span>
          )}

          {product.is_new && (
            <span className="absolute top-3 left-3 text-[9px] tracking-[0.15em] text-white/40 border border-white/20 px-2 py-0.5">
              НОВИНКА
            </span>
          )}
          {product.is_sale && product.old_price && (
            <span className="absolute top-3 right-3 text-[9px] tracking-[0.15em] text-white/40 border border-white/20 px-2 py-0.5">
              SALE
            </span>
          )}

          <button
            onClick={(e) => onToggleFavorite(product.id, e)}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10
              ${isFavorite
                ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/30'
                : 'bg-black/60 backdrop-blur text-white/60 hover:bg-white/20'
              }
              ${isHovered || isMobile ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-xs`} />
          </button>
        </div>
      </Link>

      <div className="p-3 md:p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white font-medium text-xs md:text-sm mb-1 hover:text-white/70 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-0.5 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <i
              key={star}
              className={`${
                star <= Math.floor(product.rating)
                  ? 'fas fa-star text-amber-400'
                  : star - 0.5 <= product.rating
                  ? 'fas fa-star-half-alt text-amber-400'
                  : 'far fa-star text-white/20'
              } text-[8px] md:text-[9px]`}
            />
          ))}
          {product.reviews > 0 && (
            <span className="text-white/20 text-[7px] md:text-[8px] ml-1">({product.reviews})</span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-white font-bold text-sm md:text-base">
            {product.price.toLocaleString()} ₽
          </span>
          {product.old_price && (
            <span className="text-white/30 text-[9px] md:text-xs line-through">
              {product.old_price.toLocaleString()} ₽
            </span>
          )}
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={isAdding}
          className={`w-full py-2 md:py-2.5 rounded-xl text-[9px] md:text-[10px] font-bold tracking-wider transition-all duration-300 ${buttonVisibility}
            bg-white/10 hover:bg-white hover:text-black text-white border border-white/10 disabled:opacity-50`}
        >
          {isAdding ? '...' : 'В КОРЗИНУ'}
        </button>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// ============================================
// ОСНОВНОЙ КОМПОНЕНТ
// ============================================
const FavoritesPage = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // Множество избранного для O(1) проверки
  const favoriteSet = useMemo(
    () => new Set(favorites),
    [favorites]
  );

  // ============================================
  // ЗАГРУЗКА ТОВАРОВ
  // ============================================
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        const response = await productsAPI.getAll();

        let productsData = [];
        if (Array.isArray(response.data)) {
          productsData = response.data;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          productsData = response.data.data;
        } else if (response.data?.products && Array.isArray(response.data.products)) {
          productsData = response.data.products;
        } else {
          console.error('Неожиданный формат ответа:', response.data);
          productsData = [];
        }

        const parsed = productsData.map((p: any) => ({
          ...p,
          sizes: safeParseArray(p.sizes),
          colors: safeParseArray(p.colors),
          images: safeParseArray(p.images),
          rating: 0,
          reviews: 0,
          stockType: p.stockType || 'instock',
          preorderDays: p.preorderDays || 10,
          is_new: p.is_new || false,
          is_sale: p.is_sale || false,
          old_price: p.old_price || null,
        }));

        const favProducts = parsed.filter((p: any) => favorites.includes(p.id));
        setFavoriteProducts(favProducts);
      } catch (error) {
        console.error('Ошибка загрузки избранного:', error);
        toast.error('Ошибка загрузки');
      } finally {
        setIsLoading(false);
      }
    };
    loadFavorites();
  }, [favorites]);

  // ============================================
  // CALLBACKS
  // ============================================
  const handleAddToCart = useCallback(async (product: Product) => {
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
          image: product.images?.[0] || product.image || '',
          sizes: product.sizes || ['S', 'M', 'L'],
          stockType: product.stockType,
          preorderDays: product.preorderDays
        }
      }));
      toast.success(`${product.name} добавлен в корзину`);
    } catch (error) {
      toast.error('Ошибка при добавлении в корзину');
    } finally {
      setAddingToCart(null);
    }
  }, [dispatch]);

  const handleToggleFavorite = useCallback((productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavoriteAsync(productId));
  }, [dispatch]);

  // ============================================
  // LOADING
  // ============================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] pt-20 flex items-center justify-center">
        <div className="relative w-12 h-12 md:w-16 md:h-16 mx-auto">
          <div className="absolute inset-0 border border-white/10 rounded-full" />
          <div className="absolute inset-0 border border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // ============================================
  // ПУСТОЕ ИЗБРАННОЕ
  // ============================================
  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white pt-12 md:pt-20 pb-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#050505]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_55%)]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <div className="relative z-10 w-full px-4 md:px-8 lg:px-16 py-4 md:py-8">
          <div className="text-xs text-gray-500 mt-6 md:mt-0 mb-4 md:mb-6">
            <Link to="/" className="hover:text-white transition text-gray-400 md:text-gray-500 inline-block">
              Главная
            </Link>
            <span className="inline-block mx-1"> </span>
            <i className="fas fa-chevron-right text-[9px] text-gray-600 inline-block"></i>
            <span className="inline-block mx-1"> </span>
            <span className="text-white/80 md:text-white inline-block">Избранное</span>
          </div>

          <div className="max-w-md mx-auto text-center mt-2 md:mt-12">
            <div className="relative">
              <div className="w-28 h-28 md:w-32 md:h-32 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 md:mb-8 relative">
                <div className="absolute inset-0 bg-white/5 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 border border-white/10 rounded-full"></div>
                <i className="far fa-heart text-white/20 text-4xl md:text-5xl relative z-10"></i>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-3 md:mb-4">
              ИЗБРАННОЕ ПУСТО
            </h1>

            <p className="text-gray-400 text-xs md:text-sm mb-6 md:mb-8 max-w-sm mx-auto">
              Добавляйте товары в избранное, чтобы не потерять их.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/catalog" className="inline-flex items-center justify-center gap-2 bg-white text-black px-6 md:px-8 py-3 md:py-3.5 font-bold text-xs md:text-sm tracking-wider hover:bg-white/90 transition rounded-xl">
                <i className="fas fa-arrow-right text-xs md:text-sm"></i>
                ПЕРЕЙТИ В КАТАЛОГ
              </Link>
              <Link to="/" className="inline-flex items-center justify-center gap-2 border border-white/10 text-white/70 px-6 md:px-8 py-3 md:py-3.5 font-medium text-xs md:text-sm hover:bg-white/5 hover:text-white transition rounded-xl">
                <i className="fas fa-home text-xs md:text-sm"></i>
                НА ГЛАВНУЮ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // ИЗБРАННОЕ С ТОВАРАМИ
  // ============================================
  return (
    <div className="min-h-screen bg-[#050505] pt-16 md:pt-20 pb-20 md:pb-0 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#050505]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.04),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[150px]" />
        <div className="absolute bottom-[-100px] right-0 w-[300px] h-[300px] rounded-full bg-white/[0.015] blur-[120px]" />
      </div>

      <div className="relative z-10 w-full px-3 md:px-8 lg:px-16 py-4 md:py-6 pb-24 md:pb-6">

        {/* Хлебные крошки */}
        <div className="text-xs text-white/30 mt-2 md:mt-0 mb-4 md:mb-6">
          <Link to="/" className="hover:text-white/60 transition">Главная</Link>
          <span className="mx-1"> / </span>
          <span className="text-white/60">Избранное</span>
        </div>

        {/* Заголовок */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px bg-white/40"></div>
            <span className="text-white/30 text-[8px] md:text-[10px] tracking-[0.2em] font-bold">ИЗБРАННОЕ</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-white">ИЗБРАННЫЕ ТОВАРЫ</h1>
          <p className="text-white/30 text-[9px] md:text-xs mt-1">{favoriteProducts.length} товаров</p>
        </div>

        {/* Сетка товаров */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-5">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favoriteSet.has(product.id)}
              onToggleFavorite={handleToggleFavorite}
              onAddToCart={handleAddToCart}
              isAdding={addingToCart === product.id}
            />
          ))}
        </div>
      </div>

      <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default FavoritesPage;