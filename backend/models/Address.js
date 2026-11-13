
const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [15, "Name must not exceed 15 characters"],
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[6-9]\d{9}$/.test(value);
        },
        message: "Enter a valid 10-digit mobile number",
      },
    },

    addressLine: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[1-9]\d{5}$/.test(value);
        },
        message: "Enter a valid 6-digit PIN code",
      },
    },

    selectedForDelivery: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
