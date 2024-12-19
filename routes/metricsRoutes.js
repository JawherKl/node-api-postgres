const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');
const authenticateToken = require('../middleware/auth');

// Metrics endpoint
router.get('/', authenticateToken, metricsController.getMetrics);
router.post('/', authenticateToken, metricsController.createMetric);
router.get('/user/:userId', authenticateToken, metricsController.getMetricsByUser);
router.put('/:id', authenticateToken, metricsController.updateMetric);
router.delete('/:id', authenticateToken, metricsController.deleteMetric);

module.exports = router;
