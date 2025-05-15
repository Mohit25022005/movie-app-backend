const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, reviewController.addReview); // POST /api/reviews
router.get('/:movieId', reviewController.getReviewsByMovie); // GET /api/reviews/:movieId
router.delete('/:reviewId', protect, reviewController.deleteReview); // DELETE /api/reviews/:reviewId

module.exports = router;
