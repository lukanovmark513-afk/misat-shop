import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
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
  label?: string;
  description?: string;
}

// ============================================
// ЦВЕТОВАЯ ПАЛИТРА
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
// УТИЛИТЫ
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
  <svg width={size} height={size} viewBox="0 0 56 56" style={{ opacity: 0.85 }}>
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
  }
};

// ============================================
// КОМПОНЕНТ: ЗВЁЗДНЫЙ РЕЙТИНГ
// ============================================
const StarRating = ({ rating, size = 'text-xs' }: { rating: number; size?: string }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fa-solid fa-star ${size} ${
          i < Math.floor(rating) ? 'text-amber-400' : i < rating ? 'text-amber-400/50' : 'text-white/20'
        }`}
      />
    ))}
  </div>
);

// ============================================
// КОМПОНЕНТ: КАРТОЧКА ТОВАРА
// ============================================
interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: number, e: React.MouseEvent) => void;
  onAddToCart: (product: Product) => void;
  isAdding?: boolean;
}

const ProductCard = React.memo(({ product, isFavorite, onToggleFavorite, onAddToCart, isAdding = false }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={ANIMATIONS.fadeInUp}
      className="group relative rounded-lg overflow-hidden cursor-pointer"
      style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, transition: 'border-color 0.25s, transform 0.25s' }}
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
          style={{ filter: 'grayscale(0.2) sepia(0.1) brightness(0.95)' }}
          loading="lazy"
        />
        <div className="absolute bottom-3 right-3">
          <ArchiveStamp lot={product.lot || String(product.id).padStart(4, '0')} size={48} />
        </div>
        <span className="absolute top-3 left-3 text-[9px] tracking-wider px-2 py-1" style={{ backgroundColor: 'rgba(10, 10, 11, 0.85)', border: `1px solid ${COLORS.rule}`, color: COLORS.olive, fontFamily: 'JetBrains Mono, monospace' }}>
          {product.condition || (product.stockType === 'instock' ? 'EXCELLENT' : 'VINTAGE')}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id, e); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: isFavorite ? `${COLORS.stamp}30` : 'rgba(10, 10, 11, 0.7)', border: `1px solid ${isFavorite ? COLORS.stamp : COLORS.rule}`, color: isFavorite ? COLORS.stamp : COLORS.inkSoft, borderRadius: '50%' }}
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
        <h3 className="text-sm leading-snug mb-3 line-clamp-2" style={{ color: COLORS.ink }}>{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
            {product.price.toLocaleString()} ₽
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            disabled={isAdding}
            className="w-9 h-9 flex items-center justify-center transition-all duration-200"
            style={{ backgroundColor: 'transparent', border: `1px solid ${COLORS.ink}`, color: COLORS.ink, borderRadius: '2px' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = COLORS.ink; e.currentTarget.style.color = COLORS.bg; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = COLORS.ink; }}
          >
            {isAdding ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <i className="fas fa-plus text-sm" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';

// ============================================
// ГЛАВНЫЙ КОМПОНЕНТ: СТРАНИЦА ТОВАРА
// ============================================
const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const favorites = useAppSelector((state) => state.favorites.items);

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [addingToCart, setAddingToCart] = useState(false);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const isFavorite = favoriteSet.has(Number(id));

  const nextImage = useCallback(() => {
    if (!product?.images?.length) return;
    setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  }, [product?.images]);

  const prevImage = useCallback(() => {
    if (!product?.images?.length) return;
    setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  }, [product?.images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) { setIsFullscreen(false); e.preventDefault(); }
      if (e.key === 'ArrowRight' && isFullscreen) { nextImage(); e.preventDefault(); }
      if (e.key === 'ArrowLeft' && isFullscreen) { prevImage(); e.preventDefault(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, nextImage, prevImage]);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const response = await productsAPI.getById(Number(id));
        const productData = { ...response.data };
        productData.sizes = safeParseArray(productData.sizes);
        productData.colors = safeParseArray(productData.colors);
        productData.images = safeParseArray(productData.images);
        if ((!productData.images || productData.images.length === 0) && productData.image) {
          productData.images = [productData.image];
        }
        productData.origin = productData.origin || ['ОСАКА, JP', 'МИЛАН, IT', 'НЬЮ-ЙОРК, US'][Number(id) % 3];
        productData.condition = productData.condition || ['EXCELLENT', 'MINT', 'VINTAGE'][Number(id) % 3];
        productData.lot = productData.lot || String(id).padStart(4, '0');
        productData.label = productData.label || 'ARCHIVE LABEL';
        productData.description = productData.description || 'Уникальная архивная вещь с историей. Отобрана вручную и проверена на подлинность.';

        setProduct(productData);
        setSelectedImageIndex(0);

        const allReviews = JSON.parse(localStorage.getItem('misat_reviews') || '[]');
        const productReviews = allReviews.filter((r: any) => r.productId === Number(id));
        setReviews(productReviews);
        if (isAuthenticated && user) {
          setHasReviewed(productReviews.some((r: any) => r.userId === user.id));
        }

        const allProducts = await productsAPI.getAll();
        let productsData = [];
        if (Array.isArray(allProducts.data)) productsData = allProducts.data;
        else if (allProducts.data?.data) productsData = allProducts.data.data;
        else if (allProducts.data?.products) productsData = allProducts.data.products;

        const similar = productsData
          .filter((p: any) => p.category === productData.category && p.id !== productData.id)
          .map((p: any, idx: number) => ({
            ...p,
            sizes: safeParseArray(p.sizes),
            colors: safeParseArray(p.colors),
            images: safeParseArray(p.images),
            origin: ['ОСАКА, JP', 'МИЛАН, IT', 'ЛОНДОН, UK'][idx % 3],
            condition: ['EXCELLENT', 'MINT', 'VINTAGE'][idx % 3],
            lot: String(p.id).padStart(4, '0'),
          }))
          .slice(0, 4);
        setSimilarProducts(similar);
      } catch (error) {
        console.error('Ошибка загрузки:', error);
        toast.error('Товар не найден');
        navigate('/catalog');
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id, isAuthenticated, user, navigate]);

  const handleToggleFavorite = () => {
    if (!isAuthenticated) { toast.error('Войдите в аккаунт'); return; }
    dispatch(toggleFavoriteAsync(Number(id)));
  };

  const handleAddToCart = async () => {
    if (!selectedSize) { toast.error('Выберите размер'); return; }
    if (!product) return;
    setAddingToCart(true);
    try {
      await dispatch(addToCartAsync({
        productId: product.id,
        quantity: 1,
        size: selectedSize,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image || '',
          sizes: product.sizes || ['S', 'M', 'L']
        }
      }));
      toast.success(`Лот ${product.lot} добавлен в корзину`, {
        style: { background: COLORS.bgCard, color: COLORS.ink, border: `1px solid ${COLORS.ruleStrong}`, borderRadius: '4px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }
      });
    } catch (error) {
      toast.error('Ошибка при добавлении');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedSize) { toast.error('Выберите размер'); return; }
    if (!isAuthenticated) { toast.error('Войдите в аккаунт'); navigate('/profile'); return; }
    if (!product) return;
    await dispatch(addToCartAsync({
      productId: product.id,
      quantity: 1,
      size: selectedSize,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || '',
        sizes: product.sizes || ['S', 'M', 'L']
      }
    }));
    navigate('/checkout');
  };

  const compressImage = (file: File): Promise<string> => {
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
          const maxSize = 4096;
          if (width > height && width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
          else if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          let quality = 0.92;
          let result = canvas.toDataURL('image/jpeg', quality);
          while (result.length > 5 * 1024 * 1024 && quality > 0.7) { quality -= 0.05; result = canvas.toDataURL('image/jpeg', quality); }
          resolve(result);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleReviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setReviewImages([...reviewImages, compressed]);
    } catch {
      toast.error('Ошибка загрузки фото');
    }
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated) { toast.error('Войдите в аккаунт'); return; }
    if (hasReviewed) { toast.error('Вы уже оставляли отзыв'); return; }
    if (newReview.rating === 0) { toast.error('Поставьте оценку'); return; }
    if (!newReview.comment.trim()) { toast.error('Напишите отзыв'); return; }

    setIsSubmitting(true);
    const newReviewObj = {
      id: Date.now(),
      productId: Number(id),
      userId: user.id,
      userName: user.first_name || user.email?.split('@')[0] || 'Пользователь',
      rating: newReview.rating,
      comment: newReview.comment,
      photos: reviewImages,
      date: new Date().toISOString(),
    };
    const allReviews = JSON.parse(localStorage.getItem('misat_reviews') || '[]');
    allReviews.push(newReviewObj);
    localStorage.setItem('misat_reviews', JSON.stringify(allReviews));
    setReviews([newReviewObj, ...reviews]);
    setHasReviewed(true);
    setNewReview({ rating: 0, comment: '' });
    setReviewImages([]);
    setIsSubmitting(false);
    toast.success('Спасибо за отзыв!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 md:pt-20" style={{ backgroundColor: COLORS.bg }}>
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${COLORS.rule}` }} />
            <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${COLORS.stamp}`, borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
          </div>
          <p className="text-[10px] tracking-[0.3em] mt-4" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
            ЗАГРУЗКА ЛОТА
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16 md:pt-20" style={{ backgroundColor: COLORS.bg }}>
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-30">📦</div>
          <h2 className="text-2xl font-light mb-2" style={{ color: COLORS.ink }}>Товар не найден</h2>
          <Link to="/catalog" className="text-sm transition" style={{ color: COLORS.inkFaint }}>Вернуться в каталог</Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';
  const currentImage = product.images?.[selectedImageIndex] || product.image || 'https://placehold.co/800x800/111113/e8e4dd';
  const isSizeSelected = selectedSize !== '';

  return (
    <div className="min-h-screen pt-16 md:pt-20" style={{ backgroundColor: COLORS.bg, color: COLORS.ink }}>

      {/* ===== DESKTOP VERSION ===== */}
      <div className="hidden lg:block">
        <div className="max-w-[1920px] mx-auto px-8 pt-4 pb-4">
          <div className="flex items-center gap-2 text-[10px] tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.inkFaint }}>
            <Link to="/" className="hover:text-stamp transition" style={{ color: COLORS.inkFaint }}>ГЛАВНАЯ</Link>
            <span>/</span>
            <Link to="/catalog" className="hover:text-stamp transition" style={{ color: COLORS.inkFaint }}>КАТАЛОГ</Link>
            <span>/</span>
            <span style={{ color: COLORS.inkSoft }}>{product.name.toUpperCase()}</span>
          </div>
        </div>

        <div className="max-w-[1920px] mx-auto px-8">
          <div className="flex gap-12">

            {/* Галерея */}
            <div className="flex-1">
              <div className="flex gap-3">
                {product.images && product.images.length > 1 && (
                  <div className="flex flex-col gap-2 shrink-0 pt-4">
                    {product.images.map((img: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className="w-16 h-20 overflow-hidden transition-all duration-300 flex-shrink-0"
                        style={{
                          border: `2px solid ${selectedImageIndex === idx ? COLORS.stamp : 'transparent'}`,
                          opacity: selectedImageIndex === idx ? 1 : 0.5,
                          borderRadius: '4px',
                        }}
                      >
                        <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}

                <div
                  className="relative cursor-zoom-in group flex-1"
                  style={{ height: 'calc(100vh - 150px)', minHeight: '500px', maxHeight: '900px' }}
                  onClick={() => setIsFullscreen(true)}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImageIndex}
                      src={currentImage}
                      alt={product.name}
                      className="w-full h-full object-contain select-none"
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                      loading="eager"
                      decoding="async"
                    />
                  </AnimatePresence>

                  {product.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{ backgroundColor: 'rgba(10, 10, 11, 0.7)', color: COLORS.ink, border: `1px solid ${COLORS.ruleStrong}`, cursor: 'pointer' }}
                      >
                        <i className="fas fa-chevron-left text-lg" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{ backgroundColor: 'rgba(10, 10, 11, 0.7)', color: COLORS.ink, border: `1px solid ${COLORS.ruleStrong}`, cursor: 'pointer' }}
                      >
                        <i className="fas fa-chevron-right text-lg" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 right-4 z-20 px-4 py-1.5 rounded-full text-xs tracking-[0.2em]" style={{ backgroundColor: 'rgba(10, 10, 11, 0.7)', color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace' }}>
                    {selectedImageIndex + 1} / {product.images?.length || 1}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(); }}
                    className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full flex items-center justify-center transition-all"
                    style={{ backgroundColor: 'rgba(10, 10, 11, 0.7)', border: `1px solid ${isFavorite ? COLORS.stamp : COLORS.rule}`, color: isFavorite ? COLORS.stamp : COLORS.inkSoft }}
                  >
                    <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-sm`} />
                  </button>

                  <div className="absolute top-4 left-4 z-20">
                    <ArchiveStamp lot={product.lot} size={56} />
                  </div>
                </div>
              </div>
            </div>

            {/* Информация - улучшенная */}
            <div className="w-[460px] shrink-0">
              <div className="sticky top-24 space-y-5">
                <div className="border-b pb-5" style={{ borderColor: COLORS.rule }}>
                  <p className="text-[10px] tracking-[0.3em] mb-2" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
                    {product.label || 'ARCHIVE LABEL'}
                  </p>
                  <h1 className="text-3xl font-black leading-[1.1] tracking-tight" style={{ fontFamily: 'Anton, sans-serif' }}>
                    {product.name}
                  </h1>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating rating={Number(averageRating)} size="text-sm" />
                    <span className="text-sm" style={{ color: COLORS.inkSoft }}>{averageRating}</span>
                    <span className="text-xs" style={{ color: COLORS.inkFaint }}>({reviews.length})</span>
                  </div>
                  <span className="text-xs" style={{ color: COLORS.olive, fontFamily: 'JetBrains Mono, monospace' }}>
                    {product.condition}
                  </span>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.ink }}>
                      {product.price.toLocaleString()} ₽
                    </span>
                    {product.old_price && (
                      <span className="text-lg line-through" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                        {product.old_price.toLocaleString()} ₽
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 mt-2 text-xs" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    <span style={{ color: COLORS.goldLight }}>● {product.stockType === 'instock' ? 'В НАЛИЧИИ' : 'ПОД ЗАКАЗ'}</span>
                    <span style={{ color: COLORS.inkFaint }}>{product.origin}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs tracking-wider" style={{ color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace' }}>ВЫБЕРИТЕ РАЗМЕР</span>
                    {isSizeSelected && (
                      <button onClick={() => setSelectedSize('')} className="text-xs flex items-center gap-1" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
                        <i className="fas fa-times text-[10px]"></i> СБРОСИТЬ
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes?.length > 0 ? (
                      product.sizes.map((size: string) => (
                        <motion.button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className="h-12 rounded-lg border transition-all text-sm relative"
                          style={{
                            borderColor: selectedSize === size ? COLORS.stamp : COLORS.rule,
                            backgroundColor: selectedSize === size ? `${COLORS.stamp}20` : 'transparent',
                            color: selectedSize === size ? COLORS.stamp : COLORS.inkSoft,
                            fontFamily: 'JetBrains Mono, monospace',
                          }}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {size}
                          {selectedSize === size && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px]" style={{ backgroundColor: COLORS.stamp, color: COLORS.bg }}>
                              ✓
                            </span>
                          )}
                        </motion.button>
                      ))
                    ) : (
                      <p className="text-sm col-span-4" style={{ color: COLORS.inkFaint }}>Размеры не указаны</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={!isSizeSelected || addingToCart}
                    className="w-full h-14 rounded-lg flex items-center justify-center gap-2 text-sm tracking-wider transition-all duration-300"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      backgroundColor: isSizeSelected ? COLORS.ink : COLORS.bgCard,
                      color: isSizeSelected ? COLORS.bg : COLORS.inkFaint,
                      border: `1px solid ${isSizeSelected ? COLORS.ink : COLORS.rule}`,
                      cursor: isSizeSelected ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {addingToCart ? (
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <i className="fas fa-shopping-bag text-sm" />
                    )}
                    {isSizeSelected ? 'ДОБАВИТЬ В КОРЗИНУ' : 'ВЫБЕРИТЕ РАЗМЕР'}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!isSizeSelected}
                    className="w-full h-14 rounded-lg flex items-center justify-center gap-2 text-sm tracking-wider transition-all duration-300"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      backgroundColor: 'transparent',
                      color: isSizeSelected ? COLORS.stamp : COLORS.inkFaint,
                      border: `1px solid ${isSizeSelected ? COLORS.stamp : COLORS.rule}`,
                      cursor: isSizeSelected ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <i className="fas fa-bolt text-sm" />
                    КУПИТЬ СЕЙЧАС
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: 'fa-truck', label: 'ДОСТАВКА', value: 'Бесплатно' },
                    { icon: 'fa-clock', label: 'СРОКИ', value: product.stockType === 'instock' ? '2-5 дней' : `~${product.preorderDays || 30} дн.` },
                    { icon: 'fa-shield', label: 'СОСТОЯНИЕ', value: product.condition },
                    { icon: 'fa-globe', label: 'ГЕОГРАФИЯ', value: product.origin },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
                      <div className="flex items-center gap-2 mb-1">
                        <i className={`fas ${item.icon} text-[10px]`} style={{ color: COLORS.stamp }} />
                        <span className="text-[9px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                          {item.label}
                        </span>
                      </div>
                      <span className="text-sm" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                <hr style={{ borderColor: COLORS.rule }} />

                <div>
                  <div className="flex gap-6 border-b" style={{ borderColor: COLORS.rule }}>
                    {[
                      { id: 'description', label: 'ОПИСАНИЕ' },
                      { id: 'sizing', label: 'РАЗМЕРЫ' },
                      { id: 'reviews', label: `ОТЗЫВЫ (${reviews.length})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className="text-xs tracking-wider pb-3 transition-all relative"
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          color: activeTab === tab.id ? COLORS.stamp : COLORS.inkFaint,
                        }}
                      >
                        {tab.label}
                        {activeTab === tab.id && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: COLORS.stamp }} />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="text-sm leading-relaxed max-h-[220px] overflow-y-auto scrollbar-hide pt-4" style={{ color: COLORS.inkSoft }}>
                    {activeTab === 'description' && (
                      <p>{product.description}</p>
                    )}
                    {activeTab === 'sizing' && (
                      <div className="space-y-2">
                        <p>Доступные размеры: {product.sizes?.join(', ') || 'Не указаны'}</p>
                        <p>Рекомендуем брать свой обычный размер</p>
                      </div>
                    )}
                    {activeTab === 'reviews' && (
                      <div className="space-y-4">
                        {isAuthenticated && !hasReviewed && (
                          <div className="p-4 rounded-xl" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
                            <h4 className="text-sm mb-2" style={{ color: COLORS.ink }}>Оставить отзыв</h4>
                            <div className="flex gap-1 mb-3">
                              {[1, 2, 3, 4, 5].map((r) => (
                                <button key={r} onClick={() => setNewReview({ ...newReview, rating: r })}>
                                  <i className={`fas fa-star ${r <= newReview.rating ? 'text-amber-400' : 'text-white/20'}`} />
                                </button>
                              ))}
                            </div>
                            <div className="flex gap-2 mb-3">
                              {reviewImages.map((img, idx) => (
                                <div key={idx} className="relative w-12 h-12 rounded-lg overflow-hidden" style={{ border: `1px solid ${COLORS.rule}` }}>
                                  <img src={img} alt="Фото" className="w-full h-full object-cover" />
                                  <button onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== idx))} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs">×</button>
                                </div>
                              ))}
                              <label className="cursor-pointer w-12 h-12 rounded-lg flex items-center justify-center" style={{ border: `1px dashed ${COLORS.ruleStrong}`, color: COLORS.inkFaint }}>
                                <i className="fas fa-plus text-xs" />
                                <input type="file" accept="image/*" onChange={handleReviewImageUpload} className="hidden" />
                              </label>
                            </div>
                            <textarea
                              value={newReview.comment}
                              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                              rows={2}
                              placeholder="Ваш отзыв..."
                              className="w-full px-3 py-2 rounded-xl text-sm resize-none"
                              style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}`, color: COLORS.ink, outline: 'none' }}
                            />
                            <button
                              onClick={handleSubmitReview}
                              disabled={isSubmitting}
                              className="mt-2 px-5 py-1.5 rounded-full text-sm transition"
                              style={{ backgroundColor: COLORS.ink, color: COLORS.bg, fontFamily: 'JetBrains Mono, monospace' }}
                            >
                              ОТПРАВИТЬ
                            </button>
                          </div>
                        )}

                        {reviews.length === 0 ? (
                          <p className="text-center py-4" style={{ color: COLORS.inkFaint }}>Нет отзывов</p>
                        ) : (
                          <div className="space-y-3">
                            {reviews.map((r) => (
                              <div key={r.id} className="p-3 rounded-xl" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
                                <div className="flex items-start gap-2">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: COLORS.bgElevated, color: COLORS.inkSoft }}>
                                    {r.userName.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                      <span className="text-sm" style={{ color: COLORS.ink }}>{r.userName}</span>
                                      <span className="text-[10px]" style={{ color: COLORS.inkFaint }}>
                                        {new Date(r.date).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <StarRating rating={r.rating} size="text-[8px]" />
                                    <p className="text-sm mt-1" style={{ color: COLORS.inkSoft }}>{r.comment}</p>
                                    {r.photos && r.photos.length > 0 && (
                                      <div className="flex gap-1 mt-1">
                                        {r.photos.slice(0, 3).map((photo: string, idx: number) => (
                                          <img key={idx} src={photo} alt="Фото" className="w-8 h-8 rounded-lg object-cover" />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="max-w-[1920px] mx-auto px-8 pb-20">
            <div className="border-t pt-12" style={{ borderColor: COLORS.rule }}>
              <h2 className="text-2xl font-black mb-6" style={{ fontFamily: 'Anton, sans-serif' }}>ПОХОЖИЕ ЛОТЫ</h2>
              <div className="grid grid-cols-4 gap-4">
                {similarProducts.map((similar) => (
                  <ProductCard
                    key={similar.id}
                    product={similar}
                    isFavorite={favoriteSet.has(similar.id)}
                    onToggleFavorite={(id, e) => {
                      e.stopPropagation();
                      dispatch(toggleFavoriteAsync(id));
                    }}
                    onAddToCart={(p) => {
                      dispatch(addToCartAsync({
                        productId: p.id,
                        quantity: 1,
                        size: p.sizes?.[0] || 'M',
                        product: { id: p.id, name: p.name, price: p.price, image: p.images?.[0] || '', sizes: p.sizes }
                      }));
                      toast.success(`${p.name} добавлен в корзину`);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== MOBILE VERSION ===== */}
      <div className="lg:hidden">
        <div className="relative h-[50vh] min-h-[350px] max-h-[450px]" style={{ backgroundColor: COLORS.bg }}>
          <div
            className="relative w-full h-full flex items-center justify-center"
            onTouchStart={(e) => {
              const touch = e.touches[0];
              const startX = touch.clientX;
              const element = e.currentTarget;
              const onTouchMove = (ev: TouchEvent) => {
                const currentX = ev.touches[0].clientX;
                const diff = startX - currentX;
                if (Math.abs(diff) > 30) {
                  if (diff > 0) nextImage();
                  else prevImage();
                  element.removeEventListener('touchmove', onTouchMove);
                  element.removeEventListener('touchend', onTouchEnd);
                }
              };
              const onTouchEnd = () => {
                element.removeEventListener('touchmove', onTouchMove);
                element.removeEventListener('touchend', onTouchEnd);
              };
              element.addEventListener('touchmove', onTouchMove);
              element.addEventListener('touchend', onTouchEnd);
            }}
          >
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-contain px-2 select-none"
              loading="eager"
              decoding="async"
              onClick={() => setIsFullscreen(true)}
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-2 right-2 z-10 px-2 py-0.5 rounded-full text-[8px] tracking-wide" style={{ backgroundColor: 'rgba(10, 10, 11, 0.7)', color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace' }}>
              {selectedImageIndex + 1} / {product.images?.length}
            </div>
          )}

          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(10, 10, 11, 0.7)', border: `1px solid ${isFavorite ? COLORS.stamp : COLORS.rule}`, color: isFavorite ? COLORS.stamp : COLORS.inkSoft }}
          >
            <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-xs`} />
          </button>
        </div>

        {product.images && product.images.length > 1 && (
          <div className="px-3 py-1.5 overflow-x-auto scrollbar-hide" style={{ borderBottom: `1px solid ${COLORS.rule}` }}>
            <div className="flex gap-1.5 snap-x">
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 border-2 snap-start"
                  style={{ borderColor: selectedImageIndex === idx ? COLORS.stamp : COLORS.rule, opacity: selectedImageIndex === idx ? 1 : 0.5 }}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Мобильная информация */}
        <div className="px-4 pt-3 pb-6 space-y-3">
          <div>
            <div className="text-[9px] tracking-[0.2em]" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
              {product.label || 'ARCHIVE LABEL'}
            </div>
            <h1 className="text-lg font-black leading-[1.2] tracking-tight mt-0.5" style={{ fontFamily: 'Anton, sans-serif' }}>
              {product.name}
            </h1>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {product.price.toLocaleString()} ₽
            </div>
            <div className="flex items-center gap-1">
              <StarRating rating={Number(averageRating)} size="text-[10px]" />
              <span className="text-xs" style={{ color: COLORS.inkFaint }}>({reviews.length})</span>
            </div>
          </div>

          {/* Размеры - крупные кнопки */}
          <div className="p-3 rounded-lg" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] tracking-wider" style={{ color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace' }}>
                ВЫБЕРИТЕ РАЗМЕР
              </span>
              {isSizeSelected && (
                <button onClick={() => setSelectedSize('')} className="text-[10px]" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
                  ✕ СБРОСИТЬ
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {product.sizes?.length > 0 ? (
                product.sizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="py-3 text-sm rounded-lg border transition-all relative"
                    style={{
                      borderColor: selectedSize === size ? COLORS.stamp : COLORS.rule,
                      backgroundColor: selectedSize === size ? `${COLORS.stamp}20` : 'transparent',
                      color: selectedSize === size ? COLORS.stamp : COLORS.inkSoft,
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {size}
                    {selectedSize === size && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px]" style={{ backgroundColor: COLORS.stamp, color: COLORS.bg }}>
                        ✓
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-sm col-span-4" style={{ color: COLORS.inkFaint }}>Размеры не указаны</p>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isSizeSelected || addingToCart}
            className="w-full h-12 rounded-lg flex items-center justify-center gap-2 text-sm tracking-wider"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              backgroundColor: isSizeSelected ? COLORS.ink : COLORS.bgCard,
              color: isSizeSelected ? COLORS.bg : COLORS.inkFaint,
              border: `1px solid ${isSizeSelected ? COLORS.ink : COLORS.rule}`,
            }}
          >
            {isSizeSelected ? 'ДОБАВИТЬ В КОРЗИНУ' : 'ВЫБЕРИТЕ РАЗМЕР'}
          </button>

          <div className="flex flex-wrap gap-2 text-[10px]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <span className="px-2 py-1 rounded" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.goldLight }}>
              ● {product.stockType === 'instock' ? 'В НАЛИЧИИ' : 'ПОД ЗАКАЗ'}
            </span>
            <span className="px-2 py-1 rounded" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.inkSoft }}>
              📍 {product.origin}
            </span>
            <span className="px-2 py-1 rounded" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.olive }}>
              {product.condition}
            </span>
          </div>

          <hr style={{ borderColor: COLORS.rule }} />

          <div>
            <div className="flex gap-4 border-b" style={{ borderColor: COLORS.rule }}>
              {[
                { id: 'description', label: 'ОПИСАНИЕ' },
                { id: 'reviews', label: `ОТЗЫВЫ (${reviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="text-xs tracking-wider pb-1.5 transition-all"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    color: activeTab === tab.id ? COLORS.stamp : COLORS.inkFaint,
                    borderBottom: activeTab === tab.id ? `2px solid ${COLORS.stamp}` : '2px solid transparent',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="pt-2 text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>
              {activeTab === 'description' && (
                <p>{product.description}</p>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-2">
                  {isAuthenticated && !hasReviewed && (
                    <div className="space-y-1.5 p-2.5 rounded-xl" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
                      <h4 className="text-xs" style={{ color: COLORS.ink }}>Оставить отзыв</h4>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((r) => (
                          <button key={r} onClick={() => setNewReview({ ...newReview, rating: r })} className="text-base">
                            <i className={`fas fa-star ${r <= newReview.rating ? 'text-amber-400' : 'text-white/20'}`} />
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {reviewImages.map((img, idx) => (
                          <div key={idx} className="relative w-9 h-9 rounded-lg overflow-hidden" style={{ border: `1px solid ${COLORS.rule}` }}>
                            <img src={img} alt="Фото" className="w-full h-full object-cover" />
                            <button onClick={() => setReviewImages(reviewImages.filter((_, i) => i !== idx))} className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[6px]">×</button>
                          </div>
                        ))}
                        <label className="cursor-pointer w-9 h-9 rounded-lg flex items-center justify-center" style={{ border: `1px dashed ${COLORS.ruleStrong}`, color: COLORS.inkFaint }}>
                          <i className="fas fa-plus text-[10px]" />
                          <input type="file" accept="image/*" onChange={handleReviewImageUpload} className="hidden" />
                        </label>
                      </div>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        rows={2}
                        placeholder="Ваш отзыв..."
                        className="w-full px-2.5 py-1.5 rounded-lg text-xs resize-none"
                        style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}`, color: COLORS.ink, outline: 'none' }}
                      />
                      <button
                        onClick={handleSubmitReview}
                        disabled={isSubmitting}
                        className="px-4 py-1 rounded-full text-xs transition"
                        style={{ backgroundColor: COLORS.ink, color: COLORS.bg, fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        ОТПРАВИТЬ
                      </button>
                    </div>
                  )}

                  {reviews.length === 0 ? (
                    <p className="text-xs" style={{ color: COLORS.inkFaint }}>Нет отзывов</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r.id} className="p-2.5 rounded-xl" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
                        <div className="flex items-start gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px]" style={{ backgroundColor: COLORS.bgElevated, color: COLORS.inkSoft }}>
                            {r.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="text-[11px]" style={{ color: COLORS.ink }}>{r.userName}</span>
                              <span className="text-[9px]" style={{ color: COLORS.inkFaint }}>
                                {new Date(r.date).toLocaleDateString()}
                              </span>
                            </div>
                            <StarRating rating={r.rating} size="text-[6px]" />
                            <p className="text-[11px] mt-0.5" style={{ color: COLORS.inkSoft }}>{r.comment}</p>
                            {r.photos && r.photos.length > 0 && (
                              <div className="flex gap-1 mt-0.5">
                                {r.photos.slice(0, 3).map((photo: string, idx: number) => (
                                  <img key={idx} src={photo} alt="Фото" className="w-7 h-7 rounded-lg object-cover" />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="px-4 pb-6">
            <h2 className="text-base font-black mb-2" style={{ fontFamily: 'Anton, sans-serif' }}>ПОХОЖИЕ ЛОТЫ</h2>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 snap-x">
              {similarProducts.map((similar) => (
                <Link
                  key={similar.id}
                  to={`/product/${similar.id}`}
                  className="flex-shrink-0 w-[40vw] max-w-[160px] snap-start space-y-1"
                >
                  <div className="aspect-[3/4] rounded-xl overflow-hidden" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
                    <img
                      src={similar.images?.[0] || similar.image || 'https://placehold.co/400x500/111113/e8e4dd'}
                      alt={similar.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <p className="text-[11px] line-clamp-1" style={{ color: COLORS.ink }}>{similar.name}</p>
                  <p className="text-[11px]" style={{ color: COLORS.inkSoft }}>
                    {similar.price.toLocaleString()} ₽
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== FULLSCREEN VIEWER ===== */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(10, 10, 11, 0.95)' }}
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{ backgroundColor: COLORS.bgCard, color: COLORS.ink }}
            >
              ✕
            </button>

            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COLORS.bgCard, color: COLORS.ink }}
                >
                  <i className="fas fa-chevron-left" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COLORS.bgCard, color: COLORS.ink }}
                >
                  <i className="fas fa-chevron-right" />
                </button>
              </>
            )}

            <motion.img
              key={selectedImageIndex}
              src={currentImage}
              alt={product.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="w-[90vw] h-[85vh] object-contain select-none"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full text-sm" style={{ backgroundColor: COLORS.bgCard, color: COLORS.ink }}>
              {selectedImageIndex + 1} / {product.images?.length || 1}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .cursor-zoom-in { cursor: zoom-in; }
      `}</style>
    </div>
  );
};

export default ProductPage;