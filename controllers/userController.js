const User = require('../models/user');
const Joi = require('joi');
const logger = require('../utils/logger');

// Validation schemas
const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const getUsers = async (req, res, next) => {
  try {
    const users = await User.getAll(req.query);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.getById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const userId = await User.create(value);
    res.status(201).json({ message: 'User added', userId });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    await User.update(req.params.id, req.body);
    res.status(200).json({ message: `User modified with ID: ${req.params.id}` });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await User.delete(req.params.id);
    res.status(200).json({ message: `User soft deleted with ID: ${req.params.id}` });
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
