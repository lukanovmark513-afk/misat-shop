import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCartAsync } from '../store/slices/cartSlice';
import { toggleFavoriteAsync } from '../store/slices/favoritesSlice';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';

interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  photos?: string[];
  date: string;
}

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const favorites = useAppSelector((state) => state.favorites.items);
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedViewerImage, setSelectedViewerImage] = useState(0);

  // Определение мобильного устройства
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const response = await productsAPI.getById(Number(id));
        const productData = response.data;

        productData.sizes = parseArrayField(productData.sizes);
        productData.colors = parseArrayField(productData.colors);
        productData.images = parseArrayField(productData.images);

        if ((!productData.images || productData.images.length === 0) && productData.image) {
          productData.images = [productData.image];
        }

        setProduct(productData);
        setSelectedImageIndex(0);

        const allReviews = JSON.parse(localStorage.getItem('misat_reviews') || '[]');
        const productReviews = allReviews.filter((r: Review) => r.productId === Number(id));
        setReviews(productReviews);

        if (isAuthenticated && user) {
          setHasReviewed(productReviews.some((r: Review) => r.userId === user.id));
        }

        const allProducts = await productsAPI.getAll();
        const similar = allProducts.data
          .filter((p: any) => p.category === productData.category && p.id !== productData.id)
          .map((p: any) => ({
            ...p,
            sizes: parseArrayField(p.sizes),
            colors: parseArrayField(p.colors),
            images: parseArrayField(p.images),
          }))
          .slice(0, 4);
        setSimilarProducts(similar);

      } catch (error) {
        console.error('Ошибка загрузки товара:', error);
        toast.error('Товар не найден');
        navigate('/catalog');
      } finally {
        setIsLoading(false);
      }
    };
    loadProduct();
  }, [id, isAuthenticated, user, navigate]);

  const openImageViewer = (index: number) => {
    setSelectedViewerImage(index);
    setIsImageViewerOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
    document.body.style.overflow = 'auto';
  };

  const isFavorite = favorites.includes(Number(id));

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('Войдите в аккаунт');
      return;
    }
    dispatch(toggleFavoriteAsync(Number(id)));
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Выберите размер');
      return;
    }
    if (product) {
      dispatch(addToCartAsync({
        productId: product.id,
        quantity,
        size: selectedSize,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[selectedImageIndex] || product.images?.[0] || product.image,
          sizes: product.sizes,
          stockType: product.stockType,
          preorderDays: product.preorderDays
        }
      }));
      toast.success(`${product.name} добавлен в корзину`);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Выберите размер');
      return;
    }
    if (!isAuthenticated) {
      toast.error('Войдите в аккаунт');
      navigate('/profile');
      return;
    }
    dispatch(addToCartAsync({
      productId: product.id,
      quantity,
      size: selectedSize,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[selectedImageIndex] || product.images?.[0] || product.image,
        sizes: product.sizes,
        stockType: product.stockType,
        preorderDays: product.preorderDays
      }
    }));
    toast.success('Переход к оформлению...');
    setTimeout(() => navigate('/checkout'), 500);
  };

  // Высококачественная компрессия изображений для 4K
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');

          // Сохраняем исходные размеры для 4K качества
          let width = img.width;
          let height = img.height;

          // Опционально: ограничиваем максимальный размер для производительности
          const maxSize = 4096; // 4K
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Высокое качество JPEG
          let quality = 0.92;
          let result = canvas.toDataURL('image/jpeg', quality);

          // Если файл больше 5MB, немного уменьшаем качество
          while (result.length > 5 * 1024 * 1024 && quality > 0.7) {
            quality -= 0.05;
            result = canvas.toDataURL('image/jpeg', quality);
          }

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

    setIsUploadingImage(true);
    try {
      const compressed = await compressImage(file);
      setReviewImages([...reviewImages, compressed]);
    } catch (error) {
      toast.error('Ошибка загрузки фото');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeReviewImage = (index: number) => {
    setReviewImages(reviewImages.filter((_, i) => i !== index));
  };

  const handleSubmitReview = () => {
    if (!isAuthenticated) {
      toast.error('Войдите в аккаунт');
      return;
    }
    if (hasReviewed) {
      toast.error('Вы уже оставляли отзыв');
      return;
    }
    if (newReview.rating === 0) {
      toast.error('Поставьте оценку');
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error('Напишите отзыв');
      return;
    }

    setIsSubmitting(true);

    const newReviewObj: Review = {
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
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
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

  if (!product) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-box-open text-5xl text-gray-600 mb-4"></i>
          <h2 className="text-2xl font-black text-white mb-4">ТОВАР НЕ НАЙДЕН</h2>
          <Link to="/catalog" className="bg-white text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-100 transition">В КАТАЛОГ</Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const currentImage = product.images && product.images.length > 0
    ? product.images[selectedImageIndex]
    : (product.image || 'https://placehold.co/800x800/1a1a1a/666666?text=No+Image');

  return (
    <div className="min-h-screen bg-black pt-16 pb-24 md:pb-0">
      <div className="w-full px-4 md:px-8 lg:px-16 py-4 md:py-6">

        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 md:mb-6 overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-white transition">Главная</Link>
          <i className="fas fa-chevron-right text-[9px]"></i>
          <Link to="/catalog" className="hover:text-white transition">Каталог</Link>
          <i className="fas fa-chevron-right text-[9px]"></i>
          <span className="text-white truncate">{product.name}</span>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12">

          {/* ========== ЛЕВАЯ КОЛОНКА - ФОТО ========== */}
          <div className="relative">
            {/* Основное фото */}
            <div
              onClick={() => openImageViewer(selectedImageIndex)}
              className="group cursor-pointer"
            >
              <div className="max-w-[400px] md:max-w-[500px] mx-auto">
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-auto object-contain rounded-xl transition-opacity duration-300"
                  style={{
                    maxHeight: isMobile ? '400px' : '500px',
                    imageRendering: 'high-quality'
                  }}
                  loading="eager"
                />
                {/* Оверлей при наведении (только ПК) */}
                {!isMobile && (
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none rounded-xl">
                    <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                      <i className="fas fa-expand text-white text-xl"></i>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Миниатюры */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1 justify-center">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-white shadow-md'
                        : 'border-white/20 hover:border-white/50'
                    }`}
                  >
                    <img src={img} alt={`Фото ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Кнопка избранного */}
            <button
              onClick={handleToggleFavorite}
              className="absolute top-2 right-2 w-8 h-8 md:w-10 md:h-10 bg-black/70 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition hover:scale-110 z-10 shadow-lg"
            >
              <i className={`${isFavorite ? 'fas fa-heart text-red-500 text-sm md:text-lg' : 'far fa-heart text-white text-sm md:text-lg'}`}></i>
            </button>
          </div>

          {/* ========== ПРАВАЯ КОЛОНКА ========== */}
          <div>
            <h1 className="text-xl md:text-3xl font-black text-white mb-2">{product.name}</h1>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star text-[10px] md:text-sm ${
                      i < Math.floor(Number(averageRating))
                        ? 'text-amber-400'
                        : i < Number(averageRating)
                        ? 'text-amber-400 opacity-50'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] md:text-xs text-gray-500">{averageRating} ({reviews.length})</span>
            </div>

            <p className="text-xl md:text-3xl font-black text-white mb-3 md:mb-4">{product.price.toLocaleString()} ₽</p>

            {/* Доставка */}
            <div className="mb-4 p-3 md:p-4 bg-white/5 rounded-xl border border-white/10">
              {product.stockType === 'in_stock' ? (
                <>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <i className="fas fa-check-circle text-xs md:text-sm"></i>
                    <span className="font-bold text-xs md:text-sm">В наличии в России</span>
                  </div>
                  <p className="text-gray-400 text-[10px] md:text-xs mt-1 md:mt-2">• Доставка по РФ: 2-5 дней<br />• Отправка из Москвы</p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-orange-400">
                    <i className="fas fa-ship text-xs md:text-sm"></i>
                    <span className="font-bold text-xs md:text-sm">Предзаказ из Китая</span>
                  </div>
                  <p className="text-gray-400 text-[10px] md:text-xs mt-1 md:mt-2">• Срок доставки: ~{product.preorderDays || 30} дней<br />• Трекинг-номер будет предоставлен</p>
                </>
              )}
            </div>

            {/* Размеры */}
            <div className="mb-4 md:mb-5">
              <h3 className="text-white/40 text-[9px] md:text-xs font-bold mb-1 md:mb-2 tracking-wider uppercase">Размер</h3>
              <div className="flex gap-1.5 md:gap-2 flex-wrap">
                {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-8 h-8 md:w-10 md:h-10 border text-xs md:text-sm font-bold rounded-xl transition ${
                        selectedSize === size ? 'border-white bg-white text-black' : 'border-white/20 text-white hover:border-white/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-xs">Размеры не указаны</p>
                )}
              </div>
            </div>

            {/* Количество */}
            <div className="mb-4 md:mb-6">
              <h3 className="text-white/40 text-[9px] md:text-xs font-bold mb-1 md:mb-2 tracking-wider uppercase">Количество</h3>
              <div className="flex items-center gap-2 md:gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-7 h-7 md:w-9 md:h-9 border border-white/20 rounded-xl text-white hover:border-white/50 transition text-sm">-</button>
                <span className="w-8 md:w-10 text-center font-bold text-white text-sm md:text-base">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-7 h-7 md:w-9 md:h-9 border border-white/20 rounded-xl text-white hover:border-white/50 transition text-sm">+</button>
              </div>
            </div>

            {/* Кнопки ПК */}
            <div className="hidden md:flex gap-4 mb-6">
              <button onClick={handleAddToCart} className="flex-1 bg-white/10 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition border border-white/10">
                В КОРЗИНУ
              </button>
              <button onClick={handleBuyNow} className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition">
                КУПИТЬ СЕЙЧАС
              </button>
            </div>

            {/* Табы */}
            <div className="border-t border-white/10 pt-4 md:pt-5">
              <div className="flex gap-3 md:gap-5 mb-3 md:mb-4 overflow-x-auto">
                <button onClick={() => setActiveTab('description')} className={`font-bold text-[9px] md:text-xs tracking-wider pb-1 whitespace-nowrap transition ${activeTab === 'description' ? 'text-white border-b border-white' : 'text-white/50'}`}>ОПИСАНИЕ</button>
                <button onClick={() => setActiveTab('details')} className={`font-bold text-[9px] md:text-xs tracking-wider pb-1 whitespace-nowrap transition ${activeTab === 'details' ? 'text-white border-b border-white' : 'text-white/50'}`}>ХАРАКТЕРИСТИКИ</button>
                <button onClick={() => setActiveTab('reviews')} className={`font-bold text-[9px] md:text-xs tracking-wider pb-1 whitespace-nowrap transition ${activeTab === 'reviews' ? 'text-white border-b border-white' : 'text-white/50'}`}>ОТЗЫВЫ ({reviews.length})</button>
              </div>

              <div className="text-gray-400 text-xs md:text-sm leading-relaxed">
                {activeTab === 'description' && (
                  <p>{product.description || 'Описание товара отсутствует'}</p>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-1 md:space-y-2">
                    <p className="text-[10px] md:text-sm">• Категория: <span className="text-white/80">{product.category || 'Не указана'}</span></p>
                    <p className="text-[10px] md:text-sm">• Размеры: <span className="text-white/80">{product.sizes?.join(', ') || 'Не указаны'}</span></p>
                    <p className="text-[10px] md:text-sm">• Артикул: <span className="text-white/80">#{product.id}</span></p>
                    {product.colors?.length > 0 && <p className="text-[10px] md:text-sm">• Цвета: <span className="text-white/80">{product.colors.join(', ')}</span></p>}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    {isAuthenticated && !hasReviewed && (
                      <div className="mb-4 md:mb-6 p-3 md:p-4 bg-white/5 rounded-xl border border-white/10">
                        <h4 className="text-white font-bold text-xs md:text-sm mb-2 md:mb-3">Оставить отзыв</h4>
                        <div className="flex gap-0.5 md:gap-1 mb-2 md:mb-3">
                          {[1,2,3,4,5].map(r => (
                            <button key={r} onClick={() => setNewReview({ ...newReview, rating: r })} className="text-base md:text-xl">
                              <i className={`fas fa-star ${r <= newReview.rating ? 'text-amber-400' : 'text-gray-600'}`}></i>
                            </button>
                          ))}
                        </div>
                        <div className="mb-2 md:mb-3 flex flex-wrap gap-1 md:gap-2">
                          {reviewImages.map((img, idx) => (
                            <div key={idx} className="relative w-10 h-10 md:w-14 md:h-14">
                              <img src={img} alt="Фото" className="w-full h-full object-cover rounded-lg" />
                              <button onClick={() => removeReviewImage(idx)} className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-red-500 text-white rounded-full text-[8px] md:text-xs">×</button>
                            </div>
                          ))}
                          <label className="cursor-pointer bg-white/10 px-2 py-1 md:px-3 md:py-2 rounded-lg text-[10px] md:text-xs text-white hover:bg-white/20 transition">
                            {isUploadingImage ? 'Загрузка...' : '📷 Фото'}
                            <input type="file" accept="image/*" onChange={handleReviewImageUpload} className="hidden" disabled={isUploadingImage} />
                          </label>
                        </div>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          rows={2}
                          placeholder="Ваш отзыв..."
                          className="w-full px-2 py-1.5 md:px-3 md:py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-xs md:text-sm resize-none mb-2 md:mb-3 focus:border-white/30 focus:outline-none"
                        />
                        <button onClick={handleSubmitReview} disabled={isSubmitting} className="bg-white text-black px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-xs font-bold hover:bg-gray-100 transition">
                          Отправить
                        </button>
                      </div>
                    )}
                    {reviews.length === 0 ? (
                      <p className="text-gray-500 text-center py-4 md:py-6 text-xs md:text-sm">Нет отзывов</p>
                    ) : (
                      <div className="space-y-3 md:space-y-4 max-h-80 md:max-h-96 overflow-y-auto pr-1 md:pr-2">
                        {reviews.map(r => (
                          <div key={r.id} className="border-b border-white/10 pb-2 md:pb-3">
                            <div className="flex justify-between items-center">
                              <p className="font-bold text-white text-xs md:text-sm">{r.userName}</p>
                              <p className="text-[9px] md:text-xs text-gray-500">{new Date(r.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-0.5 mt-0.5 md:mt-1">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fas fa-star text-[8px] md:text-[10px] ${i < r.rating ? 'text-amber-400' : 'text-gray-600'}`}></i>
                              ))}
                            </div>
                            <p className="text-gray-400 text-[10px] md:text-sm mt-1 md:mt-2">{r.comment}</p>
                            {r.photos && r.photos.length > 0 && (
                              <div className="flex gap-1 md:gap-2 mt-1 md:mt-2">
                                {r.photos.map((photo, idx) => (
                                  <img key={idx} src={photo} alt="Фото" className="w-8 h-8 md:w-10 md:h-10 object-cover rounded" />
                                ))}
                              </div>
                            )}
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

        {/* Похожие товары */}
        {similarProducts.length > 0 && (
          <div className="mt-10 md:mt-16 pt-6 md:pt-8 border-t border-white/10">
            <h2 className="text-lg md:text-2xl font-black text-white mb-4 md:mb-6">ПОХОЖИЕ ТОВАРЫ</h2>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {similarProducts.map((similar: any) => (
                <Link key={similar.id} to={`/product/${similar.id}`} className="group">
                  <div className="bg-white/5 rounded-xl aspect-[4/3] overflow-hidden border border-white/10 group-hover:border-white/30 transition">
                    <img
                      src={similar.images?.[0] || similar.image || 'https://placehold.co/400x300/1a1a1a/666666'}
                      alt={similar.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <p className="text-white font-bold text-[10px] md:text-xs mt-1 md:mt-2 line-clamp-1 group-hover:text-gray-300 transition">{similar.name}</p>
                  <p className="text-white font-bold text-xs md:text-sm mt-0.5 md:mt-1">{similar.price.toLocaleString()} ₽</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Мобильные кнопки */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-3 flex gap-3 z-30 md:hidden" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}>
        <button onClick={handleAddToCart} className="flex-1 bg-white/10 text-white py-2.5 rounded-xl font-bold text-xs hover:bg-white/20 transition border border-white/10">
          В корзину
        </button>
        <button onClick={handleBuyNow} className="flex-1 bg-white text-black py-2.5 rounded-xl font-bold text-xs hover:bg-gray-100 transition">
          Купить
        </button>
      </div>

      {/* МОДАЛЬНОЕ ОКНО - 4K качество */}
      {isImageViewerOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center"
          onClick={closeImageViewer}
        >
          <button
            onClick={closeImageViewer}
            className="fixed top-4 right-4 w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition z-10"
          >
            <i className="fas fa-times text-white text-sm md:text-xl"></i>
          </button>

          {product.images && product.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedViewerImage(prev => prev === 0 ? product.images.length - 1 : prev - 1);
                }}
                className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition z-10"
              >
                <i className="fas fa-chevron-left text-white text-sm md:text-2xl"></i>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedViewerImage(prev => prev === product.images.length - 1 ? 0 : prev + 1);
                }}
                className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition z-10"
              >
                <i className="fas fa-chevron-right text-white text-sm md:text-2xl"></i>
              </button>
            </>
          )}

          <img
            src={product.images?.[selectedViewerImage] || currentImage}
            alt={product.name}
            className="max-w-[95vw] max-h-[85vh] w-auto h-auto object-contain rounded-xl cursor-default"
            style={{
              imageRendering: 'high-quality',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
            loading="eager"
          />

          <div className="absolute bottom-4 left-0 right-0">
            <div className="flex justify-center gap-1 md:gap-2 overflow-x-auto px-2 md:px-4 py-1 md:py-2">
              {product.images?.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedViewerImage(idx);
                  }}
                  className={`w-8 h-8 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedViewerImage === idx ? 'border-white shadow-md' : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <div className="text-center mt-1 md:mt-2">
              <span className="bg-black/50 backdrop-blur rounded-full px-2 py-0.5 md:px-3 md:py-1 text-white text-[9px] md:text-xs">
                {selectedViewerImage + 1} / {product.images?.length || 1}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;