import Follow from '../models/Follow.js';
import User from '../models/User.js';

export const followUser = async (req, res) => {
  try {
    const followerId = req.userId;
    const followingId = req.params.id;

    if (followerId === followingId) 
      return res.status(400).json({ message: 'You cannot follow yourself' });

    const exists = await Follow.findOne({ follower: followerId, following: followingId });
    if (exists) return res.status(400).json({ message: 'Already following this user' });

    const follow = await Follow.create({ follower: followerId, following: followingId });
    res.status(201).json({ message: 'You are following', follow });

  } catch (error) {
    console.error('Error with subscribing to user');
    res.status(500).json({ message:'Server error', error: err.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.userId;
    const followingId = req.params.id;

    const follow = await Follow.findOne({ follower: followerId, following: followingId });
    if (!follow) return res.status(400).json({ message: 'You are not following this user' });

    await follow.deleteOne();
    res.json({ message: 'Unfollowed successfully' });

  } catch (error) {
    console.error('Error with subscribing to user', error.message);
    res.status(500).json({ message:'Server error', error: error.message });
  }
};

