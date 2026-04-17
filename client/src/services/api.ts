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

export const cartAPI = { /* ... */ };
export const ordersAPI = { /* ... */ };
export const favoritesAPI = { /* ... */ };
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