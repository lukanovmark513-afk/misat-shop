import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCartAsync } from '../store/slices/cartSlice';
import { toggleFavoriteAsync } from '../store/slices/favoritesSlice';
import { productsAPI, categoriesAPI } from '../services/api';
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
  brand?: string;
  rating: number;
  reviews: number;
  is_new?: boolean;
  is_sale?: boolean;
  is_exclusive?: boolean;
  is_original?: boolean;
  stockType?: string;
  preorderDays?: number;
  prepaymentPercent?: number;
  description?: string;
  origin?: string;
  condition?: string;
  lot?: string;
  label?: string;
  season?: string;
}

interface Bid {
  id: string;
  user: string;
  amount: number;
  time: number;
}

interface AuctionItem {
  id: number;
  name: string;
  image: string;
  lot: string;
  startPrice: number;
  currentBid: number;
  minStep: number;
  endsAt: number;
  bids: Bid[];
  condition: string;
  brand?: string;
  description?: string;
  origin?: string;
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
  live: '#ff6b6b',
  success: '#4ecb9e',
};

// ============================================
// БРЕНДЫ
// ============================================
const BRANDS = [
  { id: 'all', name: 'ВСЕ БРЕНДЫ' },
  { id: 'gucci', name: 'GUCCI' },
  { id: 'prada', name: 'PRADA' },
  { id: 'balenciaga', name: 'BALENCIAGA' },
  { id: 'louis-vuitton', name: 'LOUIS VUITTON' },
  { id: 'dior', name: 'DIOR' },
  { id: 'versace', name: 'VERSACE' },
  { id: 'burberry', name: 'BURBERRY' },
  { id: 'moncler', name: 'MONCLER' },
  { id: 'stone-island', name: 'STONE ISLAND' },
  { id: 'off-white', name: 'OFF-WHITE' },
  { id: 'vetements', name: 'VETEMENTS' },
  { id: 'maison-margiela', name: 'MAISON MARGIELA' },
  { id: 'rick-owens', name: 'RICK OWENS' },
  { id: 'jil-sander', name: 'JIL SANDER' },
  { id: 'acne-studios', name: 'ACNE STUDIOS' },
  { id: 'loewe', name: 'LOEWE' },
  { id: 'bottega-veneta', name: 'BOTTEGA VENETA' },
  { id: 'celine', name: 'CELINE' },
  { id: 'fendi', name: 'FENDI' },
  { id: 'givenchy', name: 'GIVENCHY' },
  { id: 'nike', name: 'NIKE' },
  { id: 'adidas', name: 'ADIDAS' },
  { id: 'yeezy', name: 'YEEZY' },
  { id: 'new-balance', name: 'NEW BALANCE' },
  { id: 'asics', name: 'ASICS' },
  { id: 'salomon', name: 'SALOMON' },
  { id: 'arcteryx', name: 'ARC\'TERYX' },
  { id: 'patagonia', name: 'PATAGONIA' },
  { id: 'tnf', name: 'THE NORTH FACE' },
  { id: 'carhartt', name: 'CARHARTT WIP' },
  { id: 'stussy', name: 'STUSSY' },
  { id: 'supreme', name: 'SUPREME' },
  { id: 'palace', name: 'PALACE' },
  { id: 'raf-simons', name: 'RAF SIMONS' },
  { id: 'cdg', name: 'COMME DES GARÇONS' },
  { id: 'issey-miyake', name: 'ISSEY MIYAKE' },
  { id: 'yohji-yamamoto', name: 'YOHJI YAMAMOTO' },
  { id: 'undercover', name: 'UNDERCOVER' },
  { id: 'neighborhood', name: 'NEIGHBORHOOD' },
  { id: 'wtaps', name: 'WTAPS' },
  { id: 'visvim', name: 'VISVIM' },
  { id: 'kapital', name: 'KAPITAL' },
  { id: 'beams', name: 'BEAMS' },
  { id: 'united-arrows', name: 'UNITED ARROWS' },
  { id: 'nanamica', name: 'NANAMICA' },
  { id: 'white-mountaineering', name: 'WHITE MOUNTAINEERING' },
  { id: 'snow-peak', name: 'SNOW PEAK' },
  { id: 'porter', name: 'PORTER' },
  { id: 'evisu', name: 'EVISU' },
  { id: 'sophnet', name: 'SOPHNET' },
  { id: 'nonnative', name: 'NONNATIVE' },
  { id: 'sacai', name: 'SACAI' },
  { id: 'junya-watanabe', name: 'JUNYA WATANABE' },
  { id: 'number-nine', name: 'NUMBER (N)INE' },
  { id: 'mastermind', name: 'MASTERMIND JAPAN' },
  { id: 'fragment', name: 'FRAGMENT DESIGN' },
  { id: 'bape', name: 'BAPE' },
  { id: 'hysteric-glamour', name: 'HYSTERIC GLAMOUR' },
  { id: 'takahiromiyashita', name: 'TAKAHIROMIYASHITA THESOLOIST' },
];

const SEASONS = [
  { id: 'any', name: 'ЛЮБОЙ', icon: 'fa-infinity' },
  { id: 'winter', name: 'ЗИМА', icon: 'fa-snowflake' },
  { id: 'summer', name: 'ЛЕТО', icon: 'fa-sun' },
  { id: 'demi', name: 'ДЕМИСЕЗОН', icon: 'fa-leaf' },
];

const CONDITIONS = [
  { id: 'all', name: 'ЛЮБОЕ', color: COLORS.inkFaint },
  { id: 'new_with_tag', name: 'НОВОЕ С БИРКОЙ', color: '#4ade80' },
  { id: 'excellent', name: 'ОТЛИЧНОЕ', color: '#a3e635' },
  { id: 'good', name: 'ХОРОШЕЕ', color: '#facc15' },
  { id: 'satisfactory', name: 'УДОВЛЕТВОРИТЕЛЬНОЕ', color: '#fb923c' },
];

const COLORS_LIST = [
  { id: 'black', name: 'ЧЁРНЫЙ', hex: '#1a1a1a', textColor: '#fff' },
  { id: 'white', name: 'БЕЛЫЙ', hex: '#e8e4dd', textColor: '#000' },
  { id: 'gray', name: 'СЕРЫЙ', hex: '#808080', textColor: '#fff' },
  { id: 'beige', name: 'БЕЖЕВЫЙ', hex: '#d4c4b0', textColor: '#000' },
  { id: 'brown', name: 'КОРИЧНЕВЫЙ', hex: '#8b6f5a', textColor: '#fff' },
  { id: 'blue', name: 'СИНИЙ', hex: '#4a6a8a', textColor: '#fff' },
  { id: 'green', name: 'ЗЕЛЁНЫЙ', hex: '#6a8a6a', textColor: '#fff' },
  { id: 'red', name: 'КРАСНЫЙ', hex: '#8a4a4a', textColor: '#fff' },
  { id: 'yellow', name: 'ЖЁЛТЫЙ', hex: '#c4b04a', textColor: '#000' },
  { id: 'purple', name: 'ФИОЛЕТОВЫЙ', hex: '#7a5a8a', textColor: '#fff' },
  { id: 'orange', name: 'ОРАНЖЕВЫЙ', hex: '#c47a4a', textColor: '#fff' },
  { id: 'pink', name: 'РОЗОВЫЙ', hex: '#c47a8a', textColor: '#fff' },
  { id: 'navy', name: 'ТЁМНО-СИНИЙ', hex: '#2a3a5a', textColor: '#fff' },
  { id: 'olive', name: 'ОЛИВКОВЫЙ', hex: '#6a7a4a', textColor: '#fff' },
  { id: 'burgundy', name: 'БОРДОВЫЙ', hex: '#6a2a3a', textColor: '#fff' },
  { id: 'khaki', name: 'ХАКИ', hex: '#8a8a6a', textColor: '#fff' },
  { id: 'cream', name: 'КРЕМОВЫЙ', hex: '#f0e8d5', textColor: '#000' },
  { id: 'lightblue', name: 'ГОЛУБОЙ', hex: '#8ab4c4', textColor: '#000' },
  { id: 'lightgreen', name: 'САЛАТОВЫЙ', hex: '#8ac48a', textColor: '#000' },
  { id: 'lavender', name: 'ЛАВАНДОВЫЙ', hex: '#b4a0c4', textColor: '#000' },
];

const SIZES_CLOTHES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const SIZES_PANTS = ['28', '29', '30', '31', '32', '33', '34', '36', '38'];
const SIZES_OUTERWEAR = ['44', '46', '48', '50', '52', '54', '56'];
const SIZES_SHOES = ['39', '40', '41', '42', '43', '44', '45', '46'];
const SIZES_ACCESSORIES = ['ONE SIZE', 'S/M', 'L/XL'];
const SIZES_BELTS = ['80', '85', '90', '95', '100', '105', '110', '115', '120'];
const SIZES_SOCKS = ['36-38', '39-41', '42-44', '45-47'];

const QUICK_FILTERS = [
  { id: 'instock', label: 'В НАЛИЧИИ', icon: 'fa-check-circle' },
  { id: 'preorder', label: 'ПОД ЗАКАЗ', icon: 'fa-clock' },
  { id: 'exclusive', label: 'ЭКСКЛЮЗИВ', icon: 'fa-crown' },
  { id: 'sale', label: 'СКИДКИ', icon: 'fa-tags' },
  { id: 'new', label: 'НОВИНКИ', icon: 'fa-star' },
];

const ITEMS_PER_PAGE = 12;

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
    } catch { return []; }
  }
  return [];
};

const formatMoney = (n: number) => n.toLocaleString('ru-RU') + ' ₽';

const useCountdown = (endsAt: number) => {
  const [left, setLeft] = useState(endsAt - Date.now());
  useEffect(() => {
    const t = setInterval(() => setLeft(endsAt - Date.now()), 1000);
    return () => clearInterval(t);
  }, [endsAt]);
  const finished = left <= 0;
  const abs = Math.max(left, 0);
  const d = Math.floor(abs / 86_400_000);
  const h = Math.floor((abs % 86_400_000) / 3_600_000);
  const m = Math.floor((abs % 3_600_000) / 60_000);
  const s = Math.floor((abs % 60_000) / 1000);
  const urgent = abs > 0 && abs < 1000 * 60 * 15;
  const label = d > 0
    ? `${d}Д ${h}Ч`
    : h > 0
      ? `${h}Ч ${String(m).padStart(2, '0')}М`
      : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return { label, finished, urgent };
};

// ============================================
// МОК-АУКЦИОНЫ
// ============================================
const seedAuctions = (): AuctionItem[] => {
  const now = Date.now();
  return [
    {
      id: 9001, name: 'Raf Simons Archive Bomber SS02 "Riot Riot Riot"',
      image: 'https://placehold.co/800x1000/111113/e8e4dd?text=LOT+9001', lot: '9001',
      startPrice: 45000, currentBid: 68000, minStep: 2000,
      endsAt: now + 1000 * 60 * 60 * 6 + 1000 * 60 * 23,
      condition: 'ОТЛИЧНОЕ', brand: 'RAF SIMONS', origin: 'АНТВЕРПЕН, BE',
      description: 'Легендарный бомбер из культовой коллекции SS02. Состояние музейное, все бирки на месте.',
      bids: [
        { id: 'b1', user: 'archivist_00', amount: 68000, time: now - 1000 * 60 * 4 },
        { id: 'b2', user: 'm.a_fan', amount: 66000, time: now - 1000 * 60 * 40 },
        { id: 'b3', user: 'tokyo_relic', amount: 60000, time: now - 1000 * 60 * 120 },
      ],
    },
    {
      id: 9002, name: 'Vetements Reworked DHL Tee FW16',
      image: 'https://placehold.co/800x1000/111113/e8e4dd?text=LOT+9002', lot: '9002',
      startPrice: 12000, currentBid: 15500, minStep: 500,
      endsAt: now + 1000 * 60 * 42,
      condition: 'НОВОЕ С БИРКОЙ', brand: 'VETEMENTS', origin: 'ПАРИЖ, FR',
      description: 'Оригинальный DHL-тишот FW16, размер M, носился пару раз.',
      bids: [
        { id: 'b1', user: 'hype_lot', amount: 15500, time: now - 1000 * 60 * 2 },
        { id: 'b2', user: 'ssense_hunter', amount: 14500, time: now - 1000 * 60 * 15 },
      ],
    },
    {
      id: 9003, name: 'Undercover "Scab" Denim Jacket AW03',
      image: 'https://placehold.co/800x1000/111113/e8e4dd?text=LOT+9003', lot: '9003',
      startPrice: 80000, currentBid: 80000, minStep: 3000,
      endsAt: now + 1000 * 60 * 60 * 22,
      condition: 'ХОРОШЕЕ', brand: 'UNDERCOVER', origin: 'ТОКИО, JP',
      description: 'Джинсовка из коллекции AW03, лёгкие следы носки, оригинальный крой.',
      bids: [],
    },
    {
      id: 9004, name: 'Number (N)ine Archive Knit AW04 "Give Peace a Chance"',
      image: 'https://placehold.co/800x1000/111113/e8e4dd?text=LOT+9004', lot: '9004',
      startPrice: 55000, currentBid: 61000, minStep: 1500,
      endsAt: now + 1000 * 60 * 60 * 34,
      condition: 'ОТЛИЧНОЕ', brand: 'NUMBER (N)INE', origin: 'ОСАКА, JP',
      description: 'Архивный свитер, состояние близко к идеальному.',
      bids: [
        { id: 'b1', user: 'archive_hunter', amount: 61000, time: now - 1000 * 60 * 8 },
        { id: 'b2', user: 'k_tokyo', amount: 59500, time: now - 1000 * 60 * 60 },
      ],
    },
    {
      id: 9005, name: 'Comme des Garçons Homme Plus Wool Blazer AD2003',
      image: 'https://placehold.co/800x1000/111113/e8e4dd?text=LOT+9005', lot: '9005',
      startPrice: 38000, currentBid: 42500, minStep: 1500,
      endsAt: now + 1000 * 60 * 60 * 14,
      condition: 'ОТЛИЧНОЕ', brand: 'COMME DES GARÇONS', origin: 'ТОКИО, JP',
      description: 'Шерстяной пиджак AD2003, размер M, состояние excellent.',
      bids: [
        { id: 'b1', user: 'cdg_archive', amount: 42500, time: now - 1000 * 60 * 20 },
      ],
    },
    {
      id: 9006, name: 'Maison Margiela Replica Painted Sneakers',
      image: 'https://placehold.co/800x1000/111113/e8e4dd?text=LOT+9006', lot: '9006',
      startPrice: 24000, currentBid: 29000, minStep: 1000,
      endsAt: now + 1000 * 60 * 60 * 48,
      condition: 'ХОРОШЕЕ', brand: 'MAISON MARGIELA', origin: 'ПАРИЖ, FR',
      description: 'Расписные Replica, размер 42, лёгкие следы носки.',
      bids: [
        { id: 'b1', user: 'paris_wardrobe', amount: 29000, time: now - 1000 * 60 * 45 },
        { id: 'b2', user: 'shoes_hunter', amount: 27000, time: now - 1000 * 60 * 120 },
      ],
    },
  ];
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
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } }
  }
};

// ============================================
// LIVE ИНДИКАТОР
// ============================================
const LiveDot = () => (
  <span className="relative inline-flex items-center justify-center w-2 h-2">
    <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: COLORS.live, opacity: 0.6 }} />
    <span className="relative w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.live }} />
  </span>
);

// ============================================
// АУКЦИОН — КАРТОЧКА (сетка) — БОЛЬШАЯ КНОПКА СТАВКИ
// ============================================
const AuctionCardGrid: React.FC<{ item: AuctionItem; onClick: () => void }> = ({ item, onClick }) => {
  const { label, finished, urgent } = useCountdown(item.endsAt);
  const leader = item.bids[0];

  return (
    <motion.div
      variants={ANIMATIONS.fadeInUp}
      className="group relative w-full rounded-xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.rule}`,
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${COLORS.stamp}80`;
        e.currentTarget.style.boxShadow = `0 8px 28px ${COLORS.stamp}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.rule;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Клик по картинке/названию открывает модалку */}
      <button onClick={onClick} className="text-left w-full">
        <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ backgroundColor: COLORS.bg }}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ filter: 'grayscale(0.2) sepia(0.1) brightness(0.95)' }}
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
            style={{ background: `linear-gradient(to top, ${COLORS.bgCard} 0%, transparent 100%)` }} />

          <span className="absolute top-2.5 left-2.5 flex items-center gap-1.5 text-[8px] tracking-wider px-2 py-0.5 rounded"
            style={{ backgroundColor: 'rgba(10,10,11,0.85)', border: `1px solid ${COLORS.rule}`, color: finished ? COLORS.inkFaint : COLORS.live, fontFamily: 'JetBrains Mono, monospace' }}>
            {!finished && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.live, animation: 'auction-pulse 1.4s infinite' }} />}
            {finished ? 'ЗАВЕРШЁН' : 'LIVE'}
          </span>

          <span className="absolute top-2.5 right-2.5 px-2 py-1 rounded text-[9px] font-bold tabular-nums"
            style={{
              backgroundColor: urgent && !finished ? `${COLORS.live}dd` : 'rgba(10,10,11,0.85)',
              border: `1px solid ${urgent && !finished ? COLORS.live : COLORS.rule}`,
              color: urgent && !finished ? '#fff' : COLORS.ink,
              fontFamily: 'JetBrains Mono, monospace',
            }}>
            {finished ? '—' : label}
          </span>

          <div className="absolute bottom-2 right-2"><ArchiveStamp lot={item.lot} size={36} /></div>
        </div>

        <div className="p-3.5 md:p-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
              ЛОТ {item.lot}
            </span>
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: COLORS.inkFaint }} />
            <span className="text-[9px] tracking-wider truncate" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
              {item.brand || 'АРХИВ'}
            </span>
          </div>

          <h3 className="text-sm md:text-base font-semibold leading-snug line-clamp-2 min-h-[40px]" style={{ color: COLORS.ink }}>
            {item.name}
          </h3>

          <div className="flex items-end justify-between pt-2" style={{ borderTop: `1px dashed ${COLORS.rule}` }}>
            <div>
              <div className="text-[8px] tracking-wider mb-0.5" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                {item.bids.length > 0 ? 'ТЕКУЩАЯ' : 'СТАРТ'}
              </div>
              <div className="text-lg md:text-xl font-black tabular-nums leading-none"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  background: `linear-gradient(90deg, ${COLORS.goldLight}, ${COLORS.stamp})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                {formatMoney(item.currentBid)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[8px] tracking-wider mb-0.5" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                СТАВОК
              </div>
              <div className="text-[12px] font-bold flex items-center gap-1 justify-end"
                style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
                <i className="fas fa-gavel text-[10px]" />
                {item.bids.length}
              </div>
            </div>
          </div>

          {leader && !finished && (
            <div className="text-[10px] flex items-center gap-1 truncate pt-1"
              style={{ color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace' }}>
              <i className="fas fa-crown text-[9px]" style={{ color: COLORS.gold }} />
              Лидер: {leader.user}
            </div>
          )}
        </div>
      </button>

      {/* БОЛЬШАЯ КНОПКА СТАВКИ — ОТДЕЛЬНО, С ОТСТУПАМИ */}
      <div className="px-3.5 md:px-4 pb-4 md:pb-5 pt-1">
        <button
          onClick={onClick}
          className="w-full py-3 md:py-3.5 rounded-lg flex items-center justify-center gap-2 transition hover:brightness-110 active:scale-[0.98]"
          style={{
            background: finished
              ? `${COLORS.stamp}18`
              : `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.stampDark})`,
            border: finished ? `1px solid ${COLORS.stamp}40` : 'none',
            color: finished ? COLORS.stamp : '#241a0c',
            fontFamily: 'JetBrains Mono, monospace',
            boxShadow: finished ? 'none' : `0 2px 10px ${COLORS.stamp}40`,
          }}
        >
          <i className={`fas ${finished ? 'fa-eye' : 'fa-gavel'} text-[12px]`} />
          <span className="text-[11px] md:text-xs font-black tracking-wider">
            {finished ? 'СМОТРЕТЬ РЕЗУЛЬТАТ' : 'СДЕЛАТЬ СТАВКУ'}
          </span>
        </button>
      </div>
    </motion.div>
  );
};

// ============================================
// АУКЦИОН — СПИСОК — БОЛЬШАЯ КНОПКА СТАВКИ
// ============================================
const AuctionCardList: React.FC<{ item: AuctionItem; onClick: () => void }> = ({ item, onClick }) => {
  const { label, finished, urgent } = useCountdown(item.endsAt);
  const leader = item.bids[0];

  return (
    <motion.div
      variants={ANIMATIONS.fadeInUp}
      className="group relative w-full rounded-xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: COLORS.bgCard,
        border: `1px solid ${COLORS.rule}`,
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${COLORS.stamp}80`;
        e.currentTarget.style.boxShadow = `0 6px 24px ${COLORS.stamp}18`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.rule;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <button onClick={onClick} className="text-left w-full flex flex-row">
        <div
          className="relative flex-shrink-0 w-28 sm:w-36 md:w-44 lg:w-52"
          style={{ backgroundColor: COLORS.bg, minHeight: 120 }}
        >
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ filter: 'grayscale(0.2) sepia(0.1) brightness(0.95)' }}
            loading="lazy"
          />
          <span className="absolute top-2 left-2 flex items-center gap-1.5 text-[8px] tracking-wider px-2 py-0.5 rounded"
            style={{ backgroundColor: 'rgba(10,10,11,0.85)', border: `1px solid ${COLORS.rule}`, color: finished ? COLORS.inkFaint : COLORS.live, fontFamily: 'JetBrains Mono, monospace' }}>
            {!finished && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.live, animation: 'auction-pulse 1.4s infinite' }} />}
            {finished ? 'ЗАВЕРШЁН' : 'LIVE'}
          </span>
          <div className="absolute bottom-2 right-2 hidden sm:block"><ArchiveStamp lot={item.lot} size={32} /></div>
        </div>

        <div className="flex-1 min-w-0 p-3 sm:p-4 md:p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[9px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  ЛОТ {item.lot}
                </span>
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: COLORS.inkFaint }} />
                <span className="text-[9px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  {item.brand || 'АРХИВ'}
                </span>
                <span className="hidden sm:inline w-1 h-1 rounded-full" style={{ backgroundColor: COLORS.inkFaint }} />
                <span className="hidden sm:inline text-[9px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  {item.condition}
                </span>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold leading-snug line-clamp-2" style={{ color: COLORS.ink }}>
                {item.name}
              </h3>
            </div>

            <div className="flex-shrink-0 px-2.5 py-1.5 rounded text-right"
              style={{
                backgroundColor: urgent && !finished ? `${COLORS.live}15` : COLORS.bgElevated,
                border: `1px solid ${urgent && !finished ? COLORS.live + '60' : COLORS.rule}`,
              }}>
              <div className="text-[7px] tracking-wider mb-0.5" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                {finished ? 'ЗАКРЫТ' : 'ОСТАЛОСЬ'}
              </div>
              <div className="text-[11px] sm:text-xs md:text-sm font-bold tabular-nums whitespace-nowrap"
                style={{ color: urgent && !finished ? COLORS.live : COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
                {finished ? '—' : label}
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 pt-3 flex-wrap"
            style={{ borderTop: `1px dashed ${COLORS.rule}` }}>
            <div className="flex items-end gap-4 sm:gap-6 flex-wrap">
              <div>
                <div className="text-[8px] tracking-wider mb-0.5" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  {item.bids.length > 0 ? 'ТЕКУЩАЯ СТАВКА' : 'СТАРТ'}
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-black tabular-nums leading-none"
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    background: `linear-gradient(90deg, ${COLORS.goldLight}, ${COLORS.stamp})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                  {formatMoney(item.currentBid)}
                </div>
              </div>

              <div className="hidden xs:block">
                <div className="text-[8px] tracking-wider mb-0.5" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  СТАВОК
                </div>
                <div className="text-sm font-bold flex items-center gap-1" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
                  <i className="fas fa-gavel text-[10px]" />
                  {item.bids.length}
                </div>
              </div>

              {leader && !finished && (
                <div className="hidden md:block min-w-0">
                  <div className="text-[8px] tracking-wider mb-0.5" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                    ЛИДЕР
                  </div>
                  <div className="text-[11px] font-bold flex items-center gap-1 truncate max-w-[140px]"
                    style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
                    <i className="fas fa-crown text-[9px]" style={{ color: COLORS.gold }} />
                    {leader.user}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </button>

      {/* БОЛЬШАЯ КНОПКА СТАВКИ — ОТДЕЛЬНО, С ОТСТУПАМИ */}
      <div className="px-3 sm:px-4 md:px-5 pb-4 md:pb-5 pt-1">
        <button
          onClick={onClick}
          className="w-full py-3 md:py-3.5 rounded-lg flex items-center justify-center gap-2 transition hover:brightness-110 active:scale-[0.98]"
          style={{
            background: finished
              ? `${COLORS.stamp}18`
              : `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.stampDark})`,
            border: finished ? `1px solid ${COLORS.stamp}40` : 'none',
            color: finished ? COLORS.stamp : '#241a0c',
            fontFamily: 'JetBrains Mono, monospace',
            boxShadow: finished ? 'none' : `0 2px 10px ${COLORS.stamp}40`,
          }}
        >
          <i className={`fas ${finished ? 'fa-eye' : 'fa-gavel'} text-[12px]`} />
          <span className="text-[11px] md:text-xs font-black tracking-wider">
            {finished ? 'СМОТРЕТЬ РЕЗУЛЬТАТ' : 'СДЕЛАТЬ СТАВКУ'}
          </span>
        </button>
      </div>
    </motion.div>
  );
};

// ============================================
// МОДАЛКА СТАВКИ — С ОТСТУПАМИ СНИЗУ
// ============================================
const BidModal: React.FC<{
  item: AuctionItem | null;
  onClose: () => void;
  onBid: (id: number, amount: number) => Promise<void> | void;
}> = ({ item, onClose, onBid }) => {
  const [customValue, setCustomValue] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [flash, setFlash] = useState(false);

  const { label, finished, urgent } = useCountdown(item?.endsAt || 0);

  useEffect(() => {
    setCustomValue('');
    setFlash(false);
  }, [item?.id]);

  if (!item) return null;

  const nextMin = item.currentBid + item.minStep;
  const quickSteps = [item.minStep, item.minStep * 2, item.minStep * 5];

  const submitBid = async (amount: number) => {
    if (finished) return;
    if (amount < nextMin) {
      toast.error(`Минимальная ставка: ${formatMoney(nextMin)}`);
      return;
    }
    setIsBidding(true);
    try {
      await onBid(item.id, amount);
      setFlash(true);
      setCustomValue('');
      setTimeout(() => setFlash(false), 700);
    } finally {
      setIsBidding(false);
    }
  };

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col max-h-[92vh]"
            style={{
              backgroundColor: COLORS.bgCard,
              border: `1px solid ${flash ? COLORS.stamp : COLORS.ruleStrong}`,
              boxShadow: flash ? `0 0 40px ${COLORS.stamp}40` : '0 20px 60px rgba(0,0,0,0.6)',
              transition: 'border-color 0.4s, box-shadow 0.4s',
            }}
          >
            <div className="flex-shrink-0 flex items-center justify-between px-4 md:px-5 py-3"
              style={{ borderBottom: `1px solid ${COLORS.rule}`, backgroundColor: COLORS.bgElevated }}>
              <div className="flex items-center gap-2">
                {!finished && <LiveDot />}
                <span className="text-[10px] tracking-wider font-bold"
                  style={{ color: finished ? COLORS.inkFaint : COLORS.live, fontFamily: 'JetBrains Mono, monospace' }}>
                  {finished ? 'АУКЦИОН ЗАВЕРШЁН' : 'LIVE ТОРГ'}
                </span>
                <span className="text-[10px] tracking-wider hidden sm:inline" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  · ЛОТ {item.lot}
                </span>
              </div>
              <button onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full transition"
                style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.inkSoft }}>
                <i className="fas fa-times text-xs" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="flex flex-col sm:flex-row gap-0">
                <div className="relative w-full sm:w-2/5 aspect-[4/5] sm:aspect-auto sm:min-h-[280px] flex-shrink-0"
                  style={{ backgroundColor: COLORS.bg }}>
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                    style={{ filter: 'grayscale(0.2) sepia(0.1) brightness(0.95)' }} />
                  <div className="absolute bottom-3 right-3"><ArchiveStamp lot={item.lot} size={44} /></div>
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 text-[9px] tracking-wider px-2 py-1 rounded"
                    style={{ backgroundColor: 'rgba(10,10,11,0.85)', border: `1px solid ${COLORS.rule}`, color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace' }}>
                    {item.condition}
                  </span>
                </div>

                <div className="flex-1 p-4 md:p-5 space-y-4">
                  <div>
                    <div className="text-[9px] tracking-wider mb-1.5" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                      {item.brand || 'АРХИВ'} · {item.origin || 'ИСТОЧНИК НЕ УКАЗАН'}
                    </div>
                    <h3 className="text-base md:text-lg font-bold leading-snug" style={{ color: COLORS.ink }}>
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-[11px] md:text-xs mt-2 leading-relaxed" style={{ color: COLORS.inkSoft }}>
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg p-3 md:p-4 grid grid-cols-2 gap-3"
                    style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}` }}>
                    <div>
                      <div className="text-[8px] tracking-wider mb-1" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                        {item.bids.length > 0 ? 'ТЕКУЩАЯ СТАВКА' : 'СТАРТ'}
                      </div>
                      <motion.div
                        key={item.currentBid}
                        initial={{ opacity: 0.4, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xl md:text-2xl font-black tabular-nums"
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          background: `linear-gradient(90deg, ${COLORS.goldLight}, ${COLORS.stamp})`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}>
                        {formatMoney(item.currentBid)}
                      </motion.div>
                    </div>
                    <div className="text-right">
                      <div className="text-[8px] tracking-wider mb-1" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                        {finished ? 'ЗАКРЫТ' : 'ДО КОНЦА'}
                      </div>
                      <div className="text-base md:text-lg font-bold tabular-nums"
                        style={{ color: urgent && !finished ? COLORS.live : COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
                        {finished ? '—' : label}
                      </div>
                    </div>
                  </div>

                  {item.bids.length > 0 && (
                    <div>
                      <div className="text-[9px] tracking-wider mb-2"
                        style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                        ПОСЛЕДНИЕ СТАВКИ ({item.bids.length})
                      </div>
                      <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-hide">
                        {item.bids.slice(0, 5).map((b, i) => (
                          <div key={b.id} className="flex items-center justify-between text-[10px] py-1"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                            <span style={{ color: i === 0 ? COLORS.stamp : COLORS.inkSoft }}>
                              {i === 0 && <i className="fas fa-crown text-[8px] mr-1" style={{ color: COLORS.gold }} />}
                              {b.user}
                            </span>
                            <span style={{ color: i === 0 ? COLORS.stamp : COLORS.inkFaint }}>
                              {formatMoney(b.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!finished ? (
              <div
                className="flex-shrink-0 p-3 md:p-4 space-y-2"
                style={{
                  backgroundColor: COLORS.bgElevated,
                  borderTop: `1px solid ${COLORS.rule}`,
                  paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px) + 16px)',
                }}
              >
                <div className="grid grid-cols-3 gap-1.5">
                  {quickSteps.map((step) => (
                    <button
                      key={step}
                      disabled={isBidding}
                      onClick={() => submitBid(item.currentBid + step)}
                      className="px-2 py-2.5 rounded-lg text-[10px] font-bold transition hover:brightness-110"
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        backgroundColor: `${COLORS.stamp}14`,
                        border: `1px solid ${COLORS.ruleStrong}`,
                        color: COLORS.stamp,
                      }}>
                      +{formatMoney(step)}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="number"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder={`от ${nextMin.toLocaleString('ru-RU')} ₽`}
                    className="w-full px-3 py-3 text-sm rounded-lg"
                    style={{
                      backgroundColor: COLORS.bg,
                      border: `1px solid ${COLORS.rule}`,
                      color: COLORS.ink,
                      fontFamily: 'JetBrains Mono, monospace',
                      outline: 'none',
                    }}
                  />
                  <button
                    disabled={isBidding || !customValue}
                    onClick={() => submitBid(Number(customValue))}
                    className="flex-shrink-0 w-full sm:w-auto px-5 py-3 rounded-lg text-xs font-black flex items-center justify-center gap-2 transition hover:brightness-110 tracking-wider"
                    style={{
                      background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.stampDark})`,
                      color: '#241a0c',
                      fontFamily: 'JetBrains Mono, monospace',
                      boxShadow: `0 2px 12px ${COLORS.stamp}40`,
                      opacity: isBidding || !customValue ? 0.5 : 1,
                    }}>
                    {isBidding ? (
                      <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <i className="fas fa-gavel text-xs" />
                    )}
                    СТАВКА
                  </button>
                </div>
                <div className="text-[9px] text-center tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  МИН. СЛЕДУЮЩАЯ: <b style={{ color: COLORS.stamp }}>{formatMoney(nextMin)}</b>
                </div>
              </div>
            ) : (
              <div className="flex-shrink-0 p-4 pb-6 flex items-center gap-2"
                style={{ backgroundColor: `${COLORS.success}10`, borderTop: `1px solid ${COLORS.success}30` }}>
                <i className="fas fa-flag-checkered" style={{ color: COLORS.success }} />
                <span className="text-xs" style={{ color: COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace' }}>
                  Победитель: <b style={{ color: COLORS.ink }}>{item.bids[0]?.user || '—'}</b> за {formatMoney(item.currentBid)}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// ЦЕНОВОЙ ПОЛЗУНОК
// ============================================
const PriceRangeSlider: React.FC<{ min: number; max: number; valueMin: number; valueMax: number; onChange: (min: number, max: number) => void }> = ({ min, max, valueMin, valueMax, onChange }) => {
  const range = Math.max(max - min, 1);
  const minPct = Math.min(Math.max(((valueMin - min) / range) * 100, 0), 100);
  const maxPct = Math.min(Math.max(((valueMax - min) / range) * 100, 0), 100);
  const step = range > 20000 ? 500 : 100;
  return (
    <div className="relative" style={{ height: 24 }}>
      <div className="absolute top-1/2 left-0 right-0 h-1 rounded-full -translate-y-1/2" style={{ backgroundColor: COLORS.rule }} />
      <div className="absolute top-1/2 h-1 rounded-full -translate-y-1/2" style={{ backgroundColor: COLORS.stamp, left: `${minPct}%`, right: `${100 - maxPct}%` }} />
      <input type="range" min={min} max={max} step={step} value={valueMin} onChange={(e) => onChange(Math.min(Number(e.target.value), valueMax - step), valueMax)} className="price-range-input" style={{ zIndex: minPct > 90 ? 5 : 3 }} aria-label="Минимальная цена" />
      <input type="range" min={min} max={max} step={step} value={valueMax} onChange={(e) => onChange(valueMin, Math.max(Number(e.target.value), valueMin + step))} className="price-range-input" style={{ zIndex: 4 }} aria-label="Максимальная цена" />
    </div>
  );
};

// ============================================
// СЕКЦИЯ ФИЛЬТРА
// ============================================
const FilterSection: React.FC<{ title: string; icon?: string; expanded: boolean; onToggle: () => void; children: React.ReactNode; activeCount?: number }> = ({ title, icon, expanded, onToggle, children, activeCount = 0 }) => (
  <div style={{ borderBottom: `1px solid ${COLORS.rule}` }}>
    <button onClick={onToggle} className="w-full flex items-center justify-between py-3 px-1 text-left transition" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      <span className="flex items-center gap-2">
        {icon && <i className={`fas ${icon} text-[10px]`} style={{ color: COLORS.stamp }} />}
        <span className="text-[10px] font-bold tracking-wider" style={{ color: activeCount > 0 ? COLORS.stamp : COLORS.inkSoft }}>{title}</span>
        {activeCount > 0 && <span className="px-1.5 py-0.5 rounded-full text-[8px]" style={{ backgroundColor: COLORS.stamp, color: COLORS.bg }}>{activeCount}</span>}
      </span>
      <i className={`fas fa-chevron-${expanded ? 'up' : 'down'} text-[8px]`} style={{ color: COLORS.inkFaint }} />
    </button>
    <AnimatePresence>
      {expanded && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
          <div className="pb-3 px-1">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <button onClick={onRemove} className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-[9px] transition-all hover:scale-105"
    style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: `${COLORS.stamp}18`, border: `1px solid ${COLORS.stamp}50`, color: COLORS.stamp, cursor: 'pointer' }}>
    <span className="max-w-[160px] truncate">{label}</span>
    <i className="fas fa-times text-[8px]" />
  </button>
);

// ============================================
// КАРТОЧКА ТОВАРА (каталог)
// ============================================
interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: number, e: React.MouseEvent) => void;
  onAddToCart: (product: Product) => void;
  isAdding: boolean;
}

const ProductCard = React.memo(({ product, isFavorite, onToggleFavorite, onAddToCart, isAdding }: ProductCardProps) => {
  const conditionInfo = CONDITIONS.find(c => c.id === product.condition) || CONDITIONS[2];
  return (
    <motion.div variants={ANIMATIONS.fadeInUp} className="group relative rounded-xl overflow-hidden cursor-pointer"
      style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, transition: 'border-color 0.25s, transform 0.25s' }}
      onClick={() => window.location.href = `/product/${product.id}`} whileHover={{ y: -3 }}>
      <div className="relative aspect-[4/5] overflow-hidden" style={{ backgroundColor: COLORS.bg }}>
        <img src={product.images?.[0] || product.image || 'https://placehold.co/800x1000/111113/e8e4dd?text=NO+IMAGE'}
          alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: 'grayscale(0.2) sepia(0.1) brightness(0.95)' }} loading="lazy" />
        <div className="absolute bottom-3 right-3"><ArchiveStamp lot={product.lot || String(product.id).padStart(4, '0')} size={48} /></div>
        <span className="absolute top-3 left-3 text-[9px] tracking-wider px-2 py-1 flex items-center gap-1.5"
          style={{ backgroundColor: 'rgba(10, 10, 11, 0.85)', border: `1px solid ${COLORS.rule}`, color: conditionInfo.color, fontFamily: 'JetBrains Mono, monospace' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: conditionInfo.color }} />
          {conditionInfo.name}
        </span>
        {product.is_original && (
          <span className="absolute bottom-3 left-3 text-[8px] tracking-wider px-2 py-1 flex items-center gap-1"
            style={{ backgroundColor: 'rgba(10, 10, 11, 0.85)', border: `1px solid ${COLORS.gold}40`, color: COLORS.gold, fontFamily: 'JetBrains Mono, monospace' }}>
            <i className="fas fa-certificate text-[8px]" /> ОРИГИНАЛ
          </span>
        )}
        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(product.id, e); }}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-300"
          style={{ backgroundColor: isFavorite ? `${COLORS.stamp}30` : 'rgba(10, 10, 11, 0.7)', border: `1px solid ${isFavorite ? COLORS.stamp : COLORS.rule}`, color: isFavorite ? COLORS.stamp : COLORS.inkSoft, borderRadius: '50%' }}>
          <i className={`${isFavorite ? 'fas' : 'far'} fa-heart text-xs`} />
        </button>
      </div>
      <div className="p-4" style={{ backgroundColor: COLORS.bgCard }}>
        <div className="flex justify-between items-center mb-3 pb-2" style={{ borderBottom: `1px dashed ${COLORS.rule}` }}>
          <span className="text-[9px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>ЛОТ {product.lot || String(product.id).padStart(4, '0')}</span>
          <span className="text-[9px] tracking-wider" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>{product.origin || 'АРХИВ'}</span>
        </div>
        <h3 className="text-sm leading-snug mb-3 line-clamp-2" style={{ color: COLORS.ink }}>{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>{product.price.toLocaleString()} ₽</span>
          <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} disabled={isAdding}
            className="w-9 h-9 flex items-center justify-center transition-all duration-200"
            style={{ backgroundColor: 'transparent', border: `1px solid ${COLORS.ink}`, color: COLORS.ink, borderRadius: '2px' }}>
            {isAdding ? <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <i className="fas fa-plus text-sm" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = 'ProductCard';

// ============================================
// ОСНОВНОЙ КОМПОНЕНТ
// ============================================
const CatalogPage = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const [searchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<'catalog' | 'auction'>(
    (searchParams.get('mode') as 'catalog' | 'auction') || 'catalog'
  );

  const [auctionLayout, setAuctionLayout] = useState<'grid' | 'list'>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('auctionLayout') : null;
    return saved === 'list' ? 'list' : 'grid';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('auctionLayout', auctionLayout);
  }, [auctionLayout]);

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [totalFilteredCount, setTotalFilteredCount] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  const [auctions, setAuctions] = useState<AuctionItem[]>(seedAuctions());
  const [openBidItem, setOpenBidItem] = useState<AuctionItem | null>(null);
  const userNameRef = useRef('you_' + Math.floor(Math.random() * 900 + 100));

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(50000);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedSeason, setSelectedSeason] = useState('any');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isOriginal, setIsOriginal] = useState(false);
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [mobileBrandSearch, setMobileBrandSearch] = useState('');
  const [showMobileBrands, setShowMobileBrands] = useState(false);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    quick: true, category: true, brand: false, season: false, condition: false, color: false, size: false, price: true,
  });

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const filteredBrands = useMemo(() => {
    if (!mobileBrandSearch) return BRANDS;
    return BRANDS.filter(b => b.name.toLowerCase().includes(mobileBrandSearch.toLowerCase()));
  }, [mobileBrandSearch]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (viewMode === 'auction') params.set('mode', 'auction');
    else params.delete('mode');
    const qs = params.toString();
    const newUrl = `${window.location.pathname}${qs ? '?' + qs : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [viewMode]);

  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? 0 : Number(e.target.value);
    if (val < 0) return;
    if (val > priceMax && priceMax > 0) { setPriceMin(priceMax); return; }
    setPriceMin(val);
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? 50000 : Number(e.target.value);
    if (val < 0) return;
    if (val < priceMin) { setPriceMax(priceMin); return; }
    setPriceMax(val);
  };

  const toggleQuickFilter = useCallback((filterId: string) => {
    setActiveQuickFilters(prev => prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]);
    setCurrentPage(1);
  }, []);

  const toggleColor = useCallback((colorId: string) => {
    setSelectedColors(prev => prev.includes(colorId) ? prev.filter(c => c !== colorId) : [...prev, colorId]);
    setCurrentPage(1);
  }, []);

  const toggleSize = useCallback((size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        if (response.data && Array.isArray(response.data)) setCategories(response.data);
      } catch (error) { console.error('Ошибка загрузки категорий:', error); }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const response = await productsAPI.getAll();
        let productsData: any[] = [];
        if (Array.isArray(response.data)) productsData = response.data;
        else if (response.data?.data && Array.isArray(response.data.data)) productsData = response.data.data;
        else if (response.data?.products && Array.isArray(response.data.products)) productsData = response.data.products;

        const seasons = ['winter', 'summer', 'demi'];
        const conditions = ['new_with_tag', 'excellent', 'good', 'satisfactory'];
        const colorsPool = COLORS_LIST.map(c => c.id);
        const origins = ['ОСАКА, JP', 'МИЛАН, IT', 'НЬЮ-ЙОРК, US', 'ПАРИЖ, FR', 'ЛОНДОН, UK'];

        const parsed = productsData.map((p: any, idx: number) => ({
          ...p,
          sizes: safeParseArray(p.sizes),
          colors: safeParseArray(p.colors).length > 0 ? safeParseArray(p.colors) : [colorsPool[idx % colorsPool.length]],
          images: safeParseArray(p.images),
          rating: 0,
          reviews: 0,
          stockType: p.stockType || 'instock',
          preorderDays: p.preorderDays || 10,
          is_new: p.is_new || false,
          is_sale: p.is_sale || false,
          is_exclusive: p.is_exclusive || false,
          is_original: p.is_original !== undefined ? p.is_original : true,
          old_price: p.old_price || null,
          origin: p.origin || origins[idx % origins.length],
          condition: p.condition || conditions[idx % conditions.length],
          season: p.season || seasons[idx % seasons.length],
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

  const handlePlaceBid = useCallback(async (id: number, amount: number) => {
    await new Promise((r) => setTimeout(r, 350));
    setAuctions((prev) =>
      prev.map((it) => {
        if (it.id !== id) return it;
        const bid: Bid = { id: `b_${Date.now()}`, user: userNameRef.current, amount, time: Date.now() };
        return { ...it, currentBid: amount, bids: [bid, ...it.bids] };
      })
    );
    setOpenBidItem(prev => {
      if (!prev || prev.id !== id) return prev;
      const bid: Bid = { id: `b_${Date.now()}`, user: userNameRef.current, amount, time: Date.now() };
      return { ...prev, currentBid: amount, bids: [bid, ...prev.bids] };
    });
    toast.success(`Ставка ${formatMoney(amount)} принята`, {
      style: { background: COLORS.bgCard, color: COLORS.ink, border: `1px solid ${COLORS.ruleStrong}`, borderRadius: '4px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' },
    });
  }, []);

  const matchesNonCategoryFilters = useCallback((p: Product) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(query) && !p.description?.toLowerCase().includes(query)) return false;
    }
    if (selectedBrand !== 'all' && !p.brand?.toLowerCase().includes(selectedBrand.toLowerCase())) return false;
    if (p.price < priceMin || p.price > priceMax) return false;
    if (activeQuickFilters.includes('instock') && p.stockType !== 'instock') return false;
    if (activeQuickFilters.includes('preorder') && !(p.stockType === 'preorder' || p.stockType === 'china')) return false;
    if (activeQuickFilters.includes('exclusive') && !(p.is_exclusive === true || p.is_new === true)) return false;
    if (activeQuickFilters.includes('sale') && !(p.is_sale && p.old_price && p.old_price > p.price)) return false;
    if (activeQuickFilters.includes('new') && p.is_new !== true) return false;
    if (selectedSeason !== 'any' && p.season !== selectedSeason) return false;
    if (selectedCondition !== 'all' && p.condition !== selectedCondition) return false;
    if (selectedColors.length > 0 && !p.colors?.some((c: string) => selectedColors.includes(c.toLowerCase()))) return false;
    if (selectedSizes.length > 0 && !p.sizes?.some((s: string) => selectedSizes.includes(s))) return false;
    if (isOriginal && p.is_original !== true) return false;
    return true;
  }, [searchQuery, selectedBrand, priceMin, priceMax, activeQuickFilters, selectedSeason, selectedCondition, selectedColors, selectedSizes, isOriginal]);

  const applyFilters = useCallback(() => {
    let filtered = products.filter(matchesNonCategoryFilters);
    if (selectedCategory !== 'all') {
      const selectedCat = categories.find(c => c.slug === selectedCategory);
      if (selectedCat) filtered = filtered.filter(p => p.category === selectedCat.name);
    }
    switch (sortBy) {
      case 'price-asc': filtered = [...filtered].sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered = [...filtered].sort((a, b) => b.price - a.price); break;
      case 'rating': filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: break;
    }
    setTotalFilteredCount(filtered.length);
    const totalPagesCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    setTotalPages(totalPagesCount);
    const safePage = Math.min(currentPage, totalPagesCount || 1);
    if (currentPage !== safePage && totalPagesCount > 0) { setCurrentPage(safePage); return; }
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    setFilteredProducts(filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE));
  }, [products, matchesNonCategoryFilters, selectedCategory, categories, sortBy, currentPage]);

  useEffect(() => {
    if (products.length > 0) applyFilters();
  }, [products, applyFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, priceMin, priceMax, sortBy, searchQuery, activeQuickFilters, selectedSeason, selectedCondition, selectedColors, selectedSizes, isOriginal]);

  const filterCategories = useMemo(() => {
    const baseMatches = products.filter(matchesNonCategoryFilters);
    const result: any[] = [{ id: 'all', name: 'ВСЕ ЛОТЫ', count: baseMatches.length }];
    categories.forEach(cat => {
      if (cat.is_active !== false) result.push({ id: cat.slug, name: cat.name, count: baseMatches.filter(p => p.category === cat.name).length });
    });
    return result;
  }, [categories, products, matchesNonCategoryFilters]);

  const handleAddToCart = useCallback(async (product: Product) => {
    setAddingToCart(product.id);
    try {
      await dispatch(addToCartAsync({
        productId: product.id,
        quantity: 1,
        size: product.sizes?.[0] || 'M',
        product: {
          id: product.id, name: product.name, price: product.price,
          image: product.images?.[0] || product.image || '',
          sizes: product.sizes || ['S', 'M', 'L'],
          stockType: product.stockType, preorderDays: product.preorderDays
        }
      }));
      toast.success(`Лот ${product.lot || product.id} добавлен в корзину`, {
        style: { background: COLORS.bgCard, color: COLORS.ink, border: `1px solid ${COLORS.ruleStrong}`, borderRadius: '4px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }
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

  const clearFilters = useCallback(() => {
    setSelectedCategory('all'); setSelectedBrand('all'); setPriceMin(0); setPriceMax(50000);
    setSortBy('popular'); setSearchQuery(''); setActiveQuickFilters([]);
    setSelectedSeason('any'); setSelectedCondition('all');
    setSelectedColors([]); setSelectedSizes([]); setIsOriginal(false);
    setCurrentPage(1); setShowMobileFilter(false);
  }, []);

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (priceMin > 0 || priceMax < 50000 ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    activeQuickFilters.length +
    (selectedSeason !== 'any' ? 1 : 0) +
    (selectedCondition !== 'all' ? 1 : 0) +
    selectedColors.length +
    selectedSizes.length +
    (isOriginal ? 1 : 0);

  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; onRemove: () => void }[] = [];
    if (searchQuery) chips.push({ key: 'search', label: `ПОИСК: ${searchQuery}`, onRemove: () => setSearchQuery('') });
    if (selectedCategory !== 'all') {
      const cat = filterCategories.find((c: any) => c.id === selectedCategory);
      chips.push({ key: 'category', label: cat?.name || selectedCategory, onRemove: () => setSelectedCategory('all') });
    }
    if (selectedBrand !== 'all') {
      const brand = BRANDS.find(b => b.id === selectedBrand);
      chips.push({ key: 'brand', label: brand?.name || selectedBrand, onRemove: () => setSelectedBrand('all') });
    }
    if (priceMin > 0 || priceMax < 50000) {
      chips.push({ key: 'price', label: `${priceMin.toLocaleString()} – ${priceMax.toLocaleString()} ₽`, onRemove: () => { setPriceMin(0); setPriceMax(50000); } });
    }
    activeQuickFilters.forEach((id) => {
      const qf = QUICK_FILTERS.find(f => f.id === id);
      if (qf) chips.push({ key: `quick-${id}`, label: qf.label, onRemove: () => toggleQuickFilter(id) });
    });
    if (selectedSeason !== 'any') {
      const season = SEASONS.find(s => s.id === selectedSeason);
      chips.push({ key: 'season', label: season?.name || selectedSeason, onRemove: () => setSelectedSeason('any') });
    }
    if (selectedCondition !== 'all') {
      const cond = CONDITIONS.find(c => c.id === selectedCondition);
      chips.push({ key: 'condition', label: cond?.name || selectedCondition, onRemove: () => setSelectedCondition('all') });
    }
    selectedColors.forEach((id) => {
      const color = COLORS_LIST.find(c => c.id === id);
      chips.push({ key: `color-${id}`, label: color?.name || id, onRemove: () => toggleColor(id) });
    });
    selectedSizes.forEach((size) => {
      chips.push({ key: `size-${size}`, label: size, onRemove: () => toggleSize(size) });
    });
    if (isOriginal) chips.push({ key: 'original', label: 'ОРИГИНАЛ', onRemove: () => setIsOriginal(false) });
    return chips;
  }, [searchQuery, selectedCategory, filterCategories, selectedBrand, priceMin, priceMax, activeQuickFilters, selectedSeason, selectedCondition, selectedColors, selectedSizes, isOriginal, toggleQuickFilter, toggleColor, toggleSize]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handlePageChange = (page: number) => { setCurrentPage(page); scrollToTop(); };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 md:pt-20 flex items-center justify-center" style={{ backgroundColor: COLORS.bg }}>
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${COLORS.rule}` }} />
            <div className="absolute inset-0 rounded-full" style={{ border: `1px solid ${COLORS.stamp}`, borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
          </div>
          <p className="text-[10px] tracking-[0.3em] mt-4" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>ЗАГРУЗКА АРХИВА</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white pt-16 pb-10 relative overflow-x-hidden md:pt-20">
      <div className="px-4 md:px-8 lg:px-16 relative z-10 pt-6 md:pt-6 pb-4 md:pb-6">

        {/* Хлебные крошки */}
        <div className="text-[10px] tracking-wider mb-4 md:mb-6" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.inkFaint }}>
          <Link to="/" style={{ color: COLORS.inkFaint }}>ГЛАВНАЯ</Link>
          <span className="mx-2">/</span>
          <span style={{ color: COLORS.inkSoft }}>{viewMode === 'catalog' ? 'КАТАЛОГ' : 'АУКЦИОН'}</span>
        </div>

        {/* Заголовок + переключатель */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-px" style={{ backgroundColor: COLORS.stamp }}></div>
            <span className="text-[10px] tracking-[0.3em]" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
              {viewMode === 'catalog' ? 'ПОЛНЫЙ МАНИФЕСТ' : 'ЖИВЫЕ ТОРГИ'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: 'Anton, sans-serif', color: COLORS.ink }}>
              {viewMode === 'catalog' ? 'КАТАЛОГ' : 'АУКЦИОН'}
            </h1>

            <div className="flex p-1 rounded-lg self-start md:self-auto"
              style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.ruleStrong}` }}>
              <button
                onClick={() => setViewMode('catalog')}
                className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-md text-[10px] md:text-xs font-bold tracking-wider transition-all"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  backgroundColor: viewMode === 'catalog' ? COLORS.ink : 'transparent',
                  color: viewMode === 'catalog' ? COLORS.bg : COLORS.inkSoft,
                }}>
                <i className="fas fa-th-large text-[10px]" />
                КАТАЛОГ
              </button>
              <button
                onClick={() => setViewMode('auction')}
                className="relative flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-md text-[10px] md:text-xs font-bold tracking-wider transition-all"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  backgroundColor: viewMode === 'auction' ? COLORS.live : 'transparent',
                  color: viewMode === 'auction' ? '#fff' : COLORS.inkSoft,
                  boxShadow: viewMode === 'auction' ? `0 2px 12px ${COLORS.live}50` : 'none',
                }}>
                <span className="relative flex items-center justify-center">
                  <span className="absolute w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: COLORS.live, opacity: 0.6 }} />
                  <span className="relative w-2 h-2 rounded-full" style={{ backgroundColor: viewMode === 'auction' ? '#fff' : COLORS.live }} />
                </span>
                АУКЦИОН
              </button>
            </div>
          </div>

          <p className="text-[10px] md:text-xs mt-3" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
            {viewMode === 'catalog' ? (
              <>ПОКАЗАНО <b style={{ color: COLORS.ink }}>{totalFilteredCount}</b> ИЗ <b style={{ color: COLORS.ink }}>{products.length}</b> ЛОТОВ</>
            ) : (
              <>{auctions.filter(a => a.endsAt > Date.now()).length} АКТИВНЫХ ЛОТОВ · КЛИКНИТЕ, ЧТОБЫ СДЕЛАТЬ СТАВКУ</>
            )}
          </p>
        </div>

        {/* ==================== КОНТЕНТ ==================== */}
        {viewMode === 'catalog' ? (
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">

            {/* ФИЛЬТРЫ ПК */}
            <div className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
              <div className="sticky top-24 p-5 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide"
                style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.ruleStrong}`, borderRadius: '4px' }}>
                <div className="flex items-center justify-between pb-4 mb-2" style={{ borderBottom: `1px solid ${COLORS.rule}` }}>
                  <h3 className="text-sm font-bold tracking-wider flex items-center gap-2" style={{ color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
                    <i className="fas fa-filter text-[10px]" style={{ color: COLORS.stamp }} /> ФИЛЬТРЫ
                  </h3>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-[9px] flex items-center gap-1" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>
                      <i className="fas fa-times text-[8px]"></i> СБРОСИТЬ ({activeFilterCount})
                    </button>
                  )}
                </div>

                <FilterSection title="БЫСТРЫЙ ВЫБОР" icon="fa-bolt" expanded={expandedSections.quick} onToggle={() => toggleSection('quick')} activeCount={activeQuickFilters.length}>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_FILTERS.map((filter) => (
                      <button key={filter.id} onClick={() => toggleQuickFilter(filter.id)}
                        className="filter-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-medium transition"
                        style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: activeQuickFilters.includes(filter.id) ? COLORS.ink : 'transparent', color: activeQuickFilters.includes(filter.id) ? COLORS.bg : COLORS.inkSoft, border: `1px solid ${activeQuickFilters.includes(filter.id) ? COLORS.ink : COLORS.rule}` }}>
                        <i className={`fas ${filter.icon} text-[8px]`}></i> {filter.label}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="КАТЕГОРИИ" icon="fa-folder" expanded={expandedSections.category} onToggle={() => toggleSection('category')} activeCount={selectedCategory !== 'all' ? 1 : 0}>
                  <div className="space-y-0.5 max-h-48 overflow-y-auto scrollbar-hide">
                    {filterCategories.map((cat: any) => {
                      const disabled = cat.count === 0 && selectedCategory !== cat.id;
                      return (
                        <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} disabled={disabled}
                          className="filter-pill w-full text-left px-3 py-2 rounded text-[10px] transition flex items-center justify-between"
                          style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: selectedCategory === cat.id ? COLORS.ink : 'transparent', color: selectedCategory === cat.id ? COLORS.bg : COLORS.inkSoft, border: '1px solid transparent', opacity: disabled ? 0.3 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}>
                          <span>{cat.name}</span>
                          <span className="text-[9px]" style={{ color: selectedCategory === cat.id ? COLORS.bg : COLORS.inkFaint }}>{cat.count}</span>
                        </button>
                      );
                    })}
                  </div>
                </FilterSection>

                <FilterSection title="БРЕНДЫ" icon="fa-tag" expanded={expandedSections.brand} onToggle={() => toggleSection('brand')} activeCount={selectedBrand !== 'all' ? 1 : 0}>
                  <div className="space-y-0.5 max-h-48 overflow-y-auto scrollbar-hide">
                    {BRANDS.map((brand) => (
                      <button key={brand.id} onClick={() => setSelectedBrand(brand.id)}
                        className="filter-pill w-full text-left px-3 py-2 rounded text-[10px] transition"
                        style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: selectedBrand === brand.id ? COLORS.ink : 'transparent', color: selectedBrand === brand.id ? COLORS.bg : COLORS.inkSoft }}>
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="СЕЗОН" icon="fa-calendar" expanded={expandedSections.season} onToggle={() => toggleSection('season')} activeCount={selectedSeason !== 'any' ? 1 : 0}>
                  <div className="flex flex-wrap gap-1.5">
                    {SEASONS.map((season) => (
                      <button key={season.id} onClick={() => setSelectedSeason(season.id)}
                        className="filter-pill flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] transition"
                        style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: selectedSeason === season.id ? COLORS.ink : 'transparent', color: selectedSeason === season.id ? COLORS.bg : COLORS.inkSoft, border: `1px solid ${selectedSeason === season.id ? COLORS.ink : COLORS.rule}` }}>
                        <i className={`fas ${season.icon} text-[8px]`}></i> {season.name}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="СОСТОЯНИЕ" icon="fa-clipboard-check" expanded={expandedSections.condition} onToggle={() => toggleSection('condition')} activeCount={selectedCondition !== 'all' ? 1 : 0}>
                  <div className="space-y-1">
                    {CONDITIONS.map((cond) => (
                      <button key={cond.id} onClick={() => setSelectedCondition(cond.id)}
                        className="filter-pill w-full text-left px-3 py-2 rounded text-[10px] transition flex items-center gap-2"
                        style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: selectedCondition === cond.id ? COLORS.ink : 'transparent', color: selectedCondition === cond.id ? COLORS.bg : COLORS.inkSoft }}>
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cond.color }} /> {cond.name}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="ЦВЕТ" icon="fa-palette" expanded={expandedSections.color} onToggle={() => toggleSection('color')} activeCount={selectedColors.length}>
                  <div className="flex flex-wrap gap-2">
                    {COLORS_LIST.map((color) => {
                      const isSelected = selectedColors.includes(color.id);
                      return (
                        <button key={color.id} onClick={() => toggleColor(color.id)} className="w-8 h-8 rounded-full transition-all relative"
                          style={{ backgroundColor: color.hex, border: `2px solid ${isSelected ? COLORS.stamp : COLORS.rule}`, boxShadow: isSelected ? `0 0 0 3px ${COLORS.stamp}40` : 'none', transform: isSelected ? 'scale(1.15)' : 'scale(1)' }} title={color.name} />
                      );
                    })}
                  </div>
                </FilterSection>

                <FilterSection title="РАЗМЕРЫ" icon="fa-ruler" expanded={expandedSections.size} onToggle={() => toggleSection('size')} activeCount={selectedSizes.length}>
                  {[
                    { label: 'ОДЕЖДА:', items: SIZES_CLOTHES, prefix: '' },
                    { label: 'БРЮКИ:', items: SIZES_PANTS, prefix: 'pants-' },
                    { label: 'ВЕРХНЯЯ ОДЕЖДА:', items: SIZES_OUTERWEAR, prefix: 'outer-' },
                    { label: 'ОБУВЬ:', items: SIZES_SHOES, prefix: 'shoes-' },
                    { label: 'ГОЛОВНЫЕ УБОРЫ:', items: SIZES_ACCESSORIES, prefix: 'acc-' },
                    { label: 'РЕМНИ (СМ):', items: SIZES_BELTS, prefix: 'belt-' },
                    { label: 'НОСКИ:', items: SIZES_SOCKS, prefix: 'socks-' },
                  ].map(group => (
                    <div key={group.label}>
                      <span className="text-[8px] block mb-1 mt-2 first:mt-0" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>{group.label}</span>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {group.items.map((size) => (
                          <button key={`${group.prefix}${size}`} onClick={() => toggleSize(size)}
                            className="filter-pill px-2.5 py-1.5 rounded text-[9px] transition"
                            style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: selectedSizes.includes(size) ? COLORS.ink : 'transparent', color: selectedSizes.includes(size) ? COLORS.bg : COLORS.inkSoft, border: `1px solid ${selectedSizes.includes(size) ? COLORS.ink : COLORS.rule}` }}>
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </FilterSection>

                <div style={{ borderBottom: `1px solid ${COLORS.rule}` }}>
                  <button onClick={() => setIsOriginal(!isOriginal)} className="w-full flex items-center gap-2 py-3 px-1 text-left transition" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    <span className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: isOriginal ? COLORS.stamp : COLORS.rule, backgroundColor: isOriginal ? COLORS.stamp : 'transparent' }}>
                      {isOriginal && <i className="fas fa-check text-[8px]" style={{ color: COLORS.bg }} />}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider" style={{ color: isOriginal ? COLORS.stamp : COLORS.inkSoft }}>
                      <i className="fas fa-certificate text-[10px] mr-1" style={{ color: COLORS.gold }} /> ЗНАЧОК ОРИГИНАЛ
                    </span>
                  </button>
                </div>

                <FilterSection title="ЦЕНА" icon="fa-ruble-sign" expanded={expandedSections.price} onToggle={() => toggleSection('price')} activeCount={priceMin > 0 || priceMax < 50000 ? 1 : 0}>
                  <div className="flex gap-2">
                    <input type="number" value={priceMin === 0 ? '' : priceMin} onChange={handlePriceMinChange} placeholder="от"
                      className="w-full px-3 py-2 text-sm"
                      style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}`, borderRadius: '4px', color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }} />
                    <span className="text-xs self-center" style={{ color: COLORS.inkFaint }}>—</span>
                    <input type="number" value={priceMax === 50000 ? '' : priceMax} onChange={handlePriceMaxChange} placeholder="до"
                      className="w-full px-3 py-2 text-sm"
                      style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.rule}`, borderRadius: '4px', color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }} />
                  </div>
                  <div className="mt-4 px-1">
                    <PriceRangeSlider min={0} max={50000} valueMin={priceMin} valueMax={priceMax}
                      onChange={(newMin, newMax) => { setPriceMin(newMin); setPriceMax(newMax); }} />
                  </div>
                </FilterSection>
              </div>
            </div>

            {/* ТОВАРЫ */}
            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-6 pb-3" style={{ borderBottom: `1px dashed ${COLORS.ruleStrong}` }}>
                <p className="text-[10px] md:text-sm" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                  НАЙДЕНО <span className="font-bold text-sm md:text-lg" style={{ color: COLORS.ink }}>{totalFilteredCount}</span> ЛОТОВ
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="hidden md:flex items-center gap-2">
                    <div className="flex p-0.5" style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, borderRadius: '4px' }}>
                      {[{ id: 'popular', label: 'ПОПУЛЯРНЫЕ' }, { id: 'price-asc', label: '↑ ЦЕНА' }, { id: 'price-desc', label: '↓ ЦЕНА' }, { id: 'rating', label: '★ РЕЙТИНГ' }].map((sort) => (
                        <button key={sort.id} onClick={() => setSortBy(sort.id)}
                          className="filter-pill px-3 py-1.5 rounded text-[10px] font-medium transition-all whitespace-nowrap"
                          style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: sortBy === sort.id ? COLORS.ink : 'transparent', color: sortBy === sort.id ? COLORS.bg : COLORS.inkFaint }}>{sort.label}</button>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setShowMobileFilter(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded text-[9px] font-medium"
                    style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace' }}>
                    <i className="fas fa-sliders-h text-[9px]"></i> ФИЛЬТРЫ {activeFilterCount > 0 && `(${activeFilterCount})`}
                  </button>
                </div>
              </div>

              {activeFilterChips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-6 -mt-2">
                  {activeFilterChips.map((chip) => <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />)}
                  <button onClick={clearFilters} className="text-[9px] underline underline-offset-2"
                    style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.inkFaint }}>СБРОСИТЬ ВСЁ</button>
                </div>
              )}

              <motion.div key={`${currentPage}-${sortBy}-${totalFilteredCount}`}
                variants={ANIMATIONS.staggerContainer} initial="hidden" animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} isFavorite={favoriteSet.has(product.id)}
                    onToggleFavorite={handleToggleFavorite} onAddToCart={handleAddToCart} isAdding={addingToCart === product.id} />
                ))}
              </motion.div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-20" style={{ border: `1px dashed ${COLORS.ruleStrong}`, borderRadius: '4px' }}>
                  <p className="text-2xl font-black mb-2" style={{ fontFamily: 'Anton, sans-serif', color: COLORS.ink }}>ЛОТОВ НЕТ</p>
                  <p className="text-sm" style={{ color: COLORS.inkSoft }}>По этим фильтрам ничего не нашлось.</p>
                  <button onClick={clearFilters} className="mt-4 px-4 py-2 rounded text-[10px]"
                    style={{ backgroundColor: COLORS.ink, color: COLORS.bg, fontFamily: 'JetBrains Mono, monospace' }}>СБРОСИТЬ ФИЛЬТРЫ</button>
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1 md:gap-2 mt-8 md:mt-12 flex-wrap">
                  {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    return (
                      <button key={pageNum} onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 md:w-10 md:h-10 rounded text-[10px] md:text-sm font-medium transition"
                        style={{ backgroundColor: currentPage === pageNum ? COLORS.ink : 'transparent', color: currentPage === pageNum ? COLORS.bg : COLORS.inkSoft, fontFamily: 'JetBrains Mono, monospace' }}>{pageNum}</button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ==================== АУКЦИОН ==================== */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="pb-4 md:pb-0"
          >
            <div
              className="sticky top-14 md:top-20 z-30 -mx-4 md:-mx-8 lg:-mx-16 px-4 md:px-8 lg:px-16 py-3 mb-4 md:mb-5"
              style={{
                backgroundColor: 'rgba(10, 10, 11, 0.85)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${COLORS.ruleStrong}`,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <LiveDot />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs md:text-sm font-black tracking-wider"
                        style={{ color: COLORS.ink, fontFamily: 'Anton, sans-serif' }}>
                        ЖИВЫЕ ТОРГИ
                      </span>
                      <span className="text-[9px] md:text-[10px] tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${COLORS.stamp}18`,
                          border: `1px solid ${COLORS.stamp}40`,
                          color: COLORS.stamp,
                          fontFamily: 'JetBrains Mono, monospace',
                        }}>
                        {auctions.length} ЛОТОВ
                      </span>
                    </div>
                    <div className="text-[9px] md:text-[10px] mt-0.5 truncate"
                      style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                      КЛИКНИТЕ НА ЛОТ, ЧТОБЫ СДЕЛАТЬ СТАВКУ
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="hidden md:flex p-0.5 rounded-lg"
                    style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}` }}>
                    <button
                      onClick={() => setAuctionLayout('grid')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider transition-all"
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        backgroundColor: auctionLayout === 'grid' ? COLORS.ink : 'transparent',
                        color: auctionLayout === 'grid' ? COLORS.bg : COLORS.inkFaint,
                      }}
                    >
                      <i className="fas fa-th-large text-[10px]" />
                      КАРТОЧКИ
                    </button>
                    <button
                      onClick={() => setAuctionLayout('list')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold tracking-wider transition-all"
                      style={{
                        fontFamily: 'JetBrains Mono, monospace',
                        backgroundColor: auctionLayout === 'list' ? COLORS.ink : 'transparent',
                        color: auctionLayout === 'list' ? COLORS.bg : COLORS.inkFaint,
                      }}
                    >
                      <i className="fas fa-list text-[10px]" />
                      СПИСОК
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      toast.success('Лоты обновлены', {
                        style: { background: COLORS.bgCard, color: COLORS.ink, border: `1px solid ${COLORS.ruleStrong}`, borderRadius: '4px', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' },
                      });
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full transition hover:scale-105"
                    style={{
                      backgroundColor: COLORS.bgCard,
                      border: `1px solid ${COLORS.ruleStrong}`,
                      color: COLORS.inkSoft,
                    }}
                    aria-label="Обновить"
                  >
                    <i className="fas fa-sync-alt text-[11px]" />
                  </button>
                </div>
              </div>
            </div>

            <motion.div
              key={auctionLayout}
              initial="hidden"
              animate="visible"
              variants={ANIMATIONS.staggerContainer}
              className={
                auctionLayout === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4'
                  : 'flex flex-col gap-3 md:gap-4'
              }
            >
              {auctions.map((item) =>
                auctionLayout === 'grid' ? (
                  <AuctionCardGrid key={item.id} item={item} onClick={() => setOpenBidItem(item)} />
                ) : (
                  <AuctionCardList key={item.id} item={item} onClick={() => setOpenBidItem(item)} />
                )
              )}
            </motion.div>
          </motion.div>
        )}

        {/* МОБИЛЬНЫЙ ФИЛЬТР */}
        <AnimatePresence>
          {showMobileFilter && viewMode === 'catalog' && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10, 10, 11, 0.8)' }} onClick={() => setShowMobileFilter(false)} />
              <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 rounded-t-3xl overflow-hidden"
                style={{ backgroundColor: COLORS.bg, borderTop: `1px solid ${COLORS.ruleStrong}`, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
                <div className="flex-shrink-0 p-4 flex justify-between items-center" style={{ backgroundColor: COLORS.bg, borderBottom: `1px solid ${COLORS.rule}` }}>
                  <div>
                    <h3 className="font-bold text-lg tracking-tighter" style={{ fontFamily: 'Anton, sans-serif', color: COLORS.ink }}>ФИЛЬТРЫ</h3>
                    {activeFilterCount > 0 && <p className="text-[9px]" style={{ color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>Активных: {activeFilterCount}</p>}
                  </div>
                  <button onClick={() => setShowMobileFilter(false)} className="w-9 h-9 flex items-center justify-center rounded-full text-sm"
                    style={{ backgroundColor: COLORS.bgCard, color: COLORS.inkFaint }}>✕</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 space-y-4 pb-6">
                    <div>
                      <label className="text-[9px] font-bold mb-2 block" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>↕ СОРТИРОВКА</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[{ id: 'popular', label: 'ПОПУЛЯРНЫЕ' }, { id: 'price-asc', label: '↑ ЦЕНА' }, { id: 'price-desc', label: '↓ ЦЕНА' }, { id: 'rating', label: '★ РЕЙТИНГ' }].map((sort) => (
                          <button key={sort.id} onClick={() => setSortBy(sort.id)}
                            className="filter-pill px-3 py-2 rounded text-[9px]"
                            style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: sortBy === sort.id ? COLORS.ink : COLORS.bgCard, color: sortBy === sort.id ? COLORS.bg : COLORS.inkSoft, border: `1px solid ${sortBy === sort.id ? COLORS.ink : COLORS.rule}` }}>{sort.label}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold mb-2 block" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>⚡ БЫСТРЫЙ ВЫБОР</label>
                      <div className="flex flex-wrap gap-1.5">
                        {QUICK_FILTERS.map((filter) => (
                          <button key={filter.id} onClick={() => toggleQuickFilter(filter.id)}
                            className="filter-pill flex items-center gap-1.5 px-3 py-2 rounded-full text-[9px]"
                            style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: activeQuickFilters.includes(filter.id) ? COLORS.ink : COLORS.bgCard, color: activeQuickFilters.includes(filter.id) ? COLORS.bg : COLORS.inkSoft, border: `1px solid ${activeQuickFilters.includes(filter.id) ? COLORS.ink : COLORS.rule}` }}>
                            <i className={`fas ${filter.icon} text-[8px]`}></i> {filter.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold mb-2 block" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>📁 КАТЕГОРИИ</label>
                      <div className="flex flex-wrap gap-1.5">
                        {filterCategories.map((cat: any) => {
                          const disabled = cat.count === 0 && selectedCategory !== cat.id;
                          return (
                            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} disabled={disabled}
                              className="filter-pill flex items-center gap-1.5 px-3 py-2 rounded-full text-[9px]"
                              style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: selectedCategory === cat.id ? COLORS.ink : COLORS.bgCard, color: selectedCategory === cat.id ? COLORS.bg : COLORS.inkSoft, border: `1px solid ${selectedCategory === cat.id ? COLORS.ink : COLORS.rule}`, opacity: disabled ? 0.3 : 1 }}>
                              {cat.name} <span style={{ color: selectedCategory === cat.id ? COLORS.bg : COLORS.inkFaint }}>{cat.count}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <button onClick={() => setShowMobileBrands(!showMobileBrands)} className="w-full flex items-center justify-between py-2 px-1">
                        <span className="text-[9px] font-bold" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>
                          🏷 БРЕНДЫ {selectedBrand !== 'all' && <span style={{ color: COLORS.stamp }}>• {BRANDS.find(b => b.id === selectedBrand)?.name}</span>}
                        </span>
                        <i className={`fas fa-chevron-${showMobileBrands ? 'up' : 'down'} text-[8px]`} style={{ color: COLORS.inkFaint }} />
                      </button>
                      {showMobileBrands && (
                        <div className="mt-2">
                          <input type="text" placeholder="Поиск бренда..." value={mobileBrandSearch} onChange={(e) => setMobileBrandSearch(e.target.value)}
                            className="w-full px-3 py-2.5 text-sm rounded mb-2"
                            style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }} />
                          <div className="max-h-40 overflow-y-auto scrollbar-hide">
                            {filteredBrands.map((brand) => (
                              <button key={brand.id} onClick={() => { setSelectedBrand(brand.id); setShowMobileBrands(false); setMobileBrandSearch(''); }}
                                className="filter-pill w-full text-left px-3 py-2 rounded text-[10px] transition"
                                style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: selectedBrand === brand.id ? COLORS.ink : 'transparent', color: selectedBrand === brand.id ? COLORS.bg : COLORS.inkSoft }}>
                                {brand.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[9px] font-bold mb-2 block" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>₽ ЦЕНА</label>
                      <div className="flex gap-2 mb-3">
                        <input type="number" value={priceMin === 0 ? '' : priceMin} onChange={handlePriceMinChange} placeholder="от"
                          className="w-full px-3 py-2 text-sm rounded"
                          style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }} />
                        <span className="text-xs self-center" style={{ color: COLORS.inkFaint }}>—</span>
                        <input type="number" value={priceMax === 50000 ? '' : priceMax} onChange={handlePriceMaxChange} placeholder="до"
                          className="w-full px-3 py-2 text-sm rounded"
                          style={{ backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.rule}`, color: COLORS.ink, fontFamily: 'JetBrains Mono, monospace', outline: 'none' }} />
                      </div>
                      <div className="px-1">
                        <PriceRangeSlider min={0} max={50000} valueMin={priceMin} valueMax={priceMax}
                          onChange={(newMin, newMax) => { setPriceMin(newMin); setPriceMax(newMax); }} />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold mb-2 block" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>🍂 СЕЗОН</label>
                      <div className="flex flex-wrap gap-1.5">
                        {SEASONS.map((season) => (
                          <button key={season.id} onClick={() => setSelectedSeason(season.id)}
                            className="filter-pill px-3 py-2 rounded-full text-[9px]"
                            style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: selectedSeason === season.id ? COLORS.ink : COLORS.bgCard, color: selectedSeason === season.id ? COLORS.bg : COLORS.inkSoft, border: `1px solid ${selectedSeason === season.id ? COLORS.ink : COLORS.rule}` }}>{season.name}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold mb-2 block" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>📋 СОСТОЯНИЕ</label>
                      <div className="space-y-1">
                        {CONDITIONS.map((cond) => (
                          <button key={cond.id} onClick={() => setSelectedCondition(cond.id)}
                            className="filter-pill w-full text-left px-3 py-2.5 rounded text-[10px] flex items-center gap-2"
                            style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: selectedCondition === cond.id ? COLORS.ink : COLORS.bgCard, color: selectedCondition === cond.id ? COLORS.bg : COLORS.inkSoft }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cond.color }} /> {cond.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold mb-2 block" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>🎨 ЦВЕТ</label>
                      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                        <div className="flex gap-2 pb-1" style={{ minWidth: 'max-content' }}>
                          {COLORS_LIST.map((color) => {
                            const isSelected = selectedColors.includes(color.id);
                            return (
                              <button key={color.id} onClick={() => toggleColor(color.id)} className="w-10 h-10 rounded-full flex-shrink-0 relative"
                                style={{ backgroundColor: color.hex, border: `2px solid ${isSelected ? COLORS.stamp : COLORS.rule}`, boxShadow: isSelected ? `0 0 0 3px ${COLORS.stamp}40` : 'none' }} title={color.name}>
                                {isSelected && <i className="fas fa-check text-[10px] absolute inset-0 flex items-center justify-center" style={{ color: color.textColor }} />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {[
                      { label: '👕 ОДЕЖДА', items: SIZES_CLOTHES, prefix: '' },
                      { label: '👖 БРЮКИ', items: SIZES_PANTS, prefix: 'pants-' },
                      { label: '🧥 ВЕРХНЯЯ ОДЕЖДА', items: SIZES_OUTERWEAR, prefix: 'outer-' },
                      { label: '👟 ОБУВЬ', items: SIZES_SHOES, prefix: 'shoes-' },
                      { label: '🧢 ГОЛОВНЫЕ УБОРЫ', items: SIZES_ACCESSORIES, prefix: 'acc-' },
                      { label: '👔 РЕМНИ (СМ)', items: SIZES_BELTS, prefix: 'belt-' },
                      { label: '🧦 НОСКИ', items: SIZES_SOCKS, prefix: 'socks-' },
                    ].map(group => (
                      <div key={group.label}>
                        <label className="text-[9px] font-bold mb-2 block" style={{ color: COLORS.inkFaint, fontFamily: 'JetBrains Mono, monospace' }}>{group.label}</label>
                        <div className="flex flex-wrap gap-1.5">
                          {group.items.map((size) => (
                            <button key={`${group.prefix}${size}`} onClick={() => toggleSize(size)}
                              className="filter-pill px-3 py-2 rounded text-[10px]"
                              style={{ fontFamily: 'JetBrains Mono, monospace', backgroundColor: selectedSizes.includes(size) ? COLORS.ink : COLORS.bgCard, color: selectedSizes.includes(size) ? COLORS.bg : COLORS.inkSoft, border: `1px solid ${selectedSizes.includes(size) ? COLORS.ink : COLORS.rule}` }}>{size}</button>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div>
                      <button onClick={() => setIsOriginal(!isOriginal)} className="flex items-center gap-2 w-full text-[10px]" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.inkSoft }}>
                        <span className="w-5 h-5 rounded border flex items-center justify-center"
                          style={{ borderColor: isOriginal ? COLORS.stamp : COLORS.rule, backgroundColor: isOriginal ? COLORS.stamp : 'transparent' }}>
                          {isOriginal && <i className="fas fa-check text-[9px]" style={{ color: COLORS.bg }} />}
                        </span>
                        <span style={{ color: isOriginal ? COLORS.stamp : COLORS.inkSoft }}>✅ ЗНАЧОК ОРИГИНАЛ</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 px-4 pt-3 pb-1" style={{ backgroundColor: COLORS.bg, borderTop: `1px solid ${COLORS.rule}` }}>
                  <p className="text-[10px]" style={{ fontFamily: 'JetBrains Mono, monospace', color: COLORS.inkSoft }}>
                    НАЙДЕНО: <b style={{ color: COLORS.ink }}>{totalFilteredCount}</b> ЛОТОВ
                  </p>
                </div>
                <div className="flex-shrink-0 p-4 flex gap-3" style={{ backgroundColor: COLORS.bg, borderTop: `1px solid ${COLORS.rule}`, paddingBottom: 'calc(100px + env(safe-area-inset-bottom))' }}>
                  <button onClick={clearFilters} className="flex-1 py-3.5 rounded text-sm font-bold"
                    style={{ backgroundColor: `${COLORS.stamp}20`, border: `2px solid ${COLORS.stamp}40`, color: COLORS.stamp, fontFamily: 'JetBrains Mono, monospace' }}>СБРОСИТЬ</button>
                  <button onClick={() => setShowMobileFilter(false)} className="flex-1 py-3.5 rounded text-sm font-bold"
                    style={{ backgroundColor: COLORS.ink, color: COLORS.bg, fontFamily: 'JetBrains Mono, monospace' }}>ПРИМЕНИТЬ</button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* МОДАЛКА СТАВКИ */}
        <BidModal
          item={openBidItem}
          onClose={() => setOpenBidItem(null)}
          onBid={handlePlaceBid}
        />
      </div>

      {/* Нижний отступ на мобиле под карусель/таб-бар */}
      <div
        aria-hidden="true"
        className="block md:hidden"
        style={{ height: '160px', minHeight: '160px', width: '100%', flexShrink: 0 }}
      />

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes auction-pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.55); }
          70% { box-shadow: 0 0 0 6px rgba(255, 107, 107, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
        }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="number"] { -moz-appearance: textfield; }
        .filter-pill:not(:disabled):hover { border-color: ${COLORS.ruleStrong} !important; color: ${COLORS.ink} !important; }
        .filter-pill:disabled { opacity: 0.35; cursor: not-allowed; }
        .price-range-input {
          position: absolute; top: 0; left: 0; width: 100%; height: 24px;
          margin: 0; background: transparent; appearance: none; -webkit-appearance: none; pointer-events: none;
        }
        .price-range-input::-webkit-slider-thumb {
          appearance: none; -webkit-appearance: none; pointer-events: auto;
          width: 16px; height: 16px; border-radius: 50%;
          background: ${COLORS.ink}; border: 2px solid ${COLORS.stamp}; cursor: pointer;
        }
        .price-range-input::-moz-range-thumb {
          pointer-events: auto; width: 14px; height: 14px; border-radius: 50%;
          background: ${COLORS.ink}; border: 2px solid ${COLORS.stamp}; cursor: pointer;
        }
        .price-range-input::-webkit-slider-runnable-track { background: transparent; height: 24px; }
        .price-range-input::-moz-range-track { background: transparent; height: 24px; }
      `}</style>
    </div>
  );
};

export default CatalogPage;