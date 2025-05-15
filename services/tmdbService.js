const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const API_KEY = process.env.TMDB_API_KEY;

const mapMovie = (movie) => ({
  id: movie.id,
  title: movie.title,
  overview: movie.overview,
  poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
  genres: movie.genre_ids || [],
  release_date: movie.release_date,
  popularity: movie.popularity,
  vote_count: movie.vote_count,
  vote_average: movie.vote_average,
});

async function fetchWithRetry(url, params, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await axios.get(url, { params });
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`Request failed, retrying (${i + 1}/${retries})...`);
      await new Promise(res => setTimeout(res, 1000)); // wait 1 second before retry
    }
  }
}

exports.fetchMovies = async (category, page = 1) => {
  const response = await fetchWithRetry(`${TMDB_BASE_URL}/movie/${category}`, {
    api_key: API_KEY,
    language: 'en-US',
    page,
  });

  return {
    page: response.data.page,
    total_pages: response.data.total_pages,
    total_results: response.data.total_results,
    results: response.data.results.map(mapMovie),
  };
};

exports.fetchLatestMovie = async () => {
  const response = await fetchWithRetry(`${TMDB_BASE_URL}/movie/latest`, {
    api_key: API_KEY,
    language: 'en-US',
  });

  const movie = response.data;
  return {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
    genres: movie.genres || [],
    release_date: movie.release_date,
    popularity: movie.popularity,
    vote_count: movie.vote_count,
    vote_average: movie.vote_average,
  };
};

exports.searchMovies = async (query, page = 1) => {
  const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
    params: {
      api_key: API_KEY,
      language: 'en-US',
      query,
      page,
    },
  });

  return {
    page: response.data.page,
    total_pages: response.data.total_pages,
    total_results: response.data.total_results,
    results: response.data.results.map(mapMovie),
  };
};

exports.fetchMovieDetails = async (movieId) => {
  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`;

  const response = await axios.get(url);
  return response.data;
};