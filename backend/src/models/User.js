import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxLength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    about: {
      type: String,
      default: '',
      maxLength: [150, 'Description cannot exceed 150 characters'],
    },
    website: {
      type: String,
      default: '',
    },
    avatar: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },

    postsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },

    resetCode: { type: Number },
    resetCodeExpires: { type: Number },
  },
  { timestamps: true,
    toJSON: { virtuals: true },  
    toObject: { virtuals: true }, }
);

// virtual  field posts by user
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

// Подписчики (followers)
// - Берём все Follow-документы, где Follow.following = User._id

userSchema.virtual('followers', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'following',
  justOne: false,
});

// Подписки (following)
// - Берём все Follow-документы, где Follow.follower = User._i

userSchema.virtual('following', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'follower',
  justOne: false,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetCode;
  delete obj.resetCodeExpires;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
