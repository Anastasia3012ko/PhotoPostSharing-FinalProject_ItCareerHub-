import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  url: { type: String, required: true }, // ссылка на файл в S3
  folder: { type: String, default: "posts" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //  (user id) 
 },
 {timestamps: true}
);

const Image = mongoose.model("Image", imageSchema);

export default Image;
