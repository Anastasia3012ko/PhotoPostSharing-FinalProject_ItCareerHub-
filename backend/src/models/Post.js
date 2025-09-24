import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  photo_url: { type: String, required: true }, 
  description: { type: String, default: '' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // пользователи, которые лайкнули
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  uploadedAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);
export default Post;