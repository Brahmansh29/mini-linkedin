// Get user profile
db.users.findOne({ _id: ObjectId("60e9dbf7d4f89f1b4c5b8bfa") });

// Get user's posts
db.posts.find({ user: ObjectId("60e9dbf7d4f89f1b4c5b8bfa") }).sort({ createdAt: -1 });
