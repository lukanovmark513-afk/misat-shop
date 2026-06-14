import api, { productsAPI, cartAPI, ordersAPI, favoritesAPI, authAPI } from './api';

export interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'user' | 'admin';
  balance: number;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  images: string[];
  description: string;
  category: string;
  sizes: string[];
  colors: string[];
  rating: number;
  isNew?: boolean;
  isSale?: boolean;
  stock: number;
  stockType: 'in_stock' | 'preorder';
  preorderDays?: number;
  prepaymentPercent: number;
  created_at: string;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  userId: number;
  stockType?: 'in_stock' | 'preorder';
  preorderDays?: number;
  prepaymentPercent?: number;
}

export interface Order {
  id: string;
  userId: number;
  items: CartItem[];
  total: number;
  prepaymentAmount: number;
  remainingAmount: number;
  paymentStatus: 'prepaid' | 'partial' | 'unpaid';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  address: string;
  phone: string;
  comment: string;
  created_at: string;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  photos?: string[];
  date: string;
}

export interface Favorite {
  id: number;
  userId: number;
  productId: number;
}

export interface Message {
  id: number;
  userId: number;
  userName: string;
  message: string;
  isAdmin: boolean;
  timestamp: string;
  isRead: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  products?: number;
  status?: string;
  is_active?: boolean;
}

export interface Promocode {
  id: number;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

const STORAGE_KEYS = {
  USERS: 'misat_users',
  PRODUCTS: 'misat_products',
  CART: 'misat_cart',
  ORDERS: 'misat_orders',
  REVIEWS: 'misat_reviews',
  FAVORITES: 'misat_favorites',
  CURRENT_USER: 'misat_current_user',
  PASSWORDS: 'misat_passwords',
  GIFT_CARDS: 'misat_gift_cards',
  CHAT_MESSAGES: 'misat_chat_messages',
  CATEGORIES: 'misat_categories',
  PROMOCODES: 'misat_promocodes',
};

const initLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CART)) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GIFT_CARDS)) {
    localStorage.setItem(STORAGE_KEYS.GIFT_CARDS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROMOCODES)) {
    localStorage.setItem(STORAGE_KEYS.PROMOCODES, JSON.stringify([]));
  }
};

initLocalStorage();

// ============ ПОЛЬЗОВАТЕЛИ ============
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getPasswords = (): Record<string, string> => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSWORDS) || '{}');
};

export const savePasswords = (passwords: Record<string, string>) => {
  localStorage.setItem(STORAGE_KEYS.PASSWORDS, JSON.stringify(passwords));
};

export const registerUser = (userData: Omit<User, 'id' | 'created_at' | 'role'>): User | null => {
  const users = getUsers();
  if (users.some(u => u.email === userData.email)) {
    return null;
  }

  const newUser: User = {
    id: Date.now(),
    ...userData,
    role: 'user',
    balance: 0,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const passwords = getPasswords();
  passwords[userData.email] = userData.password;
  savePasswords(passwords);

  return newUser;
};

export const loginUser = (email: string, password: string): User | null => {
  const users = getUsers();
  const passwords = getPasswords();
  const user = users.find(u => u.email === email);

  if (user && passwords[email] === password) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const changePassword = (userId: number, oldPassword: string, newPassword: string): boolean => {
  const users = getUsers();
  const passwords = getPasswords();
  const user = users.find(u => u.id === userId);
  if (!user) return false;
  passwords[user.email] = newPassword;
  savePasswords(passwords);
  return true;
};

// ============ БАЛАНС ============
export const getUserBalance = (userId: number): number => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  return user?.balance || 0;
};

export const addToBalance = (userId: number, amount: number): boolean => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1) {
    users[index].balance = (users[index].balance || 0) + amount;
    saveUsers(users);
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.balance = users[index].balance;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    }
    return true;
  }
  return false;
};

export const subtractFromBalance = (userId: number, amount: number): boolean => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index !== -1 && (users[index].balance || 0) >= amount) {
    users[index].balance = (users[index].balance || 0) - amount;
    saveUsers(users);
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.balance = users[index].balance;
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    }
    return true;
  }
  return false;
};

// ============ ТОВАРЫ ============
export const getProducts = (): Product[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getProductById = (id: number): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};

export const addProduct = (product: Omit<Product, 'id' | 'created_at'>): Product => {
  const products = getProducts();
  const newProduct: Product = {
    id: Date.now(),
    ...product,
    rating: 0,
    created_at: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (id: number, updates: Partial<Product>): Product | null => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
    return products[index];
  }
  return null;
};

export const deleteProduct = (id: number): boolean => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
  return filtered.length !== products.length;
};

// ============ КОРЗИНА ============
export const getCart = (userId: number): CartItem[] => {
  const cart = JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
  return cart.filter((item: CartItem) => item.userId === userId);
};

export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
};

export const addToCartStorage = (userId: number, product: Product, size: string, quantity: number): CartItem => {
  const cart = getCart(userId);
  const existingItem = cart.find(
    (item: CartItem) => item.productId === product.id && item.size === size
  );
  const firstImage = product.images && product.images.length > 0 ? product.images[0] : '';

  if (existingItem) {
    existingItem.quantity += quantity;
    saveCart([...cart.filter(i => i.userId === userId), existingItem]);
    return existingItem;
  }

  const newItem: CartItem = {
    id: Date.now(),
    userId,
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity,
    size,
    image: firstImage,
    stockType: product.stockType,
    preorderDays: product.preorderDays,
    prepaymentPercent: product.prepaymentPercent
  };
  cart.push(newItem);
  saveCart(cart);
  return newItem;
};

export const removeFromCartStorage = (userId: number, itemId: number) => {
  const cart = getCart(userId);
  const filtered = cart.filter((item: CartItem) => item.id !== itemId);
  saveCart(filtered);
};

export const updateCartQuantity = (userId: number, itemId: number, quantity: number) => {
  const cart = getCart(userId);
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.quantity = quantity;
    saveCart(cart);
  }
};

export const clearCartStorage = (userId: number) => {
  const cart = getCart(userId);
  const filtered = cart.filter((item: CartItem) => item.userId !== userId);
  saveCart(filtered);
};

// ============ ЗАКАЗЫ ============
export const getOrders = (): Order[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

export const createOrder = (userId: number, items: CartItem[], total: number, prepaymentAmount: number, remainingAmount: number, address: string, phone: string, comment: string): Order => {
  const orders = getOrders();

  const newOrder: Order = {
    id: `MISAT-${Date.now()}`,
    userId,
    items,
    total,
    prepaymentAmount,
    remainingAmount,
    paymentStatus: remainingAmount > 0 ? 'partial' : 'prepaid',
    status: 'pending',
    address,
    phone,
    comment,
    created_at: new Date().toISOString(),
  };

  orders.push(newOrder);
  saveOrders(orders);
  clearCartStorage(userId);

  return newOrder;
};

export const getUserOrders = (userId: number): Order[] => {
  const orders = getOrders();
  return orders.filter((order: Order) => order.userId === userId).sort((a: Order, b: Order) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export const getAllOrders = (): Order[] => {
  return getOrders();
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    saveOrders(orders);
  }
};

// ============ КАТЕГОРИИ ============
export const getCategories = (): Category[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
};

export const saveCategories = (categories: Category[]) => {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

export const addCategory = (category: Omit<Category, 'id'>): Category => {
  const categories = getCategories();
  const newCategory: Category = {
    id: Date.now(),
    ...category,
  };
  categories.push(newCategory);
  saveCategories(categories);
  return newCategory;
};

export const updateCategory = (id: number, updates: Partial<Category>): Category | null => {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], ...updates };
    saveCategories(categories);
    return categories[index];
  }
  return null;
};

export const deleteCategory = (id: number): boolean => {
  const categories = getCategories();
  const filtered = categories.filter(c => c.id !== id);
  saveCategories(filtered);
  return filtered.length !== categories.length;
};

// ============ ПРОМОКОДЫ ============
export const getPromocodes = (): Promocode[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROMOCODES) || '[]');
};

export const savePromocodes = (promocodes: Promocode[]) => {
  localStorage.setItem(STORAGE_KEYS.PROMOCODES, JSON.stringify(promocodes));
};

export const addPromocode = (promocode: Omit<Promocode, 'id' | 'usedCount'>): Promocode => {
  const promocodes = getPromocodes();
  const newPromocode: Promocode = {
    id: Date.now(),
    ...promocode,
    usedCount: 0,
  };
  promocodes.push(newPromocode);
  savePromocodes(promocodes);
  return newPromocode;
};

export const updatePromocode = (id: number, updates: Partial<Promocode>): Promocode | null => {
  const promocodes = getPromocodes();
  const index = promocodes.findIndex(p => p.id === id);
  if (index !== -1) {
    promocodes[index] = { ...promocodes[index], ...updates };
    savePromocodes(promocodes);
    return promocodes[index];
  }
  return null;
};

export const deletePromocode = (id: number): boolean => {
  const promocodes = getPromocodes();
  const filtered = promocodes.filter(p => p.id !== id);
  savePromocodes(filtered);
  return filtered.length !== promocodes.length;
};

// ============ ОТЗЫВЫ ============
export const getProductReviews = (productId: number): Review[] => {
  const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
  return reviews.filter((r: Review) => r.productId === productId);
};

export const hasUserReviewed = (userId: number, productId: number): boolean => {
  const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
  return reviews.some((r: Review) => r.userId === userId && r.productId === productId);
};

export const addReview = (userId: number, productId: number, rating: number, comment: string, photos?: string[]): Review | null => {
  if (hasUserReviewed(userId, productId)) {
    return null;
  }

  const user = getCurrentUser();
  const reviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');

  const newReview: Review = {
    id: Date.now(),
    productId,
    userId,
    userName: user?.first_name || user?.email?.split('@')[0] || 'Пользователь',
    rating,
    comment,
    photos: photos || [],
    date: new Date().toISOString(),
  };

  reviews.push(newReview);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  return newReview;
};

// ============ ИЗБРАННОЕ ============
export const getFavorites = (userId: number): number[] => {
  const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
  return favorites.filter((f: Favorite) => f.userId === userId).map((f: Favorite) => f.productId);
};

export const toggleFavorite = (userId: number, productId: number): boolean => {
  const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
  const existing = favorites.find((f: Favorite) => f.userId === userId && f.productId === productId);

  if (existing) {
    const filtered = favorites.filter((f: Favorite) => !(f.userId === userId && f.productId === productId));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
    return false;
  } else {
    favorites.push({ id: Date.now(), userId, productId });
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    return true;
  }
};

// ============ ЧАТ ============
export const getChatMessages = (): Message[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES) || '[]');
};

export const saveChatMessages = (messages: Message[]) => {
  localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
};

export const addChatMessage = (message: Omit<Message, 'id'>): Message => {
  const messages = getChatMessages();
  const newMessage: Message = {
    id: Date.now(),
    ...message,
  };
  messages.push(newMessage);
  saveChatMessages(messages);
  return newMessage;
};

export const markMessagesAsRead = (userId: number): void => {
  const messages = getChatMessages();
  const updated = messages.map(msg => {
    if (msg.userId === userId && !msg.isAdmin && !msg.isRead) {
      return { ...msg, isRead: true };
    }
    return msg;
  });
  saveChatMessages(updated);
};

export const getUserUnreadCount = (userId: number): number => {
  const messages = getChatMessages();
  return messages.filter(msg => msg.userId === userId && !msg.isAdmin && !msg.isRead).length;
};

// ============ ПОДАРОЧНЫЕ СЕРТИФИКАТЫ ============
export const getGiftCards = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.GIFT_CARDS) || '[]');
};

export const addGiftCard = (card: any) => {
  const cards = getGiftCards();
  cards.push(card);
  localStorage.setItem(STORAGE_KEYS.GIFT_CARDS, JSON.stringify(cards));
};

// ============ СТАТИСТИКА ============
export const getStats = () => {
  const products = getProducts();
  const orders = getAllOrders();
  const users = getUsers();

  return {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: users.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    lowStock: products.filter(p => p.stock < 10).length,
  };
};