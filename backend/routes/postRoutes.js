const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createPost,
  getMyPosts,
  getPostsByUser,
} = require('../controllers/postController');

router.post('/', auth, createPost);                  // POST /api/posts
router.get('/me', auth, getMyPosts);                 // GET /api/posts/me
router.get('/user/:userId', auth, getPostsByUser);   // GET /api/posts/user/:userId

module.exports = router;
