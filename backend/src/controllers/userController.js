import User from '../models/User.js';
import Follow from '../models/Follow.js';

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password');
      if(!user) {
        return res.status(404).json({message: 'User not found'})
      }
    res.json(user);
  } catch (error) {
    res.status(500).json({message: 'Server error', error: error.message });
  }
}

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, fullName, bio, avatar_url, website_url } = req.body;
    if (req.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden: you can update only your profile' });
    }
    
    const updateData = {};
    if (username) updateData.username = username;
    if (fullName) updateData.fullName = fullName;
    if (bio) updateData.bio = bio;
    if (avatar_url) updateData.avatar_url = avatar_url;
    if (website_url) updateData.website_url = website_url;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password'); 

    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (error) {
    res.status(500).json({message: 'Server error', error: error.message });
  }
}

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
    res.status(500).json({message: 'Server error', error: error.message });
  }
}

export const getFollowers = async (req, res) => {
  try {
    const followers = await Follow.find({ following: req.params.userId })
      .populate('follower', 'username avatar_url');
    res.json(followers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
