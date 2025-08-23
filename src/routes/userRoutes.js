const express = require('express');
const { authenticateToken, isAdmin, authorizeRoles } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

router.get('/', authenticateToken, isAdmin, getAllUsers);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'client'), getUserById);
router.post('/', authenticateToken, isAdmin, createUser);
router.put('/:id', authenticateToken, authorizeRoles('admin', 'client'), updateUser);
router.delete('/:id', authenticateToken, isAdmin, deleteUser);

module.exports = router;