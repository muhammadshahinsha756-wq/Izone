
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 15
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: false
        },

        googleId: {
            type: String,
            default: null
        },

        phone: {
            type: String,
            validate: {
                validator: function (value) {
                    // Google signup may not have a phone number
                    if (!value) return true;

                    return /^[6-9]\d{9}$/.test(value);
                },
                message: "Please enter a valid 10-digit mobile number"
            }
        },

        profileImage: {
            type: String,
            default: ""
        },

        address: {
            type: String,
            default: ""
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        isBlocked: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;