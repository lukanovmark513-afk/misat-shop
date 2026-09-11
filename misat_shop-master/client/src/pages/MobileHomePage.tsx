import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCartAsync } from '../store/slices/cartSlice';
import { toggleFavoriteAsync } from '../store/slices/favoritesSlice';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';
import HeroSlider from '../components/HeroSlider';

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
// КОНСТАНТЫ
// ============================================
const ORIGINS = [
  { name: 'ЯПОНИЯ', count: 18, desc: 'Секонд-хенд рынки Осаки и Токио.', avgAge: '8 лет', items: 'Деним, спорт' },
  { name: 'ИТАЛИЯ', count: 24, desc: 'Аутлеты и частные распродажи.', avgAge: '5 лет', items: 'Пальто, костюмы' },
  { name: 'США', count: 31, desc: 'Винтажные развалы восточного побережья.', avgAge: '12 лет', items: 'Куртки' },
  { name: 'ФРАНЦИЯ', count: 9, desc: 'Парижские блошиные рынки.', avgAge: '10 лет', items: 'Верхняя одежда' },
  { name: 'ВЕЛИКОБРИТАНИЯ', count: 14, desc: 'Лондонские archive-дилеры.', avgAge: '15 лет', items: 'Кожа' },
];

const CRITERIA = [
  { number: '01', title: 'Силуэт', desc: 'Узнаваемый крой.' },
  { number: '02', title: 'Состояние', desc: 'Честный осмотр.' },
  { number: '03', title: 'Подлинность', desc: 'Проверка лейблов.' },
  { number: '04', title: 'История', desc: 'Вещь с прошлым.' },
];

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

const MobileHomePage = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeOrigin, setActiveOrigin] = useState(0);
  const [subscribeEmail, setSubscribeEmail] = useState('');

  const parseArrayField = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try { return JSON.parse(field); } catch { return []; }
    }
    return [];
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productsAPI.getAll();
        let productsData = [];
        if (Array.isArray(response.data)) productsData = response.data;
        else if (response.data?.data && Array.isArray(response.data.data)) productsData = response.data.data;
        else if (response.data?.products && Array.isArray(response.data.products)) productsData = response.data.products;

        const productsWithArrays = productsData.slice(0, 8).map((product: any, idx: number) => ({
          ...product,
          sizes: parseArrayField(product.sizes),
          colors: parseArrayField(product.colors),
          images: parseArrayField(product.images),
          origin: ['ОСАКА, JP', 'МИЛАН, IT', 'НЬЮ-ЙОРК, US', 'ПАРИЖ, FR'][idx % 4],
          condition: ['EXCELLENT', 'MINT', 'VINTAGE'][idx % 3],
          lot: String(idx + 1).padStart(4, '0'),
        }));
        setProducts(productsWithArrays);
      } catch (error) {
        toast.error('Ошибка загрузки');
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
    toast.success(`Лот ${product.lot} добавлен в корзину`, {
      style: { background: COLORS.bgCard, color: COLORS.ink, border: `1px solid ${COLORS.ruleStrong}`, borderRadius: '4px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }
    });
  };

  const handleToggleFavorite = (productId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavoriteAsync(productId));
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="w-10 h-10 rounded-full border" style={{ borderColor: COLORS.rule, borderTopColor: COLORS.stamp, animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, color: COLORS.ink, overflowX: 'hidden' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

      <HeroSlider />

      {/* ===== ГЕОГРАФИЯ ЗАКУПОК ===== */}
      <div style={{ padding: '24px 16px', backgroundColor: COLORS.bgCard, borderBottom: `1px solid ${COLORS.rule}` }}>
        <p style={{ color: COLORS.stamp, fontSize: 8, letterSpacing: '0.3em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>СНАБЖЕНИЕ</p>
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 24, margin: '0 0 16px' }}>ГЕОГРАФИЯ ЗАКУПОК</h2>

        {/* Горизонтальный скролл стран */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12 }}>
          {ORIGINS.map((origin, idx) => (
            <button
              key={idx}
              onClick={() => setActiveOrigin(idx)}
              style={{
                flex: '0 0 auto',
                padding: '8px 14px',
                borderRadius: 4,
                backgroundColor: activeOrigin === idx ? `${COLORS.stamp}20` : COLORS.bg,
                border: `1px solid ${activeOrigin === idx ? COLORS.stamp : COLORS.rule}`,
                color: activeOrigin === idx ? COLORS.stamp : COLORS.inkSoft,
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {origin.name}
            </button>
          ))}
        </div>

        {/* Детали выбранной страны */}
        <div style={{ padding: '14px 16px', backgroundColor: COLORS.bg, borderRadius: 4, border: `1px solid ${COLORS.rule}` }}>
          <p style={{ color: COLORS.stamp, fontSize: 9, fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>
            ГЕОГРАФИЯ / {ORIGINS[activeOrigin].name}
          </p>
          <p style={{ color: COLORS.inkSoft, fontSize: 12, lineHeight: 1.5, marginBottom: 12 }}>{ORIGINS[activeOrigin].desc}</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, color: COLORS.ink }}>{ORIGINS[activeOrigin].count}</span>
              <small style={{ display: 'block', fontSize: 7, color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>ВЕЩЕЙ</small>
            </div>
            <div>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, color: COLORS.ink }}>{ORIGINS[activeOrigin].avgAge}</span>
              <small style={{ display: 'block', fontSize: 7, color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>ВОЗРАСТ</small>
            </div>
          </div>
        </div>
      </div>

      {/* ===== КРИТЕРИИ ОТБОРА ===== */}
      <div style={{ padding: '24px 16px', borderBottom: `1px solid ${COLORS.rule}` }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <p style={{ color: COLORS.stamp, fontSize: 8, letterSpacing: '0.3em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 4 }}>КУРАЦИЯ</p>
          <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 24, margin: 0 }}>КАК МЫ ОТБИРАЕМ ВЕЩИ</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {CRITERIA.map((item, idx) => (
            <div key={idx} style={{ padding: '12px 14px', backgroundColor: COLORS.bgCard, borderRadius: 4, border: `1px solid ${COLORS.rule}` }}>
              <p style={{ fontFamily: 'Anton, sans-serif', fontSize: 28, color: `${COLORS.ink}10`, margin: '0 0 6px' }}>{item.number}</p>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: COLORS.ink, margin: '0 0 4px' }}>{item.title}</h3>
              <p style={{ fontSize: 9, color: COLORS.inkSoft, margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== ПОСЛЕДНИЕ ЛОТЫ ===== */}
      <div style={{ padding: '24px 16px', backgroundColor: COLORS.bgCard, borderBottom: `1px solid ${COLORS.rule}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingBottom: 10, borderBottom: `1px dashed ${COLORS.ruleStrong}` }}>
          <div>
            <p style={{ color: COLORS.stamp, fontSize: 8, letterSpacing: '0.3em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 2 }}>МАНИФЕСТ</p>
            <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 20, margin: 0 }}>ПОСЛЕДНИЕ ЛОТЫ</h2>
          </div>
          <Link to="/catalog" style={{ color: COLORS.inkFaint, fontSize: 9, textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace' }}>
            ВСЕ →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {products.slice(0, 4).map((product) => {
            const isFav = favorites.includes(product.id);
            return (
              <div key={product.id} style={{ backgroundColor: COLORS.bg, borderRadius: 4, border: `1px solid ${COLORS.rule}`, overflow: 'hidden' }}>
                <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
                  <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                    <img src={product.images?.[0] || product.image || 'https://placehold.co/400x500/111113/e8e4dd'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.2) sepia(0.1) brightness(0.95)' }} loading="lazy" />
                    <div style={{ position: 'absolute', bottom: 6, right: 6 }}>
                      <ArchiveStamp lot={product.lot} size={32} />
                    </div>
                    <span style={{ position: 'absolute', top: 6, left: 6, fontSize: 6, padding: '2px 5px', backgroundColor: 'rgba(10,10,11,0.85)', border: `1px solid ${COLORS.rule}`, color: COLORS.olive, fontFamily: 'JetBrains Mono, monospace' }}>
                      {product.condition}
                    </span>
                    <button onClick={(e) => handleToggleFavorite(product.id, e)} style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%', backgroundColor: isFav ? `${COLORS.stamp}30` : 'rgba(10,10,11,0.7)', border: `1px solid ${isFav ? COLORS.stamp : COLORS.rule}`, color: isFav ? COLORS.stamp : COLORS.inkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <i className={`${isFav ? 'fas' : 'far'} fa-heart`} style={{ fontSize: 9 }} />
                    </button>
                  </div>
                </Link>
                <div style={{ padding: '8px 10px 10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, paddingBottom: 4, borderBottom: `1px dashed ${COLORS.rule}` }}>
                    <span style={{ fontSize: 6, color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>ЛОТ {product.lot}</span>
                    <span style={{ fontSize: 6, color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>{product.origin}</span>
                  </div>
                  <h3 style={{ fontSize: 10, color: COLORS.ink, margin: '0 0 6px', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>{product.price.toLocaleString()} ₽</span>
                  </div>
                  <button onClick={() => handleAddToCart(product)} style={{ width: '100%', padding: '6px 0', backgroundColor: 'transparent', border: `1px solid ${COLORS.ink}`, borderRadius: 2, color: COLORS.ink, fontSize: 7, fontWeight: 600, letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace' }}>
                    + В КОРЗИНУ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== CTA ===== */}
      <div style={{ padding: '40px 16px', textAlign: 'center', backgroundColor: COLORS.bgCard, borderBottom: `1px solid ${COLORS.rule}` }}>
        <p style={{ color: COLORS.stamp, fontSize: 8, letterSpacing: '0.3em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 8 }}>ПРИСОЕДИНЯЙТЕСЬ</p>
        <h2 style={{ fontFamily: 'Anton, sans-serif', fontSize: 32, lineHeight: 0.9, margin: '0 0 12px' }}>
          МИРОВЫЕ БРЕНДЫ<br />
          <span style={{ color: COLORS.inkFaint }}>БЕЗ ПОВТОРОВ</span>
        </h2>
        <p style={{ color: COLORS.inkSoft, fontSize: 11, margin: '0 auto 16px', maxWidth: 260, lineHeight: 1.5 }}>
          Одежда, обувь и аксессуары с историей.
        </p>
        <Link to="/catalog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', border: `1px solid ${COLORS.stamp}`, color: COLORS.stamp, fontSize: 9, textDecoration: 'none', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>
          ПЕРЕЙТИ В КАТАЛОГ <i className="fas fa-arrow-right" style={{ fontSize: 9 }} />
        </Link>
      </div>

      {/* ===== ПОДПИСКА ===== */}
      <div style={{ padding: '24px 16px' }}>
        <div style={{ backgroundColor: COLORS.bgCard, borderRadius: 4, border: `1px solid ${COLORS.ruleStrong}`, padding: '20px 16px', maxWidth: 400, margin: '0 auto' }}>
          <p style={{ color: COLORS.stamp, fontSize: 8, letterSpacing: '0.2em', fontFamily: 'JetBrains Mono, monospace', marginBottom: 6 }}>ПОДПИСКА</p>
          <h3 style={{ fontFamily: 'Anton, sans-serif', fontSize: 18, margin: '0 0 4px' }}>УЗНАВАЙТЕ ПЕРВЫМИ</h3>
          <p style={{ color: COLORS.inkSoft, fontSize: 10, margin: '0 0 14px' }}>Новые поступления и эксклюзивные лоты.</p>
          <form onSubmit={(e) => { e.preventDefault(); toast.success('Спасибо за подписку!'); }} style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              placeholder="ваш@email.com"
              style={{ flex: 1, padding: '10px 12px', backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}`, borderRadius: 2, color: COLORS.ink, fontSize: 11, outline: 'none', fontFamily: 'JetBrains Mono, monospace' }}
            />
            <button type="submit" style={{ padding: '10px 16px', backgroundColor: COLORS.ink, color: COLORS.bg, border: 'none', borderRadius: 2, fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace', whiteSpace: 'nowrap' }}>
              ПОДПИСАТЬСЯ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MobileHomePage;