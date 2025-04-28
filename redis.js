const { createClient } = require('redis');
const redisClient = createClient({
  url: "rediss://default:AVNS_R77IMVkRekEiEhkQjUj@redis-34b9f5ee-teacher-101.d.aivencloud.com:21247"
});
redisClient.connect().catch(console.error);

module.exports = redisClient;