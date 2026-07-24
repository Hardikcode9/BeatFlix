const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    subscription: {
      type: String,
      enum: ["starter", "pro", "ultimate"],
      default: "starter",
    },

    subscriptionStatus: {
      type: String,
      enum: ["inactive", "active"],
      default: "inactive",
    },

    subscriptionExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;