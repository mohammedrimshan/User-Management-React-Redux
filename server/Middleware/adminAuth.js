require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const verifyAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        console.log("Token from cookie:", token);

        if (!token) {
            console.log("No token in cookies");
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user details excluding password
        const user = await User.findById(decoded.id).select("-password");
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify if user is admin
        if (!user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Not authorized as admin"
            });
        }

        // Attach user to request
        req.user = user;
        console.log("Authenticated admin:", req.user);
        next();
    } catch (error) {
        console.error("Admin verification error:", error);
        return res.status(401).json({
            success: false,
            message: "Not authorized, token failed"
        });
    }
};

module.exports = { verifyAdmin };
