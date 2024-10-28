const pool = require('../config/db');
const Joi = require('joi');

// Validation schemas
const userSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
});

const getUsers = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const results = await pool.query('SELECT * FROM users ORDER BY id ASC LIMIT $1 OFFSET $2', [limit, offset]);
    res.status(200).json(results.rows);
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
  const { error, value } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { name, email } = value;
  try {
    await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
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
