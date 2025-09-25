import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  photo: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true },
  description: { type: String, default: '', maxLength: [200, 'Description cannot exceed 200 characters'] },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // пользователи, которые лайкнули
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

export default Post;

