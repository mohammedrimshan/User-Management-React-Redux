const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./Config/db');  
const UserModel = require('./Models/userModel');
const userRoute = require('./Routes/userRoute');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // Adjust this to your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Apply no-cache headers to all routes
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
});

// Connect to the database
connectDB();

// Base route to fetch users (optional)
app.get('/', (req, res) => {
    UserModel.find()
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err));
});

// Serve static files from the uploads directory
app.use('/uploads/images', express.static(path.join(__dirname, 'multer/images'))); // Serve uploaded images

// User routes
app.use("/user", userRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
