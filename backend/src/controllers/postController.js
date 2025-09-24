import { uploadSinglePhoto } from '../utils/s3.js';
import Post from '../models/Post.js';
import Image from '../models/Image.js';

export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const file = req.file;

    if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }


  const image = await uploadSinglePhoto(file, req.userId, "posts");

  const post = new Post({ description, photo: image, user: req.userId });
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
