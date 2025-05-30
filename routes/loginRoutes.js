const express = require('express');
const router = express.Router();
const { login, register, forgotPassword, resetPassword } = require('../controllers/authController');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login an existing user
 *     description: Authenticates the user and returns a JWT token
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', login);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user and returns a success message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message of successful user creation
 *       400:
 *         description: Bad request (invalid input)
 *       500:
 *         description: Server error
 */
router.post('/register', register);

/**
 * @swagger
 * /forgot-password:
 *   post:
 *     summary: Request password reset
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /reset-password/{token}:
 *   post:
 *     summary: Reset password with token
 */
router.post('/reset-password/:token', resetPassword);

module.exports = router;
