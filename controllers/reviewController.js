const Review = require('../models/Review');
const { connectRedis } = require('../redis/redisClient');

let redisClient;
(async () => {
  redisClient = await connectRedis();
})();

// POST /api/reviews
exports.addReview = async (req, res) => {
  try {
    const { movieId, content } = req.body;
    const user = req.user;

    const newReview = new Review({
      movieId,
      userId: user._id,
      authorName: user.name,
      avatar: user.avatar || '',
      content,
    });

    await newReview.save();

    // Invalidate cache for this movie's reviews after adding a new one
    const cacheKey = `reviews:movie:${movieId}`;
    await redisClient.del(cacheKey);

    res.status(201).json(newReview);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/reviews/:movieId
exports.getReviewsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const cacheKey = `reviews:movie:${movieId}`;

    // Try to get from cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // If no cache, fetch from DB
    const reviews = await Review.find({ movieId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Cache the result for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(reviews));

    res.json(reviews);
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// DELETE /api/reviews/:reviewId
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.userId.toString() !== userId.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(reviewId);

    // Invalidate cache for this movie's reviews after deletion
    const cacheKey = `reviews:movie:${review.movieId}`;
    await redisClient.del(cacheKey);

    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
