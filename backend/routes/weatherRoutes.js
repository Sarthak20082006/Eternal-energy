const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getSolarWeather, getCityCoordinates } = require('../controllers/weatherController');

router.get('/solar', protect, getSolarWeather);
router.get('/cities', protect, getCityCoordinates);

module.exports = router;
