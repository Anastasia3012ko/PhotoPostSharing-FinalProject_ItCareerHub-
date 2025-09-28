import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import mongoose from 'mongoose';

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post Id' });
    }

    const newComment = new Comment({
      user: req.userId,
      post: postId,
      text,
    });

    await newComment.save();
    res.status(201).json({ message: 'Comment added successfully', newComment });
  } catch (error) {
    console.error('Error adding comment:', error.message);
    res
      .status(500)
      .json({
        message: 'Server error with adding commit',
        error: error.message,
      });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: 'Invalid comment Id' });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: you can update only your comment' });
    }

    if(text) comment.text = text

    await comment.save();
    res.json({message: 'Comment updated successfully', comment})
  } catch (error) {
    console.error('Error with updating comment: ', error.message);
    res.status(500).json({message: 'Server error with updating comment', error: error.message})
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: 'Invalid comment Id' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const post = await Post.findById(comment.post);
    if (!post) {
      return res.status(404).json({ message: 'Associated post not found' });
    }
    
    if (comment.user.toString() !== req.userId.toString() &&
        post.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'You are not allowed to delete this comment' });
    }

    await comment.deleteOne();

    res.json({message: 'Comment deleted successfully'})

  } catch (error) {
    console.error('Error with deleting comment: ', error.message);
    res.status(500).json({message: 'Server error with deleting comment', error: error.message})
  }
  
}
