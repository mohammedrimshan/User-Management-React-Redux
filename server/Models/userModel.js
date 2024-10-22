const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // Simple regex for validating email format
    },
    mobile: {
        type: String,
        unique: true,  // Ensure mobile number is unique
        sparse: true,   // Allows documents without a mobile number
    },
    image: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    is_admin: {
        type: Boolean,
        default: false, // Optional; no need for 'required' since it defaults
    }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
