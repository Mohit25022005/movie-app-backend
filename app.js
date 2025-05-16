const express = require('express');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');
const redisClient = require('./redis/redisClient');
const swaggerDocument = require('./swagger-output.json');

dotenv.config();
const app = express();

// Redis client connection
(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connection error:', err.message);
  }
})();

// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routers
const movieRouter = require('./router/movieRoute');
const authRouter = require('./router/authRoutes');
const reviewRoutes = require('./router/reviewRoutes');
const favoritesRoutes = require('./router/favoritesRoutes');

// Route Mappings
app.use('/api/movies', movieRouter);
app.use('/api', authRouter);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoritesRoutes);

module.exports = app;
