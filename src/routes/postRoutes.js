const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getMyPosts,
  getPostsByUser,
  deletePost,
  toggleLikePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Feeds
router.get('/', getAllPosts);
router.get('/me', protect, getMyPosts);
router.get('/user/:userId', getPostsByUser);

// Post creation
router.post('/', protect, createPost);

// Actions on a specific post
router.post('/:id/like', protect, toggleLikePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
