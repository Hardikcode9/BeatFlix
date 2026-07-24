const User = require("../model/User");

const getCurrentSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "subscription subscriptionStatus subscriptionExpiry"
    );

    res.json({
      success: true,
      subscription: user.subscription,
      status: user.subscriptionStatus,
      expiry: user.subscriptionExpiry,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch subscription.",
    });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!["starter", "pro", "ultimate"].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription plan.",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (plan === "starter") {
      user.subscription = "starter";
      user.subscriptionStatus = "inactive";
      user.subscriptionExpiry = null;
    } else {
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 1);

      user.subscription = plan;
      user.subscriptionStatus = "active";
      user.subscriptionExpiry = expiry;
    }

    await user.save();

    res.json({
      success: true,
      subscription: user.subscription,
      status: user.subscriptionStatus,
      expiry: user.subscriptionExpiry,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

module.exports = {
  getCurrentSubscription,
  updateSubscription,
};