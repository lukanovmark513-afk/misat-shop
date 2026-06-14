import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesAPI } from '../../services/api';
import { getCurrentUser } from '../../services/storageService';
import toast from 'react-hot-toast';

interface FavoritesState {
  items: number[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
  error: null,
};

// Загрузка избранного
export const fetchFavorites = createAsyncThunk(
  'favorites/fetch',
  async () => {
    const user = getCurrentUser();
    if (!user) return [];
    const response = await favoritesAPI.get();
    console.log('📦 Загружено избранное:', response.data);
    return response.data;
  }
);

// Переключение избранного (добавление/удаление)
export const toggleFavoriteAsync = createAsyncThunk(
  'favorites/toggle',
  async (productId: number, { rejectWithValue }) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        toast.error('Войдите в аккаунт');
        return rejectWithValue('Не авторизован');
      }

      console.log('🔄 Переключение товара:', productId);
      const response = await favoritesAPI.toggle(productId);
      console.log('✅ Ответ API:', response.data);

      return response.data;
    } catch (error: any) {
      console.error('❌ Ошибка:', error);
      toast.error('Ошибка при обновлении избранного');
      return rejectWithValue(error.message);
    }
  }
);

// Добавление в избранное
export const addToFavoritesAsync = createAsyncThunk(
  'favorites/add',
  async (productId: number, { rejectWithValue }) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        toast.error('Войдите в аккаунт');
        return rejectWithValue('Не авторизован');
      }

      await favoritesAPI.add(productId);
      toast.success('Добавлено в избранное');
      return productId;
    } catch (error: any) {
      toast.error('Ошибка добавления');
      return rejectWithValue(error.message);
    }
  }
);

// Удаление из избранного
export const removeFromFavoritesAsync = createAsyncThunk(
  'favorites/remove',
  async (productId: number, { rejectWithValue }) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        toast.error('Войдите в аккаунт');
        return rejectWithValue('Не авторизован');
      }

      console.log('🗑️ Удаление товара из избранного:', productId);
      await favoritesAPI.remove(productId);
      toast.success('Удалено из избранного');
      return productId;
    } catch (error: any) {
      console.error('❌ Ошибка удаления:', error);
      toast.error('Ошибка удаления');
      return rejectWithValue(error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
    },
    // Для немедленного удаления без API
    removeFavoriteLocally: (state, action) => {
      state.items = state.items.filter(id => id !== action.payload);
      toast.success('Удалено из избранного');
    },
  },
  extraReducers: (builder) => {
    builder
      // Загрузка
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        console.log('📦 Избранное загружено:', state.items);
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Переключение (toggle)
      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        const { productId, isFavorite } = action.payload;
        if (isFavorite) {
          if (!state.items.includes(productId)) {
            state.items.push(productId);
          }
          toast.success('Добавлено в избранное');
        } else {
          state.items = state.items.filter(id => id !== productId);
          toast.success('Удалено из избранного');
        }
        console.log('📦 Избранное после toggle:', state.items);
      })
      .addCase(toggleFavoriteAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Добавление
      .addCase(addToFavoritesAsync.fulfilled, (state, action) => {
        if (!state.items.includes(action.payload)) {
          state.items.push(action.payload);
        }
      })
      // Удаление
      .addCase(removeFromFavoritesAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(id => id !== action.payload);
        console.log('📦 Избранное после удаления:', state.items);
      });
  },
});

export const { clearFavorites, removeFavoriteLocally } = favoritesSlice.actions;
export default favoritesSlice.reducer;