const express = require('express');
const router = express.Router();
const {
  searchUsers,
  getUserProfile,
  updateProfile,
  toggleFollow,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { updateProfileSchema } = require('../schemas/validationSchemas');

// Update profile (Email is readonly)
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);

// Search users by name or ID
router.get('/search', protect, searchUsers);

// Get profile and toggle follow
router.get('/:id', getUserProfile);
router.post('/:id/follow', protect, toggleFollow);

module.exports = router;
