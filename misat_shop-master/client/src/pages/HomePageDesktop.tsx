import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCartAsync } from '../store/slices/cartSlice';
import { toggleFavoriteAsync } from '../store/slices/favoritesSlice';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const HomePageDesktop = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const slides = [
    {
      title: 'NIKE',
      subtitle: 'JUST DO IT',
      description: 'Новая коллекция Air Max. Стиль и комфорт.',
      btnText: 'КУПИТЬ',
      btnLink: '/catalog?brand=nike',
      image: '/images/brands/nike.jpg'
    },
    {
      title: 'ADIDAS',
      subtitle: 'IMPOSSIBLE IS NOTHING',
      description: 'Оригинальная коллекция Originals. Классика на все времена.',
      btnText: 'СМОТРЕТЬ',
      btnLink: '/catalog?brand=adidas',
      image: '/images/brands/adidas.jpg'
    },
    {
      title: 'BALENCIAGA',
      subtitle: 'LUXURY STREETWEAR',
      description: 'Высокая мода встречает уличный стиль.',
      btnText: 'ВЫБРАТЬ',
      btnLink: '/catalog?brand=balenciaga',
      image: '/images/brands/balenciaga.jpg'
    },
    {
      title: 'RAF SIMONS',
      subtitle: 'AVANT-GARDE',
      description: 'Экспериментальный дизайн. Культовые силуэты.',
      btnText: 'ПОСМОТРЕТЬ',
      btnLink: '/catalog?brand=raf-simons',
      image: '/images/brands/raf_simons.jpg'
    },
  ];

  const benefits = [
    { icon: 'fa-truck-fast', title: 'Бесплатная доставка', desc: 'от 5 000 ₽' },
    { icon: 'fa-arrow-rotate-left', title: 'Легкий возврат', desc: '30 дней' },
    { icon: 'fa-lock', title: 'Безопасная оплата', desc: 'Карты, СБП' },
    { icon: 'fa-gift', title: 'Подарочные карты', desc: 'Для близких' },
  ];

  const categoryImages = {
    all: '/images/brands/всетовары.jpg',
    clothes: '/images/brands/одежда.jpg',
    shoes: '/images/brands/обувь.jpg',
    accessories: '/images/brands/аксессуары.jpg',
  };

  const categories = [
    { id: 'all', name: 'ВСЕ ТОВАРЫ', icon: 'fa-th-large', description: 'Полный каталог' },
    { id: 'clothes', name: 'ОДЕЖДА', icon: 'fa-tshirt', description: 'Футболки, худи' },
    { id: 'shoes', name: 'ОБУВЬ', icon: 'fa-shoe-prints', description: 'Кроссовки, кеды' },
    { id: 'accessories', name: 'АКСЕССУАРЫ', icon: 'fa-gem', description: 'Сумки, часы' },
  ];

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return products.length;
    return products.filter(p => p.category === categoryId).length;
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

  const getProductRating = (productId: number) => {
    const allReviews = JSON.parse(localStorage.getItem('misat_reviews') || '[]');
    const productReviews = allReviews.filter((r: any) => r.productId === productId);
    if (productReviews.length === 0) return 0;
    const avg = productReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / productReviews.length;
    return Math.round(avg * 2) / 2;
  };

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }
    if (touchStart - touchEnd < -50) {
      setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

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

  // Анимация для появления элементов
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20">

      {/* HERO SLIDER */}
      <section
        className="relative h-[70vh] min-h-[500px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

            <div className="relative h-full flex items-center px-4 md:px-12 lg:px-20">
              <div className="max-w-2xl">
                <span className="inline-block text-white/60 text-[10px] tracking-[0.3em] mb-4 pl-3 border-l-2 border-white/40">
                  {slide.subtitle}
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white leading-[1.05] mb-6 drop-shadow-2xl">
                  {slide.title}
                </h1>
                <p className="text-gray-300 text-sm md:text-base max-w-md mb-8 leading-relaxed hidden md:block">
                  {slide.description}
                </p>
                <Link
                  to={slide.btnLink}
                  className="inline-flex items-center gap-2 bg-white text-black px-6 md:px-10 py-2 md:py-4 text-sm font-black tracking-[0.2em] hover:bg-white/90 hover:gap-3 transition-all duration-300 rounded-full"
                >
                  <span>{slide.btnText}</span>
                  <i className="fas fa-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                </Link>
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`transition-all duration-300 ${
                activeSlide === index
                  ? 'w-6 md:w-8 bg-white'
                  : 'w-1.5 md:w-2 bg-white/30'
              } h-0.5 rounded-full`}
            />
          ))}
        </div>

        <button
          onClick={() => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur items-center justify-center text-white transition z-20"
        >
          <i className="fas fa-chevron-left text-sm"></i>
        </button>
        <button
          onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur items-center justify-center text-white transition z-20"
        >
          <i className="fas fa-chevron-right text-sm"></i>
        </button>
      </section>

      {/* BENEFITS - с анимацией */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="py-12 border-b border-white/5"
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {benefits.map((benefit, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="group text-center">
                <div className="w-12 h-12 mx-auto bg-white/5 rounded-xl flex items-center justify-center mb-3 group-hover:bg-white/10 transition-all duration-300">
                  <i className={`fas ${benefit.icon} text-white/70 text-base`}></i>
                </div>
                <h3 className="text-white font-bold text-xs tracking-wider mb-1">{benefit.title}</h3>
                <p className="text-gray-500 text-[10px]">{benefit.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* SALE BANNER - с анимацией */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInLeft}
        className="py-8"
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-black border border-white/10 group">
            <div className="absolute inset-0 opacity-20">
              <img
                src="/images/brands/raspr.jpg"
                alt="Sale"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

            <div className="relative py-6 md:py-8 px-6 md:px-10">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1 rounded-full mb-3">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/70 text-[9px] tracking-wider">LIMITED TIME</span>
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tighter text-white mb-2 leading-[1.2]">
                  СЕЗОННАЯ<br />РАСПРОДАЖА
                </h2>
                <p className="text-gray-300 text-sm mb-5 max-w-md">
                  Скидка до 50% на коллекцию прошлого сезона
                </p>
                <Link
                  to="/catalog?category=sale"
                  className="inline-flex items-center gap-2 bg-white text-black px-5 md:px-6 py-2 md:py-2.5 text-xs font-black tracking-[0.2em] hover:bg-white/90 transition-all duration-300 rounded-full"
                >
                  ВЫБРАТЬ <i className="fas fa-arrow-right text-[10px]"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CATEGORIES - с анимацией */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="py-12"
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="text-center mb-10">
            <p className="text-gray-500 text-[10px] tracking-[0.3em] mb-2">КАТАЛОГ</p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white">ВЫБЕРИТЕ КАТЕГОРИЮ</h2>
            <div className="w-12 h-0.5 bg-white/30 mx-auto mt-3"></div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
          >
            {categories.map((cat) => {
              const count = getCategoryCount(cat.id);
              return (
                <motion.div key={cat.id} variants={fadeInUp}>
                  <Link
                    to={`/catalog?category=${cat.id}`}
                    className="group relative overflow-hidden rounded-xl aspect-[3/4] block"
                  >
                    <img
                      src={categoryImages[cat.id as keyof typeof categoryImages]}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition" />

                    <div className="relative h-full flex flex-col justify-end p-3 md:p-4">
                      <i className={`fas ${cat.icon} text-white/50 text-xl mb-2`}></i>
                      <h3 className="text-white font-black text-sm md:text-base mb-0.5">{cat.name}</h3>
                      <p className="text-gray-300 text-[10px]">{cat.description}</p>
                      <p className="text-white/30 text-[9px] mt-1">{count} товаров</p>
                      <div className="flex items-center gap-1 text-white/40 group-hover:text-white transition-all mt-2">
                        <span className="text-[9px] font-bold tracking-wider">ПЕРЕЙТИ</span>
                        <i className="fas fa-arrow-right text-[8px]"></i>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* POPULAR PRODUCTS - с анимацией */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInRight}
        className="py-16 bg-[#0d0d0d]"
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16">
          <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
            <div>
              <p className="text-gray-500 text-[10px] tracking-[0.3em] mb-2">РЕКОМЕНДУЕМ</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white">ПОПУЛЯРНЫЕ ТОВАРЫ</h2>
            </div>
            <Link to="/catalog" className="text-white/40 text-xs font-bold uppercase tracking-wider border-b border-white/20 pb-1 hover:text-white hover:border-white transition">
              ВСЕ ТОВАРЫ →
            </Link>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeInUp}
                className="group bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative bg-[#111] aspect-square overflow-hidden">
                    <img
                      src={product.images?.[0] || product.image || 'https://placehold.co/400x400/1a1a1a/666666?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/1a1a1a/666666?text=No+Image';
                      }}
                    />
                    {product.is_new && (
                      <span className="absolute top-2 left-2 bg-white/90 text-black text-[9px] px-1.5 py-0.5 font-bold rounded-full">NEW</span>
                    )}
                    {product.is_sale && product.old_price && (
                      <span className="absolute top-2 right-2 bg-red-500/90 text-white text-[9px] px-1.5 py-0.5 font-bold rounded-full">
                        -{Math.round((1 - product.price / product.old_price) * 100)}%
                      </span>
                    )}
                    <button
                      onClick={(e) => handleToggleFavorite(product.id, e)}
                      className={`absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition ${
                        favorites.includes(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-black/60 backdrop-blur text-white/80'
                      }`}
                    >
                      <i className={`${favorites.includes(product.id) ? 'fas fa-heart' : 'far fa-heart'} text-xs`}></i>
                    </button>
                  </div>
                </Link>
                <div className="p-3">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-white font-bold text-xs mb-1 hover:text-gray-300 transition line-clamp-1">{product.name}</h3>
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
                            : 'far fa-star text-gray-500'
                        } text-[8px]`}
                      />
                    ))}
                    {product.reviews > 0 && (
                      <span className="text-gray-500 text-[7px] ml-1">({product.reviews})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-white font-bold text-sm">{product.price.toLocaleString()} ₽</span>
                    {product.old_price && (
                      <span className="text-gray-500 text-[9px] line-through">{product.old_price.toLocaleString()} ₽</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-white/10 text-white py-1.5 rounded-lg text-[10px] font-bold tracking-wider hover:bg-white hover:text-black transition"
                  >
                    В КОРЗИНУ
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* NEWSLETTER - с анимацией */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
        className="border-t border-white/5"
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-16 py-6 md:py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="w-12 h-12 mx-auto bg-white/5 rounded-xl flex items-center justify-center mb-3">
              <i className="far fa-envelope text-white/40 text-lg"></i>
            </div>
            <h2 className="text-base md:text-xl font-black tracking-tighter text-white mb-2">ПОДПИШИТЕСЬ НА НОВОСТИ</h2>
            <p className="text-gray-400 text-xs mb-4">Будьте в курсе новых коллекций</p>

            <form className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-white/50 focus:outline-none transition rounded-full text-sm"
              />
              <button className="bg-white text-black px-6 py-2.5 text-xs font-black tracking-wider hover:bg-white/90 transition rounded-full">
                ПОДПИСАТЬСЯ
              </button>
            </form>

            <p className="text-gray-500 text-[10px] text-center mt-2">Никакого спама, только полезные новости</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePageDesktop;