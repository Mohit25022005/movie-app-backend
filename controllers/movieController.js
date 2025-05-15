const tmdbService = require('../services/tmdbService');

const buildPagination = (req, data) => {
  const currentPage = parseInt(req.query.page) || 1;
  const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
  const buildUrl = (page) => `${baseUrl}?${new URLSearchParams({ ...req.query, page })}`;

  return {
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
    next_page: data.page < data.total_pages ? buildUrl(data.page + 1) : null,
    prev_page: data.page > 1 ? buildUrl(data.page - 1) : null,
  };
};

exports.getUpcomingMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbService.fetchMovies('upcoming', page);
    const pagination = buildPagination(req, data);
    res.json({ pagination, results: data.results });
  } catch (err) {
    console.error('Error fetching upcoming movies:', err.message);
    res.status(500).json({ error: 'Failed to fetch upcoming movies' });
  }
};

exports.getPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbService.fetchMovies('popular', page);
    const pagination = buildPagination(req, data);
    res.json({ pagination, results: data.results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
};

exports.getTopRatedMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const data = await tmdbService.fetchMovies('top_rated', page);
    const pagination = buildPagination(req, data);
    res.json({ pagination, results: data.results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch top rated movies' });
  }
};

exports.getLatestMovie = async (req, res) => {
  try {
    const movie = await tmdbService.fetchLatestMovie();
    res.json(movie); // No pagination for latest
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch latest movie' });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    const movies = await tmdbService.searchMovies(q, page);
    res.json(movies);
  } catch (err) {
    console.error('Error searching movies:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to search movies' });
  }
};


exports.getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await tmdbService.fetchMovieDetails(id);

    const {
      title,
      overview,
      genres,
      popularity,
      release_date,
      original_language,
      production_countries,
      vote_count,
      vote_average,
      budget,
      revenue,
      homepage,
      poster_path,
    } = movie;

    res.json({
      title,
      overview,
      genres: genres.map(g => g.name),
      popularity,
      release_date,
      original_language,
      origin_country: production_countries.map(c => c.iso_3166_1),
      vote_count,
      vote_average,
      budget,
      revenue,
      homepage,
      poster_url: `https://image.tmdb.org/t/p/w500${poster_path}`,
    });
  } catch (err) {
    console.error('Error fetching movie details:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
};
