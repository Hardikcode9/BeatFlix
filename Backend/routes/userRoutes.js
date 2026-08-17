const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
  googleLogin,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  getAllUsers,
  updateProfile,
} = require("../controller/userController");

const router = express.Router();

const auth = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/profile", auth, getProfile);
router.get("/all", getAllUsers);
router.put("/update-profile", auth, updateProfile);

module.exports = router;