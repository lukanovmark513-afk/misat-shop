import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCartAsync } from '../store/slices/cartSlice';
import { toggleFavoriteAsync } from '../store/slices/favoritesSlice';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';
import HeroSlider from '../components/HeroSlider';

const MobileHomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const benefits = [
    { icon: 'fa-truck-fast', title: 'Доставка', desc: 'от 5 000 ₽' },
    { icon: 'fa-arrow-rotate-left', title: 'Возврат', desc: '30 дней' },
    { icon: 'fa-lock', title: 'Оплата', desc: 'Карты, СБП' },
    { icon: 'fa-gift', title: 'Подарки', desc: 'Для близких' }
  ];

  const categories = [
    { id: 'all', name: 'ВСЕ ТОВАРЫ', icon: 'fa-th-large' },
    { id: 'clothes', name: 'ОДЕЖДА', icon: 'fa-tshirt' },
    { id: 'shoes', name: 'ОБУВЬ', icon: 'fa-shoe-prints' },
    { id: 'accessories', name: 'АКСЕССУАРЫ', icon: 'fa-gem' }
  ];

  const categoryImages = {
    all: '/images/brands/всетовары.jpg',
    clothes: '/images/brands/одежда.jpg',
    shoes: '/images/brands/обувь.jpg',
    accessories: '/images/brands/аксессуары.jpg',
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
    const loadProducts = async () => {
      try {
        const response = await productsAPI.getAll();
        const productsWithArrays = response.data.map((product: any) => ({
          ...product,
          sizes: parseArrayField(product.sizes),
          colors: parseArrayField(product.colors),
          images: parseArrayField(product.images),
          rating: getProductRating(product.id),
          reviews: getProductReviewsCount(product.id)
        }));
        setProducts(productsWithArrays.slice(0, 4));
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

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
        sizes: product.sizes || ['S', 'M', 'L']
      }
    }));
    toast.success(`${product.name} добавлен в корзину`);
  };

  const handleToggleFavorite = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavoriteAsync(productId));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail || !subscribeEmail.includes('@')) {
      toast.error('Введите корректный email');
      return;
    }

    setIsSubscribing(true);
    setTimeout(() => {
      toast.success('Спасибо за подписку!');
      setSubscribeEmail('');
      setIsSubscribing(false);
    }, 500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/40 text-xs tracking-wider">ЗАГРУЗКА</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">

      <HeroSlider />

      <div className="px-4 py-3 border-b border-white/10">
        <div className="grid grid-cols-4 gap-2">
          {benefits.map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="w-10 h-10 mx-auto bg-white/5 rounded-xl flex items-center justify-center mb-1">
                <i className={`fas ${item.icon} text-white/60 text-sm`}></i>
              </div>
              <p className="text-white text-[9px] font-bold mb-0.5">{item.title}</p>
              <p className="text-gray-500 text-[7px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-3">
        <Link to="/catalog?category=sale">
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black">
            <div className="relative h-[140px] md:h-[200px] overflow-hidden">
              <img
                src="/images/brands/raspr.jpg"
                alt="Распродажа"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent"></div>
            </div>
            <div className="absolute inset-0 flex flex-col justify-center px-5">
              <div className="inline-flex items-center gap-1.5 bg-red-500/20 px-2 py-0.5 rounded-full mb-2 w-fit">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-400 text-[8px] font-bold">🔥 СЕЗОННАЯ РАСПРОДАЖА</span>
              </div>
              <h2 className="text-white text-xl md:text-2xl font-black mb-1">СКИДКА ДО 50%</h2>
              <p className="text-gray-300 text-[10px] md:text-xs mb-3">На все товары из коллекции</p>
              <span className="inline-flex items-center gap-1 text-white text-[9px] md:text-[10px] font-bold">
                ВЫБРАТЬ →
              </span>
            </div>
          </div>
        </Link>
      </div>

      <div className="px-4 py-2">
        <div className="text-center mb-2">
          <p className="text-gray-500 text-[8px] tracking-[0.3em] mb-0.5">КАТАЛОГ</p>
          <h2 className="text-white text-lg font-black">КАТЕГОРИИ</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const count = cat.id === 'all'
              ? products.length
              : products.filter(p => p.category === cat.name || p.category === cat.id).length;

            return (
              <Link
                key={cat.id}
                to={`/catalog?category=${cat.id}`}
                className="group relative overflow-hidden rounded-xl aspect-[3/4] bg-black"
              >
                <img
                  src={categoryImages[cat.id as keyof typeof categoryImages]}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />

                <div className="relative h-full flex flex-col justify-end p-3">
                  <i className={`fas ${cat.icon} text-white/60 text-lg mb-1`}></i>
                  <h3 className="text-white font-bold text-sm leading-tight">{cat.name}</h3>
                  <p className="text-white/40 text-[9px] mt-0.5">{count} товаров</p>
                  <div className="flex items-center gap-1 text-white/40 group-hover:text-white/80 transition-all mt-1">
                    <span className="text-[8px] font-bold tracking-wider">ПЕРЕЙТИ</span>
                    <i className="fas fa-arrow-right text-[7px] group-hover:translate-x-0.5 transition"></i>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ПОПУЛЯРНЫЕ ТОВАРЫ С РЕАЛЬНЫМ РЕЙТИНГОМ */}
      <div className="px-4 py-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white text-lg font-black">ПОПУЛЯРНОЕ</h2>
          <Link to="/catalog" className="text-gray-500 text-[9px] hover:text-white transition">
            ВСЕ →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300">
              <Link to={`/product/${product.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                  <img
                    src={product.images?.[0] || product.image || 'https://placehold.co/400x300/1a1a1a/666666'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {product.is_new && (
                    <span className="absolute top-2 left-2 bg-white text-black text-[8px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                  )}
                  {product.is_sale && product.old_price && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                      -{Math.round((1 - product.price / product.old_price) * 100)}%
                    </span>
                  )}
                  <button
                    onClick={(e) => handleToggleFavorite(product.id, e)}
                    className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-sm ${
                      favorites.includes(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-black/60 text-white/80'
                    }`}
                  >
                    <i className={`${favorites.includes(product.id) ? 'fas fa-heart' : 'far fa-heart'} text-[10px]`}></i>
                  </button>
                </div>
              </Link>
              <div className="p-2.5">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-white font-semibold text-[10px] mb-0.5 line-clamp-1 group-hover:text-white/80">
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
                      } text-[8px]`}
                    />
                  ))}
                  {product.reviews > 0 && (
                    <span className="text-gray-500 text-[7px] ml-1">({product.reviews})</span>
                  )}
                </div>

                <div className="flex items-center gap-1 mb-2">
                  <span className="text-white font-bold text-sm">{product.price.toLocaleString()} ₽</span>
                  {product.old_price && (
                    <span className="text-gray-500 text-[8px] line-through">{product.old_price.toLocaleString()} ₽</span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-white/10 text-white py-1.5 rounded-lg text-[8px] font-bold hover:bg-white/20 transition"
                >
                  В КОРЗИНУ
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 pt-2 pb-4 border-t border-white/10">
        <div className="text-center mb-2">
          <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full mb-1">
            <i className="fas fa-envelope text-white/50 text-[10px]"></i>
            <span className="text-white/50 text-[9px] tracking-wider">НОВОСТИ</span>
          </div>
          <h3 className="text-white text-base font-black mb-0">ПОДПИШИТЕСЬ</h3>
          <p className="text-gray-500 text-[9px] max-w-[280px] mx-auto">
            Будьте в курсе новых коллекций и акций
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="max-w-sm mx-auto">
          <div className="flex gap-2">
            <input
              type="email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder="Ваш email"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-white/30 transition"
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-gray-200 transition disabled:opacity-50"
            >
              {isSubscribing ? (
                <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'ПОДПИСАТЬСЯ'
              )}
            </button>
          </div>
        </form>

        <div className="flex justify-center gap-5 mt-3">
          <a href="#" className="flex flex-col items-center gap-0.5 group">
            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all duration-300">
              <i className="fab fa-telegram text-white/40 text-xs group-hover:text-white/70 transition"></i>
            </div>
            <span className="text-white/30 text-[6px] group-hover:text-white/50 transition">Telegram</span>
          </a>
          <a href="#" className="flex flex-col items-center gap-0.5 group">
            <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all duration-300">
              <i className="fab fa-tiktok text-white/40 text-xs group-hover:text-white/70 transition"></i>
            </div>
            <span className="text-white/30 text-[6px] group-hover:text-white/50 transition">TikTok</span>
          </a>
        </div>
      </div>

    </div>
  );
};

export default MobileHomePage;