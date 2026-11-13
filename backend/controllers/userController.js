
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");
// user profile
const getProfile=async(req,res)=>{
    try{
        const user=await User.findById(req.user.id)
        .select("-password")
        if(!user){
            return res.status(404).json({
                message:"user not found"
            })
        }
        res.status(200).json({
            message:"profile fetched successfully",
            user
        })
    }
    catch(error){
   res.status(500).json({
    message:"profile fetch failed",
    error:error.message
   })
    }

}

// update user profile

const updateProfile = async (req, res) => {
    try {
        const { name, phone, address, profileImage } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Name validation
        if (name !== undefined) {
            const trimmedName = name.trim();

            if (!trimmedName) {
                return res.status(400).json({
                    message: "Name cannot be empty"
                });
            }

            if (trimmedName.length > 15) {
                return res.status(400).json({
                    message: "Name must not exceed 15 characters"
                });
            }

            user.name = trimmedName;
        }

        // Phone validation
        if (phone !== undefined) {
            const normalizedPhone = String(phone).trim();
            const phoneRegex = /^[6-9]\d{9}$/;

            if (!phoneRegex.test(normalizedPhone)) {
                return res.status(400).json({
                    message: "Please enter a valid 10-digit mobile number"
                });
            }

            user.phone = normalizedPhone;
        }

        if (address !== undefined) {
            user.address = address;
        }

        if (profileImage !== undefined) {
            user.profileImage = profileImage;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "Profile update failed",
            error: error.message
        });
    }
};

// Upload Profile Image
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please select an image"
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "izone/profile-images",
                public_id: user._id.toString(),
                overwrite: true,
                resource_type: "image"
            },
            async (error, result) => {
                if (error) {
                    return res.status(500).json({
                        message: "Image upload failed",
                        error: error.message
                    });
                }

                try {
                    user.profileImage = result.secure_url;
                    await user.save();

                    return res.status(200).json({
                        message: "Profile image uploaded successfully",
                        profileImage: user.profileImage
                    });
                } catch (saveError) {
                    return res.status(500).json({
                        message: "Failed to save profile image",
                        error: saveError.message
                    });
                }
            }
        );

        uploadStream.end(req.file.buffer);

    } catch (error) {
        return res.status(500).json({
            message: "Profile image upload failed",
            error: error.message
        });
    }
};

module.exports={getProfile,updateProfile,uploadProfileImage}