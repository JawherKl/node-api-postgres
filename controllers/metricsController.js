const client = require('prom-client');

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
const getMetrics = async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.send(await register.metrics());
};

module.exports = { trackRequests, getMetrics };
