require('express-async-errors');
const Metrics = require('../models/metrics');
const client = require('prom-client');
const jwt = require('jsonwebtoken');

// Create a Registry to register metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metric: HTTP request counter
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
});
register.registerMetric(httpRequestCounter);

// Middleware to count requests
const trackRequests = (req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      path: req.route ? req.route.path : req.path,
      status: res.statusCode,
    });
  });
  next();
};

// Metrics endpoint handler
/*
const getMetrics = async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
};
*/

// Metrics endpoint handler
const getMetrics = async (req, res) => {
  // Get the Authorization header
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Extract the token
  const token = authHeader.split(' ')[1];

  // Verify and decode the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.userId; // Ensure your JWT payload contains a `userId`

  if (!userId) {
    return res.status(400).json({ error: 'Invalid token: userId missing' });
  }

  // Set content type and retrieve metrics
  res.set('Content-Type', register.contentType);
  const metricsText = await register.metrics();
  const metrics = parseMetrics(metricsText); // Helper function to parse metrics.

  // Save metrics to the database
  await Metrics.saveMetricsToDatabase(userId, metrics);

  // Send the metrics as a response
  res.set('Content-Type', register.contentType);
  res.send(metricsText);
};

function parseMetrics(metricsText) {
  const lines = metricsText.split("\n");
  const metrics = [];

  lines.forEach(line => {
    // Look for metric lines that follow the format: 'metric_name value'
    if (!line.startsWith("#") && line.trim() !== "") {
      const [metricName, metricValue] = line.split(/\s+/);
      if (metricName && metricValue) {
        metrics.push({ metricName, metricValue });
      }
    }
  });

  return metrics;
}


const createMetric = async (req, res) => {
  const { userId, metricName, metricValue } = req.body;
  const metric = await Metrics.create({ userId, metricName, metricValue });
  res.status(201).json(metric);
};

const getMetricsByUser = async (req, res) => {
  const { userId } = req.params;
  const metrics = await Metrics.findByUserId(userId);
  res.status(200).json(metrics);
};

const updateMetric = async (req, res) => {
  const { id } = req.params;
  const { metricName, metricValue } = req.body;
  const metric = await Metrics.update(id, { metricName, metricValue });
  res.status(200).json(metric);
};

const deleteMetric = async (req, res) => {
  const { id } = req.params;
  await Metrics.delete(id);
  res.status(200).json({ message: 'Metric deleted successfully' });
};

module.exports = { 
  trackRequests, 
  getMetrics,
  createMetric,
  getMetricsByUser,
  updateMetric,
  deleteMetric,
};
