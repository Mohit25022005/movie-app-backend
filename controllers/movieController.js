const tmdbService = require('../services/tmdbService');
const { connectRedis } = require('../redis/redisClient');

let redisConnectionClient;
(async () => {
  redisConnectionClient = await connectRedis();
})();

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
    const cacheKey = `upcomingMovies:page:${page}`;

    const cached = await redisConnectionClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    const data = await tmdbService.fetchMovies('upcoming', page);
    const pagination = buildPagination(req, data);
    const response = { pagination, results: data.results };

    await redisConnectionClient.setEx(cacheKey, 3600, JSON.stringify(response));
    return res.status(200).json(response);
  } catch (err) {
    console.error('Error fetching upcoming movies:', err.message);
    return res.status(500).json({ error: 'Failed to fetch upcoming movies' });
  }
};

exports.getPopularMovies = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const cacheKey = `popularMovies:page:${page}`;

    const cached = await redisConnectionClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const data = await tmdbService.fetchMovies('popular', page);
    const pagination = buildPagination(req, data);
    const response = { pagination, results: data.results };

    await redisConnectionClient.setEx(cacheKey, 3600, JSON.stringify(response));
    res.json(response);
  } catch (err) {
    console.error('Error fetching popular movies:', err.message);
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
    console.error('Error fetching top rated movies:', err.message);
    res.status(500).json({ error: 'Failed to fetch top rated movies' });
  }
};

exports.getLatestMovie = async (req, res) => {
  try {
    const cacheKey = 'latestMovie';

    const cached = await redisConnectionClient.get(cacheKey);
    if (cached) return res.json(JSON.parse(cached));

    const movie = await tmdbService.fetchLatestMovie();

    await redisConnectionClient.setEx(cacheKey, 3600, JSON.stringify(movie));
    res.json(movie);
  } catch (err) {
    console.error('Error fetching latest movie:', err.message);
    res.status(500).json({ error: 'Failed to fetch latest movie' });
  }
};

exports.searchMovies = async (req, res) => {
  try {
    const { q, page = 1 } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });

    const cacheKey = `searchMovies:q:${q}:page:${page}`;

    const cached = await redisConnectionClient.get(cacheKey);
    if (cached) {
      console.log('Cache hit for search:', cacheKey);
      return res.status(200).json(JSON.parse(cached));
    }

    console.log(`Searching movies for query: "${q}" page: ${page}`);
    const movies = await tmdbService.searchMovies(q, page);

    if (!movies) {
      console.error('No results returned from TMDB search');
      return res.status(404).json({ error: 'No movies found' });
    }

    await redisConnectionClient.setEx(cacheKey, 3600, JSON.stringify(movies));
    res.status(200).json(movies);
  } catch (err) {
    console.error('Error searching movies:', err.stack || err.message);
    res.status(500).json({ error: 'Failed to search movies' });
  }
};



exports.getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Request for movie details with ID:', id);

    const cacheKey = `movieDetails:${id}`;

    const cached = await redisConnectionClient.get(cacheKey);
    if (cached) {
      console.log('Cache hit for movie details', id);
      return res.status(200).json(JSON.parse(cached));
    }

    const movie = await tmdbService.fetchMovieDetails(id);
    if (!movie) {
      console.error('No movie found with ID:', id);
      return res.status(404).json({ error: 'Movie not found' });
    }

    const response = {
      title: movie.title,
      overview: movie.overview,
      genres: movie.genres?.map(g => g.name) || [],
      popularity: movie.popularity,
      release_date: movie.release_date,
      original_language: movie.original_language,
      origin_country: movie.production_countries?.map(c => c.iso_3166_1) || [],
      vote_count: movie.vote_count,
      vote_average: movie.vote_average,
      budget: movie.budget,
      revenue: movie.revenue,
      homepage: movie.homepage,
      poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    };

    await redisConnectionClient.setEx(cacheKey, 3600, JSON.stringify(response));

    res.status(200).json(response);
  } catch (err) {
    console.error('Error fetching movie details:', err.stack || err.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
};
