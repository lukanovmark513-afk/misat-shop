import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI, productsAPI } from '../../services/api';
import { getCurrentUser } from '../../services/storageService';

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

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const user = getCurrentUser();
  if (!user) return [];
  const response = await cartAPI.get();
  return response.data;
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
          image: 'https://placehold.co/400x400/eeeeee/cccccc?text=No+Image',
          sizes: ['S', 'M', 'L'],
          stockType: 'in_stock',
          preorderDays: null,
          prepaymentPercent: 100
        };
      }
    }

    const newItem: CartItem = {
      id: Date.now(),
      productId: fullProduct.id,
      name: fullProduct.name,
      price: fullProduct.price,
      quantity: quantity,
      size: size,
      image: fullProduct.image,
      stockType: fullProduct.stockType,
      preorderDays: fullProduct.preorderDays,
      prepaymentPercent: fullProduct.prepaymentPercent
    };

    if (user) {
      await cartAPI.add(productId, quantity, size);
      const response = await cartAPI.get();
      return response.data;
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
      return guestCart;
    }
  }
);

export const updateCartItemAsync = createAsyncThunk(
  'cart/update',
  async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
    const user = getCurrentUser();
    if (user) {
      await cartAPI.update(itemId, quantity);
      const response = await cartAPI.get();
      return response.data;
    } else {
      const guestCart = loadGuestCart();
      const index = guestCart.findIndex((item) => item.id === itemId);
      if (index !== -1) {
        guestCart[index].quantity = quantity;
        saveGuestCart(guestCart);
      }
      return guestCart;
    }
  }
);

export const removeFromCartAsync = createAsyncThunk('cart/remove', async (itemId: number) => {
  const user = getCurrentUser();
  if (user) {
    await cartAPI.remove(itemId);
    const response = await cartAPI.get();
    return response.data;
  } else {
    const guestCart = loadGuestCart();
    const filtered = guestCart.filter((item) => item.id !== itemId);
    saveGuestCart(filtered);
    return filtered;
  }
});

export const clearCartAsync = createAsyncThunk('cart/clear', async () => {
  const user = getCurrentUser();
  if (user) {
    await cartAPI.clear();
    const response = await cartAPI.get();
    return response.data;
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
  return response.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
        state.total = action.payload.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
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

export default cartSlice.reducer;