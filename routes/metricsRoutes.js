const express = require('express');
const { getMetrics } = require('../controllers/metricsController');

const router = express.Router();

// Metrics endpoint
router.get('/', getMetrics);

module.exports = router;
