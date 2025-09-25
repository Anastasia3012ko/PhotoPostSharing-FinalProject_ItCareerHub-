import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const registerUser = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;
    if (!fullName || !userName || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Full name, user name, email, password are required!' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists' });
    }
    const newUser = new User({ fullName, userName, email, password });
    newUser.save();
    res.status(201).json({
      message: 'User registered successfully',
      user: { _id: newUser._id, userName, email },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error with registering user' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: 'Email and password are required!' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.cookie('token', token, {
      httpOnly: true, // нельзя читать через JS
      secure: false,
      sameSite: 'Strict', //защита от CSRF
      maxAge: 1000 * 60 * 60 * 24, // 1 day in ms
    });
    res.json({ message: 'User logged in successfully' });
  } catch (error) {
    console.error('Error with login user');
    res.status(500).json({ error: 'Server error with login user', error: error.message});
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.userId !== userId) {
      return res
        .status(403)
        .json({ message: 'Forbidden: you can logout only your profile' });
    }
    await res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error with logout user');
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
