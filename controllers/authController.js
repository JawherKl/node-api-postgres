require('express-async-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');
const { sendEmail } = require('../utils/mailer');

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
    [name, email, hashedPassword]
  );
  res.status(201).json({ message: 'User registered', userId: result.rows[0].id });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if the user exists
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Compare password with hashed password in database
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // Generate a more secure JWT token
  const tokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: Math.floor(Date.now() / 1000),
    jti: require('crypto').randomBytes(16).toString('hex') // Add unique token ID
  };

  const token = jwt.sign(
    tokenPayload,
    process.env.JWT_SECRET,
    { 
      expiresIn: '24h', // Increased from 1h to 24h
      algorithm: 'HS512' // More secure algorithm (upgrade from default HS256)
    }
  );

  // Response with token and user details
  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  // Check if user exists
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour from now

  // Save reset token and expiry to database
  await pool.query(
    'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
    [resetToken, resetTokenExpires, user.id]
  );

  // Create reset URL - using the base URL from where the request originated
  const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

  // Send email
  try {
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please go to this link to reset your password: ${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.`,
      html: `
        <p>You requested a password reset.</p>
        <p>Please click the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    });

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    // If email fails, remove the reset token from database
    await pool.query(
      'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = $1',
      [user.id]
    );
    return res.status(500).json({ message: 'Error sending password reset email' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Find user with valid reset token
    const result = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );
    
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2 RETURNING id',
      [hashedPassword, user.id]
    );

    console.log(`Password reset successful for user ID: ${user.id}`);
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error resetting password. Please try again.' });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
