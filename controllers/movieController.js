const tmdbService = require('../services/tmdbService');

exports.getUpcomingMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const movies = await tmdbService.fetchMovies('upcoming', page);
    res.json(movies);
  } catch (err) {
    console.error('Error fetching upcoming movies:', err.message);
    res.status(500).json({ error: 'Failed to fetch upcoming movies' });
  }
};


exports.getPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const movies = await tmdbService.fetchMovies('popular', page);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
};

exports.getTopRatedMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const movies = await tmdbService.fetchMovies('top_rated', page);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top rated movies' });
  }
};

exports.getLatestMovie = async (req, res) => {
  try {
    const movie = await tmdbService.fetchLatestMovie();
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch latest movie' });
  }
};
