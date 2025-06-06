const cache = require('../middleware/caching.js');
const client = require('../redis.js');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var HotelService = require("../services/HotelService")
var db = require("../models");
var hotelService = new HotelService(db);
var { checkIfAuthorized, isAdmin } = require("./authMiddlewares")

/* GET hotels listing. */
router.get('/', cache, async function (req, res, next) {
  try {
    const hotels = await hotelService.get(); // ou como estiver sua função para buscar hotéis
    await client.set(req.originalUrl, JSON.stringify(hotels)); // salva no cache
    res.render('hotels', { hotels: hotels }); // renderiza normalmente
  } catch (error) {
    next(error); // trata erros caso ocorram
  }
});


router.post('/:hotelId/rate', checkIfAuthorized, jsonParser, async function(req, res, next) {
  let value = req.body.Value;
  let userId = req.body.UserId;
  await hotelService.makeARate(userId, req.params.hotelId, value);
  res.end()
});

router.post('/', checkIfAuthorized, isAdmin, jsonParser, async function(req, res, next) {
  let Name = req.body.Name;
  let Location = req.body.Location;
  await hotelService.create(Name, Location);
  res.end()
});

router.delete('/', checkIfAuthorized, jsonParser, async function(req, res, next) {
  let id = req.body.id;
  await hotelService.deleteHotel(id);
  res.end()
});

router.delete('/:id', checkIfAuthorized, jsonParser, async function(req, res, next) {
  await hotelService.deleteHotel(req.params.id);
  res.end()
});

module.exports = router;
