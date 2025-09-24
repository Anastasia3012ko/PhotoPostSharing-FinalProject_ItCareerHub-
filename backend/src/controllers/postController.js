import { uploadSinglePhoto } from '../utils/s3.js';
import Post from '../models/Post.js';

export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const file = req.file;

    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const photo_url = await uploadSinglePhoto(file);

    const post = new Post({ description, photo_url, user: req.userId });
    await post.save();

    res.json({ message: 'Post created', post });
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Server error with creating post',
        error: error.message,
      });
  }
};
