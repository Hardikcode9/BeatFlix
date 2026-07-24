const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");


// ========================================
// REGISTER USER
// ========================================

const registerUser = async (req, res) => {
  try {
    const { name, password, confirmPassword } = req.body;

    if (!name || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ name });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this name already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Profile created successfully",

      user: {
        id: user._id,
        name: user.name,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ========================================
// LOGIN USER
// ========================================

const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: "Name and password are required",
      });
    }

    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid name or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid name or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// ========================================
// EXPORTS
// ========================================

module.exports = {
  registerUser,
  loginUser,
  getProfile,
};