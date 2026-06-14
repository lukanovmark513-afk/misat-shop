import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/auth';

const getValidUser = () => {
  // Сначала проверяем sessionStorage, потом localStorage
  const user = sessionStorage.getItem('misat_current_user') || localStorage.getItem('misat_current_user');
  if (!user) return null;

  try {
    const parsed = JSON.parse(user);
    if (parsed && parsed.id && parsed.email && parsed.role) {
      return parsed;
    }
    sessionStorage.removeItem('misat_current_user');
    localStorage.removeItem('misat_current_user');
    return null;
  } catch {
    return null;
  }
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, rememberMe }: { email: string; password: string; rememberMe?: boolean }) => {
    const users = JSON.parse(localStorage.getItem('misat_users') || '[]');
    const passwords = JSON.parse(localStorage.getItem('misat_passwords') || '{}');

    const user = users.find((u: any) => u.email === email);
    if (user && passwords[email] === password) {
      const token = `fake-jwt-token-${Date.now()}`;

      if (rememberMe) {
        localStorage.setItem('misat_current_user', JSON.stringify(user));
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('misat_current_user', JSON.stringify(user));
        sessionStorage.setItem('token', token);
      }
      return { user, token };
    }

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response.data;
    } catch {
      throw new Error('Неверный email или пароль');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    middle_name?: string;
  }) => {
    const users = JSON.parse(localStorage.getItem('misat_users') || '[]');
    const passwords = JSON.parse(localStorage.getItem('misat_passwords') || '{}');

    if (users.some((u: any) => u.email === data.email)) {
      throw new Error('Пользователь с таким email уже существует');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(data.password)) {
      throw new Error('Пароль должен содержать минимум 8 символов, заглавную и строчную букву, цифру');
    }

    const isFirst = users.length === 0;

    const newUser = {
      id: Date.now(),
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name || '',
      phone: data.phone || '',
      name: `${data.first_name} ${data.last_name}`,
      role: isFirst ? 'admin' : 'user',
      balance: 0,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    passwords[data.email] = data.password;

    localStorage.setItem('misat_users', JSON.stringify(users));
    localStorage.setItem('misat_passwords', JSON.stringify(passwords));

    return { user: newUser, autoLogin: false };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getValidUser(),
    token: null,
    isAuthenticated: !!getValidUser(),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('misat_current_user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('misat_current_user');
    },
    updateUserBalance: (state, action) => {
      if (state.user) {
        state.user.balance = action.payload;
        const currentUser = JSON.parse(localStorage.getItem('misat_current_user') || '{}');
        currentUser.balance = action.payload;
        localStorage.setItem('misat_current_user', JSON.stringify(currentUser));
      }
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('misat_current_user', JSON.stringify(state.user));

        const users = JSON.parse(localStorage.getItem('misat_users') || '[]');
        const updatedUsers = users.map((u: any) =>
          u.id === state.user.id ? { ...u, ...action.payload } : u
        );
        localStorage.setItem('misat_users', JSON.stringify(updatedUsers));
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
      })
      .addCase(login.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        // Не авторизуем после регистрации
      })
      .addCase(register.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, updateUserBalance, updateUser } = authSlice.actions;
export default authSlice.reducer;