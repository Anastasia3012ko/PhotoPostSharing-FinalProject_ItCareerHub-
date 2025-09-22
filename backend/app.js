import express from 'express';
import connectToDatabase from './config/db.js';
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3003", // frontend
  credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (_req, res) => {
    res.send('HomePage');
})

//Routes
app.use('/auth', authRoutes);

// Start server
app.listen(PORT, async () => {
     try {
        await connectToDatabase();
        console.log(`Server running on http://localhost:${PORT}`);
    } catch (error) {
        console.error('Failed to start the server due to MongoDB connection issue', error);
    }
});