import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUser, getCart, saveCart, clearCartStorage } from '../../services/storageService';
import toast from 'react-hot-toast';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  stockType?: 'in_stock' | 'preorder';
  preorderDays?: number;
  prepaymentPercent?: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  initialized: boolean;
}

// ============================================
// ЗАГРУЗКА ГОСТЕВОЙ КОРЗИНЫ
// ============================================
const loadGuestCart = (): CartItem[] => {
  const saved = localStorage.getItem('guest_cart');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
};

const saveGuestCart = (cart: CartItem[]) => {
  localStorage.setItem('guest_cart', JSON.stringify(cart));
};

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  initialized: false,
};

// ============================================
// ОБОГАЩЕНИЕ КОРЗИНЫ ДАННЫМИ ИЗ ТОВАРОВ
// ============================================
const enrichCartItemsSync = (cart: any[]): CartItem[] => {
  const products = JSON.parse(localStorage.getItem('misat_products') || '[]');

  if (!cart || cart.length === 0) return [];

  return cart.map((item: any) => {
    const product = products.find((p: any) => p.id === item.productId);
    return {
      id: item.id,
      productId: item.productId,
      name: product?.name || item.name || 'Товар',
      price: product?.price || item.price || 0,
      quantity: item.quantity || 1,
      size: item.size || 'M',
      image: product?.images?.[0] || product?.image || item.image || 'https://placehold.co/400x400/1a1a1a/666666',
      stockType: product?.stockType || item.stockType || 'in_stock',
      preorderDays: product?.preorderDays || item.preorderDays || null,
      prepaymentPercent: product?.prepaymentPercent || item.prepaymentPercent || 70
    };
  });
};

// ============================================
// ЗАГРУЗКА КОРЗИНЫ (ТОЛЬКО 1 РАЗ)
// ============================================
export const fetchCart = createAsyncThunk('cart/fetch', async (_, { getState }) => {
  const state: any = getState();
  // Если корзина уже инициализирована, не загружаем заново
  if (state.cart.initialized) {
    console.log('📦 Корзина уже инициализирована, пропускаем загрузку');
    return state.cart.items;
  }

  const user = getCurrentUser();
  let cart;

  if (user) {
    cart = getCart(user.id);
  } else {
    cart = loadGuestCart();
  }

  const enriched = enrichCartItemsSync(cart);
  console.log('📦 Корзина загружена:', enriched);
  return enriched;
});

// ============================================
// ДОБАВЛЕНИЕ В КОРЗИНУ
// ============================================
export const addToCartAsync = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity, size, product }: { productId: number; quantity: number; size: string; product?: any }) => {
    const user = getCurrentUser();

    let fullProduct;

    if (product && product.price && product.image) {
      fullProduct = product;
    } else {
      const products = JSON.parse(localStorage.getItem('misat_products') || '[]');
      const found = products.find((p: any) => p.id === productId);
      fullProduct = found || {
        id: productId,
        name: 'Товар',
        price: 0,
        image: 'https://placehold.co/400x400/1a1a1a/666666',
        sizes: ['S', 'M', 'L'],
        stockType: 'in_stock',
        preorderDays: null,
        prepaymentPercent: 70
      };
    }

    const newItem = {
      id: Date.now(),
      productId: fullProduct.id,
      name: fullProduct.name,
      price: fullProduct.price,
      quantity: quantity,
      size: size,
      image: fullProduct.images?.[0] || fullProduct.image,
      stockType: fullProduct.stockType,
      preorderDays: fullProduct.preorderDays,
      prepaymentPercent: fullProduct.prepaymentPercent || 70
    };

    let updatedCart;

    if (user) {
      const cart = getCart(user.id);
      const existingIndex = cart.findIndex(
        (item: any) => item.productId === productId && item.size === size
      );
      if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        cart.push(newItem);
      }
      saveCart(cart);
      updatedCart = cart;
    } else {
      const guestCart = loadGuestCart();
      const existingIndex = guestCart.findIndex(
        (item) => item.productId === productId && item.size === size
      );
      if (existingIndex !== -1) {
        guestCart[existingIndex].quantity += quantity;
      } else {
        guestCart.push(newItem);
      }
      saveGuestCart(guestCart);
      updatedCart = guestCart;
    }

    toast.success(`${fullProduct.name} добавлен в корзину 🛒`);
    return enrichCartItemsSync(updatedCart);
  }
);

// ============================================
// ОБНОВЛЕНИЕ КОЛИЧЕСТВА
// ============================================
export const updateCartItemAsync = createAsyncThunk(
  'cart/update',
  async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
    const user = getCurrentUser();
    let updatedCart;

    if (user) {
      const cart = getCart(user.id);
      const index = cart.findIndex((item: any) => item.id === itemId);
      if (index !== -1) {
        cart[index].quantity = quantity;
        saveCart(cart);
      }
      updatedCart = cart;
    } else {
      const guestCart = loadGuestCart();
      const index = guestCart.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        guestCart[index].quantity = quantity;
        saveGuestCart(guestCart);
      }
      updatedCart = guestCart;
    }

    return enrichCartItemsSync(updatedCart);
  }
);

// ============================================
// УДАЛЕНИЕ ИЗ КОРЗИНЫ
// ============================================
export const removeFromCartAsync = createAsyncThunk(
  'cart/remove',
  async (itemId: number) => {
    const user = getCurrentUser();
    let updatedCart;

    if (user) {
      const cart = getCart(user.id);
      updatedCart = cart.filter((item: any) => item.id !== itemId);
      saveCart(updatedCart);
    } else {
      const guestCart = loadGuestCart();
      updatedCart = guestCart.filter((item) => item.id !== itemId);
      saveGuestCart(updatedCart);
    }

    toast.success('Товар удалён из корзины 🗑️');
    return enrichCartItemsSync(updatedCart);
  }
);

// ============================================
// ОЧИСТКА КОРЗИНЫ
// ============================================
export const clearCartAsync = createAsyncThunk('cart/clear', async () => {
  const user = getCurrentUser();

  if (user) {
    clearCartStorage(user.id);
  } else {
    saveGuestCart([]);
  }

  return [];
});

// ============================================
// СЛИЯНИЕ ГОСТЕВОЙ КОРЗИНЫ
// ============================================
export const mergeGuestCart = createAsyncThunk('cart/merge', async () => {
  const user = getCurrentUser();
  if (!user) return [];

  const guestCart = loadGuestCart();
  if (guestCart.length === 0) return [];

  const userCart = getCart(user.id);

  guestCart.forEach((guestItem: any) => {
    const existing = userCart.find(
      (item: any) => item.productId === guestItem.productId && item.size === guestItem.size
    );
    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      userCart.push({
        ...guestItem,
        userId: user.id,
        id: Date.now() + Math.random()
      });
    }
  });

  saveCart(userCart);
  saveGuestCart([]);
  toast.success('Гостевая корзина объединена с аккаунтом 🔄');

  return enrichCartItemsSync(userCart);
});

// ============================================
// SLICE
// ============================================
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: () => initialState,
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
    setInitialized: (state) => {
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Загрузка
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        state.initialized = true;
        console.log('📦 Корзина загружена:', state.items);
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
        state.initialized = true;
      })
      // Добавление - ОБНОВЛЯЕМ СОСТОЯНИЕ БЕЗ ПОВТОРНОЙ ЗАГРУЗКИ
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        state.initialized = true;
        console.log('📦 Корзина после добавления:', state.items);
      })
      .addCase(addToCartAsync.rejected, (state) => {
        state.loading = false;
      })
      // Обновление
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        state.initialized = true;
        console.log('📦 Корзина после обновления:', state.items);
      })
      // Удаление
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        state.initialized = true;
        console.log('🗑️ Корзина после удаления:', state.items);
      })
      // Очистка
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.initialized = true;
        console.log('🧹 Корзина очищена');
      })
      // Слияние
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        state.initialized = true;
        console.log('🔄 Корзина после слияния:', state.items);
      });
  },
});

export const { resetCart, clearCart, setInitialized } = cartSlice.actions;
export default cartSlice.reducer;