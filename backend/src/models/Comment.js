import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, maxLength: [200, 'Comment cannot exceed 200 characters'] },
  },
  { timestamps: true }
);

// Хуки для обновления счётчика комментариев
commentSchema.post('save', async function () {
  await mongoose.model('Post').updateOne({ _id: this.post }, { $inc: { commentsCount: 1 } });
});

commentSchema.post('remove', async function () {
  await mongoose.model('Post').updateOne({ _id: this.post }, { $inc: { commentsCount: -1 } });
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
