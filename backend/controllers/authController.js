import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const registerUser = async (req, res) => {
    try {
        const { fullName, userName, email, password } = req.body;
        if(!fullName || !userName || !email || !password) {
            return res.status(400).json({error: 'Full name, user name, email, password are required!'});
            
        }
        const existingUser = await User.findOne({email})
        if(existingUser) {
            return res.status(400).json({message: 'User with this email already exists'});
        }
        const newUser = new User({ fullName, userName, email, password });
        newUser.save();
        res. status(201).json({message: 'User registered successfully', user: { _id: newUser._id, userName, email }});
    } catch (error) {
        res.status(500).json({message: 'Error with registering user'});
    }
}

export const loginUser  = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({error: 'Email and password are required!'});
            
        }
        const user =  await User.findOne({email});
        if(!user) {
            return res.status(401).json({message: 'Incorrect email or password'})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({message: 'Incorrect email or password'})
        }
        const token = jwt.sign(
            {
            userId: user._id
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        res.cookie("token", token, {
            httpOnly: true, // нельзя читать через JS
            secure: process.env.NODE_ENV === "production", // HTTPS в продакшне
            sameSite: "Strict", // защита от CSRF
            maxAge: 3600000 // 1 час в мс
        });
        res.json({message: 'User logged in successfully', token });
    } catch (error) {
        console.error('Error with login user', error.message);
        res.status(500).json({ error: "Server error with login user" });
    }
}
