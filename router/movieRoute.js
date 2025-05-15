const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { protect } = require('../middlewares/authMiddleware');

// Protected Routes
router.get('/upcoming', protect, movieController.getUpcomingMovies);
router.get('/popular', protect, movieController.getPopularMovies);
router.get('/top_rated', protect, movieController.getTopRatedMovies);
router.get('/latest', protect, movieController.getLatestMovie);
router.get('/search', protect, movieController.searchMovies);
router.get('/:id', protect, movieController.getMovieDetails);

module.exports = router;
