require("dotenv").config();
const User = require('../Models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// Secure password hashing
const securePassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.log(error);
    }
};

// User Registration
const createUser = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const existingMobileUser = await User.findOne({ mobile });
        if (existingMobileUser) {
            return res.status(400).json({ message: "User with this mobile number already exists" });
        }

        const hashedPassword = await securePassword(password);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            mobile,
            image: req.file ? `/uploads/images/${req.file.filename}` : null,
            isAdmin: 0
        });

        await newUser.save();
        return res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
        console.error('Error in user creation:', error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

// User Login
const verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        if (!user.password) {
            console.error('User found but password is undefined:', user);
            return res.status(500).json({ message: "Server error" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Include isAdmin in the JWT token
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get User Data
const getUserData = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Logout User
const userLogout = async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
      });
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ message: "Server error during logout" });
    }
  };

// Update User (Prevents admins from using this endpoint)
const updateUser = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            return res.status(403).json({ message: "Admins cannot update regular user profiles" });
        }

        const { name, email, mobile } = req.body;  
        const { id } = req.params;  

        let updatedData = {};
        if (name) updatedData.name = name;
        if (email) updatedData.email = email;
        if (mobile) updatedData.mobile = mobile;

        if (req.file) {
            updatedData.image = `/uploads/images/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createUser,
    verifyLogin,
    getUserData,
    userLogout,
    updateUser
};
