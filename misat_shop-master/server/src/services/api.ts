import axios from 'axios';

// ВРЕМЕННО - жёстко прописываем IP твоего компьютера
const API_BASE_URL = 'http://192.168.0.27:5000/api';

console.log('🔧 API URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Добавляем токен
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
      console.error('   2. Правильный ли IP: http://192.168.0.27:5000');
      console.error('   3. Телефон и компьютер в одной сети Wi-Fi');
    }
    return Promise.reject(error);
  }
);

export default api;

// API сервисы
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/admin/products', data),
  update: (id: number, data: any) => api.put(`/admin/products/${id}`, data),
  delete: (id: number) => api.delete(`/admin/products/${id}`),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getActive: () => api.get('/categories/active'),
  create: (data: any) => api.post('/admin/categories', data),
  update: (id: number, data: any) => api.put(`/admin/categories/${id}`, data),
  delete: (id: number) => api.delete(`/admin/categories/${id}`),
};

export const cartAPI = {
  get: () => api.get('/cart'),
  add: (productId: number, quantity: number, size: string) => api.post('/cart', { productId, quantity, size }),
  update: (productId: number, quantity: number) => api.put('/cart', { productId, quantity }),
  remove: (productId: number) => api.delete(`/cart/${productId}`),
};

// ИСПРАВЛЕННЫЙ favoritesAPI - соответствует серверу
export const favoritesAPI = {
  get: () => api.get('/favorites'),
  add: (productId: number) => api.post('/favorites', { productId }),
  remove: (productId: number) => api.delete(`/favorites/${productId}`),
  toggle: (productId: number) => api.post(`/favorites/toggle/${productId}`), // ← ИСПРАВЛЕНО
};

export const ordersAPI = {
  create: (data: any) => api.post('/orders', data),
  get: () => api.get('/orders'),
};

export const formsAPI = {
  subscribe: (email: string) => api.post('/forms/subscribe', { email }),
  contact: (data: any) => api.post('/forms/contact', data),
};