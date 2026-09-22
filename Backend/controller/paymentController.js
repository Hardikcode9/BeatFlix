const crypto = require("crypto");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_THN6lHM5kstDgA",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "q4lCttDsaAkraGm5AFdwhISN",
});

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_THN6lHM5kstDgA",
    });
  } catch (error) {
    console.error("Razorpay createOrder error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment order.",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters.",
      });
    }

    const signBody = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "q4lCttDsaAkraGm5AFdwhISN")
      .update(signBody.toString())
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      return res.json({
        success: true,
        message: "Payment verified successfully.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }
  } catch (error) {
    console.error("Razorpay verifyPayment error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed.",
    });
  }
};

module.exports = { createOrder, verifyPayment };