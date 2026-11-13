const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    otpHash: {
        type: String,
        required: true
    },

    expiresAt: {
        type: Date,
        required: true
    },

    attempts: {
        type: Number,
        default: 0
    },

    verified: {
        type: Boolean,
        default: false
    },
    purpose: {
    type: String,
    enum: ["signup", "reset-password","email-change"],
    required: true
},
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null
},

}, { timestamps: true });

// Automatically delete 
otpSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

module.exports = mongoose.model("OTP", otpSchema);