
const express = require("express");
const router = express.Router();

const {
    sendOTP,
    verifyOTP,
    sendEmailChangeOTP,
    verifyEmailChangeOTP,
    updateEmailAfterVerification
} = require("../controllers/otpController");

const authMiddleware = require("../middleware/authMiddleware");

// Send OTP
router.post("/send", sendOTP);

// Verify OTP
router.post("/verify", verifyOTP);

// Email Change Routes
router.post("/send-email-change-otp", authMiddleware, sendEmailChangeOTP);

router.post("/verify-email-change-otp", authMiddleware, verifyEmailChangeOTP);

router.put("/change-email", authMiddleware, updateEmailAfterVerification);

module.exports = router;
