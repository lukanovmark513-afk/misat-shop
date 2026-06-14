"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const favoritesController_1 = require("../controllers/favoritesController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authMiddleware, favoritesController_1.getFavorites);
router.post('/:productId', auth_1.authMiddleware, favoritesController_1.toggleFavorite);
exports.default = router;
