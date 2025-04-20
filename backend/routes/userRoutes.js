const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  searchUsers,
} = require('../controllers/userController');

router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);
router.get('/search', auth, searchUsers);

module.exports = router;

// Search users by name or skill
router.get('/search', auth, async (req, res) => {
  const { q } = req.query;

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { skills: { $regex: q, $options: 'i' } }
      ]
    }).select('name email bio skills');

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Search failed' });
  }
});

// Public profile by user ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email bio skills');
    const posts = await Post.find({ user: req.params.id }).sort({ createdAt: -1 });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({ user, posts });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching profile' });
  }
});
