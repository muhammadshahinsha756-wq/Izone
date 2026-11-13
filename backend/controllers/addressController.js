
const Address = require("../models/Address");

// Common validation function
const validateAddress = (data) => {
  const {
    fullName,
    phone,
    addressLine,
    city,
    state,
    pincode,
  } = data;

  if (
    !fullName?.trim() ||
    !phone?.trim() ||
    !addressLine?.trim() ||
    !city?.trim() ||
    !state?.trim() ||
    !pincode?.trim()
  ) {
    return "All address fields are required";
  }

  if (fullName.trim().length > 15) {
    return "Name must not exceed 15 characters";
  }

  if (!/^[6-9]\d{9}$/.test(phone.trim())) {
    return "Enter a valid 10-digit mobile number";
  }

  if (!/^[1-9]\d{5}$/.test(pincode.trim())) {
    return "Enter a valid 6-digit PIN code";
  }

  return null;
};

// Add Address
const addAddress = async (req, res) => {
  try {
    const validationError = validateAddress(req.body);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pincode,
    } = req.body;

    const address = await Address.create({
      user: req.user.id,
      fullName: fullName.trim(),
      phone: phone.trim(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      selectedForDelivery: false,
    });

    res.status(201).json({
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add address",
      error: error.message,
    });
  }
};

// Get Addresses
const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch addresses",
      error: error.message,
    });
  }
};

// Update Address
const updateAddress = async (req, res) => {
  try {
    const allowedFields = [
      "fullName",
      "phone",
      "addressLine",
      "city",
      "state",
      "pincode",
    ];

    const updateData = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] !== "string") {
          return res.status(400).json({
            message: `Invalid ${field}`,
          });
        }

        updateData[field] = req.body[field].trim();
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "Please provide data to update",
      });
    }

    const existingAddress = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!existingAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const updatedData = {
      fullName: updateData.fullName ?? existingAddress.fullName,
      phone: updateData.phone ?? existingAddress.phone,
      addressLine: updateData.addressLine ?? existingAddress.addressLine,
      city: updateData.city ?? existingAddress.city,
      state: updateData.state ?? existingAddress.state,
      pincode: updateData.pincode ?? existingAddress.pincode,
    };

    const validationError = validateAddress(updatedData);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
      });
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update address",
      error: error.message,
    });
  }
};

// Delete Address
const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete address",
      error: error.message,
    });
  }
};

// Select Delivery Address
const selectDeliveryAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    await Address.updateMany(
      { user: req.user.id },
      { $set: { selectedForDelivery: false } }
    );

    address.selectedForDelivery = true;
    await address.save();

    res.status(200).json({
      message: "Delivery address selected successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to select delivery address",
      error: error.message,
    });
  }
};

// Get Single Address by ID
const getAddressById = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    res.status(200).json({ address });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch address",
      error: error.message,
    });
  }
};

module.exports = {
  addAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  selectDeliveryAddress,
};
