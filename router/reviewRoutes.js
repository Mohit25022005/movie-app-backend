const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/api/reviews', protect, reviewController.addReview); // POST /api/reviews
router.get('/api/reviews/:movieId', reviewController.getReviewsByMovie); // GET /api/reviews/:movieId
router.delete('/api/reviews/:reviewId', protect, reviewController.deleteReview); // DELETE /api/reviews/:reviewId

module.exports = router;
