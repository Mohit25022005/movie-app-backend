const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesControllers');
const { protect } = require('../middlewares/authMiddleware');  // Your JWT auth middleware

router.post('/', protect, favoritesController.addFavorite);
router.get('/', protect, favoritesController.getFavorites);

module.exports = router;
