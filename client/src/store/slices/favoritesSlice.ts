import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesAPI } from '../../services/api';
import { getCurrentUser } from '../../services/storageService';

interface FavoritesState {
  items: number[];
  loading: boolean;
}

const initialState: FavoritesState = {
  items: [],
  loading: false,
};

// Асинхронные действия
export const fetchFavorites = createAsyncThunk('favorites/fetch', async () => {
  const user = getCurrentUser();
  if (!user) return [];
  const response = await favoritesAPI.get();
  return response.data;
});

export const toggleFavoriteAsync = createAsyncThunk('favorites/toggle', async (productId: number) => {
  const response = await favoritesAPI.toggle(productId);
  return { productId, isFavorite: response.data.isFavorite };
});

// Синхронные действия (для совместимости со старым кодом)
export const toggleFavorite = (productId: number) => {
  return toggleFavoriteAsync(productId);
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(toggleFavoriteAsync.fulfilled, (state, action) => {
        if (action.payload.isFavorite) {
          state.items.push(action.payload.productId);
        } else {
          state.items = state.items.filter(id => id !== action.payload.productId);
        }
      });
  },
});

export default favoritesSlice.reducer;