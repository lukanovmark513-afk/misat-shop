"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFavorite = exports.getFavorites = void 0;
const database_1 = require("../config/database");
const getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const db = await (0, database_1.getDb)();
        const favorites = await db.all('SELECT product_id FROM favorites WHERE user_id = ?', [userId]);
        res.json(favorites.map((f) => f.product_id));
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getFavorites = getFavorites;
const toggleFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;
        const db = await (0, database_1.getDb)();
        const existing = await db.get('SELECT * FROM favorites WHERE user_id = ? AND product_id = ?', [userId, productId]);
        let isFavorite = false;
        if (existing) {
            await db.run('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [userId, productId]);
            isFavorite = false;
        }
        else {
            await db.run('INSERT INTO favorites (user_id, product_id) VALUES (?, ?)', [userId, productId]);
            isFavorite = true;
        }
        res.json({ isFavorite });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.toggleFavorite = toggleFavorite;
