import mongoose from 'mongoose';
import User from './User.js';

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    photo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
      required: true,
    },
    description: {
      type: String,
      default: '',
      maxLength: [1000, 'Description cannot exceed 1000 characters'],
    },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

postSchema.post("save", async function () {
  try {
    if (this.isNew) {
      await User.updateOne({ _id: this.user }, { $inc: { postsCount: 1 } }).exec();
    }
  } catch (error) {
    console.error("Error incrementing postsCount:", error.message);
  }
});

postSchema.post("deleteOne", { document: true }, async function () {
  try {
    await User.updateOne(
      { _id: this.user },
      { $inc: { postsCount: -1 } }
    ).exec();
  } catch (error) {
    console.error("Error decrementing postsCount:", error.message);
  }
});

postSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});

postSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'post',
  justOne: false,
});


const Post = mongoose.model('Post', postSchema);

export default Post;
