const Favorite = require('../models/Favorite');

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;  // Assuming `req.user` set by auth middleware
    const { movieId } = req.body;

    if (!movieId) {
      return res.status(400).json({ error: 'movieId is required' });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({ userId, movieId });
    if (existing) {
      return res.status(400).json({ error: 'Movie already in favorites' });
    }

    const favorite = new Favorite({ userId, movieId });
    await favorite.save();

    res.status(201).json({ message: 'Movie added to favorites' });
  } catch (err) {
    console.error('Error adding favorite:', err.message);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;

    const favorites = await Favorite.find({ userId });

    res.json(favorites);
  } catch (err) {
    console.error('Error fetching favorites:', err.message);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};
