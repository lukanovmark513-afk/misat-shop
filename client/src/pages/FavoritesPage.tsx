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

  // Парсинг массивов из JSON строк
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

  const handleRemoveFromFavorites = (productId: number) => {
    dispatch(toggleFavoriteAsync(productId));
    toast.success('Удалено из избранного');
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCartAsync({ productId: product.id, quantity: 1, size: product.sizes?.[0] || 'M' }));
    toast.success(`${product.name} добавлен в корзину`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="container mx-auto px-4 py-20 text-center">
          <i className="far fa-heart text-6xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-black mb-4">ИЗБРАННОЕ ПУСТО</h2>
          <p className="text-gray-500 mb-8">Добавляйте товары в избранное, чтобы не потерять их</p>
          <Link to="/catalog" className="inline-block bg-black text-white px-8 py-3 font-black tracking-wider hover:bg-gray-800 transition">
            ПЕРЕЙТИ В КАТАЛОГ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter">ИЗБРАННОЕ</h1>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-black">
            {favoriteProducts.length} товаров
          </span>
        </div>

        {isMobile ? (
          <div className="space-y-4">
            {favoriteProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border">
                <div className="flex gap-3">
                  <Link to={`/product/${product.id}`} className="flex-shrink-0">
                    <img
                      src={product.images?.[0] || product.image || 'https://placehold.co/100x100/eeeeee/cccccc?text=No+Image'}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/eeeeee/cccccc?text=No+Image';
                      }}
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-black text-base">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <p className="font-black text-base">{product.price.toLocaleString()} ₽</p>
                        {product.old_price && (
                          <p className="text-xs text-gray-400 line-through">{product.old_price.toLocaleString()} ₽</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-black text-white px-3 py-1.5 rounded-full text-xs font-black"
                      >
                        В КОРЗИНУ
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveFromFavorites(product.id)}
                      className="w-full mt-2 border border-red-500 text-red-500 py-1.5 rounded-full text-xs font-black hover:bg-red-500 hover:text-white transition"
                    >
                      УДАЛИТЬ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteProducts.map(product => (
              <div key={product.id} className="group border-2 border-black hover:shadow-lg transition bg-white">
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
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-black text-lg mb-1 hover:opacity-70 transition line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <p className="font-black text-xl">{product.price.toLocaleString()} ₽</p>
                      {product.old_price && (
                        <p className="text-sm text-gray-400 line-through">{product.old_price.toLocaleString()} ₽</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-black text-white px-3 py-2 rounded-full text-sm font-black hover:bg-gray-800 transition"
                    >
                      В КОРЗИНУ
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveFromFavorites(product.id)}
                    className="w-full mt-3 border-2 border-red-500 text-red-500 py-2 rounded-full text-sm font-black hover:bg-red-500 hover:text-white transition"
                  >
                    УДАЛИТЬ
                  </button>
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