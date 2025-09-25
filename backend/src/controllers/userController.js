import User from '../models/User.js';
import Image from '../models/Image.js';
import Post from '../models/Post.js';
import Follow from '../models/Follow.js';
import { uploadSinglePhoto, deletePhotoFromS3 } from '../utils/s3.js';
import mongoose from 'mongoose';

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user Id' });
    }

    const user = await User.findById(userId)
      .select('-password')
      .populate('avatar');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const postCount = await Post.countDocuments({ user: userId });
    res.json(user, postCount);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userName, fullName, about, website } = req.body;
    const file = req.file; // multer

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user Id' });
    }

    if (req.userId !== userId) {
      return res
        .status(403)
        .json({ message: 'Forbidden: you can update only your profile' });
    }

    const user = await User.findById(userId).populate("avatar");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {};
    if (userName) updateData.userName = userName;
    if (fullName) updateData.fullName = fullName;
    if (about) {
      if (about.length > 150) {
        return res.status(400).json({ message: 'About cannot exceed 150 characters' });
      }
      updateData.about = about;
    }
    if (website) updateData.website = website;


    if (file) {
      if (user.avatar && user.avatar.filename) {
        await deletePhotoFromS3(user.avatar.filename);
        await Image.findByIdAndDelete(user.avatar._id);
      }

      const newImage = await uploadSinglePhoto(file, userId, 'avatar');
      updateData.avatar = newImage._id;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('avatar');

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    console.error('Error with updating user profile');
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const followToUserById = async (req, res) => {
  try {
    const { followerId } = req.body;
    const { userId } = req.params;

    const follow = new Follow({ follower: followerId, following: userId });
    await follow.save();

    res.status(201).json({ message: 'Now following' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already following' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({
      following: req.params.userId,
    }).populate('follower', 'username avatar_url');
    res.json(followers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
