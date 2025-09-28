import mongoose from 'mongoose';
import User from './User.js';

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// unique index, impossible to subscribe twice
followSchema.index({ follower: 1, following: 1 }, { unique: true });

followSchema.pre('save', function (next) {
  if (this.follower.equals(this.following)) {
    return next(new Error('You cannot subscribe to yourself'));
  }
  next();
});

followSchema.post('save', async function (doc) {
  const User = mongoose.model('User');
  await User.updateOne({ _id: doc.follower }, { $inc: { followingCount: 1 } });
  await User.updateOne({ _id: doc.following }, { $inc: { followersCount: 1 } });
});

followSchema.post('deleteOne', { document: true }, async function (doc) {
  await User.updateOne({ _id: doc.follower }, { $inc: { followingCount: -1 } });
  await User.updateOne(
    { _id: doc.following },
    { $inc: { followersCount: -1 } }
  );
});

const Follow = mongoose.model('Follow', followSchema);

export default Follow;
