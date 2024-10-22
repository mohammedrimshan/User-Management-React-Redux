const express = require("express");
const userRoute = express.Router();
const { createUser, verifyLogin, getUserData, userLogout, updateUser } = require('../Controllers/userController');
const multer = require('multer');
const path = require('path');
const auth  = require('../Middleware/userAuth');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../Multer/images'));
    },
    filename: function(req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });

// User routes
userRoute.post('/create', upload.single('image'), createUser);  // User registration with image upload
userRoute.post('/login', verifyLogin);  // User login
userRoute.get('/:id', getUserData);  // Get user details by ID
userRoute.post('/logout', auth.verifyUser, userLogout);  // User logout (protected route)
userRoute.put('/update/:id', auth.verifyUser, upload.single('image'), updateUser);  // Update user profile with image upload

module.exports = userRoute;
