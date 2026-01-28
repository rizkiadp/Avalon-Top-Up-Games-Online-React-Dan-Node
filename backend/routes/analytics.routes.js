const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

router.post('/visit', analyticsController.trackVisit);
router.get('/traffic', analyticsController.getTrafficData);

module.exports = router;
