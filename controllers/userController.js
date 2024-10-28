const pool = require('../config/db');
const Joi = require('joi');
const logger = require('../utils/logger');
const path = require('path');

// Validation schemas
const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// Get users with pagination, search, and sorting
const getUsers = async (req, res, next) => {
  const { page = 1, limit = 10, search, sort } = req.query;
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM users WHERE deleted_at IS NULL';
  const params = [];

  if (search) {
    query += ` AND (name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 2})`;
    params.push(`%${search}%`, `%${search}%`);
  }

  if (sort) {
    query += ` ORDER BY ${sort}`;
  } else {
    query += ' ORDER BY id ASC';
  }

  query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  try {
    const result = await pool.query(query, params);
    const countResult = await pool.query('SELECT COUNT(*) FROM users WHERE deleted_at IS NULL');
    const totalUsers = countResult.rows[0].count;

    res.status(200).json({
      totalUsers,
      page,
      totalPages: Math.ceil(totalUsers / limit),
      users: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// Create user
const createUser = async (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email } = value;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
      [name, email]
    );
    res.status(201).json({ message: 'User added', userId: result.rows[0].id });
  } catch (error) {
    next(error);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  try {
    const result = await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3 AND deleted_at IS NULL', [name, email, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found or already deleted' });
    }
    logger.info(`User updated: ID ${id}, name: ${name}`);
    res.status(200).json({ message: `User modified with ID: ${id}` });
  } catch (error) {
    next(error);
  }
};

// Soft delete user
const deleteUser = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query(
      'UPDATE users SET deleted_at = NOW() WHERE id = $1',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found or already deleted' });
    }
    res.status(200).json({ message: `User soft deleted with ID: ${id}` });
  } catch (error) {
    next(error);
  }
};

// Upload user profile picture
const uploadProfilePicture = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const picturePath = req.file.path; // Assuming multer is set up to handle this

  try {
    const result = await pool.query('UPDATE users SET profile_picture = $1 WHERE id = $2 AND deleted_at IS NULL', [picturePath, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found or already deleted' });
    }
    res.status(200).json({ message: `Profile picture updated for user ID: ${id}` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadProfilePicture,
};
