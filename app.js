const express = require('express');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const dotenv = require('dotenv');
const swaggerDocument = require('./swagger-output.json');

dotenv.config();
const app = express();

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000, // 1 hour
  handler: (req, res, next) => {
    res.set('X-RateLimit-Reason', 'Too many requests'); // Custom header
    res.status(429).json({
      success: false,
      message: 'We have received too many requests from this IP. Please try after one hour'
    });
  }
});

app.use('/api',limiter);
// Redis client connection


// Middleware
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routers
const movieRouter = require('./router/movieRoute');
const authRouter = require('./router/authRoutes');
const reviewRoutes = require('./router/reviewRoutes');
const favoritesRoutes = require('./router/favoritesRoutes');

// Route Mappings
app.use('/', movieRouter);
app.use('/', authRouter);
app.use('/', reviewRoutes);
app.use('/', favoritesRoutes);

module.exports = app;
