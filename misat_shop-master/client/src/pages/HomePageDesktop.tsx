import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCartAsync } from '../store/slices/cartSlice';
import { toggleFavoriteAsync } from '../store/slices/favoritesSlice';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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
  origin?: string;
  condition?: string;
  lot?: string;
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

// ============================================
// ДАННЫЕ ДЛЯ СЛАЙДЕРА
// ============================================
const SLIDES = [
  {
    id: 1,
    title: 'ВЕЩИ С ПРОШЛЫМ',
    subtitle: 'ЛОТ № 0142 / НОВОЕ ПОСТУПЛЕНИЕ',
    description: 'Редкие силуэты, привезённые лично — без повторов и без склада на тысячи единиц.',
    btnText: 'СМОТРЕТЬ МАНИФЕСТ',
    btnLink: '/catalog?type=new',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1600&q=80',
    origin: 'ОСАКА, JP',
    condition: 'EXCELLENT',
    lot: '0142',
  },
  {
    id: 2,
    title: 'АРХИВНАЯ ЛИНИЯ',
    subtitle: 'ЛОТ № 0138 / ADIDAS ORIGINALS',
    description: 'Классика, которая не подвластна времени. Оригинальные силуэты 90-х.',
    btnText: 'СМОТРЕТЬ КОЛЛЕКЦИЮ',
    btnLink: '/catalog?brand=adidas',
    image: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&q=80',
    origin: 'МИЛАН, IT',
    condition: 'MINT',
    lot: '0138',
  },
  {
    id: 3,
    title: 'ВИНТАЖНЫЙ ОТБОР',
    subtitle: 'ЛОТ № 0135 / BALENCIAGA',
    description: 'Высокая мода встречает уличный стиль. Каждая вещь — с характером.',
    btnText: 'ОТКРЫТЬ НОВИНКИ',
    btnLink: '/catalog?brand=balenciaga',
    image: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=1600&q=80',
    origin: 'ЛОНДОН, UK',
    condition: 'VINTAGE',
    lot: '0135',
  },
  {
    id: 4,
    title: 'РЕДКИЕ СИЛУЭТЫ',
    subtitle: 'ЛОТ № 0129 / RAF SIMONS',
    description: 'Экспериментальный дизайн. Культовые вещи для тех, кто понимает.',
    btnText: 'ПЕРЕЙТИ',
    btnLink: '/catalog?brand=raf-simons',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1600&q=80',
    origin: 'НЬЮ-ЙОРК, US',
    condition: 'EXCELLENT',
    lot: '0129',
  },
];

// ============================================
// КОНСТАНТЫ
// ============================================
const ORIGINS = [
  { name: 'ЯПОНИЯ', count: 18, desc: 'Секонд-хенд рынки Осаки и Токио — рабочая одежда, деним и редкие спортивные линии 90-х.', avgAge: '8 лет', items: 'Деним, спорт' },
  { name: 'ИТАЛИЯ', count: 24, desc: 'Аутлеты и частные распродажи — тонкий крой, качественные ткани, узнаваемые силуэты домов.', avgAge: '5 лет', items: 'Пальто, костюмы' },
  { name: 'США', count: 31, desc: 'Винтажные развалы восточного побережья — спортивная классика и рабочая одежда с характером.', avgAge: '12 лет', items: 'Куртки, толстовки' },
  { name: 'ФРАНЦИЯ', count: 9, desc: 'Парижские блошиные рынки — лаконичные силуэты и вещи с историей одной семьи.', avgAge: '10 лет', items: 'Верхняя одежда' },
  { name: 'ВЕЛИКОБРИТАНИЯ', count: 14, desc: 'Лондонские archive-дилеры — панк и постпанк наследие, узнаваемая фурнитура.', avgAge: '15 лет', items: 'Кожа, аксессуары' },
];

// ============================================
// БРЕНДЫ ДЛЯ MARQUEE (НОВОЕ)
// ============================================
const BRAND_MARQUEE = [
  { name: 'COMME DES GARÇONS', country: 'ЯПОНИЯ' },
  { name: 'YOHJI YAMAMOTO', country: 'ЯПОНИЯ' },
  { name: 'ISSEY MIYAKE', country: 'ЯПОНИЯ' },
  { name: 'UNDERCOVER', country: 'ЯПОНИЯ' },
  { name: 'BAPE', country: 'ЯПОНИЯ' },
  { name: 'NEIGHBORHOOD', country: 'ЯПОНИЯ' },
  { name: 'KENZO', country: 'ЯПОНИЯ' },
  { name: 'SACAI', country: 'ЯПОНИЯ' },
  { name: 'SHANGHAI TANG', country: 'КИТАЙ' },
  { name: 'JNBY', country: 'КИТАЙ' },
  { name: 'EXCEPTION', country: 'КИТАЙ' },
  { name: 'ZUCZUG', country: 'КИТАЙ' },
  { name: 'PRADA', country: 'ИТАЛИЯ' },
  { name: 'GUCCI', country: 'ИТАЛИЯ' },
  { name: 'ARMANI', country: 'ИТАЛИЯ' },
  { name: 'VERSACE', country: 'ИТАЛИЯ' },
  { name: 'FENDI', country: 'ИТАЛИЯ' },
  { name: 'DOLCE & GABBANA', country: 'ИТАЛИЯ' },
  { name: 'BOTTEGA VENETA', country: 'ИТАЛИЯ' },
  { name: 'VALENTINO', country: 'ИТАЛИЯ' },
  { name: 'NIKE', country: 'США' },
  { name: 'ADIDAS', country: 'США' },
  { name: 'RALPH LAUREN', country: 'США' },
  { name: 'CALVIN KLEIN', country: 'США' },
  { name: 'TOMMY HILFIGER', country: 'США' },
  { name: 'CARHARTT', country: 'США' },
  { name: 'LEVI\'S', country: 'США' },
  { name: 'DICKIES', country: 'США' },
  { name: 'SAINT LAURENT', country: 'ФРАНЦИЯ' },
  { name: 'BALENCIAGA', country: 'ФРАНЦИЯ' },
  { name: 'CHANEL', country: 'ФРАНЦИЯ' },
  { name: 'LOUIS VUITTON', country: 'ФРАНЦИЯ' },
  { name: 'HERMÈS', country: 'ФРАНЦИЯ' },
  { name: 'DIOR', country: 'ФРАНЦИЯ' },
  { name: 'LANVIN', country: 'ФРАНЦИЯ' },
  { name: 'CELINE', country: 'ФРАНЦИЯ' },
  { name: 'BURBERRY', country: 'ВЕЛИКОБРИТАНИЯ' },
  { name: 'VIVIENNE WESTWOOD', country: 'ВЕЛИКОБРИТАНИЯ' },
  { name: 'PAUL SMITH', country: 'ВЕЛИКОБРИТАНИЯ' },
  { name: 'ALEXANDER MCQUEEN', country: 'ВЕЛИКОБРИТАНИЯ' },
  { name: 'STELLA MCCARTNEY', country: 'ВЕЛИКОБРИТАНИЯ' },
  { name: 'MULBERRY', country: 'ВЕЛИКОБРИТАНИЯ' },
  { name: 'BARBOUR', country: 'ВЕЛИКОБРИТАНИЯ' },
  { name: 'BELSTAFF', country: 'ВЕЛИКОБРИТАНИЯ' },
];

const CATEGORIES = [
  { id: 'all', name: 'ВСЕ ЛОТЫ', icon: 'fa-archive' },
  { id: 'clothes', name: 'ОДЕЖДА', icon: 'fa-tshirt' },
  { id: 'shoes', name: 'ОБУВЬ', icon: 'fa-shoe-prints' },
  { id: 'accessories', name: 'АКСЕССУАРЫ', icon: 'fa-gem' },
];

const CATEGORY_IMAGES = {
  all: '/images/brands/всетовары.jpg',
  clothes: '/images/brands/одежда.jpg',
  shoes: '/images/brands/обувь.jpg',
  accessories: '/images/brands/аксессуары.jpg',
};

const CRITERIA = [
  { number: '01', title: 'Силуэт', desc: 'Берём вещи с узнаваемым кроем — тем, что держит форму и работает как самостоятельная деталь образа.' },
  { number: '02', title: 'Состояние', desc: 'Каждая вещь проходит осмотр на швы, фурнитуру и износ — статус состояния всегда указан честно.' },
  { number: '03', title: 'Подлинность', desc: 'Проверяем лейблы, фурнитуру и пошив перед тем, как вещь попадёт в манифест поступлений.' },
  { number: '04', title: 'История', desc: 'Каждый лот — вещь из конкретного места и времени, а не серийный товар со склада.' },
];

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
// SVG ШТАМП
// ============================================
const ArchiveStamp = ({ lot = '0142', size = 56 }: { lot?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 56 56"
    style={{ opacity: 0.85 }}
  >
    <circle cx="28" cy="28" r="24" fill="none" stroke={COLORS.stamp} strokeWidth="1" strokeDasharray="2 3" />
    <text x="28" y="25" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="9" fill={COLORS.stamp}>M/A</text>
    <text x="28" y="34" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="5" fill={COLORS.stamp}>№{lot}</text>
  </svg>
);

// ============================================
// АНИМАЦИИ
// ============================================
const ANIMATIONS = {
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
    }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1, scale: 1,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      }
    }
  },
  heroSlide: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1, ease: "easeOut" }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }
    }
  }
};

// ============================================
// HERO СЛАЙДЕР (с учётом шапки)
// ============================================
const HeroSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const throttleRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (throttleRef.current) return;
      throttleRef.current = window.requestAnimationFrame(() => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePos({ x, y });
        throttleRef.current = null;
      });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (throttleRef.current) cancelAnimationFrame(throttleRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSlideChange = useCallback((index: number) => {
    setActiveSlide(index);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden"
      style={{
        height: 'calc(100vh - 64px)',
        minHeight: '600px',
        maxHeight: '850px',
        contentVisibility: 'auto',
        containIntrinsicSize: 'calc(100vh - 64px)',
      }}
    >
      <div
        className="absolute inset-0 z-10 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${COLORS.gold}20, transparent 50%)`
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          variants={ANIMATIONS.heroSlide}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${SLIDES[activeSlide].image})`,
              filter: 'grayscale(0.3) sepia(0.15) brightness(0.5)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 150px 50px rgba(0,0,0,0.6)' }} />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 h-full flex items-center px-8 md:px-16 lg:px-24">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-px" style={{ backgroundColor: COLORS.stamp }} />
                <p className="text-[11px] tracking-[0.35em]" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
                  {SLIDES[activeSlide].subtitle}
                </p>
              </div>

              <h1
                className="text-[clamp(50px,10vw,140px)] font-black leading-[0.85] tracking-[-0.04em]"
                style={{ fontFamily: 'Anton, sans-serif', color: COLORS.ink }}
              >
                {SLIDES[activeSlide].title}
              </h1>

              <p className="text-base md:text-lg max-w-md font-light tracking-wide leading-relaxed" style={{ color: COLORS.inkSoft }}>
                {SLIDES[activeSlide].description}
              </p>

              <Link
                to={SLIDES[activeSlide].btnLink}
                className="inline-flex items-center gap-3 px-10 py-4 text-[10px] tracking-[0.25em] transition-all duration-300"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  border: `1px solid ${COLORS.stamp}`,
                  color: COLORS.stamp,
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.stamp;
                  e.currentTarget.style.color = COLORS.bg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = COLORS.stamp;
                }}
              >
                {SLIDES[activeSlide].btnText}
                <i className="fas fa-arrow-right text-xs"></i>
              </Link>

              <div className="flex gap-6 pt-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-xs" style={{ color: COLORS.stamp }} />
                  <span className="text-[10px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    {SLIDES[activeSlide].origin}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-xs" style={{ color: COLORS.olive }} />
                  <span className="text-[10px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    {SLIDES[activeSlide].condition}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-tag text-xs" style={{ color: COLORS.gold }} />
                  <span className="text-[10px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    ЛОТ {SLIDES[activeSlide].lot}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, rotate: -15, scale: 1.5 }}
        animate={{ opacity: 1, rotate: -12, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.2, 0.9, 0.3, 1.2] }}
        className="absolute top-1/2 -translate-y-1/2 right-8 lg:right-16 hidden lg:block z-20"
      >
        <ArchiveStamp lot={SLIDES[activeSlide].lot} size={110} />
      </motion.div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className="transition-all duration-300 h-[2px] rounded-full"
            style={{
              width: activeSlide === index ? '40px' : '20px',
              backgroundColor: activeSlide === index ? COLORS.stamp : COLORS.ruleStrong,
            }}
          />
        ))}
      </div>

      <div className="absolute bottom-10 right-8 lg:right-16 z-30 hidden md:block">
        <span className="text-[11px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
          {String(activeSlide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
        </span>
      </div>

      <button
        onClick={() => setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center transition-all duration-300 rounded-full"
        style={{ color: COLORS.inkFaint, backgroundColor: 'rgba(10, 10, 11, 0.5)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${COLORS.stamp}20`;
          e.currentTarget.style.color = COLORS.stamp;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(10, 10, 11, 0.5)';
          e.currentTarget.style.color = COLORS.inkFaint;
        }}
      >
        <i className="fas fa-chevron-left text-sm"></i>
      </button>
      <button
        onClick={() => setActiveSlide((prev) => (prev + 1) % SLIDES.length)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center transition-all duration-300 rounded-full"
        style={{ color: COLORS.inkFaint, backgroundColor: 'rgba(10, 10, 11, 0.5)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${COLORS.stamp}20`;
          e.currentTarget.style.color = COLORS.stamp;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(10, 10, 11, 0.5)';
          e.currentTarget.style.color = COLORS.inkFaint;
        }}
      >
        <i className="fas fa-chevron-right text-sm"></i>
      </button>
    </section>
  );
};

// ============================================
// КАРТОЧКА ТОВАРА
// ============================================
interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: number, e: React.MouseEvent) => void;
  onAddToCart: (product: Product) => void;
  isAdding?: boolean;
}

const ProductCard = React.memo(({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  isAdding = false
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={ANIMATIONS.fadeInUp}
      className="group relative rounded-lg overflow-hidden cursor-pointer"
      style={{
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.rule}`,
        transition: 'border-color 0.25s, transform 0.25s',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = `/product/${product.id}`}
      whileHover={{ y: -3 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: COLORS.bg }}>
        <img
          src={product.images?.[0] || product.image || 'https://placehold.co/800x1000/111113/e8e4dd?text=NO+IMAGE'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{
            filter: 'grayscale(0.2) sepia(0.1) brightness(0.95)',
          }}
          loading="lazy"
        />

        <div className="absolute bottom-3 right-3">
          <ArchiveStamp lot={product.lot || String(product.id).padStart(4, '0')} size={48} />
        </div>

        <span
          className="absolute top-3 left-3 text-[9px] tracking-wider px-2 py-1"
          style={{
            backgroundColor: 'rgba(10, 10, 11, 0.85)',
            border: `1px solid ${COLORS.rule}`,
            color: COLORS.olive,
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {product.condition || (product.stockType === 'instock' ? 'EXCELLENT' : 'VINTAGE')}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id, e);
          }}
          aria-label="В избранное"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: isFavorite ? `${COLORS.stamp}30` : 'rgba(10, 10, 11, 0.7)',
            border: `1px solid ${isFavorite ? COLORS.stamp : COLORS.rule}`,
            color: isFavorite ? COLORS.stamp : COLORS.inkSoft,
            borderRadius: '50%',
          }}
        >
          <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-xs`} />
        </button>
      </div>

      <div className="p-4" style={{ backgroundColor: COLORS.bgCard }}>
        <div className="flex justify-between items-center mb-3 pb-2" style={{ borderBottom: `1px dashed ${COLORS.rule}` }}>
          <span className="text-[9px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
            ЛОТ {product.lot || String(product.id).padStart(4, '0')}
          </span>
          <span className="text-[9px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
            {product.origin || 'АРХИВ'}
          </span>
        </div>

        <h3 className="text-sm leading-snug mb-3 line-clamp-2" style={{ color: COLORS.ink }}>
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-base font-semibold" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
            {product.price.toLocaleString()} ₽
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={isAdding}
            aria-label="В корзину"
            className="w-9 h-9 flex items-center justify-center transition-all duration-200"
            style={{
              backgroundColor: 'transparent',
              border: `1px solid ${COLORS.ink}`,
              color: COLORS.ink,
              borderRadius: '2px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.ink;
              e.currentTarget.style.color = COLORS.bg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = COLORS.ink;
            }}
          >
            {isAdding ? (
              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <i className="fas fa-plus text-sm" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

// ============================================
// КАРТОЧКА КАТЕГОРИИ
// ============================================
interface CategoryCardProps {
  cat: typeof CATEGORIES[0];
  count: number;
}

const CategoryCard = React.memo(({ cat, count }: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={ANIMATIONS.scaleIn}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/catalog?category=${cat.id}`}
        className="relative block aspect-[4/5] overflow-hidden group"
        style={{
          backgroundColor: COLORS.bgCard,
          border: `1px solid ${COLORS.rule}`,
          borderRadius: '4px',
        }}
      >
        <img
          src={CATEGORY_IMAGES[cat.id as keyof typeof CATEGORY_IMAGES]}
          alt={cat.name}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-50"
          style={{
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            filter: 'grayscale(0.5) sepia(0.2) brightness(0.6)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 z-10">
          <i className={`fas ${cat.icon} text-xl mb-3 block`} style={{ color: COLORS.goldLight }} />
          <h3 className="text-2xl font-black tracking-tighter" style={{ color: COLORS.ink, fontFamily: 'Anton, sans-serif' }}>
            {cat.name}
          </h3>
          <p className="text-[10px] tracking-wider mt-1" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
            {count} ЛОТОВ
          </p>
        </div>
      </Link>
    </motion.div>
  );
});

CategoryCard.displayName = 'CategoryCard';

// ============================================
// ОСНОВНОЙ КОМПОНЕНТ
// ============================================
const HomePageDesktop = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('new');
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [activeOrigin, setActiveOrigin] = useState(0);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);

  const categoryCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      const categoryMap: Record<string, string> = {
        'clothes': 'clothes',
        'shoes': 'shoes',
        'accessories': 'accessories',
      };
      const key = categoryMap[product.category] || 'all';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productsAPI.getAll();
        let productsData = [];
        if (Array.isArray(response.data)) productsData = response.data;
        else if (response.data?.data && Array.isArray(response.data.data)) productsData = response.data.data;
        else if (response.data?.products && Array.isArray(response.data.products)) productsData = response.data.products;

        const parsed = productsData.map((p: any, idx: number) => ({
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
          origin: p.origin || ['ОСАКА, JP', 'МИЛАН, IT', 'НЬЮ-ЙОРК, US', 'ПАРИЖ, FR', 'ЛОНДОН, UK'][idx % 5],
          condition: p.condition || ['EXCELLENT', 'MINT', 'VINTAGE'][idx % 3],
          lot: p.lot || String(idx + 1).padStart(4, '0'),
        }));
        setProducts(parsed);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        toast.error('Ошибка загрузки товаров');
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const sortedProducts = useMemo(() => {
    switch (sortBy) {
      case 'price-asc': return [...products].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...products].sort((a, b) => b.price - a.price);
      default: return [...products];
    }
  }, [products, sortBy]);

  const displayedProducts = sortedProducts.slice(0, 8);

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
          sizes: product.sizes || ['S', 'M', 'L']
        }
      }));
      toast.success(`Лот ${product.lot || product.id} добавлен в корзину`, {
        style: {
          background: COLORS.bgCard,
          color: COLORS.ink,
          border: `1px solid ${COLORS.ruleStrong}`,
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'JetBrains Mono, monospace',
        }
      });
    } catch (error) {
      toast.error('Ошибка при добавлении');
    } finally {
      setAddingToCart(null);
    }
  }, [dispatch]);

  const handleToggleFavorite = useCallback((productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavoriteAsync(productId));
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${COLORS.rule}` }} />
            <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${COLORS.stamp}`, borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
          </div>
          <p className="text-[10px] tracking-[0.3em] mt-4" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
            ЗАГРУЗКА АРХИВА
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.bg, color: COLORS.ink }}>

      {/* ===== HERO СЛАЙДЕР ===== */}
      <HeroSlider />

      {/* ===== MARQUEE — БРЕНДЫ (НОВОЕ) ===== */}
      <div className="overflow-hidden py-6" style={{
        borderTop: `1px solid ${COLORS.rule}`,
        borderBottom: `1px solid ${COLORS.rule}`,
        backgroundColor: COLORS.bgCard
      }}>
        <div className="flex gap-12 whitespace-nowrap animate-marquee">
          {[...BRAND_MARQUEE, ...BRAND_MARQUEE].map((brand, idx) => {
            const flags: Record<string, string> = {
              'ЯПОНИЯ': '🇯🇵',
              'КИТАЙ': '🇨🇳',
              'ИТАЛИЯ': '🇮🇹',
              'США': '🇺🇸',
              'ФРАНЦИЯ': '🇫🇷',
              'ВЕЛИКОБРИТАНИЯ': '🇬🇧',
            };
            return (
              <span key={idx} className="text-[11px] tracking-wider flex items-center gap-2" style={{
                color: COLORS.inkSoft,
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                <span>{flags[brand.country]}</span>
                {brand.name}
                <span style={{ color: COLORS.stamp, marginLeft: '4px' }}>✦</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* ===== ГЕОГРАФИЯ ЗАКУПОК ===== */}
      <section className="py-24 px-4 md:px-8 lg:px-16" style={{ backgroundColor: COLORS.bgCard, borderBottom: `1px solid ${COLORS.rule}` }}>
        <div className="container mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={ANIMATIONS.fadeInUp}
            className="mb-12"
          >
            <p className="text-[10px] tracking-[0.35em] mb-3" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>СНАБЖЕНИЕ</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: 'Anton, sans-serif' }}>
              ГЕОГРАФИЯ ЗАКУПОК
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              {ORIGINS.map((origin, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveOrigin(idx)}
                  className="w-full flex justify-between items-center py-4 px-2 text-left transition-all duration-200"
                  style={{
                    borderBottom: idx < ORIGINS.length - 1 ? `1px solid ${COLORS.rule}` : 'none',
                    backgroundColor: activeOrigin === idx ? `${COLORS.stamp}10` : 'transparent',
                  }}
                  onMouseEnter={() => setActiveOrigin(idx)}
                >
                  <span className="text-xl font-black tracking-tight" style={{ fontFamily: 'Anton, sans-serif', color: activeOrigin === idx ? COLORS.ink : COLORS.inkFaint }}>
                    {origin.name}
                  </span>
                  <span className="text-[11px]" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.inkFaint }}>
                    {String(origin.count).padStart(2, '0')} ВЕЩЕЙ
                  </span>
                </button>
              ))}
            </div>

            <div className="p-6" style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}`, borderRadius: '4px' }}>
              <p className="text-[10px] tracking-[0.25em] mb-4" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
                ГЕОГРАФИЯ / {ORIGINS[activeOrigin].name}
              </p>
              <p className="text-lg leading-relaxed mb-6" style={{ color: COLORS.inkSoft, fontWeight: 340 }}>
                {ORIGINS[activeOrigin].desc}
              </p>
              <div className="flex gap-8 flex-wrap">
                <div>
                  <span className="block text-2xl" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.ink }}>
                    {ORIGINS[activeOrigin].count}
                  </span>
                  <small className="text-[9px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    ВЕЩЕЙ В НАЛИЧИИ
                  </small>
                </div>
                <div>
                  <span className="block text-2xl" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.ink }}>
                    {ORIGINS[activeOrigin].avgAge}
                  </span>
                  <small className="text-[9px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    СРЕДНИЙ ВОЗРАСТ
                  </small>
                </div>
                <div>
                  <span className="block text-2xl" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.ink }}>
                    {ORIGINS[activeOrigin].items}
                  </span>
                  <small className="text-[9px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    ОСНОВНЫЕ КАТЕГОРИИ
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== КАТЕГОРИИ ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={ANIMATIONS.staggerContainer}
        className="py-24 px-4 md:px-8 lg:px-16"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '500px' }}
      >
        <div className="container mx-auto">
          <motion.div variants={ANIMATIONS.fadeInUp} className="mb-12">
            <p className="text-[10px] tracking-[0.35em] mb-3" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>КАТАЛОГ</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: 'Anton, sans-serif' }}>
              ВЫБЕРИТЕ КАТЕГОРИЮ
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} count={categoryCounts[cat.id] || 0} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== ПОСЛЕДНИЕ ЛОТЫ (товары) ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        variants={ANIMATIONS.staggerContainer}
        className="py-24 px-4 md:px-8 lg:px-16"
        style={{ backgroundColor: COLORS.bgCard, borderTop: `1px solid ${COLORS.rule}`, borderBottom: `1px solid ${COLORS.rule}`, contentVisibility: 'auto', containIntrinsicSize: '600px' }}
      >
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6">
            <motion.div variants={ANIMATIONS.fadeInUp}>
              <p className="text-[10px] tracking-[0.35em] mb-3" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
                МАНИФЕСТ / ПОСТУПЛЕНИЯ ЭТОЙ НЕДЕЛИ
              </p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: 'Anton, sans-serif' }}>
                ПОСЛЕДНИЕ ЛОТЫ
              </h2>
            </motion.div>

            <motion.div variants={ANIMATIONS.fadeInUp} className="flex gap-1 p-1" style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}`, borderRadius: '4px' }}>
              {[
                { id: 'new', label: 'НОВОЕ' },
                { id: 'price-asc', label: '↑ ЦЕНА' },
                { id: 'price-desc', label: '↓ ЦЕНА' }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSortBy(type.id)}
                  className="px-5 py-2 text-[10px] tracking-wider transition-all duration-200"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    backgroundColor: sortBy === type.id ? COLORS.ink : 'transparent',
                    color: sortBy === type.id ? COLORS.bg : COLORS.inkSoft,
                    borderRadius: '2px',
                  }}
                >
                  {type.label}
                </button>
              ))}
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {displayedProducts.map((product) => (
              <motion.div key={product.id} variants={ANIMATIONS.fadeInUp}>
                <ProductCard
                  product={product}
                  isFavorite={favoriteSet.has(product.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                  isAdding={addingToCart === product.id}
                />
              </motion.div>
            ))}
          </div>

          <motion.div variants={ANIMATIONS.fadeInUp} className="text-center mt-16">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-3 text-[10px] tracking-[0.25em] transition-all duration-300"
              style={{ color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace', borderBottom: `1px solid ${COLORS.ruleStrong}`, paddingBottom: '4px' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = COLORS.stamp;
                e.currentTarget.style.borderColor = COLORS.stamp;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = COLORS.inkSoft;
                e.currentTarget.style.borderColor = COLORS.ruleStrong;
              }}
            >
              СМОТРЕТЬ ВЕСЬ КАТАЛОГ
              <i className="fas fa-arrow-right text-xs"></i>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== КРИТЕРИИ ОТБОРА ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={ANIMATIONS.staggerContainer}
        className="py-24 px-4 md:px-8 lg:px-16"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '400px' }}
      >
        <div className="container mx-auto">
          <motion.div variants={ANIMATIONS.fadeInUp} className="text-center mb-16">
            <p className="text-[10px] tracking-[0.35em] mb-3" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>КУРАЦИЯ</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: 'Anton, sans-serif' }}>
              КАК МЫ ОТБИРАЕМ ВЕЩИ
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CRITERIA.map((item, idx) => (
              <motion.div
                key={idx}
                variants={ANIMATIONS.fadeInUp}
                className="p-6"
                style={{ border: `1px solid ${COLORS.rule}`, borderRadius: '4px', backgroundColor: COLORS.bgCard }}
              >
                <p className="text-7xl font-black mb-6 select-none" style={{ color: `${COLORS.ink}10`, fontFamily: 'Anton, sans-serif' }}>
                  {item.number}
                </p>
                <h3 className="text-lg font-bold mb-3" style={{ color: COLORS.ink }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.inkSoft, fontWeight: 340 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== CTA ===== */}
      <section className="py-32 px-4 md:px-8 lg:px-16 text-center relative overflow-hidden" style={{ backgroundColor: COLORS.bgCard, borderTop: `1px solid ${COLORS.rule}` }}>
        <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${COLORS.stamp}08 0%, transparent 70%)` }} />
        <div className="relative z-10 container mx-auto max-w-5xl">
          <p className="text-[10px] tracking-[0.35em] mb-8" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>ПРИСОЕДИНЯЙТЕСЬ</p>
          <h2 className="text-[clamp(45px,10vw,130px)] font-black leading-[0.85] tracking-[-0.04em]" style={{ fontFamily: 'Anton, sans-serif' }}>
            МИРОВЫЕ БРЕНДЫ
            <br />
            <span style={{ color: COLORS.inkFaint }}>БЕЗ ПОВТОРОВ</span>
          </h2>
          <p className="text-base md:text-lg mt-8 font-light leading-relaxed max-w-2xl mx-auto" style={{ color: COLORS.inkSoft }}>
            Одежда, обувь и аксессуары с историей — по одной вещи, привезённые лично, а не собранные со склада.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-3 px-12 py-5 text-[11px] tracking-[0.25em] mt-12 transition-all duration-300"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              border: `1px solid ${COLORS.stamp}`,
              color: COLORS.stamp,
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.stamp;
              e.currentTarget.style.color = COLORS.bg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = COLORS.stamp;
            }}
          >
            ПЕРЕЙТИ В КАТАЛОГ
            <i className="fas fa-arrow-right text-sm"></i>
          </Link>
        </div>
      </section>

      {/* ===== ПОДПИСКА (перед футером) ===== */}
      <div className="py-20 px-4 md:px-8 lg:px-16" style={{ borderTop: `1px solid ${COLORS.rule}` }}>
        <div className="container mx-auto max-w-lg">
          <div className="p-8" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.ruleStrong}`, borderRadius: '4px' }}>
            <p className="text-[10px] tracking-[0.25em] mb-2" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>ПОДПИСКА</p>
            <h3 className="text-2xl mb-3" style={{ color: COLORS.ink, fontFamily: 'Anton, sans-serif' }}>ПОЛУЧАТЬ УВЕДОМЛЕНИЯ О НОВЫХ ЛОТАХ</h3>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: COLORS.inkSoft, fontWeight: 340 }}>
              Каждое поступление — ограниченный тираж. Узнавайте о новых лотах раньше остальных.
            </p>
            <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="ваш@email.com"
                className="flex-1 px-4 py-3 text-sm"
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: `1px solid ${COLORS.ruleStrong}`,
                  color: COLORS.ink,
                  fontFamily: 'JetBrains Mono, monospace',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="px-6 py-3 text-[10px] tracking-wider transition-all duration-200"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  backgroundColor: COLORS.ink,
                  color: COLORS.bg,
                  border: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.stamp;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.ink;
                }}
              >
                ПОДПИСАТЬСЯ
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ===== STYLES ===== */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: ${COLORS.bg};
        }
        ::-webkit-scrollbar-thumb {
          background: ${COLORS.ruleStrong};
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${COLORS.stampDark};
        }

        ::selection {
          background: ${COLORS.stamp}30;
          color: ${COLORS.ink};
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HomePageDesktop;