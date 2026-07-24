const express = require("express");
const router = express.Router();

const {
  getCurrentSubscription,
  updateSubscription,
} = require("../controller/subscriptionController");

const authMiddleware = require("../middleware/auth");

router.get("/current", authMiddleware, getCurrentSubscription);

router.post("/update", authMiddleware, updateSubscription);

module.exports = router;