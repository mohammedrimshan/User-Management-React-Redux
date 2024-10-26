const express = require('express');
const multer = require('multer');
const path = require('path');
const { verifyAdmin } = require('../Middleware/adminAuth'); // Import the verifyAdmin middleware
const {
    adminLogin,
    getData,
    editUser,
    updateUser,
    createUser,
    deleteUser,
    logoutAdmin,
    manageUsers,
} = require('../Controllers/adminController');

const adminrouter = express.Router();

// Multer storage setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../Multer/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Public route - No authentication needed
adminrouter.post('/login', adminLogin);

// Protected routes - Require admin authentication
adminrouter.get('/manage-users', verifyAdmin, manageUsers); 
adminrouter.get('/data', verifyAdmin, getData);
adminrouter.get('/editUser/:id', verifyAdmin, editUser);
adminrouter.put('/update', verifyAdmin, upload.single('image'), updateUser);
adminrouter.post('/create', verifyAdmin, upload.single('image'), createUser);
adminrouter.delete('/delete/:id', verifyAdmin, deleteUser);
adminrouter.post('/logout', verifyAdmin, logoutAdmin);

module.exports = adminrouter;