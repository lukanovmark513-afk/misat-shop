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
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [reviewImages, setReviewImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

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
          const maxSize = 400;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', 0.7));
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
    setNewReview({ rating: 5, comment: '' });
    setReviewImages([]);
    setIsSubmitting(false);
    toast.success('Спасибо за отзыв!');
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

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
          <h2 className="text-2xl font-black mb-4">ТОВАР НЕ НАЙДЕН</h2>
          <Link to="/catalog" className="bg-black text-white px-6 py-2 rounded-full">В КАТАЛОГ</Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Текущее фото для отображения
  const currentImage = product.images && product.images.length > 0
    ? product.images[selectedImageIndex]
    : (product.image || 'https://placehold.co/600x600/eeeeee/cccccc?text=No+Image');

  return (
    <div className="min-h-screen bg-white pt-20 pb-24 md:pb-0">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 overflow-x-auto whitespace-nowrap pb-1">
          <Link to="/" className="hover:text-black">Главная</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <Link to="/catalog" className="hover:text-black">Каталог</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="text-black truncate">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12">
          {/* Левая колонка - Фото с галереей */}
          <div className="relative md:sticky md:top-24">
            {/* Главное фото */}
            <div className="bg-gray-100 rounded-2xl overflow-hidden mb-3">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Миниатюры - показываем все фото */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition flex-shrink-0 ${
                      selectedImageIndex === idx ? 'border-black' : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    <img src={img} alt={`Фото ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleToggleFavorite}
              className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition"
            >
              <i className={`${isFavorite ? 'fas fa-heart text-red-500' : 'far fa-heart'} text-lg`}></i>
            </button>
          </div>

          {/* Правая колонка */}
          <div>
            <h1 className="text-2xl md:text-3xl font-black mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-500 text-sm">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < Math.floor(Number(averageRating)) ? 'text-yellow-500' : 'text-gray-300'}`}></i>
                ))}
              </div>
              <span className="text-xs text-gray-500">{averageRating} ({reviews.length})</span>
            </div>
            <p className="text-2xl md:text-3xl font-black mb-4">{product.price.toLocaleString()} ₽</p>

            {/* Информация о доставке */}
            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
              {product.stockType === 'in_stock' ? (
                <>
                  <div className="flex items-center gap-2 text-green-700">
                    <i className="fas fa-check-circle"></i>
                    <span className="font-bold">В наличии в России</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    • Доставка по РФ: 2-5 дней<br />
                    • Отправка из Москвы
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-orange-600">
                    <i className="fas fa-ship"></i>
                    <span className="font-bold">Предзаказ из Китая</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    • Срок доставки: ~{product.preorderDays || 30} дней<br />
                    • Трекинг-номер будет предоставлен
                  </p>
                </>
              )}
            </div>

            {/* Размеры */}
            <div className="mb-4">
              <h3 className="font-bold text-sm mb-2">РАЗМЕР</h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0 ? (
                  product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 border-2 text-sm font-bold rounded-lg transition ${
                        selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Размеры не указаны</p>
                )}
              </div>
            </div>

            {/* Количество */}
            <div className="mb-6">
              <h3 className="font-bold text-sm mb-2">КОЛИЧЕСТВО</h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 border-2 rounded-lg hover:border-black transition">-</button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 border-2 rounded-lg hover:border-black transition">+</button>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="hidden md:flex gap-4 mb-6">
              <button onClick={handleAddToCart} className="flex-1 bg-gray-100 border-2 border-black py-3 rounded-full font-bold text-sm hover:bg-gray-200 transition">
                В КОРЗИНУ
              </button>
              <button onClick={handleBuyNow} className="flex-1 bg-black text-white py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition">
                КУПИТЬ СЕЙЧАС
              </button>
            </div>

            {/* Табы */}
            <div className="border-t-2 border-black pt-4">
              <div className="flex gap-4 mb-4 overflow-x-auto">
                <button onClick={() => setActiveTab('description')} className={`font-bold pb-1 text-sm whitespace-nowrap ${activeTab === 'description' ? 'border-b-2 border-black' : 'text-gray-400'}`}>ОПИСАНИЕ</button>
                <button onClick={() => setActiveTab('details')} className={`font-bold pb-1 text-sm whitespace-nowrap ${activeTab === 'details' ? 'border-b-2 border-black' : 'text-gray-400'}`}>ХАРАКТЕРИСТИКИ</button>
                <button onClick={() => setActiveTab('reviews')} className={`font-bold pb-1 text-sm whitespace-nowrap ${activeTab === 'reviews' ? 'border-b-2 border-black' : 'text-gray-400'}`}>ОТЗЫВЫ ({reviews.length})</button>
              </div>

              <div className="text-gray-600 text-sm">
                {activeTab === 'description' && (
                  <p>{product.description || 'Описание товара отсутствует'}</p>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-1">
                    <p>• Категория: {product.category || 'Не указана'}</p>
                    <p>• Размеры: {product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0
                      ? product.sizes.join(', ')
                      : 'Не указаны'}</p>
                    <p>• Артикул: #{product.id}</p>
                    {product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
                      <p>• Цвета: {product.colors.join(', ')}</p>
                    )}
                    {product.stock !== undefined && (
                      <p>• Наличие: {product.stock > 0 ? `${product.stock} шт.` : 'Нет в наличии'}</p>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    {isAuthenticated && !hasReviewed && (
                      <div className="mb-6 p-3 bg-gray-50 rounded-xl">
                        <h4 className="font-bold mb-2 text-sm">Оставить отзыв</h4>
                        <div className="flex gap-1 mb-2">
                          {[1,2,3,4,5].map(r => (
                            <button key={r} onClick={() => setNewReview({ ...newReview, rating: r })} className="text-xl">
                              <i className={`fas fa-star ${r <= newReview.rating ? 'text-yellow-500' : 'text-gray-300'}`}></i>
                            </button>
                          ))}
                        </div>
                        <div className="mb-2 flex flex-wrap gap-2">
                          {reviewImages.map((img, idx) => (
                            <div key={idx} className="relative w-16 h-16">
                              <img src={img} alt="Фото" className="w-full h-full object-cover rounded-lg" />
                              <button onClick={() => removeReviewImage(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs">×</button>
                            </div>
                          ))}
                          <label className="cursor-pointer bg-gray-200 px-3 py-2 rounded-lg text-sm inline-block">
                            {isUploadingImage ? 'Загрузка...' : '📷 Фото'}
                            <input type="file" accept="image/*" onChange={handleReviewImageUpload} className="hidden" disabled={isUploadingImage} />
                          </label>
                        </div>
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          rows={2}
                          placeholder="Ваш отзыв..."
                          className="w-full px-3 py-2 border rounded-lg text-sm resize-none mb-2"
                        />
                        <button onClick={handleSubmitReview} disabled={isSubmitting} className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold">
                          Отправить
                        </button>
                      </div>
                    )}
                    {reviews.length === 0 ? (
                      <p className="text-gray-500 text-center py-4 text-sm">Нет отзывов</p>
                    ) : (
                      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                        {reviews.map(r => (
                          <div key={r.id} className="border-b pb-3">
                            <div className="flex justify-between">
                              <p className="font-bold text-sm">{r.userName}</p>
                              <p className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString()}</p>
                            </div>
                            <div className="flex text-yellow-500 text-xs mt-1">
                              {[...Array(5)].map((_, i) => <i key={i} className={`fas fa-star ${i < r.rating ? 'text-yellow-500' : 'text-gray-300'}`}></i>)}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{r.comment}</p>
                            {r.photos && r.photos.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {r.photos.map((photo, idx) => (
                                  <img key={idx} src={photo} alt="Фото" className="w-12 h-12 object-cover rounded" />
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
          <div className="mt-12 pt-8 border-t-2 border-black">
            <h2 className="text-xl md:text-2xl font-black mb-6">ПОХОЖИЕ ТОВАРЫ</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similarProducts.map((similar: any) => (
                <Link key={similar.id} to={`/product/${similar.id}`} className="group">
                  <div className="bg-gray-100 rounded-xl aspect-square overflow-hidden">
                    <img
                      src={similar.images?.[0] || similar.image || 'https://placehold.co/400x400/eeeeee/cccccc?text=No+Image'}
                      alt={similar.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  </div>
                  <p className="font-black mt-2 text-sm line-clamp-1">{similar.name}</p>
                  <p className="font-bold text-sm md:text-lg">{similar.price.toLocaleString()} ₽</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {similar.stockType === 'in_stock' ? '✅ В наличии' : '📦 Предзаказ'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Мобильные кнопки */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex gap-3 z-30 md:hidden">
        <button onClick={handleAddToCart} className="flex-1 bg-gray-100 border-2 border-black py-3 rounded-full font-bold text-sm">
          В корзину
        </button>
        <button onClick={handleBuyNow} className="flex-1 bg-black text-white py-3 rounded-full font-bold text-sm">
          Купить
        </button>
      </div>
    </div>
  );
};

export default ProductPage;