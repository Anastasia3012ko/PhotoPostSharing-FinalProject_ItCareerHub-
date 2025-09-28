import Like from '../models/Likes.js';
import Post from '../models/Post.js';

export const addLike = async (req, res) => {
  try {
    const userId = req.userId;
    const { id: postId } = req.params;

    const existing = await Like.findOne({ user: userId, post: postId });
    if (existing) {
      return res.status(400).json({ message: 'Already liked' });
    }

    await Like.create({ user: userId, post: postId });
    const post = await Post.findById(postId);

    res.json({
      likesCount: post.likesCount,
      message: 'Like added',
    });
  } catch (error) {
    console.error('AddLike error: ', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteLike = async (req, res) => {
  try {
    const userId = req.userId;
    const { id: postId } = req.params;

    const existing = await Like.findOne({ user: userId, post: postId });
    if (!existing) {
      return res.status(400).json({ message: 'Not liked yet' });
    }

    await existing.deleteOne();
    const post = await Post.findById(postId);

    res.json({
      likesCount: post.likesCount,
      message: 'Like removed',
    });
  } catch (error) {
    console.error('Error with removing like', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
