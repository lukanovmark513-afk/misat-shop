import axios from 'axios';

// ============================================
// АВТОМАТИЧЕСКОЕ ОПРЕДЕЛЕНИЕ URL
// ============================================
const getApiUrl = () => {
  // Если запущено локально (компьютер)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }

  // Если запущено в сети (телефон, другой компьютер)
  // Используем тот же IP, что и фронтенд, но порт 5000
  return `http://${window.location.hostname}:5000/api`;
};

const API_BASE_URL = getApiUrl();
console.log('🔧 API URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Глобальная обработка ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.message);
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Не удаётся подключиться к серверу! Проверь:');
      console.error('   1. Запущен ли сервер (npm run dev в папке server)');
      console.error(`   2. Правильный ли IP: ${API_BASE_URL}`);
      console.error('   3. Телефон и компьютер в одной сети Wi-Fi');
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (product: any) => api.post('/products', product),
  update: (id: number, updates: any) => api.put(`/products/${id}`, updates),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: number) => api.get(`/categories/${id}`),
  create: (category: any) => api.post('/categories', category),
  update: (id: number, updates: any) => api.put(`/categories/${id}`, updates),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Brands API
export const brandsAPI = {
  getAll: () => api.get('/brands'),
  getById: (id: number) => api.get(`/brands/${id}`),
  create: (brand: any) => api.post('/brands', brand),
  update: (id: number, updates: any) => api.put(`/brands/${id}`, updates),
  delete: (id: number) => api.delete(`/brands/${id}`),
};

// Auth API
export const authAPI = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (userData: any) => api.post('/auth/register', userData),
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return Promise.resolve({ data: user ? JSON.parse(user) : null });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve({ data: { success: true } });
  },
};

// Favorites API
export const favoritesAPI = {
  get: () => api.get('/favorites'),
  toggle: (productId: number) => api.post(`/favorites/toggle/${productId}`),
  add: (productId: number) => api.post(`/favorites/${productId}`),
  remove: (productId: number) => api.delete(`/favorites/${productId}`),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId: number, quantity: number, size: string) =>
    api.post('/cart', { productId, quantity, size }),
  update: (itemId: number, quantity: number) =>
    api.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId: number) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete('/cart'),
};

// Orders API
export const ordersAPI = {
  create: (orderData: any) => api.post('/orders', orderData),
  get: () => api.get('/orders'),
  getById: (id: number) => api.get(`/orders/${id}`),
};

// CDEK API
export const cdekAPI = {
  getPvz: (city: string) =>
    api.get(`/cdek/pvz?city=${encodeURIComponent(city)}`),
  getNearestPvz: (lat: number, lng: number, radius: number = 5000) =>
    api.get(`/cdek/pvz/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  searchCity: (query: string) =>
    api.get(`/cdek/cities?query=${encodeURIComponent(query)}`),
};

export default api;