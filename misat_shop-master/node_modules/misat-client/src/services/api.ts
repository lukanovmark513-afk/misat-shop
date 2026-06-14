// Временное решение - используем localStorage вместо API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productsAPI = {
  getAll: async () => {
    await delay(300);
    const products = JSON.parse(localStorage.getItem('misat_products') || '[]');
    return { data: products };
  },
  getById: async (id: number) => {
    await delay(200);
    const products = JSON.parse(localStorage.getItem('misat_products') || '[]');
    const product = products.find((p: any) => p.id === id);
    return { data: product };
  },
  create: async (product: any) => {
    const products = JSON.parse(localStorage.getItem('misat_products') || '[]');
    const newProduct = { ...product, id: Date.now() };
    products.push(newProduct);
    localStorage.setItem('misat_products', JSON.stringify(products));
    return { data: newProduct };
  },
  update: async (id: number, updates: any) => {
    const products = JSON.parse(localStorage.getItem('misat_products') || '[]');
    const index = products.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      localStorage.setItem('misat_products', JSON.stringify(products));
    }
    return { data: products[index] };
  },
  delete: async (id: number) => {
    const products = JSON.parse(localStorage.getItem('misat_products') || '[]');
    const filtered = products.filter((p: any) => p.id !== id);
    localStorage.setItem('misat_products', JSON.stringify(filtered));
    return { data: { success: true } };
  }
};

export const authAPI = {
  login: async (email: string, password: string) => {
    await delay(300);
    const users = JSON.parse(localStorage.getItem('misat_users') || '[]');
    const passwords = JSON.parse(localStorage.getItem('misat_passwords') || '{}');
    const user = users.find((u: any) => u.email === email);
    if (user && passwords[email] === password) {
      localStorage.setItem('misat_current_user', JSON.stringify(user));
      return { data: user };
    }
    throw new Error('Неверный email или пароль');
  },
  register: async (userData: any) => {
    await delay(300);
    const users = JSON.parse(localStorage.getItem('misat_users') || '[]');
    const newUser = { ...userData, id: Date.now(), role: 'user', balance: 0, created_at: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('misat_users', JSON.stringify(users));
    const passwords = JSON.parse(localStorage.getItem('misat_passwords') || '{}');
    passwords[userData.email] = userData.password;
    localStorage.setItem('misat_passwords', JSON.stringify(passwords));
    return { data: newUser };
  },
  logout: async () => {
    localStorage.removeItem('misat_current_user');
    return { data: { success: true } };
  },
  getCurrentUser: async () => {
    const user = localStorage.getItem('misat_current_user');
    return { data: user ? JSON.parse(user) : null };
  }
};

export const favoritesAPI = {
  get: async () => {
    const favorites = JSON.parse(localStorage.getItem('misat_favorites') || '[]');
    return { data: favorites };
  },
  toggle: async (productId: number) => {
    await delay(200);
    let favorites = JSON.parse(localStorage.getItem('misat_favorites') || '[]');
    const exists = favorites.includes(productId);

    if (exists) {
      favorites = favorites.filter((id: number) => id !== productId);
      return { data: { isFavorite: false, productId } };
    } else {
      favorites.push(productId);
      return { data: { isFavorite: true, productId } };
    }
  },
  add: async (productId: number) => {
    const favorites = JSON.parse(localStorage.getItem('misat_favorites') || '[]');
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      localStorage.setItem('misat_favorites', JSON.stringify(favorites));
    }
    return { data: { success: true } };
  },
  remove: async (productId: number) => {
    const favorites = JSON.parse(localStorage.getItem('misat_favorites') || '[]');
    const filtered = favorites.filter((id: number) => id !== productId);
    localStorage.setItem('misat_favorites', JSON.stringify(filtered));
    return { data: { success: true } };
  }
};

// ✅ ИСПРАВЛЕННЫЙ cartAPI - работает с localStorage
export const cartAPI = {
  get: async () => {
    const cart = JSON.parse(localStorage.getItem('misat_cart') || '[]');
    return { data: cart };
  },
  add: async (productId: number, quantity: number, size: string) => {
    const cart = JSON.parse(localStorage.getItem('misat_cart') || '[]');
    const existingIndex = cart.findIndex((item: any) => item.productId === productId && item.size === size);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      // Получаем информацию о товаре
      const products = JSON.parse(localStorage.getItem('misat_products') || '[]');
      const product = products.find((p: any) => p.id === productId);

      cart.push({
        id: Date.now(),
        productId,
        quantity,
        size,
        name: product?.name || 'Товар',
        price: product?.price || 0,
        image: product?.images?.[0] || product?.image || '',
        sizes: product?.sizes || [],
        stockType: product?.stockType || 'in_stock',
        preorderDays: product?.preorderDays || null
      });
    }

    localStorage.setItem('misat_cart', JSON.stringify(cart));
    return { data: cart };
  },
  update: async (itemId: number, quantity: number) => {
    const cart = JSON.parse(localStorage.getItem('misat_cart') || '[]');
    const index = cart.findIndex((item: any) => item.id === itemId);
    if (index !== -1) {
      cart[index].quantity = quantity;
      localStorage.setItem('misat_cart', JSON.stringify(cart));
    }
    return { data: cart };
  },
  remove: async (itemId: number) => {
    const cart = JSON.parse(localStorage.getItem('misat_cart') || '[]');
    const filtered = cart.filter((item: any) => item.id !== itemId);
    localStorage.setItem('misat_cart', JSON.stringify(filtered));
    return { data: filtered };
  },
  clear: async () => {
    localStorage.setItem('misat_cart', JSON.stringify([]));
    return { data: [] };
  }
};

export const ordersAPI = {
  create: async (orderData: any) => {
    await delay(500);
    const orders = JSON.parse(localStorage.getItem('misat_orders') || '[]');
    const newOrder = {
      ...orderData,
      id: Date.now(),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem('misat_orders', JSON.stringify(orders));

    // Очищаем корзину после создания заказа
    localStorage.setItem('misat_cart', JSON.stringify([]));

    return { data: newOrder };
  },
  get: async () => {
    const orders = JSON.parse(localStorage.getItem('misat_orders') || '[]');
    return { data: orders };
  },
  getById: async (id: number) => {
    const orders = JSON.parse(localStorage.getItem('misat_orders') || '[]');
    const order = orders.find((o: any) => o.id === id);
    return { data: order };
  }
};

export const categoriesAPI = {
  getAll: async () => {
    const categories = JSON.parse(localStorage.getItem('misat_categories') || '[]');
    return { data: categories };
  },
  getById: async (id: number) => {
    const categories = JSON.parse(localStorage.getItem('misat_categories') || '[]');
    const category = categories.find((c: any) => c.id === id);
    return { data: category };
  },
  create: async (category: any) => {
    const categories = JSON.parse(localStorage.getItem('misat_categories') || '[]');
    const newCategory = { ...category, id: Date.now() };
    categories.push(newCategory);
    localStorage.setItem('misat_categories', JSON.stringify(categories));
    return { data: newCategory };
  },
  update: async (id: number, updates: any) => {
    const categories = JSON.parse(localStorage.getItem('misat_categories') || '[]');
    const index = categories.findIndex((c: any) => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updates };
      localStorage.setItem('misat_categories', JSON.stringify(categories));
    }
    return { data: categories[index] };
  },
  delete: async (id: number) => {
    const categories = JSON.parse(localStorage.getItem('misat_categories') || '[]');
    const filtered = categories.filter((c: any) => c.id !== id);
    localStorage.setItem('misat_categories', JSON.stringify(filtered));
    return { data: { success: true } };
  }
};