const pool = require('../config/db');
const Joi = require('joi');
const logger = require('../utils/logger');

// Validation schemas
const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const getUsers = async (req, res, next) => {
  const { page = 1, limit = 10, search, sort } = req.query;
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM users';
  const params = [];

  if (search) {
    query += ` WHERE name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 2}`;
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
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email } = value;
  try {
    const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id', [name, email]);
    res.status(201).json({ message: 'User added', userId: result.rows[0].id });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  try {
    await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
    logger.info(`User updated: ID ${id}, name: ${name}`);
    res.status(200).json({ message: `User modified with ID: ${id}` });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.status(200).json({ message: `User deleted with ID: ${id}` });
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
};
