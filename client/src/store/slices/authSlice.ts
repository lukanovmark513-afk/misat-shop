import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/auth';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: any) => {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('misat_current_user');
    },
    updateUserBalance: (state, action) => {
      if (state.user) {
        state.user.balance = action.payload;
        // Обновляем localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.balance = action.payload;
        localStorage.setItem('user', JSON.stringify(currentUser));
        localStorage.setItem('misat_current_user', JSON.stringify(currentUser));
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
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('misat_current_user', JSON.stringify(action.payload.user));
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
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('misat_current_user', JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, updateUserBalance } = authSlice.actions;
export default authSlice.reducer;