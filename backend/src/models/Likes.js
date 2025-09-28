import mongoose from 'mongoose';
import Post from './Post.js';

const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  },
  { timestamps: true }
);

// Only one like per post from one user
likeSchema.index({ user: 1, post: 1 }, { unique: true });

// Хуки для обновления счётчика likes
likeSchema.post('save', async function (doc) {
  try {
    await Post.updateOne({ _id: doc.post }, { $inc: { likesCount: 1 } });
  } catch (error) {
    console.error('Error incrementing likesCount:', error.message);
  }
});

likeSchema.post('deleteOne', { document: true }, async function () {
  try {
    await mongoose
      .model('Post')
      .updateOne({ _id: this.post }, { $inc: { likesCount: -1 } });
  } catch (error) {
    console.error('Error decrementing likesCount:', error.message);
  }
});
const Like = mongoose.model('Like', likeSchema);

export default Like;
