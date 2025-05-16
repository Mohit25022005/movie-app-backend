const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { protect } = require('../middlewares/authMiddleware');

// Protected Routes
router.get('/api/movies/upcoming', protect, movieController.getUpcomingMovies);
router.get('/api/movies/popular', protect, movieController.getPopularMovies);
router.get('/api/movies/top_rated', protect, movieController.getTopRatedMovies);
router.get('/api/movies/latest', protect, movieController.getLatestMovie);
router.get('/api/movies/search', protect, movieController.searchMovies);
router.get('/api/movies/:id', protect, movieController.getMovieDetails);

module.exports = router;
