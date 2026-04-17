import { Request, Response } from 'express';
import { getDb } from '../config/database';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const products = await db.all('SELECT * FROM products ORDER BY id DESC');

    const productsWithArrays = products.map((product: any) => ({
      ...product,
      sizes: product.sizes ? JSON.parse(product.sizes) : [],
      colors: product.colors ? JSON.parse(product.colors) : [],
      images: product.images ? JSON.parse(product.images) : [],
      stockType: product.stockType || 'in_stock',
      preorderDays: product.preorderDays || 30,
      prepaymentPercent: product.prepaymentPercent || (product.stockType === 'preorder' ? 100 : 70)
    }));

    res.json(productsWithArrays);
  } catch (err: any) {
    console.error('Get products error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);

    if (!product) {
      return res.status(404).json({ error: 'Товар не найден' });
    }

    product.sizes = product.sizes ? JSON.parse(product.sizes) : [];
    product.colors = product.colors ? JSON.parse(product.colors) : [];
    product.images = product.images ? JSON.parse(product.images) : [];
    product.stockType = product.stockType || 'in_stock';
    product.preorderDays = product.preorderDays || 30;
    product.prepaymentPercent = product.prepaymentPercent || (product.stockType === 'preorder' ? 100 : 70);

    res.json(product);
  } catch (err: any) {
    console.error('Get product error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      name, price, old_price, image, images, description, category,
      sizes, colors, stock, is_new, is_sale,
      stockType, preorderDays, prepaymentPercent
    } = req.body;

    const db = await getDb();

    console.log('📦 Получены данные:', { name, price, stockType, images: images?.substring(0, 100) });

    const result = await db.run(
      `INSERT INTO products (
        name, price, old_price, image, images, description, category,
        sizes, colors, stock, is_new, is_sale,
        stockType, preorderDays, prepaymentPercent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        name, price, old_price || null, image || '', images || '[]', description || '',
        category, sizes || '[]', colors || '[]', stock || 0, is_new ? 1 : 0, is_sale ? 1 : 0,
        stockType || 'in_stock', preorderDays || 30, prepaymentPercent || 100
      ]
    );

    const newProduct = await db.get('SELECT * FROM products WHERE id = ?', [result.lastID]);

    newProduct.sizes = newProduct.sizes ? JSON.parse(newProduct.sizes) : [];
    newProduct.colors = newProduct.colors ? JSON.parse(newProduct.colors) : [];
    newProduct.images = newProduct.images ? JSON.parse(newProduct.images) : [];

    res.status(201).json(newProduct);
  } catch (err: any) {
    console.error('Create product error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name, price, old_price, image, images, description, category,
      sizes, colors, stock, is_new, is_sale,
      stockType, preorderDays, prepaymentPercent
    } = req.body;

    const db = await getDb();

    console.log('✏️ Обновление товара:', { id, name, price, stockType });

    await db.run(
      `UPDATE products SET
        name = ?, price = ?, old_price = ?, image = ?, images = ?, description = ?,
        category = ?, sizes = ?, colors = ?, stock = ?, is_new = ?, is_sale = ?,
        stockType = ?, preorderDays = ?, prepaymentPercent = ?, updated_at = datetime('now')
      WHERE id = ?`,
      [
        name, price, old_price || null, image || '', images || '[]', description || '',
        category, sizes || '[]', colors || '[]', stock || 0, is_new ? 1 : 0, is_sale ? 1 : 0,
        stockType || 'in_stock', preorderDays || 30, prepaymentPercent || 100, id
      ]
    );

    const updatedProduct = await db.get('SELECT * FROM products WHERE id = ?', [id]);

    updatedProduct.sizes = updatedProduct.sizes ? JSON.parse(updatedProduct.sizes) : [];
    updatedProduct.colors = updatedProduct.colors ? JSON.parse(updatedProduct.colors) : [];
    updatedProduct.images = updatedProduct.images ? JSON.parse(updatedProduct.images) : [];

    res.json(updatedProduct);
  } catch (err: any) {
    console.error('Update product error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.run('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Товар удалён' });
  } catch (err: any) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: err.message });
  }
};