import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// ============================================
// ВСЕГДА ИСПОЛЬЗУЕМ localStorage (не sessionStorage)
// ============================================
const getValidUser = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

const getToken = () => {
  return localStorage.getItem('token');
};

// ============================================
// ВХОД
// ============================================
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, rememberMe }: { email: string; password: string; rememberMe?: boolean }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { token, user } = response.data;

      // Всегда сохраняем в localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Неверный email или пароль');
    }
  }
);

// ============================================
// РЕГИСТРАЦИЯ — СОХРАНЯЕМ ТОКЕН И ПОЛЬЗОВАТЕЛЯ
// ============================================
export const register = createAsyncThunk(
  'auth/register',
  async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, data);
      const { token, user } = response.data;

      // 🔥 СОХРАНЯЕМ ТОКЕН И ПОЛЬЗОВАТЕЛЯ ПОСЛЕ РЕГИСТРАЦИИ
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      return { user, token };
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Ошибка регистрации');
    }
  }
);

// ============================================
// ЗАГРУЗКА ПОЛЬЗОВАТЕЛЯ
// ============================================
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async () => {
    const token = getToken();
    if (!token) return null;

    const user = getValidUser();
    if (user) {
      return { user, token };
    }
    return null;
  }
);

// ============================================
// SLICE
// ============================================
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getValidUser(),
    token: getToken(),
    isAuthenticated: !!getValidUser(),
    loading: false,
    error: null as string | null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    updateUserBalance: (state, action) => {
      if (state.user) {
        state.user.balance = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: any) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: any) => {
        state.loading = false;
        // 🔥 СОХРАНЯЕМ ПОЛЬЗОВАТЕЛЯ ПОСЛЕ РЕГИСТРАЦИИ
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(register.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action: any) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, updateUser, updateUserBalance } = authSlice.actions;
export default authSlice.reducer;