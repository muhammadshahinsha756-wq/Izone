
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { addAddress, getAddresses, getAddressById, updateAddress, deleteAddress, selectDeliveryAddress } = require("../controllers/addressController");
//add
router.post("/", authMiddleware, addAddress);
// get all
router.get("/", authMiddleware, getAddresses);
// get single
router.get("/:id", authMiddleware, getAddressById);
// update
router.put("/:id", authMiddleware, updateAddress);
// delete
router.delete("/:id", authMiddleware, deleteAddress);
//Select delivery address
router.patch("/:id/select-delivery",authMiddleware,selectDeliveryAddress);
module.exports = router;
