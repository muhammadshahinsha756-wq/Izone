
const express = require("express");

const router = express.Router();

const { adminLogin,getAllUsers,toggleUserBlock} = require("../controllers/adminController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// Admin Login - Public Route
router.post("/login", adminLogin);
// Admin Dashboard - Protected Route
router.get( "/dashboard",authMiddleware,adminMiddleware,(req, res) => {
    res.status(200).json({
      message: "Welcome to Admin Dashboard"
    });
  }
);
router.get(  "/users",authMiddleware,adminMiddleware,getAllUsers);
router.patch( "/users/:id/block",authMiddleware,toggleUserBlock);
module.exports = router;
