const Review = require('../models/Review');

// POST /api/reviews
exports.addReview = async (req, res) => {
  try {
    const { movieId, content } = req.body;
    const user = req.user;

    const newReview = new Review({
      movieId,
      userId: user._id,
      authorName: user.name,
      avatar: user.avatar || '', // optional
      content,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
};

// GET /api/reviews/:movieId
exports.getReviewsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    const reviews = await Review.find({ movieId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(reviews);
  } catch (err) {
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

    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};
