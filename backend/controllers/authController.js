
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const { OAuth2Client } = require("google-auth-library");

// Google Client
const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

// Password validation
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


// USER REGISTER
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
const trimmedName = name?.trim();
const normalizedPhone = String(phone || "").trim();

if (!trimmedName || !email?.trim() || !password || !normalizedPhone) {
    return res.status(400).json({
        message: "Please fill all required fields"
    });
}

// Name validation - Maximum 15 characters
if (trimmedName.length > 15) {
    return res.status(400).json({
        message: "Name must not exceed 15 characters"
    });
}

// Phone validation - Exactly 10 digits, starting with 6-9
const phoneRegex = /^[6-9]\d{9}$/;

if (!phoneRegex.test(normalizedPhone)) {
    return res.status(400).json({
        message: "Please enter a valid 10-digit mobile number"
    });
}
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        // Check verified OTP
        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            verified: true,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Please verify your email with OTP first"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

       const newUser = await User.create({
    name: trimmedName,
    email: normalizedEmail,
    password: hashedPassword,
    phone: normalizedPhone
});

        await OTP.deleteOne({
            _id: otpRecord._id
        });

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};


// USER LOGIN
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email and password"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                message: "Your account has been blocked"
            });
        }

        if (!user.password) {
            return res.status(400).json({
                message: "This account does not have a password. Please use Google login."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};


// GET USER PROFILE
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {
        return res.status(500).json({
            message: "Profile fetching failed"
        });
    }
};


// GOOGLE LOGIN
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                message: "Google token is required"
            });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const {
            sub,
            email,
            name,
            picture,
            email_verified
        } = payload;

        if (!email_verified) {
            return res.status(401).json({
                message: "Google email is not verified"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        let user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            user = await User.create({
                name,
                email: normalizedEmail,
                googleId: sub,
                profileImage: picture || ""
            });

        } else {
            if (user.isBlocked) {
                return res.status(403).json({
                    message: "Your account has been blocked"
                });
            }

            if (!user.googleId) {
                user.googleId = sub;
                await user.save();
            }
        }

        const jwtToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Google login successful",
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("GOOGLE LOGIN ERROR:", error);

        return res.status(500).json({
            message: "Google login failed",
            error: error.message
        });
    }
};


// RESET PASSWORD (FORGOT PASSWORD + OTP)
const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and new password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
            });
        }

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            verified: true,
            purpose: "reset-password",
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return res.status(400).json({
                message: "Please verify your email with OTP first"
            });
        }

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        await OTP.deleteMany({
            email: normalizedEmail
        });

        return res.status(200).json({
            message: "Password reset successful"
        });

    } catch (error) {
        console.error("RESET PASSWORD ERROR:", error);

        return res.status(500).json({
            message: "Password reset failed"
        });
    }
};


// CHANGE PASSWORD (LOGGED-IN USER)
const changePassword = async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword,
            confirmPassword
        } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                message: "Please fill all password fields"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New password and confirm password do not match"
            });
        }

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({
                message: "New password must be different from current password"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

      // Prevent Google users from changing password
if (user.googleId) {
    return res.status(403).json({
        message: "Google users cannot change their password."
    });
}

if (!user.password) {
    return res.status(400).json({
        message: "This account does not have a password. Please use Google login."
    });
}
        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error("CHANGE PASSWORD ERROR:", error);

        return res.status(500).json({
            message: "Password change failed"
        });
    }
};


// EXPORT ALL CONTROLLERS
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    googleLogin,
    resetPassword,
    changePassword
};
