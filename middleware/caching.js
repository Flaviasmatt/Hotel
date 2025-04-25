const client = require('../redis.js');

async function cache(req, res, next) {
  console.log("🧪 Verificando cache para:", req.originalUrl);
  const data = await client.get(req.originalUrl);
  if (data !== null) {
    console.log("✅ Cache HIT:", req.originalUrl);
    res.render('hotels', { hotels: JSON.parse(data) });
  } else {
    console.log("❌ Cache MISS:", req.originalUrl);
    next();
  }
}

module.exports = cache;

