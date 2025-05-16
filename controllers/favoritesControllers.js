const Favorite = require('../models/Favorite');
const { connectRedis } = require('../redis/redisClient');

let redisClient;
(async () => {
  redisClient = await connectRedis();
})();

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
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

    // Invalidate favorites cache for this user after adding a new favorite
    const cacheKey = `favorites:user:${userId}`;
    await redisClient.del(cacheKey);

    res.status(201).json({ message: 'Movie added to favorites' });
  } catch (err) {
    console.error('Error adding favorite:', err.message);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user._id;
    const cacheKey = `favorites:user:${userId}`;

    // Try cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // Cache miss: fetch from DB
    const favorites = await Favorite.find({ userId });

    // Cache for 1 hour
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(favorites));

    res.json(favorites);
  } catch (err) {
    console.error('Error fetching favorites:', err.message);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};
