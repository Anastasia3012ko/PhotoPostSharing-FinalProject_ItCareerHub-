import { uploadSinglePhoto, deletePhotoFromS3 } from '../utils/s3.js';
import Post from '../models/Post.js';
import mongoose from 'mongoose';

export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const image = await uploadSinglePhoto(file, req.userId, 'posts');

    const post = new Post({ description, photo: image, user: req.userId });
    await post.save();

    res.json({ message: 'Post created', post });
  } catch (error) {
    res.status(500).json({
      message: 'Server error with creating post',
      error: error.message,
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid post Id" });
    }

    const post = await Post.findById(postId)
      .populate("user", "userName avatar")
      .populate("photo");

    if(!post) {
      return res.status(404).json({ message: "Post not found" });
    }   
    
    res.json({post});
  } catch (error) {
    console.error("Error getting post by ID:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllPosts = async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "userName avatar") 
      .populate("photo")                   
      .sort({ createdAt: -1 });
      res.json(posts)
  } catch (error) {
    console.error("Error getting all posts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const getAllPostsOneUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ user: userId })
      .populate('user', 'username avatar')
      .populate('photo')
      .populate('comments.user', 'username avatar')
      .sort({ createdAt: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: 'This user has no posts yet' });
    }

    res.json(posts);
  } catch (error) {
    console.error('Error getting user posts:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const description = req.body.description;
    const file = req.file;

    if (!description && !file) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: 'Forbidden: you can update only your own post' });
    }

    if (description) {
      if (description.length > 300) {
        return res
          .status(400)
          .json({ message: 'Description cannot exceed 300 characters' });
      }
      post.description = description.trim();
    }

    if (file) {
      if (post.photo && post.photo.filename) {
        await deletePhotoFromS3(post.photo.filename);
        await Image.findByIdAndDelete(post.photo._id);
      }

      const newImage = await uploadSinglePhoto(file, req.userId, "posts");
      post.photo = newImage._id;
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate("user", "userName avatar")
      .populate("photo");

    res.json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error('Error updating post description:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deletePostById = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: 'Forbidden: you can delete only your own post' });
    }

    await Post.deleteOne({ _id: postId });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
