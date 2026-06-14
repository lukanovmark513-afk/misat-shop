import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavoriteAsync } from '../store/slices/favoritesSlice';
import { addToCartAsync } from '../store/slices/cartSlice';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';

const FavoritesPage = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

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
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
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
        const favProducts = productsWithArrays.filter((p: any) => favorites.includes(p.id));
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

  const handleRemoveFromFavorites = (productId: number, productName: string) => {
    dispatch(toggleFavoriteAsync(productId));
    toast.success(`${productName} удалён из избранного`);
  };

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
      toast.error('Ошибка при добавлении в корзину');
    } finally {
      setAddingToCart(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 text-xs tracking-wider mt-4 animate-pulse">ЗАГРУЗКА</p>
        </div>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-20">
        <div className="w-full px-4 md:px-8 lg:px-16 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-6">
              <i className="far fa-heart text-white/40 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">ИЗБРАННОЕ ПУСТО</h2>
            <p className="text-gray-400 text-sm mb-8">Добавляйте товары в избранное, чтобы не потерять их</p>
            <Link to="/catalog" className="inline-block bg-white text-black px-8 py-3 font-bold text-sm tracking-wider hover:bg-white/90 transition rounded-xl">
              ПЕРЕЙТИ В КАТАЛОГ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">
      <div className="w-full px-4 md:px-8 lg:px-16 py-8">

        {/* Баннер */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900/80 via-gray-800/80 to-black border border-white/10 mb-8">
          <div className="absolute inset-0 opacity-20">
            <img
              src="/images/brands/raspr.jpg"
              alt="Favorites"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

          <div className="relative py-8 px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-0.5 bg-white/40"></div>
                <span className="text-gray-400 text-[10px] tracking-[0.3em]">ИЗБРАННОЕ</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
                ИЗБРАННЫЕ ТОВАРЫ
              </h1>
              <p className="text-gray-400 text-sm mt-2">
                <span className="text-white font-bold">{favoriteProducts.length}</span> товаров в избранном
              </p>
            </div>
          </div>
        </div>

        {/* Десктопная сетка с отзывами */}
        {!isMobile ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {favoriteProducts.map(product => (
              <div key={product.id} className="group bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 border border-white/10 hover:border-white/30">
                <Link to={`/product/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                    <img
                      src={product.images?.[0] || product.image || 'https://placehold.co/400x400/1a1a1a/666666'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/1a1a1a/666666';
                      }}
                    />
                    {product.is_new && (
                      <span className="absolute top-2 left-2 bg-white/90 text-black text-[9px] font-bold px-2 py-0.5 rounded-full">NEW</span>
                    )}
                    {product.is_sale && product.old_price && (
                      <span className="absolute top-2 right-2 bg-red-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        -{Math.round((1 - product.price / product.old_price) * 100)}%
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-white font-bold text-sm mb-1 hover:text-gray-300 transition line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>

                  {/* ЗВЁЗДЫ РЕЙТИНГА */}
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
                        } text-[9px]`}
                      />
                    ))}
                    {product.reviews > 0 && (
                      <span className="text-gray-500 text-[9px] ml-1">({product.reviews})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-white font-bold text-base">{product.price.toLocaleString()} ₽</span>
                    {product.old_price && (
                      <span className="text-gray-500 text-[9px] line-through">{product.old_price.toLocaleString()} ₽</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCart === product.id}
                      className="flex-1 bg-white/10 text-white py-2 rounded-lg text-[10px] font-bold tracking-wider hover:bg-white hover:text-black transition disabled:opacity-50"
                    >
                      {addingToCart === product.id ? '...' : 'В КОРЗИНУ'}
                    </button>
                    <button
                      onClick={() => handleRemoveFromFavorites(product.id, product.name)}
                      className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-[10px] font-bold hover:bg-red-500 hover:text-white transition"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Мобильная версия с отзывами */
          <div className="space-y-3 pb-20">
            {favoriteProducts.map(product => (
              <div key={product.id} className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex gap-3">
                  <Link to={`/product/${product.id}`} className="flex-shrink-0">
                    <img
                      src={product.images?.[0] || product.image || 'https://placehold.co/80x80/1a1a1a/666666'}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/1a1a1a/666666';
                      }}
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-white font-bold text-sm line-clamp-1">{product.name}</h3>
                    </Link>

                    {/* ЗВЁЗДЫ РЕЙТИНГА */}
                    <div className="flex items-center gap-0.5 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`${
                            star <= Math.floor(product.rating)
                              ? 'fas fa-star text-amber-400'
                              : star - 0.5 <= product.rating
                              ? 'fas fa-star-half-alt text-amber-400'
                              : 'far fa-star text-gray-500'
                          } text-[8px]`}
                        />
                      ))}
                      {product.reviews > 0 && (
                        <span className="text-gray-500 text-[8px] ml-1">({product.reviews})</span>
                      )}
                    </div>

                    <p className="text-white font-bold text-sm mt-1">{product.price.toLocaleString()} ₽</p>
                    <div className="flex justify-between items-center mt-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-[9px] font-bold hover:bg-white hover:text-black transition"
                      >
                        В КОРЗИНУ
                      </button>
                      <button
                        onClick={() => handleRemoveFromFavorites(product.id, product.name)}
                        className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-[9px] font-bold hover:bg-red-500 hover:text-white transition"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;