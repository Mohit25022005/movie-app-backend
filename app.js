const express = require('express');
const app = express();

const movieRouter = require('./router/movieRoute');
const authRouter = require('./router/authRoutes'); 

app.use(express.json());

// Routes
app.use('/api/movies', movieRouter);
app.use('/api', authRouter);

module.exports = app;
