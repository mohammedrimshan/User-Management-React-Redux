const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./Config/db');  
const userRoute = require('./Routes/userRoute');
const adminRoute = require('./Routes/adminRoute'); 

const app = express();
const corsOptions = {
    origin: 'http://localhost:5173', // Adjust this to your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Global no-cache headers
app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

// Connect to the database
connectDB();

// Serve static files from the uploads directory
app.use('/uploads/images', express.static(path.join(__dirname, 'multer/images'))); // Serve uploaded images

// User routes
app.use("/user", userRoute);

// Admin routes
app.use("/admin", adminRoute); // Connect the admin routes

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
