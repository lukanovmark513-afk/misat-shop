import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCartAsync } from '../store/slices/cartSlice';
import { toggleFavoriteAsync } from '../store/slices/favoritesSlice';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: 'NIKE',
      subtitle: 'JUST DO IT',
      description: 'Новая коллекция Air Max. Стиль и комфорт.',
      bgColor: 'from-red-900 via-black to-black',
      btnText: 'КУПИТЬ',
      btnLink: '/catalog?brand=nike',
      image: '/images/brands/nike.jpg'
    },
    {
      title: 'ADIDAS',
      subtitle: 'IMPOSSIBLE IS NOTHING',
      description: 'Оригинальная коллекция Originals. Классика на все времена.',
      bgColor: 'from-blue-900 via-black to-black',
      btnText: 'СМОТРЕТЬ',
      btnLink: '/catalog?brand=adidas',
      image: '/images/brands/adidas.jpg'
    },
    {
      title: 'BALENCIAGA',
      subtitle: 'LUXURY STREETWEAR',
      description: 'Высокая мода встречает уличный стиль.',
      bgColor: 'from-purple-900 via-black to-black',
      btnText: 'ВЫБРАТЬ',
      btnLink: '/catalog?brand=balenciaga',
      image: '/images/brands/balenciaga.jpg'
    },
    {
      title: 'RAF SIMONS',
      subtitle: 'AVANT-GARDE',
      description: 'Экспериментальный дизайн. Культовые силуэты.',
      bgColor: 'from-emerald-900 via-black to-black',
      btnText: 'ПОСМОТРЕТЬ',
      btnLink: '/catalog?brand=raf-simons',
      image: '/images/brands/raf_simons.jpg'
    },
  ];

  const categories = [
    { id: 'all', name: 'ВСЕ', icon: 'fa-grid-2' },
    { id: 'clothes', name: 'ОДЕЖДА', icon: 'fa-tshirt' },
    { id: 'shoes', name: 'ОБУВЬ', icon: 'fa-shoe-prints' },
    { id: 'accessories', name: 'АКСЕССУАРЫ', icon: 'fa-clock' },
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
        const response = await productsAPI.getAll();
        const productsWithArrays = response.data.map((product: any) => ({
          ...product,
          sizes: parseArrayField(product.sizes),
          colors: parseArrayField(product.colors),
          images: parseArrayField(product.images),
        }));
        setProducts(productsWithArrays.slice(0, 8));
      } catch (error) {
        console.error('Ошибка загрузки:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleAddToCart = (product: any) => {
    dispatch(addToCartAsync({
      productId: product.id,
      quantity: 1,
      size: 'M',
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image,
        sizes: product.sizes || ['S', 'M', 'L']
      }
    }));
    toast.success(`${product.name} добавлен в корзину`, { icon: '🛒' });
  };

  const handleToggleFavorite = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavoriteAsync(productId));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <section className="relative h-[60vh] md:h-screen overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ${
              activeSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgColor} opacity-50`} />
            <div className="relative h-full flex items-center justify-center text-white px-4">
              <div className="text-center max-w-4xl">
                <p className="text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-300 mb-2 md:mb-4 animate-fadeInUp">
                  {slide.subtitle}
                </p>
                <h1 className="text-5xl md:text-8xl font-black mb-3 md:mb-6 tracking-tighter animate-fadeInUp delay-100">
                  {slide.title}
                </h1>
                <p className="text-sm md:text-lg text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-4 animate-fadeInUp delay-200">
                  {slide.description}
                </p>
                <Link
                  to={slide.btnLink}
                  className="inline-block bg-white text-black px-6 md:px-10 py-2 md:py-4 text-xs md:text-sm font-black tracking-[0.15em] md:tracking-[0.2em] hover:bg-transparent hover:text-white border-2 border-white transition-all duration-300 animate-fadeInUp delay-300"
                >
                  {slide.btnText}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Индикаторы слайдов - АДАПТИВНЫЕ ТОЧКИ */}
        <div className="absolute bottom-3 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`transition-all duration-300 ${
                activeSlide === index
                  ? 'w-4 md:w-8 bg-white'
                  : 'w-1.5 md:w-2 bg-white/50'
              } h-1 md:h-2 rounded-full`}
            />
          ))}
        </div>

        {/* Стрелки - только на десктопе */}
        <button
          onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="hidden md:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur items-center justify-center text-white text-lg md:text-xl transition z-20"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
          className="hidden md:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur items-center justify-center text-white text-lg md:text-xl transition z-20"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </section>

      {/* Категории */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-12">
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-400 mb-1 md:mb-2">Категории</p>
            <h2 className="text-2xl md:text-5xl font-black tracking-tighter">ВЫБЕРИТЕ КАТЕГОРИЮ</h2>
            <div className="w-12 md:w-20 h-0.5 bg-black mx-auto mt-2 md:mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalog?category=${cat.id}`}
                className="group p-3 md:p-6 rounded-xl md:rounded-2xl text-center transition-all duration-300 bg-gray-100 text-black hover:bg-black hover:text-white"
              >
                <i className={`fas ${cat.icon} text-2xl md:text-4xl mb-2 md:mb-3 group-hover:scale-110 transition`}></i>
                <p className="font-black text-xs md:text-sm tracking-wider">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Популярные товары */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-6 md:mb-8 flex-wrap gap-4">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-400 mb-1">Популярные товары</p>
              <h2 className="text-2xl md:text-4xl font-black tracking-tighter">ЛУЧШИЕ ПРЕДЛОЖЕНИЯ</h2>
            </div>
            <Link to="/catalog" className="text-xs md:text-sm font-black uppercase tracking-wider border-b-2 border-black pb-1 hover:opacity-70 transition">
              ВЕСЬ КАТАЛОГ <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <Link to={`/product/${product.id}`}>
                  <div className="relative bg-gray-100 aspect-square overflow-hidden">
                    <img
                      src={product.images?.[0] || product.image || 'https://placehold.co/400x400/eeeeee/cccccc?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.is_new && <span className="absolute top-2 md:top-3 left-2 md:left-3 bg-green-500 text-white text-[10px] md:text-xs px-1.5 md:px-2 py-0.5 rounded-full">NEW</span>}
                    <button
                      onClick={(e) => handleToggleFavorite(product.id, e)}
                      className="absolute bottom-2 md:bottom-3 right-2 md:right-3 w-6 h-6 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
                    >
                      <i className={`${favorites.includes(product.id) ? 'fas fa-heart text-red-500' : 'far fa-heart'} text-xs md:text-sm`}></i>
                    </button>
                  </div>
                </Link>
                <div className="p-2 md:p-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-black text-xs md:text-lg mb-1 hover:opacity-70 transition line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="font-bold text-sm md:text-xl mt-0.5 md:mt-1">{product.price.toLocaleString()} ₽</p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-2 md:mt-4 w-full bg-black text-white py-1.5 md:py-2 rounded-full text-xs md:text-sm font-black hover:bg-gray-800 transition"
                  >
                    В КОРЗИНУ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-8 md:py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            {[
              { icon: 'fa-truck-fast', title: 'Бесплатная доставка', desc: 'от 5000 ₽' },
              { icon: 'fa-arrows-spin', title: 'Возврат 30 дней', desc: 'без вопросов' },
              { icon: 'fa-credit-card', title: 'Безопасная оплата', desc: 'картой или наличными' },
              { icon: 'fa-gift', title: 'Подарочные карты', desc: 'для близких' },
            ].map((feature, idx) => (
              <div key={idx} className="group">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:bg-black transition">
                  <i className={`fas ${feature.icon} text-xl md:text-2xl text-gray-600 group-hover:text-white transition`}></i>
                </div>
                <h3 className="font-black text-xs md:text-sm uppercase tracking-wider">{feature.title}</h3>
                <p className="text-[10px] md:text-xs text-gray-400 mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Баннер распродажи */}
      <section className="relative py-12 md:py-20 overflow-hidden mx-4 md:mx-auto rounded-2xl md:rounded-none my-8 md:my-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl md:rounded-none"
          style={{
            backgroundImage: 'url(/images/brands/raspr.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-black/60 rounded-2xl md:rounded-none" />
        <div className="relative container mx-auto px-4 text-center z-10">
          <i className="fas fa-tag text-3xl md:text-5xl text-white/80 mb-3 md:mb-4"></i>
          <h2 className="text-2xl md:text-6xl font-black mb-2 md:mb-4 text-white">СЕЗОННАЯ РАСПРОДАЖА</h2>
          <p className="text-white/80 mb-6 md:mb-8 max-w-md mx-auto text-sm md:text-lg">Скидка до 50% на коллекцию прошлого сезона</p>
          <Link to="/catalog?category=sale" className="inline-block bg-white text-black px-6 md:px-10 py-2 md:py-4 text-xs md:text-sm font-black tracking-[0.15em] md:tracking-[0.2em] hover:bg-transparent hover:text-white border-2 border-white transition rounded-full md:rounded-none">
            ВЫБРАТЬ
          </Link>
        </div>
      </section>

      {/* Подписка */}
      <section className="py-8 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <i className="far fa-envelope text-3xl md:text-4xl text-gray-400 mb-3 md:mb-4"></i>
          <h2 className="text-2xl md:text-3xl font-black mb-2 md:mb-3">ПОДПИШИТЕСЬ НА НОВОСТИ</h2>
          <p className="text-gray-500 mb-4 md:mb-6 text-sm md:text-base">Будьте в курсе новых коллекций и эксклюзивных предложений</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="email" placeholder="Ваш email" className="flex-1 px-4 md:px-5 py-2 md:py-3 border-2 border-gray-200 focus:border-black focus:outline-none transition text-sm md:text-base rounded-full md:rounded-none" />
            <button className="bg-black text-white px-6 md:px-8 py-2 md:py-3 font-black tracking-wider hover:bg-gray-800 transition text-sm md:text-base rounded-full md:rounded-none">ПОДПИСАТЬСЯ</button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }

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

export default HomePage;