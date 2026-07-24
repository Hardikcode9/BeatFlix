const express = require("express");

const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controller/userController");

const router = express.Router();

const auth = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getProfile);

module.exports = router;