const Post = require('../models/Post');

// Create a post
exports.createPost = async (req, res) => {
  const { content } = req.body;
  try {
    const post = new Post({
      user: req.user,
      content,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all posts of logged-in user
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get posts by userId (for profile viewing)
exports.getPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
