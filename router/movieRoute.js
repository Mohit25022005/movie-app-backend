const express = require('express')
const movieController = require('./../controllers/movieController')

const router = express.Router()
router.route('/').get(movieController.getAllMovies).post(movieController.createMovie)
router.route('/:id').delete(movieController.deleteMovie)
router.route('/filtername').get(movieController.filterByName)
router.route("/rating").get(movieController.rating)

module.exports = router; 