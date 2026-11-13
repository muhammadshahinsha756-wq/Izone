const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { registerUser,loginUser,googleLogin,resetPassword,changePassword} = require("../controllers/authController");
const {getProfile, updateProfile,uploadProfileImage} = require("../controllers/userController");
const { sendEmailChangeOTP,verifyEmailChangeOTP,updateEmailAfterVerification} = require("../controllers/otpController");
const upload = require("../middleware/uploadMiddleware");
// register
router.post("/register", registerUser);
// login
router.post("/login", loginUser);
// Get Profile
router.get("/profile", authMiddleware, getProfile);
// Update Profile 
router.put("/profile", authMiddleware, updateProfile);
//google login
router.post("/google-login", googleLogin);
//change pass
router.put("/reset-password",resetPassword)
// Send Email Change OTP
router.post("/send-email-change-otp", authMiddleware, sendEmailChangeOTP);
// Verify Email Change OTP
router.post(  "/verify-email-change-otp", authMiddleware,  verifyEmailChangeOTP);
// Update Email After OTP Verification
router.put( "/change-email",authMiddleware,updateEmailAfterVerification);
router.patch( "/change-password",authMiddleware,changePassword);
// Upload Profile Image
router.post( "/profile/upload-image",authMiddleware,upload.single("profileImage"),uploadProfileImage);
module.exports = router;
