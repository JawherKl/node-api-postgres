const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/loginRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerJsDoc = require('swagger-jsdoc');
const { swaggerUi, swaggerSpec } = require('./config/swagger'); // Import Swagger UI
const metricsRoutes = require('./routes/metricsRoutes');
const { trackRequests } = require('./controllers/metricsController');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(trackRequests);

// Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  headers: true, // Sends the rate limit info in the response headers
});

app.use(globalLimiter);

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000/api-docs',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],  // Make sure Authorization is allowed
}));

// Serve Swagger documentation at the /api-docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Password reset route
app.get('/reset-password/:token', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset-password.html'));
});

// Routes
app.use('/users', userRoutes);

// Use login routes
app.use('/', loginRoutes);

// Use metrics routes
app.use('/metrics', metricsRoutes);

// Error Handler
app.use(errorHandler);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes',
});

app.use('/login', loginLimiter);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post('/users/:id/profile-picture', upload.single('profilePicture'), (req, res) => {
  const id = parseInt(req.params.id);
  const picturePath = req.file.path;

  pool.query('UPDATE users SET profile_picture = $1 WHERE id = $2', [picturePath, id], (error) => {
    if (error) {
      throw error;
    }
    res.status(200).send(`Profile picture updated for user ID: ${id}`);
  });
});

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User API',
      version: '1.0.0',
      description: 'User management API',
    },
  },
  apis: ['./routes/*.js'], // path where API docs are located
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Conditionally start the server only if this file is the entry point
if (require.main === module) {
  app.listen(port, () => {
    console.log(`App running on port ${port}.`);
  });
}

module.exports = app;
