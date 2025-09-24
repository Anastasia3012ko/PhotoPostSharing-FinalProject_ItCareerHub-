import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true }, // ссылка на файл в S3
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //  (user id)
  type: { type: String, enum: ['avatar', 'post'], required: true },
  uploadedAt: { type: Date, default: Date.now }, 
});

const Image = mongoose.model("Image", imageSchema);

export default Image;
