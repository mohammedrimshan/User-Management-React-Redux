require("dotenv").config();
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');

const verifyUser = async (req, res, next) => {
  const token = req.cookies.token;  // Get the token from cookies
  console.log(token);
  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user by ID, excluding password
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Attach user info to the request object (optional)
      req.user = user;
      
      // Move to the next middleware/route handler
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    // No token present in cookies
    console.log("No token provided");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { verifyUser };
