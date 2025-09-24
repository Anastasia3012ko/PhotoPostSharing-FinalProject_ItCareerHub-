import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // reciever
  type: { type: String, enum: ['like', 'comment', 'follow'], required: true },
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // sender
//post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // if new post
  read: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;