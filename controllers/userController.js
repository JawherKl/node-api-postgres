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
    const userId = parseInt(req.params.id, 10); // Ensure userId is a number
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const user = await User.getById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Profile picture is required" });
    }
    value.picture = req.file.filename; // Add uploaded filename to user data
    const userId = await User.create(value);
    res.status(201).json({ message: "User added", userId });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!email || !email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const user = await User.getById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Assuming `User.update` returns the updated user
    await User.update(id, { name, email, password });

    // If `User.update` doesn't return the full user object, fetch it again
    const updatedUserDetails = await User.getById(id);

    return res.status(200).json({
      message: `User modified with ID: ${id}`,
      user: updatedUserDetails,  // return the updated user object
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  // Ensure that the ID is a valid integer
  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const user = await User.getById(id);  // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await User.delete(id);  // Proceed with the deletion
    res.status(200).json({ message: `User soft deleted with ID: ${id}` });
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
