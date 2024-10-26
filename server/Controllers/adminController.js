const express = require("express");
const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const securePassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.log("Password hashing error:", error);
  }
};

// Function to generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminInfo = await User.findOne({ email });

    if (adminInfo?.isAdmin) {
      // Check if the user is an admin
      if (await bcrypt.compare(password, adminInfo.password)) {
        const token = generateToken(adminInfo._id); // Generate token

        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
        });

        return res.status(200).json({
          message: "Login successful",
          _id: adminInfo._id,
          name: adminInfo.name,
          email: adminInfo.email,
          mobile: adminInfo.mobile,
          image: adminInfo.image,
          token, // Return the generated token
        });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } else {
      return res.status(403).json({ message: "No access" });
    }
  } catch (err) {
    console.log("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Fetch all users
const getData = async (req, res) => {
  try {
    const users = await User.find(); // Get all users, including admins
    res.status(200).json(users);
  } catch (err) {
    console.log("Error fetching data:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch non-admin users for admin to manage
const manageUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select("-password"); // Exclude password
    res.status(200).json(users);
  } catch (err) {
    console.log("Error managing users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user data by ID
const editUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.log("Error fetching user data:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    const { id, email, name, mobile } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    let updatedData = {};
    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (mobile) updatedData.mobile = mobile;
    if (image) updatedData.image = image;

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
    res.json({ message: "Update successful", updatedUser });
  } catch (err) {
    console.log("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    const image = req.file ? `/uploads/images/${req.file.filename}` : null;

    const isEmailExists = await User.findOne({ email });
    if (isEmailExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const passwordHash = await securePassword(password);
    const user = await User.create({
      name,
      image,
      password: passwordHash,
      email,
      mobile,
    });
    res.status(201).json(user);
  } catch (err) {
    console.log("Error creating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};



const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin logout
const logoutAdmin = async (req, res) => {
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

module.exports = {
  adminLogin,
  getData,
  manageUsers,
  editUser,
  updateUser,
  createUser,
  deleteUser,
  logoutAdmin,
};
