const express = require('express');
const app = express();
require('dotenv').config();

const movieRouter = require('./router/movieRoute');
const authRouter = require('./router/authRoutes'); 
const reviewRoutes = require('./router/reviewRoutes');

app.use(express.json());

// Routes
app.use('/api/movies', movieRouter);
app.use('/api', authRouter);
app.use('/api/reviews', reviewRoutes);

module.exports = app;
