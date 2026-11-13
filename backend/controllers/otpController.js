
const OTP = require("../models/OTP");
const User = require("../models/User");
const { generateOTP, hashOTP } = require("../utils/otp");
const sendEmail = require("../utils/sendEmail");

// Check whether the logged-in user is a Google user
const isGoogleUser = async (userId) => {
    const user = await User.findById(userId).select("googleId");
    return !!user?.googleId;
};

// Signup and Forgot Password OTP
const sendOTP = async (req, res) => {
    try {
        const { email, purpose } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (!["signup", "reset-password"].includes(purpose)) {
            return res.status(400).json({
                message: "Invalid OTP purpose"
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (purpose === "signup" && existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        if (purpose === "reset-password" && !existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const otp = generateOTP();
        const otpHash = hashOTP(otp);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await OTP.findOneAndUpdate(
            { email: normalizedEmail, purpose },
            {
                $set: {
                    email: normalizedEmail,
                    otpHash,
                    expiresAt,
                    attempts: 0,
                    verified: false,
                    purpose
                }
            },
            { upsert: true, returnDocument: "after" }
        );

        await sendEmail(
            normalizedEmail,
            "iZone Email Verification",
            `Your iZone OTP is ${otp}. It is valid for 5 minutes.`
        );

        return res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.log("OTP Error:", error);
        return res.status(500).json({
            message: "Failed to send OTP"
        });
    }
};

// Verify Signup and Forgot Password OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp, purpose } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        if (!["signup", "reset-password"].includes(purpose)) {
            return res.status(400).json({
                message: "Invalid OTP purpose"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            purpose
        });

        if (!otpRecord) {
            return res.status(404).json({
                message: "OTP not found. Please request a new OTP"
            });
        }

        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        if (otpRecord.attempts >= 5) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(429).json({
                message: "Too many attempts"
            });
        }

        if (hashOTP(otp.toString()) !== otpRecord.otpHash) {
            otpRecord.attempts += 1;
            await otpRecord.save();

            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        otpRecord.verified = true;
        await otpRecord.save();

        return res.status(200).json({
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.log("Verify OTP Error:", error);
        return res.status(500).json({
            message: "OTP verification failed"
        });
    }
};

// Send Email Change OTP
const sendEmailChangeOTP = async (req, res) => {
    try {
        // Prevent Google users from changing email
        if (await isGoogleUser(req.user.id)) {
            return res.status(403).json({
                message: "Google users cannot change their email."
            });
        }

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "New email is required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "This email is already registered"
            });
        }

        const otp = generateOTP();
        const otpHash = hashOTP(otp);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await OTP.findOneAndUpdate(
            {
                email: normalizedEmail,
                purpose: "email-change",
                userId: req.user.id
            },
            {
                $set: {
                    email: normalizedEmail,
                    otpHash,
                    expiresAt,
                    attempts: 0,
                    verified: false,
                    purpose: "email-change",
                    userId: req.user.id
                }
            },
            { upsert: true, returnDocument: "after" }
        );

        await sendEmail(
            normalizedEmail,
            "iZone Email Change Verification",
            `Your iZone OTP is ${otp}. It is valid for 5 minutes.`
        );

        return res.status(200).json({
            message: "Email change OTP sent successfully"
        });

    } catch (error) {
        console.log("Email Change OTP Error:", error);
        return res.status(500).json({
            message: "Failed to send email change OTP"
        });
    }
};

// Verify Email Change OTP
const verifyEmailChangeOTP = async (req, res) => {
    try {
        // Prevent Google users from changing email
        if (await isGoogleUser(req.user.id)) {
            return res.status(403).json({
                message: "Google users cannot change their email."
            });
        }

        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            purpose: "email-change",
            userId: req.user.id
        });

        if (!otpRecord) {
            return res.status(404).json({
                message: "OTP not found"
            });
        }

        if (otpRecord.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        if (otpRecord.attempts >= 5) {
            await OTP.deleteOne({ _id: otpRecord._id });
            return res.status(429).json({
                message: "Too many attempts"
            });
        }

        if (hashOTP(otp.toString()) !== otpRecord.otpHash) {
            otpRecord.attempts += 1;
            await otpRecord.save();

            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        otpRecord.verified = true;
        await otpRecord.save();

        return res.status(200).json({
            message: "Email OTP verified successfully"
        });

    } catch (error) {
        console.log("Email Change Verify Error:", error);
        return res.status(500).json({
            message: "Email OTP verification failed"
        });
    }
};

// Update Email After Verification
const updateEmailAfterVerification = async (req, res) => {
    try {
        // Prevent Google users from changing email
        if (await isGoogleUser(req.user.id)) {
            return res.status(403).json({
                message: "Google users cannot change their email."
            });
        }

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "New email is required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            purpose: "email-change",
            userId: req.user.id,
            verified: true,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Please verify your email with OTP first"
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser && existingUser._id.toString() !== req.user.id) {
            return res.status(409).json({
                message: "This email is already registered"
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { email: normalizedEmail },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await OTP.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({
            message: "Email updated successfully",
            user
        });

    } catch (error) {
        console.log("Update Email Error:", error);
        return res.status(500).json({
            message: "Failed to update email"
        });
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
    sendEmailChangeOTP,
    verifyEmailChangeOTP,
    updateEmailAfterVerification
};
