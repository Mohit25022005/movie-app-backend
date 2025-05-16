const { createClient } = require('redis');
require('dotenv').config();
exports.connectRedis = async () => {
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  redisClient.on('connect', () => console.log('Redis Client Connected'));

  await redisClient.connect();
  return redisClient;
};
