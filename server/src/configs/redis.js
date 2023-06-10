const redis = require('redis');
require('dotenv').config();

let redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOSTNAME,
    port: parseInt(process.env.REDIS_PORT)
  }
});

redisClient.on('error', function (err) {
  console.log('*Redis Client Error: ' + err.message);
});
redisClient.on('connect', function () {
  console.log('Connected to redis instance');
});

(async () => {
  await redisClient.auth(process.env.REDIS_PASSWORD).catch((err) => {
    console.log('Redis auth error: ' + err.message);
  });
  await redisClient.connect().catch((err) => {
    console.log('Redis connect error: ' + err.message);
  });
})();

module.exports = redisClient;
