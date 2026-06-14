"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const database_1 = require("../config/database");
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const db = await (0, database_1.getDb)();
        const cart = await db.all(`SELECT ci.*, p.name, p.price, p.image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`, [userId]);
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getCart = getCart;
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity, size } = req.body;
        const db = await (0, database_1.getDb)();
        const existing = await db.get('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ?', [userId, productId, size]);
        if (existing) {
            await db.run('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [quantity, existing.id]);
        }
        else {
            await db.run('INSERT INTO cart_items (user_id, product_id, quantity, size) VALUES (?, ?, ?, ?)', [userId, productId, quantity, size]);
        }
        const cart = await db.all(`SELECT ci.*, p.name, p.price, p.image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`, [userId]);
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.addToCart = addToCart;
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const { quantity } = req.body;
        const db = await (0, database_1.getDb)();
        await db.run('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, itemId, userId]);
        const cart = await db.all(`SELECT ci.*, p.name, p.price, p.image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`, [userId]);
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateCartItem = updateCartItem;
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const db = await (0, database_1.getDb)();
        await db.run('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [itemId, userId]);
        const cart = await db.all(`SELECT ci.*, p.name, p.price, p.image
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`, [userId]);
        res.json(cart);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.removeFromCart = removeFromCart;
const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const db = await (0, database_1.getDb)();
        await db.run('DELETE FROM cart_items WHERE user_id = ?', [userId]);
        res.json([]);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.clearCart = clearCart;
