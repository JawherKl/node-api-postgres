const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');
const authorize = require('../middleware/authorize');

const router = express.Router();

router.get('/', authenticateToken, userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', authenticateToken, authorize('admin'), userController.deleteUser);

module.exports = router;
