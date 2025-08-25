const express = require('express');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const { getAdminStats } = require('../controllers/adminController');

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get admin dashboard stats
// @access  Private (Admin)
router.get('/stats', authenticateToken, isAdmin, getAdminStats);

module.exports = router;
