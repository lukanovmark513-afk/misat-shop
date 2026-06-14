import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI, productsAPI } from '../../services/api';
import { getCurrentUser } from '../../services/storageService';
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
}

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
}

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
  items: loadGuestCart(),
  total: 0,
  loading: false,
};

// Функция для обогащения корзины данными из товаров
const enrichCartItems = async (cart: any[]): Promise<CartItem[]> => {
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
      preorderDays: product?.preorderDays || item.preorderDays || null
    };
  });
};

// Синхронная версия для немедленного обновления UI
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
      preorderDays: product?.preorderDays || item.preorderDays || null
    };
  });
};

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const user = getCurrentUser();
  let cart;

  if (user) {
    const response = await cartAPI.get();
    cart = response.data;
  } else {
    cart = loadGuestCart();
  }

  return enrichCartItemsSync(cart);
});

export const addToCartAsync = createAsyncThunk(
  'cart/add',
  async ({ productId, quantity, size, product }: { productId: number; quantity: number; size: string; product?: any }) => {
    const user = getCurrentUser();
    let fullProduct;

    if (product && product.price && product.image) {
      fullProduct = product;
    } else {
      try {
        const response = await productsAPI.getById(productId);
        fullProduct = response.data;
      } catch (error) {
        fullProduct = {
          id: productId,
          name: 'Товар',
          price: 0,
          image: 'https://placehold.co/400x400/1a1a1a/666666',
          sizes: ['S', 'M', 'L'],
          stockType: 'in_stock',
          preorderDays: null
        };
      }
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
      preorderDays: fullProduct.preorderDays
    };

    let updatedCart;

    if (user) {
      await cartAPI.add(productId, quantity, size);
      const response = await cartAPI.get();
      updatedCart = response.data;
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

    toast.success(`${fullProduct.name} добавлен в корзину`);
    return enrichCartItemsSync(updatedCart);
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/update',
  async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
    const user = getCurrentUser();
    let updatedCart;

    if (user) {
      await cartAPI.update(itemId, quantity);
      const response = await cartAPI.get();
      updatedCart = response.data;
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

export const removeFromCartAsync = createAsyncThunk(
  'cart/remove',
  async (itemId: number) => {
    const user = getCurrentUser();
    let updatedCart;

    if (user) {
      await cartAPI.remove(itemId);
      const response = await cartAPI.get();
      updatedCart = response.data;
    } else {
      const guestCart = loadGuestCart();
      updatedCart = guestCart.filter((item) => item.id !== itemId);
      saveGuestCart(updatedCart);
    }

    toast.success('Товар удалён из корзины');
    return enrichCartItemsSync(updatedCart);
  }
);

export const clearCartAsync = createAsyncThunk('cart/clear', async () => {
  const user = getCurrentUser();

  if (user) {
    await cartAPI.clear();
    const response = await cartAPI.get();
    return enrichCartItemsSync(response.data);
  } else {
    saveGuestCart([]);
    return [];
  }
});

export const mergeGuestCart = createAsyncThunk('cart/merge', async () => {
  const user = getCurrentUser();
  if (!user) return [];

  const guestCart = loadGuestCart();
  if (guestCart.length === 0) return [];

  for (const item of guestCart) {
    await cartAPI.add(item.productId, item.quantity, item.size);
  }
  saveGuestCart([]);
  const response = await cartAPI.get();
  return enrichCartItemsSync(response.data);
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
      })
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      })
      .addCase(addToCartAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        console.log('🗑️ Корзина после удаления:', state.items);
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;