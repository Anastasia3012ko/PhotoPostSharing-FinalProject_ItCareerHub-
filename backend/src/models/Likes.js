import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // кто лайкнул
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // какой пост
  },
  { timestamps: true }
);

// Only one like per post from one user
likeSchema.index({ user: 1, post: 1 }, { unique: true });

// Индекс для выборки всех лайков поста
likeSchema.index({ post: 1, createdAt: -1 });

const Like = mongoose.model('Like', likeSchema);
export default Like;
